const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sbk_jwt_default_secret_fallback_key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sbk@admin2026';

// EmailJS Configuration (Stored securely in server environment variables)
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_d6t9wbc';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_dxadctr';
const EMAILJS_REPLY_TEMPLATE_ID = process.env.EMAILJS_REPLY_TEMPLATE_ID || 'template_ubvp7hi';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'sSOqcsUjoDSeZJZ8-';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || '';

// 1. CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.web.app') ||
        origin.endsWith('.firebaseapp.com') ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '100kb' }));

// 2. Simple In-Memory Rate Limiter for Contact Submissions
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const contactRateLimiter = (req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp);

  if (!clientData || now - clientData.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, startTime: now });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: 'Too many messages sent from this IP. Please wait a few minutes before trying again.',
    });
  }

  clientData.count++;
  return next();
};

// Periodic cleanup of stale rate-limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);

// ==========================================
// ROUTES
// ==========================================

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'portfolio-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'portfolio-backend',
    emailEngine: 'EmailJS REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------
// AUTHENTICATION: Admin Login (POST /api/auth/login)
// ------------------------------------------
app.post('/api/auth/login', (req, res) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const trimmedInput = password.trim();
    let isMatch = false;

    // Check if ADMIN_PASSWORD is stored as a BCrypt hash or plain string
    if (ADMIN_PASSWORD.startsWith('$2a$') || ADMIN_PASSWORD.startsWith('$2b$')) {
      isMatch = bcrypt.compareSync(trimmedInput, ADMIN_PASSWORD);
    } else {
      isMatch = trimmedInput === ADMIN_PASSWORD;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials. Access denied.' });
    }

    // Generate secure JWT token valid for 4 hours
    const token = jwt.sign({ role: 'admin', subject: 'portfolio-owner' }, JWT_SECRET, {
      expiresIn: '4h',
    });

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      expiresIn: '4h',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
});

// Verify Token (GET /api/auth/verify)
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch {
    return res.status(401).json({ valid: false, message: 'Invalid or expired session token.' });
  }
});

// ------------------------------------------
// CONTACT: Email Dispatch via EmailJS API (POST /api/contact)
// ------------------------------------------
app.post('/api/contact', contactRateLimiter, async (req, res) => {
  try {
    const { name, email, message, importance, website } = req.body;

    // 1. Server-Side Honeypot Trap:
    // If the hidden 'website' field contains any value, it's an automated bot.
    // Silently return success without calling EmailJS!
    if (website && website.trim().length > 0) {
      console.warn(`[Spam Blocked] Honeypot triggered from ${req.ip} with website field: "${website}"`);
      return res.json({ success: true, message: 'Thank you! Your message was received.' });
    }

    // 2. Input Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const isPriority = importance === 'high';

    // 3. Dispatch Notification via EmailJS Server API
    const originHeader = req.headers.origin || 'https://sivabalakeerthick.web.app';
    const emailPayload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      ...(EMAILJS_PRIVATE_KEY ? { accessToken: EMAILJS_PRIVATE_KEY } : {}),
      template_params: {
        name: cleanName,
        email: cleanEmail,
        priority: isPriority ? 'HIGH IMPORTANCE (URGENT)' : 'Normal',
        importance_badge: isPriority ? '🚨 HIGH IMPORTANCE' : 'Standard',
        message: isPriority
          ? `[PRIORITY: HIGH IMPORTANCE / URGENT INQUIRY]\n\n${cleanMessage}`
          : cleanMessage,
      },
    };

    const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': originHeader,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error(`EmailJS API error (${emailRes.status}):`, errText);
      throw new Error(`EmailJS dispatch failed with status ${emailRes.status}`);
    }

    // 4. Best-effort User Auto-Reply (runs asynchronously)
    if (EMAILJS_REPLY_TEMPLATE_ID) {
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': originHeader,
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_REPLY_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          ...(EMAILJS_PRIVATE_KEY ? { accessToken: EMAILJS_PRIVATE_KEY } : {}),
          template_params: {
            name: cleanName,
            email: cleanEmail,
          },
        }),
      }).catch((replyErr) => console.warn('EmailJS auto-reply warning:', replyErr));
    }

    return res.json({
      success: true,
      message: isPriority
        ? 'High Importance message dispatched! Your priority request has been sent to my urgent inbox.'
        : 'Thank you for reaching out! Your message was sent successfully. I will get back to you shortly.',
    });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio backend running securely on http://localhost:${PORT}`);
    console.log(`📧 Email Provider: EmailJS REST API (${EMAILJS_SERVICE_ID})`);
    console.log(`🛡️  Allowed Origins: ${allowedOrigins.join(', ')}`);
  });
}

module.exports = app;

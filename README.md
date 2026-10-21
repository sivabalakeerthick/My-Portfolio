# Siva Bala Keerthick G - Portfolio

A modern, responsive personal developer portfolio engineered with **Angular 22**, **TypeScript**, and modern **SCSS**, backed by a secure **Node.js** REST API.

🌐 **Live Demo:** [https://sivabalakeerthick.web.app/](https://sivabalakeerthick.web.app/)

---

## 🚀 Features

- **Angular 22 Standalone Architecture:** Ultra-fast, modular, component-driven architecture without legacy module boilerplate.
- **Responsive & Mobile-First Design:** Optimized across mobile (320px+), tablet, and desktop viewports with collapsible navigation and keyboard accessibility.
- **Dynamic Dark / Light Mode:** Persistent theme toggling synchronized with `localStorage` and system color schemes.
- **Interactive Experience & Project Showcases:** Smooth role timelines, interactive architectural presentation viewer, and project category filters.
- **Secure Backend Integration:** Lightweight Node.js REST API with JWT-based admin authentication, honeypot anti-spam verification, and IP rate limiting.
- **Cloud Résumé Delivery:** Hosted on **Supabase Cloud Storage**, allowing zero-downtime, zero-deployment updates via the Supabase dashboard.
- **Automated CI/CD:** Continuous integration and deployment to Firebase Hosting via GitHub Actions.

---

## 🛠️ Tech Stack

- **Frontend:** Angular 22, TypeScript, SCSS
- **Backend:** Node.js, Express, JSON Web Tokens (JWT), BCrypt
- **Cloud Storage:** Supabase Storage
- **Email Service:** EmailJS REST API
- **Animations & Icons:** AOS (Animate on Scroll), FontAwesome Free
- **Hosting & CI/CD:** Firebase Hosting, GitHub Actions

---

## 💻 Project Structure

```text
My-Portfolio/
├── src/                  # Angular 22 Frontend
│   ├── app/
│   │   ├── components/   # Hero, Experience, Projects, Contact, Admin, etc.
│   │   └── services/     # Resume management and application services
│   └── environments/     # Environment configurations (API & CDN URLs)
├── server/               # Secure Node.js Backend API
│   ├── src/index.js      # Express server with Auth & Contact endpoints
│   ├── package.json      # Backend dependencies
│   └── .env.example      # Backend environment template
├── firebase.json         # Firebase Hosting configuration
└── package.json          # Frontend dependencies & build scripts
```

---

## ⚡ Getting Started Locally

### Prerequisites
- Node.js (v20+ or v24+)
- npm (v10+)

### 1. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/sivabalakeerthick/My-Portfolio.git
cd My-Portfolio

# Install dependencies and start development server
npm install
npm start
```
Navigate to `http://localhost:4200/`.

### 2. Backend Setup
```bash
# In a new terminal, navigate to server directory
cd server

# Install backend dependencies
npm install

# Start the backend server
npm start
```
The backend API runs on `http://localhost:5000`.

---

## 📄 Updating the Résumé

The résumé is powered by **Supabase Cloud Storage**:
1. Open your Supabase Dashboard &rarr; **Storage** &rarr; `resume`.
2. Upload your updated PDF with the name `Experience Resume.pdf` and check **"Overwrite existing file"**.
3. All portfolio visitors worldwide immediately download your newest résumé without modifying code or redeploying!

---

## 👤 Author

**Siva Bala Keerthick G**
- **Portfolio:** [sivabalakeerthick.web.app](https://sivabalakeerthick.web.app/)
- **LinkedIn:** [sivabalakeerthick](https://linkedin.com/in/sivabalakeerthick)

---
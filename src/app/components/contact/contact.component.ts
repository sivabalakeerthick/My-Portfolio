import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export function disallowOwnerEmailValidator(): ValidatorFn {
  const disallowedEmails = new Set([
    'sivabalakeerthick@gmail.com',
  ]);

  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (!raw || typeof raw !== 'string') {
      return null;
    }

    const trimmed = raw.trim().toLowerCase();
    const parts = trimmed.split('@');
    if (parts.length !== 2) {
      return null;
    }

    const [user, host] = parts;
    let normalized = trimmed;

    // In Gmail, dots are ignored and tags after '+' are aliases
    if (host === 'gmail.com' || host === 'googlemail.com') {
      const cleanUser = user.replace(/\./g, '').split('+')[0];
      normalized = `${cleanUser}@gmail.com`;
    }

    if (disallowedEmails.has(normalized)) {
      return { ownerEmailNotAllowed: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnDestroy {
  contactForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  mailtoFallbackUrl = '';
  gmailWebUrl = '';

  copiedEmail = false;
  readonly emailAddress = 'sivabalakeerthick@gmail.com';
  readonly instagramUrl = 'https://instagram.com/sivabalakeerthick';
  readonly chessComUrl = 'https://www.chess.com/member/sivabalakerthick';

  // Configurable WhatsApp ID / Username for Number Privacy
  whatsappId = 'sivabalakeerthick';

  get whatsappLink(): string {
    const cleanId = this.whatsappId.trim();
    if (!cleanId) return '#';
    if (cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
      return cleanId;
    }
    const message = encodeURIComponent('Hi Siva, I saw your portfolio and would like to connect!');
    return `https://wa.me/${cleanId}?text=${message}`;
  }

  localTime = '';
  private timer: any = null;
  private readonly submissionCooldownMs = 60_000;
  private lastSubmissionAt = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, disallowOwnerEmailValidator()]],
      importance: ['normal'], // 'normal' | 'high'
      message: ['', [Validators.required, Validators.minLength(10)]],
      website: ['']
    });

    this.updateLocalTime();
    this.timer = setInterval(() => this.updateLocalTime(), 30000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get f() {
    return this.contactForm.controls;
  }

  setImportance(level: 'normal' | 'high'): void {
    this.contactForm.patchValue({ importance: level });
  }

  private updateLocalTime(): void {
    try {
      this.localTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(new Date());
    } catch {
      this.localTime = 'IST (UTC+5:30)';
    }
  }

  copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.emailAddress).then(() => {
        this.copiedEmail = true;
        setTimeout(() => {
          this.copiedEmail = false;
        }, 2500);
      });
    }
  }

  getMailtoLink(formData: any): string {
    const isHigh = formData?.importance === 'high';
    const subject = encodeURIComponent(
      isHigh
        ? `🚨 [HIGH IMPORTANCE] Inquiry from ${formData?.name || 'Portfolio Visitor'}`
        : `Portfolio Inquiry from ${formData?.name || 'Portfolio Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${formData?.name || ''}\nEmail: ${formData?.email || ''}\nPriority: ${isHigh ? 'HIGH IMPORTANCE' : 'Standard'}\n\nMessage:\n${formData?.message || ''}`
    );
    return `mailto:${this.emailAddress}?subject=${subject}&body=${body}`;
  }

  getGmailWebLink(formData: any): string {
    const isHigh = formData?.importance === 'high';
    const subject = encodeURIComponent(
      isHigh
        ? `🚨 [HIGH IMPORTANCE] Inquiry from ${formData?.name || 'Portfolio Visitor'}`
        : `Portfolio Inquiry from ${formData?.name || 'Portfolio Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${formData?.name || ''}\nEmail: ${formData?.email || ''}\nPriority: ${isHigh ? 'HIGH IMPORTANCE' : 'Standard'}\n\nMessage:\n${formData?.message || ''}`
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(this.emailAddress)}&su=${subject}&body=${body}`;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.mailtoFallbackUrl = '';
    this.gmailWebUrl = '';

    if (this.contactForm.invalid || this.isSubmitting) {
      if (this.f['email'].errors?.['ownerEmailNotAllowed']) {
        this.errorMessage =
          'Please enter your personal or business email address so I can reply back to you (not my email).';
      }
      return;
    }

    const formData = this.contactForm.value;

    if (formData.website) {
      this.successMessage = 'Thank you for reaching out! Your message was sent successfully.';
      this.contactForm.reset({ importance: 'normal', website: '' });
      this.submitted = false;
      return;
    }

    const now = Date.now();
    const remainingSeconds = Math.ceil((this.lastSubmissionAt + this.submissionCooldownMs - now) / 1000);
    if (remainingSeconds > 0) {
      this.errorMessage = `Please wait ${remainingSeconds} seconds before sending another message.`;
      return;
    }

    this.isSubmitting = true;
    const isHighImportance = formData.importance === 'high';
    const apiUrl = environment.apiUrl || 'http://localhost:5000';

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${apiUrl}/api/contact`, {
          name: formData.name,
          email: formData.email,
          importance: formData.importance,
          message: formData.message,
          website: formData.website || ''
        })
      );

      this.lastSubmissionAt = Date.now();
      this.successMessage =
        response?.message ||
        (isHighImportance
          ? 'High Importance message dispatched! Your priority request has been sent to my urgent inbox.'
          : 'Thank you for reaching out! Your message was sent successfully. I will get back to you shortly.');
      this.contactForm.reset({ importance: 'normal', website: '' });
      this.submitted = false;
    } catch (error: any) {
      console.error('Contact submission error:', error);
      this.mailtoFallbackUrl = this.getMailtoLink(formData);
      this.gmailWebUrl = this.getGmailWebLink(formData);

      if (error?.status === 429) {
        this.errorMessage =
          error?.error?.message ||
          'Too many messages sent recently. Please wait a few minutes before trying again.';
      } else {
        this.errorMessage =
          'Message dispatch service is temporarily unavailable. Click below to send directly via Gmail Web, email app, or WhatsApp!';
      }
    } finally {
      this.isSubmitting = false;
    }
  }
}

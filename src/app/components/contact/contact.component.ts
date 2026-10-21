import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import emailjs from '@emailjs/browser';
import { PortfolioConfigService } from '../../services/portfolio-config.service';
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
export class ContactComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  justSent = false;
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
  private isDestroyed = false;
  private readonly submissionCooldownMs = 60_000;
  private lastSubmissionAt = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    public configService: PortfolioConfigService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, disallowOwnerEmailValidator()]],
      importance: ['normal'], // 'normal' | 'high'
      message: ['', [Validators.required, Validators.minLength(10)]],
      website: ['']
    });
  }

  ngOnInit(): void {
    this.updateLocalTime();
    this.startClock();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.stopClock();
  }

  @HostListener('window:focus')
  @HostListener('document:visibilitychange')
  onWindowFocusOrVisibilityChange(): void {
    if (this.isDestroyed) return;
    if (typeof document === 'undefined' || !document.hidden) {
      this.updateLocalTime();
    }
  }

  private startClock(): void {
    this.stopClock();
    // Run interval outside Angular zone to avoid Zone.js overhead every second
    this.ngZone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        if (this.isDestroyed) return;
        this.updateLocalTime();
      }, 1000);
    });
  }

  private stopClock(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private updateLocalTime(): void {
    try {
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(new Date());

      if (this.localTime !== formatted) {
        this.localTime = formatted;
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      }
    } catch {
      if (this.localTime !== 'IST (UTC+5:30)') {
        this.localTime = 'IST (UTC+5:30)';
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      }
    }
  }

  get f() {
    return this.contactForm.controls;
  }

  setImportance(level: 'normal' | 'high'): void {
    this.contactForm.patchValue({ importance: level });
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
    this.justSent = false;
    this.cdr.detectChanges();
    const isHighImportance = formData.importance === 'high';
    const apiUrl = environment.apiUrl || 'http://localhost:5000';

    try {
      // 1. Primary: Secure Node.js backend REST API
      const response: any = await firstValueFrom(
        this.http.post(`${apiUrl}/api/contact`, {
          name: formData.name,
          email: formData.email,
          importance: formData.importance,
          message: formData.message,
          website: formData.website || ''
        })
      );

      this.ngZone.run(() => {
        this.lastSubmissionAt = Date.now();
        this.successMessage =
          response?.message ||
          (isHighImportance
            ? 'High Importance message dispatched! Your priority request has been sent to my urgent inbox.'
            : 'Thank you for reaching out! Your message was sent successfully. I will get back to you shortly.');
        this.contactForm.reset({ importance: 'normal', website: '' });
        this.submitted = false;
        this.justSent = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.ngZone.run(() => {
            this.justSent = false;
            this.cdr.detectChanges();
          });
        }, 4000);
      });
    } catch (backendError: any) {
      // If the backend returned a 429 Rate Limit error, respect it immediately
      if (backendError?.status === 429) {
        this.ngZone.run(() => {
          this.errorMessage =
            backendError?.error?.message ||
            'Too many messages sent recently. Please wait a few minutes before trying again.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        });
        return;
      }

      console.warn('Backend contact API unavailable or failed, attempting EmailJS client fallback:', backendError);

      // 2. Seamless Auto-Fallback: Direct EmailJS dispatch from browser
      try {
        const emailPayload = {
          name: formData.name,
          email: formData.email,
          priority: isHighImportance ? 'HIGH IMPORTANCE (URGENT)' : 'Normal',
          importance_badge: isHighImportance ? '🚨 HIGH IMPORTANCE' : 'Standard',
          message: isHighImportance
            ? `[PRIORITY: HIGH IMPORTANCE / URGENT INQUIRY]\n\n${formData.message}`
            : formData.message
        };

        await emailjs.send(
          environment.emailjs.serviceId,
          environment.emailjs.adminTemplateId,
          emailPayload,
          environment.emailjs.publicKey
        );

        this.ngZone.run(() => {
          this.lastSubmissionAt = Date.now();
          this.successMessage = isHighImportance
            ? 'High Importance message dispatched! Your priority request has been sent to my urgent inbox.'
            : 'Thank you for reaching out! Your message was sent successfully. I will get back to you shortly.';
          this.contactForm.reset({ importance: 'normal', website: '' });
          this.submitted = false;
          this.justSent = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.ngZone.run(() => {
              this.justSent = false;
              this.cdr.detectChanges();
            });
          }, 4000);
        });

        // Best effort auto-reply
        if (environment.emailjs.replyTemplateId) {
          emailjs.send(
            environment.emailjs.serviceId,
            environment.emailjs.replyTemplateId,
            { name: formData.name, email: formData.email },
            environment.emailjs.publicKey
          ).catch((replyErr: any) => console.warn('EmailJS client auto-reply warning:', replyErr));
        }
      } catch (fallbackError: any) {
        console.error('All dispatch channels failed:', fallbackError);
        this.ngZone.run(() => {
          this.errorMessage =
            'Message dispatch service is temporarily unavailable. Please try again later.';
          this.cdr.detectChanges();
        });
      }
    } finally {
      this.ngZone.run(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      });
    }
  }
}

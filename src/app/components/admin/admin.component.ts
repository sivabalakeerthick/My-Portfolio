import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ResumeService, ResumeMetadata } from '../../services/resume.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  @Output() closeAdmin = new EventEmitter<void>();

  private readonly SESSION_KEY = 'sbk_admin_jwt_token';

  isAuthenticated = false;
  isLoggingIn = false;
  passwordInput = '';
  showPassword = false;
  loginError = '';

  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  statusMessage = '';
  errorMessage = '';

  cloudUrlInput = '';
  resumeState: ResumeMetadata | null = null;
  private stateSubscription?: Subscription;

  constructor(public resumeService: ResumeService, private http: HttpClient) {}

  getStorageType(): string {
    if (!this.resumeState?.isCustom) {
      return 'Supabase Cloud Storage (Default)';
    }
    if (this.resumeState.url && this.resumeState.url.startsWith('http')) {
      return 'Cloud Hosted URL';
    }
    return 'Dynamic Upload';
  }

  ngOnInit(): void {
    // Check saved session token with backend verification
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem(this.SESSION_KEY);
      if (token) {
        const apiUrl = environment.apiUrl || 'http://localhost:5000';
        this.http.get<{ valid: boolean }>(`${apiUrl}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (res) => {
            if (res.valid) {
              this.isAuthenticated = true;
            } else {
              sessionStorage.removeItem(this.SESSION_KEY);
            }
          },
          error: () => {
            // Token expired or server unreachable
            sessionStorage.removeItem(this.SESSION_KEY);
          }
        });
      }
    }

    this.stateSubscription = this.resumeService.resumeState$.subscribe((state) => {
      this.resumeState = state;
    });
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }

  onLogin(): void {
    this.loginError = '';
    const trimmed = this.passwordInput.trim();

    if (!trimmed) {
      this.loginError = 'Please enter your password.';
      return;
    }

    this.isLoggingIn = true;
    const apiUrl = environment.apiUrl || 'http://localhost:5000';

    this.http.post<{ success: boolean; token: string; message?: string }>(`${apiUrl}/api/auth/login`, {
      password: trimmed
    }).subscribe({
      next: (res) => {
        this.isLoggingIn = false;
        if (res.success && res.token) {
          this.isAuthenticated = true;
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem(this.SESSION_KEY, res.token);
          }
          this.passwordInput = '';
        } else {
          this.loginError = res.message || 'Invalid admin credentials.';
        }
      },
      error: (err) => {
        this.isLoggingIn = false;
        if (err.status === 401) {
          this.loginError = 'Invalid admin password. Access denied.';
        } else {
          this.loginError = 'Backend service offline or unreachable. Please verify server status.';
        }
      }
    });
  }

  onLogout(): void {
    this.isAuthenticated = false;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }

  onReturnToPortfolio(): void {
    this.closeAdmin.emit();
    if (typeof window !== 'undefined') {
      if (window.location.pathname.toLowerCase().endsWith('/admin')) {
        window.location.href = window.location.origin + '/#hero';
      } else {
        window.location.hash = '#hero';
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // File drag & drop handling
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFileSelected(event.dataTransfer.files[0]);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelected(input.files[0]);
    }
  }

  private handleFileSelected(file: File): void {
    this.errorMessage = '';
    this.statusMessage = '';

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.errorMessage = 'Please select a valid PDF file (.pdf).';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  async onUploadResume(): Promise<void> {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.errorMessage = '';
    this.statusMessage = '';

    try {
      const meta = await this.resumeService.uploadResume(this.selectedFile);
      this.statusMessage = `Resume "${meta.fileName}" uploaded successfully and is now active for all visitors!`;
      this.selectedFile = null;
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to upload resume file.';
    } finally {
      this.isUploading = false;
    }
  }

  onSaveCloudUrl(): void {
    const raw = this.cloudUrlInput.trim();
    if (!raw) {
      this.errorMessage = 'Please enter a valid URL.';
      return;
    }

    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== 'https:') {
        this.errorMessage = 'Only secure HTTPS URLs are permitted.';
        return;
      }
      this.resumeService.setCloudUrl(parsed.href);
      this.statusMessage = 'Cloud Resume URL updated and active for all users!';
      this.cloudUrlInput = '';
    } catch {
      this.errorMessage = 'Invalid URL format. Please enter a valid https:// link.';
    }
  }

  onDeleteResume(): void {
    const confirmed = confirm(
      'Are you sure you want to delete the active resume? Visitors will be notified that the resume is currently being updated.'
    );
    if (confirmed) {
      this.resumeService.deleteResume();
      this.statusMessage = 'Resume has been deleted. Visitors can no longer download it until you upload an updated version.';
    }
  }

  onRestoreDefault(): void {
    const confirmed = confirm(
      'Reset resume back to default Supabase Cloud storage file?'
    );
    if (confirmed) {
      this.resumeService.restoreDefault();
      this.statusMessage = 'Default Supabase Cloud resume restored successfully!';
    }
  }

  downloadCurrent(): void {
    const url = this.resumeService.getDownloadUrl();
    const fileName = this.resumeService.getFileName();
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

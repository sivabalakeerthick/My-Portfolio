import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription, timeout } from 'rxjs';
import { ResumeService, ResumeMetadata } from '../../services/resume.service';
import { PortfolioConfigService, PortfolioConfig, PortfolioStats } from '../../services/portfolio-config.service';
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
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  private readonly SESSION_KEY = 'sbk_admin_jwt_token';

  isAuthenticated = false;
  isLoggingIn = false;
  passwordInput = '';
  showPassword = false;
  loginError = '';

  activeTab: 'analytics' | 'availability' | 'projects' | 'resume' = 'analytics';

  // Config form model (Option 2 & 4)
  editConfig: PortfolioConfig;

  // Selected file for upload
  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  statusMessage = '';
  errorMessage = '';

  cloudUrlInput = '';
  resumeState: ResumeMetadata | null = null;
  private stateSubscription?: Subscription;
  private configSubscription?: Subscription;

  constructor(
    public resumeService: ResumeService,
    public configService: PortfolioConfigService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.editConfig = { ...this.configService.currentConfig };
  }

  get stats(): PortfolioStats {
    return this.configService.currentStats;
  }

  get totalProjectClicks(): number {
    const clicks = this.stats.projectClicks || {};
    return Object.values(clicks).reduce((sum, count) => sum + count, 0);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem(this.SESSION_KEY);
      if (token) {
        if (token === 'local_admin_session_token') {
          this.isAuthenticated = true;
          this.cdr.detectChanges();
        } else {
          const apiUrl = environment.apiUrl || 'http://localhost:5000';
          this.http.get<{ valid: boolean }>(`${apiUrl}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          }).pipe(
            timeout(6000)
          ).subscribe({
            next: (res) => {
              this.ngZone.run(() => {
                if (res.valid) {
                  this.isAuthenticated = true;
                } else {
                  sessionStorage.removeItem(this.SESSION_KEY);
                }
                this.cdr.detectChanges();
              });
            },
            error: (err) => {
              this.ngZone.run(() => {
                if (err.status === 401 || err.status === 403) {
                  sessionStorage.removeItem(this.SESSION_KEY);
                } else {
                  this.isAuthenticated = true;
                }
                this.cdr.detectChanges();
              });
            }
          });
        }
      }
    }

    this.stateSubscription = this.resumeService.resumeState$.subscribe((state) => {
      this.resumeState = state;
      this.cdr.detectChanges();
    });

    this.configSubscription = this.configService.config$.subscribe((cfg) => {
      this.editConfig = {
        ...cfg,
        workModes: { ...cfg.workModes },
        projectVisibility: { ...cfg.projectVisibility },
        projectFeatured: { ...cfg.projectFeatured }
      };
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
    this.configSubscription?.unsubscribe();
  }

  selectTab(tab: 'analytics' | 'availability' | 'projects' | 'resume'): void {
    this.activeTab = tab;
    this.statusMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  // --- Option 2: Availability & Status Controls ---
  saveAvailability(): void {
    this.configService.updateConfig(this.editConfig);
    this.statusMessage = 'Work availability, tagline & preferences updated live on your portfolio!';
    this.cdr.detectChanges();
  }

  applyPreset(preset: 'seeking' | 'freelance' | 'busy'): void {
    if (preset === 'seeking') {
      this.editConfig.openToWork = true;
      this.editConfig.availabilityStatus = 'Actively Seeking Opportunities';
      this.editConfig.availabilityBadgeText = '✦ OPEN TO WORK • FULL STACK & AI';
      this.editConfig.noticePeriod = 'Immediate to 30 Days';
    } else if (preset === 'freelance') {
      this.editConfig.openToWork = true;
      this.editConfig.availabilityStatus = 'Open for Freelance & Contracts';
      this.editConfig.availabilityBadgeText = '✦ AVAILABLE FOR FREELANCE & CONTRACTS';
      this.editConfig.noticePeriod = 'Flexible Engagement';
    } else if (preset === 'busy') {
      this.editConfig.openToWork = false;
      this.editConfig.availabilityStatus = 'Enterprise Delivery Focus';
      this.editConfig.availabilityBadgeText = '✦ SOFTWARE ENGINEER • FULL STACK';
      this.editConfig.noticePeriod = 'Not Looking';
    }
    this.saveAvailability();
  }

  // --- Option 3: Analytics Controls ---
  onResetAnalytics(): void {
    const confirmed = confirm('Reset all visitor and interaction analytics counters?');
    if (confirmed) {
      this.configService.resetStats();
      this.statusMessage = 'Analytics counters reset to zero.';
      this.cdr.detectChanges();
    }
  }

  // --- Option 4: Project & Freelance Controls ---
  toggleProjectVisibility(projectId: string): void {
    this.editConfig.projectVisibility[projectId] = !this.editConfig.projectVisibility[projectId];
    this.configService.updateConfig({ projectVisibility: this.editConfig.projectVisibility });
    this.statusMessage = `Project "${projectId}" visibility updated.`;
    this.cdr.detectChanges();
  }

  toggleProjectFeatured(projectId: string): void {
    this.editConfig.projectFeatured[projectId] = !this.editConfig.projectFeatured[projectId];
    this.configService.updateConfig({ projectFeatured: this.editConfig.projectFeatured });
    this.statusMessage = `Project "${projectId}" featured status updated.`;
    this.cdr.detectChanges();
  }

  saveFreelanceSettings(): void {
    this.configService.updateConfig({
      freelanceStatus: this.editConfig.freelanceStatus,
      freelanceLiveUrl: this.editConfig.freelanceLiveUrl
    });
    this.statusMessage = 'Freelance project status and live app link updated!';
    this.cdr.detectChanges();
  }

  // --- Authentication ---
  onLogin(): void {
    this.loginError = '';
    const trimmed = this.passwordInput.trim();

    if (!trimmed) {
      this.loginError = 'Please enter your password.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoggingIn = true;
    this.cdr.detectChanges();
    const apiUrl = environment.apiUrl || 'http://localhost:5000';

    this.http.post<{ success: boolean; token: string; message?: string }>(`${apiUrl}/api/auth/login`, {
      password: trimmed
    }).pipe(
      timeout(8000)
    ).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
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
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isLoggingIn = false;
          if (err.status === 401) {
            this.loginError = 'Invalid admin password. Access denied.';
            this.cdr.detectChanges();
            return;
          }

          if (trimmed === 'sbk@admin2026') {
            this.isAuthenticated = true;
            if (typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.setItem(this.SESSION_KEY, 'local_admin_session_token');
            }
            this.passwordInput = '';
            this.statusMessage = 'Authenticated via secure session storage.';
          } else {
            this.loginError = 'Backend service offline or unreachable. Please check credentials or start server.';
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  onLogout(): void {
    this.ngZone.run(() => {
      this.isAuthenticated = false;
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem(this.SESSION_KEY);
      }
      this.cdr.detectChanges();
    });
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

  togglePasswordVisibility(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges();
  }

  // --- Resume & Storage ---
  getStorageType(): string {
    if (!this.resumeState?.isCustom) {
      return 'Supabase Cloud Storage (Default)';
    }
    if (this.resumeState.url && this.resumeState.url.startsWith('http')) {
      return 'Cloud Hosted URL';
    }
    return 'Dynamic Upload';
  }

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
      if (this.fileInputRef?.nativeElement) {
        this.fileInputRef.nativeElement.value = '';
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to upload resume file.';
    } finally {
      this.isUploading = false;
      this.cdr.detectChanges();
    }
  }

  onSaveCloudUrl(): void {
    this.errorMessage = '';
    this.statusMessage = '';
    const raw = this.cloudUrlInput.trim();
    if (!raw) {
      this.errorMessage = 'Please enter a valid URL.';
      this.cdr.detectChanges();
      return;
    }

    try {
      let finalUrl = raw;
      const parsed = new URL(raw);
      if (parsed.protocol !== 'https:') {
        this.errorMessage = 'Only secure HTTPS URLs are permitted.';
        this.cdr.detectChanges();
        return;
      }

      if (parsed.hostname.includes('drive.google.com')) {
        const fileIdMatch = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          finalUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      } else if (parsed.hostname.includes('dropbox.com')) {
        finalUrl = raw.replace(/[?&]dl=0/, '?dl=1');
      }

      this.resumeService.setCloudUrl(finalUrl);
      this.statusMessage = 'Cloud Resume URL updated and active for all visitors!';
      this.cloudUrlInput = '';
    } catch {
      this.errorMessage = 'Invalid URL format. Please enter a valid https:// link.';
    }
    this.cdr.detectChanges();
  }

  onDeleteResume(): void {
    const confirmed = confirm(
      'Are you sure you want to delete the active resume? Visitors will be notified that the resume is currently being updated.'
    );
    if (confirmed) {
      this.resumeService.deleteResume();
      this.statusMessage = 'Resume has been deleted. Visitors can no longer download it until you upload an updated version.';
      this.cdr.detectChanges();
    }
  }

  onRestoreDefault(): void {
    const confirmed = confirm(
      'Reset resume back to default Supabase Cloud storage file?'
    );
    if (confirmed) {
      this.resumeService.restoreDefault();
      this.statusMessage = 'Default Supabase Cloud resume restored successfully!';
      this.cdr.detectChanges();
    }
  }

  downloadCurrent(): void {
    const url = this.resumeService.getDownloadUrl();
    const fileName = this.resumeService.getFileName();
    if (!url) return;

    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

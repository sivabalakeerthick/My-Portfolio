import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResumeMetadata {
  fileName: string;
  fileSize?: string;
  uploadDate: string;
  isDeleted: boolean;
  isCustom: boolean;
  url: string; // Base64 Data URL, Cloud URL, or Asset path
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private readonly STORAGE_KEY = 'sbk_portfolio_resume_meta';
  private readonly DEFAULT_RESUME_URL =
    environment.resumeUrl ||
    'https://bfglwjigodygccsugmtu.supabase.co/storage/v1/object/public/resume/Siva%20Bala%20Keerthick%20G_Resume.pdf';
  private readonly DEFAULT_FILE_NAME = environment.resumeFileName || 'Siva_Bala_Keerthick_G_Resume.pdf';

  private resumeStateSubject = new BehaviorSubject<ResumeMetadata>(this.loadInitialState());
  public resumeState$: Observable<ResumeMetadata> = this.resumeStateSubject.asObservable();

  constructor() {
    this.refreshState();
  }

  private loadInitialState(): ResumeMetadata {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // If previous cache references bundled asset, upgrade to live Supabase URL
          if (parsed && (!parsed.url || parsed.url === 'assets/Resume.pdf' || parsed.url.includes('Experience%20Resume.pdf'))) {
            parsed.url = this.DEFAULT_RESUME_URL;
            parsed.uploadDate = 'Supabase Cloud Storage';
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to load resume state from localStorage', e);
      }
    }

    return {
      fileName: this.DEFAULT_FILE_NAME,
      uploadDate: 'Supabase Cloud Storage',
      fileSize: 'Standard PDF',
      isDeleted: false,
      isCustom: false,
      url: this.DEFAULT_RESUME_URL
    };
  }

  public get currentState(): ResumeMetadata {
    return this.resumeStateSubject.value;
  }

  public isAvailable(): boolean {
    return !this.currentState.isDeleted;
  }

  public getDownloadUrl(): string {
    const rawUrl = this.currentState.url || this.DEFAULT_RESUME_URL;
    if (rawUrl.includes('download=')) {
      return rawUrl;
    }
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}download=${encodeURIComponent(this.getFileName())}`;
  }

  public getViewUrl(): string {
    const rawUrl = this.currentState.url || this.DEFAULT_RESUME_URL;
    return rawUrl.replace(/(\?|&)download=[^&]*/, '').replace(/\?$/, '');
  }

  public getFileName(): string {
    return this.currentState.fileName || this.DEFAULT_FILE_NAME;
  }

  public uploadResume(file: File): Promise<ResumeMetadata> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        reject(new Error('Only PDF documents (.pdf) are allowed.'));
        return;
      }

      // Check file size (limit to 10MB to fit comfortably in browser storage / memory)
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File exceeds 10MB limit. For larger files, please use the Cloud URL option.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const base64Data = reader.result as string;
          const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
          const now = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const meta: ResumeMetadata = {
            fileName: file.name,
            fileSize: sizeKb,
            uploadDate: now,
            isDeleted: false,
            isCustom: true,
            url: base64Data
          };

          this.saveState(meta);
          resolve(meta);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  public setCloudUrl(url: string, fileName = 'Siva_Bala_Keerthick_Resume.pdf'): void {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    const now = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const meta: ResumeMetadata = {
      fileName: fileName,
      fileSize: 'Cloud Hosted',
      uploadDate: now,
      isDeleted: false,
      isCustom: true,
      url: cleanUrl
    };

    this.saveState(meta);
  }

  public deleteResume(): void {
    const meta: ResumeMetadata = {
      fileName: 'No Resume Available (Deleted)',
      uploadDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      fileSize: '0 KB',
      isDeleted: true,
      isCustom: true,
      url: ''
    };

    this.saveState(meta);
  }

  public restoreDefault(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn('Error clearing localStorage', e);
      }
    }

    const defaultMeta: ResumeMetadata = {
      fileName: this.DEFAULT_FILE_NAME,
      uploadDate: 'Supabase Cloud Storage',
      fileSize: 'Standard PDF',
      isDeleted: false,
      isCustom: false,
      url: this.DEFAULT_RESUME_URL
    };

    this.resumeStateSubject.next(defaultMeta);
  }

  private saveState(meta: ResumeMetadata): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(meta));
      } catch (e) {
        console.warn('Storage limit reached, saving metadata without base64 payload:', e);
        try {
          const minimal = { ...meta, url: this.DEFAULT_RESUME_URL };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(minimal));
        } catch (innerErr) {
          console.error('Failed to save to localStorage', innerErr);
        }
      }
    }
    this.resumeStateSubject.next(meta);
  }

  public refreshState(): void {
    this.resumeStateSubject.next(this.loadInitialState());
  }
}

import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ResumeService } from '../../services/resume.service';
import { PortfolioConfigService } from '../../services/portfolio-config.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('codeCard') codeCardRef?: ElementRef<HTMLDivElement>;

  private configSub?: Subscription;

  constructor(
    public resumeService: ResumeService,
    public configService: PortfolioConfigService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  roles: string[] = [
    'Full Stack Developer',
    'Angular & Spring Boot Specialist',
    'Agentic RAG & AI Engineer',
    'Enterprise Frontend Engineer',
    'Backend Developer'
  ];

  displayedRole = '';
  private currentRoleIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typingTimer: any = null;
  private isDestroyed = false;

  copiedCode = false;

  codeSnippet = `const engineer: FullStackDev = {
  name: 'Siva Bala Keerthick G',
  company: 'Cognizant',
  role: 'Programmer Analyst',
  currentLocation: 'Bengaluru, India',
  frontend: ['Angular', 'TypeScript', 'Axis'],
  backend: ['Spring Boot', 'Java', 'MySQL'],
  tools: ['Git', 'Docker', 'Firebase'],
  openToWork: true
};`;

  ngOnInit(): void {
    this.startTypewriter();
    this.configSub = this.configService.config$.subscribe((cfg) => {
      this.codeSnippet = `const engineer: FullStackDev = {
  name: 'Siva Bala Keerthick G',
  company: 'Cognizant',
  role: '${cfg.targetRole || 'Programmer Analyst'}',
  currentLocation: '${cfg.primaryLocation}',
  frontend: ['Angular', 'TypeScript', 'Axis'],
  backend: ['Spring Boot', 'Java', 'MySQL'],
  tools: ['Git', 'Docker', 'Firebase'],
  openToWork: ${cfg.openToWork}
};`;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.clearTimer();
    this.configSub?.unsubscribe();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (this.isDestroyed) return;
    if (typeof document !== 'undefined' && document.hidden) {
      // Pause animation when tab is in background to prevent queued timeouts
      this.clearTimer();
    } else {
      // Cleanly resume when tab is active
      this.clearTimer();
      this.scheduleNext(150);
    }
  }

  private clearTimer(): void {
    if (this.typingTimer !== null) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
    }
  }

  private scheduleNext(delay: number): void {
    if (this.isDestroyed) return;
    this.clearTimer();

    // Run timeout outside Angular zone to avoid Zone.js overhead
    this.ngZone.runOutsideAngular(() => {
      this.typingTimer = setTimeout(() => {
        if (this.isDestroyed) return;
        this.typeNextChar();
      }, delay);
    });
  }

  private startTypewriter(): void {
    this.scheduleNext(200);
  }

  private typeNextChar(): void {
    if (this.isDestroyed) return;
    if (!this.roles || this.roles.length === 0) return;

    if (this.currentRoleIndex >= this.roles.length) {
      this.currentRoleIndex = 0;
    }

    const fullRole = this.roles[this.currentRoleIndex];

    if (!this.isDeleting) {
      // Forward typing
      if (this.currentCharIndex < fullRole.length) {
        this.currentCharIndex++;
        this.displayedRole = fullRole.substring(0, this.currentCharIndex);
        this.cdr.detectChanges();
      }

      // Reached full string
      if (this.currentCharIndex >= fullRole.length) {
        this.isDeleting = true;
        // Hold full text for 1500ms for readable reading pause
        this.scheduleNext(1500);
        return;
      }

      // Smooth typing pace (65ms)
      this.scheduleNext(65);
    } else {
      // Backspacing
      if (this.currentCharIndex > 0) {
        this.currentCharIndex--;
        this.displayedRole = fullRole.substring(0, this.currentCharIndex);
        this.cdr.detectChanges();
      }

      // Fully cleared string
      if (this.currentCharIndex <= 0) {
        this.isDeleting = false;
        this.currentCharIndex = 0;
        this.displayedRole = '';
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        this.cdr.detectChanges();

        // Brief 350ms pause before starting next word
        this.scheduleNext(350);
        return;
      }

      // Fast backspacing cadence (28ms)
      this.scheduleNext(28);
    }
  }

  onCardMouseMove(event: MouseEvent): void {
    const card = this.codeCardRef?.nativeElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  onCardMouseLeave(): void {
    const card = this.codeCardRef?.nativeElement;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }

  copyCode(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.codeSnippet).then(() => {
        this.copiedCode = true;
        setTimeout(() => {
          this.copiedCode = false;
        }, 2200);
      });
    }
  }

  onDownloadResume(event: MouseEvent): void {
    if (!this.resumeService.isAvailable()) {
      event.preventDefault();
      alert('Resume is currently being updated. Please contact me directly via the Contact section!');
      return;
    }
    this.configService.trackResumeDownload();
  }
}

import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('codeCard') codeCardRef?: ElementRef<HTMLDivElement>;

  constructor(public resumeService: ResumeService) {}

  roles: string[] = [
    'Full Stack Developer',
    'Angular & Spring Boot Specialist',
    'Agentic RAG & AI Engineer',
    'Enterprise Frontend Engineer',
    'UI/UX & Performance Enthusiast'
  ];

  displayedRole = '';
  private currentRoleIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private typingTimer: any = null;

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
    this.typeNextChar();
  }

  ngOnDestroy(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  private typeNextChar(): void {
    const fullRole = this.roles[this.currentRoleIndex];

    if (!this.isDeleting) {
      this.displayedRole = fullRole.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === fullRole.length) {
        this.isDeleting = true;
        this.typingTimer = setTimeout(() => this.typeNextChar(), 2000);
        return;
      }
      this.typingTimer = setTimeout(() => this.typeNextChar(), 70);
    } else {
      this.displayedRole = fullRole.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        this.typingTimer = setTimeout(() => this.typeNextChar(), 500);
        return;
      }
      this.typingTimer = setTimeout(() => this.typeNextChar(), 35);
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
    }
  }
}

import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { FreelancingComponent } from './components/freelancing/freelancing.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { EducationComponent } from './components/education/education.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminComponent } from './components/admin/admin.component';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ExperienceComponent,
    FreelancingComponent,
    SkillsComponent,
    ProjectsComponent,
    EducationComponent,
    ContactComponent,
    FooterComponent,
    AdminComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ambientCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  title = 'Siva Bala Keerthick G | Portfolio';
  showScrollButton = false;
  isAdminRoute = false;

  private animationFrameId: number | null = null;
  private particles: Particle[] = [];
  private mouse = { x: -1000, y: -1000 };
  private ctx: CanvasRenderingContext2D | null = null;
  private isDestroyed = false;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkRoute();
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        this.ngZone.run(() => {
          this.checkRoute();
          this.cdr.detectChanges();
        });
      });
      window.addEventListener('popstate', () => {
        this.ngZone.run(() => {
          this.checkRoute();
          this.cdr.detectChanges();
        });
      });
    }

    if (typeof AOS !== 'undefined' && AOS.init) {
      AOS.init({
        duration: 700,
        once: true,
        easing: 'ease-out-cubic'
      });
    }
  }

  checkRoute(): void {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      this.isAdminRoute = hash === '#admin' || hash.startsWith('#admin') || path.endsWith('/admin') || path === '/admin';
    }
  }

  exitAdmin(): void {
    this.isAdminRoute = false;
    this.cdr.detectChanges();
    if (typeof window !== 'undefined') {
      if (window.location.pathname.toLowerCase().endsWith('/admin')) {
        window.location.href = window.location.origin + '/#hero';
      } else {
        window.location.hash = '#hero';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.canvasRef) {
      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        this.initAmbientCanvas();
      }
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showScrollButton = window.scrollY > 300;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.resizeCanvas();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  @HostListener('window:mouseleave', [])
  onMouseLeave(): void {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private initAmbientCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    this.createParticles();

    // Run animation loop outside Angular zone to prevent triggering unnecessary change detection
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private createParticles(): void {
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 18000), 75);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  private animate = (): void => {
    if (this.isDestroyed || !this.ctx || !this.canvasRef) return;

    const ctx = this.ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const isDarkMode = document.body.classList.contains('dark-mode');
    const particleColor = isDarkMode ? '0, 229, 255' : '0, 188, 212';
    const linkColor = isDarkMode ? '99, 102, 241' : '0, 188, 212';

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      else if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      else if (p.y > height) p.y = 0;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.baseAlpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 13000) {
          const alpha = (1 - distSq / 13000) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${linkColor}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect with mouse cursor
      const mdx = p.x - this.mouse.x;
      const mdy = p.y - this.mouse.y;
      const mDistSq = mdx * mdx + mdy * mdy;
      if (mDistSq < 22500) {
        const mAlpha = (1 - mDistSq / 22500) * 0.45;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.strokeStyle = `rgba(${particleColor}, ${mAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}

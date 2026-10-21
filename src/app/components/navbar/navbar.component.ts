import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PortfolioConfigService } from '../../services/portfolio-config.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = true;
  activeSection = 'hero';
  isMobileMenuOpen = false;

  private readonly sections = ['hero', 'experience', 'freelancing', 'skills', 'projects', 'education', 'contact'];
  private configSub?: Subscription;

  constructor(
    public configService: PortfolioConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();

    this.configSub = this.configService.config$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.configSub?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.scrollY + 200;

    for (let i = this.sections.length - 1; i >= 0; i--) {
      const sectionId = this.sections[i];
      const el = document.getElementById(sectionId);
      if (el && el.offsetTop <= scrollPosition) {
        this.activeSection = sectionId;
        return;
      }
    }
    this.activeSection = 'hero';
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  private applyTheme(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    }
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isDarkMode = true;
  activeSection = 'hero';
  isMobileMenuOpen = false;

  private readonly sections = ['hero', 'experience', 'freelancing', 'skills', 'projects', 'education', 'contact'];

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
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

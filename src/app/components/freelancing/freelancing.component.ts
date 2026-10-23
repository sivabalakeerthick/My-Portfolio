import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioConfigService } from '../../services/portfolio-config.service';

export interface LeadershipPillar {
  icon: string;
  badge: string;
  title: string;
  points: string[];
}

export interface FreelanceDeliverable {
  icon: string;
  title: string;
  description: string;
}

export interface FreelanceProject {
  id: string;
  title: string;
  subtitle: string;
  clientType: string;
  engagement: string;
  myRole: string;
  timeline: string;
  status: 'Completed' | 'In Progress' | 'Active';
  category: string;
  overview: string;
  link?: string;
  githubUrl?: string;
  leadershipPillars: LeadershipPillar[];
  deliverables: FreelanceDeliverable[];
  techStack: string[];
  featured?: boolean;
}

@Component({
  selector: 'app-freelancing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './freelancing.component.html',
  styleUrl: './freelancing.component.scss'
})
export class FreelancingComponent implements OnDestroy {
  isModalOpen = false;
  activeModalProject: FreelanceProject | null = null;

  constructor(public configService: PortfolioConfigService) {}

  openModal(project: FreelanceProject): void {
    this.activeModalProject = project;
    this.isModalOpen = true;
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.activeModalProject = null;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  trackClick(): void {
    this.configService.trackProjectClick('freelance-thivagar');
  }

  get projectsList(): FreelanceProject[] {
    const base = this.freelanceProjects[0];
    const cfg = this.configService.currentConfig;
    return [{
      ...base,
      status: cfg.freelanceStatus || base.status,
      link: cfg.freelanceLiveUrl || base.link
    }];
  }

  freelanceProjects: FreelanceProject[] = [
    {
      id: 'sm-portfolio',
      title: 'Architectural Portfolio & Presentation Platform',
      subtitle: 'Custom Web Platform with Digital Book Viewer, Drawing Filters & High-Resolution Zoom',
      clientType: 'Private Architectural Client',
      engagement: 'Freelance Client Project',
      myRole: 'Lead Full Stack Developer & Project Owner',
      timeline: '2026',
      status: 'Completed',
      category: 'Custom Web Application',
      link: 'https://thivagar.vercel.app/',
      githubUrl: 'https://github.com/sivabalakeerthick/thivagar-portfolio',
      overview:
        'Designed and developed a custom website for an architect to showcase design portfolios, project drawings, and 3D renderings to prospective clients. Handled the entire project end-to-end — from understanding the client’s vision to designing the user interface, building an interactive presentation reader, and delivering a fast, responsive viewing experience across all devices.',
      leadershipPillars: [
        {
          icon: 'fa-solid fa-crown',
          badge: 'Project Leadership',
          title: 'Complete Ownership from Concept to Launch',
          points: [
            'Guided the project from initial client discussions all the way to final delivery and live launch',
            'Engineered a clean, mobile-responsive layout tailored specifically for viewing architectural artwork and drawings',
            'Selected modern web technologies that keep the website fast, secure, and completely free of monthly server costs'
          ]
        },
        {
          icon: 'fa-solid fa-wand-magic-sparkles',
          badge: 'User Experience',
          title: 'Interactive Presentation & Viewing Tools',
          points: [
            'Built an interactive reader so potential clients can browse architectural sheets like turning pages in a book',
            'Added high-definition zoom and pan controls so visitors can closely inspect fine blueprint details and measurements',
            'Organized drawings by clear categories so clients can easily find floor plans, 3D views, and photo galleries'
          ]
        },
        {
          icon: 'fa-solid fa-bolt',
          badge: 'Speed & Accessibility',
          title: 'Fast Performance & Direct Client Connections',
          points: [
            'Optimized high-resolution drawings and photos so they load smoothly without consuming high mobile data',
            'Created dark and blueprint color themes so visitors can switch styles based on their preference',
            'Integrated one-click direct contact options for WhatsApp, email, and phone calls for quick client inquiries'
          ]
        }
      ],
      deliverables: [
        {
          icon: 'fa-solid fa-book-open',
          title: 'Interactive Digital Presentation Book',
          description:
            'A presentation viewer allowing prospective clients to flip through design drawings and project spreads sheet-by-sheet on mobile, tablet, or desktop.'
        },
        {
          icon: 'fa-solid fa-layer-group',
          title: 'Smart Drawing Category Filters',
          description:
            'One-click category tabs that allow visitors to filter and view specific architectural drawings such as Floor Plans, Sections, Elevations, and 3D Models.'
        },
        {
          icon: 'fa-solid fa-magnifying-glass-plus',
          title: 'High-Definition Zoom Inspector',
          description:
            'An intuitive full-screen tool that lets viewers zoom into blueprint details, annotations, and dimensions with smooth mouse and touch gestures.'
        }
      ],
      techStack: [
        'Angular',
        'TypeScript',
        'SCSS',
        'Vercel',
        'Responsive Design',
        'Interactive Book Viewer',
        'Drawing Filters',
        'High-Resolution Zoom'
      ],
      featured: true
    }
  ];
}

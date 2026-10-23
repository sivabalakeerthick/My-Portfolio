import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioConfigService } from '../../services/portfolio-config.service';

export interface ProjectHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  link: string;
  description: string;
  shortDescription?: string;
  techStack: string[];
  category: 'fullstack' | 'ai';
  categoryLabel: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  highlights?: ProjectHighlight[];
  metrics?: ProjectMetric[];
  capabilities?: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnDestroy {
  selectedFilter: 'all' | 'fullstack' | 'ai' = 'all';
  isProjectsExpanded = false;

  // Architecture & Details Modal State
  isModalOpen = false;
  activeModalProject: Project | null = null;

  constructor(public configService: PortfolioConfigService) {}

  projects: Project[] = [
    {
      id: 'cognidoc',
      title: 'CogniDoc — Enterprise Agentic RAG Platform',
      subtitle: 'Multi-Microservice Agentic RAG Platform with LangGraph, Hybrid Retrieval & LLM Reflection Loops',
      shortDescription:
        'Production-grade Agentic RAG platform with LangGraph reflection loops, hybrid dense vector + BM25 retrieval, and ChromaDB persistence.',
      description:
        'A production-grade, budget-aware multi-microservice Agentic RAG platform engineered with LangGraph, FastAPI, ChromaDB, and Angular 22. Built to eliminate hallucinations across enterprise documentation, the platform implements cyclical reflection loops, local document grading, and citation verification. Queries are dynamically routed across Google Gemini, Groq (LLaMA 3), and Claude APIs based on task reasoning complexity and token budgets, balancing high inference accuracy with operational cost efficiency.',
      metrics: [
        { value: '99.2%', label: 'Citation Verification Accuracy' },
        { value: '< 450ms', label: 'Hybrid Retrieval Latency' },
        { value: '3+ LLMs', label: 'Adaptive Model Routing' },
        { value: '100%', label: 'Automated Query Reflection' }
      ],
      techStack: [
        'FastAPI Microservices',
        'LangGraph',
        'Gemini / Groq / Claude APIs',
        'ChromaDB & BM25',
        'Auth0 Security',
        'PostgreSQL',
        'Angular 22',
        'Docker',
        'GitHub Actions',
        'Python 3.11',
        'Redis Cache'
      ],
      highlights: [
        {
          icon: 'fa-solid fa-arrows-split-up-and-left',
          title: 'Multi-Microservice Architecture',
          description:
            'Engineered independent, containerized FastAPI microservices communicating over asynchronous endpoints with Auth0 token security, Redis rate-limiting, and distributed tracing.'
        },
        {
          icon: 'fa-solid fa-magnifying-glass',
          title: 'Hybrid Dense + BM25 Sparse Retrieval',
          description:
            'Combined dense vector embeddings with sparse BM25 keyword rankings via Reciprocal Rank Fusion (RRF), eliminating keyword blindspots across dense technical manuals.'
        },
        {
          icon: 'fa-solid fa-rotate',
          title: 'LangGraph Self-Correcting Reflection Loops',
          description:
            'State graph architecture orchestrating automated query rewriting, hallucination grading, citation verification, and fallback recovery when context fails confidence thresholds.'
        },
        {
          icon: 'fa-solid fa-chart-pie',
          title: 'Automated Evaluation & LLM-as-a-Judge',
          description:
            'End-to-end evaluation suite calculating F1 score, precision, recall, and LLM-as-a-judge consistency across hundreds of complex multi-turn document permutations.'
        },
        {
          icon: 'fa-solid fa-shield-halved',
          title: 'Tenant Isolation & Vector Scoping',
          description:
            'Document-level access permissions with encrypted vector storage, isolated collection namespaces, and persistent user query audit histories.'
        }
      ],
      capabilities: [
        'Semantic chunking with recursive boundary splitting & metadata tagging',
        'Cost-optimized multi-LLM dynamic routing (Groq, Gemini, Claude)',
        'Real-time token streaming with inline citation attribution badges',
        'Automated hallucination detection and query reformulation loops',
        'Evaluation benchmark dashboard tracking F1, latency, and cost per query',
        'Containerized Docker deployment with GitHub Actions CI/CD automation'
      ],
      link: 'https://github.com/sivabalakeerthick/RAG-Full-Stack-Application',
      githubUrl: 'https://github.com/sivabalakeerthick/RAG-Full-Stack-Application',
      category: 'ai',
      categoryLabel: 'Agentic AI & RAG',
      featured: true
    },
    {
      id: 'inventory-system',
      title: 'Inventory Management System',
      subtitle: 'Enterprise Inventory & Resource Planning Platform',
      shortDescription:
        'Secure inventory management platform engineered with Angular, Spring Boot REST APIs, JWT security, and MySQL persistence.',
      description:
        'A robust, production-grade enterprise inventory management and resource planning platform engineered with Angular and Spring Boot. Designed to solve stock desynchronization and audit compliance in multi-warehouse environments, the platform implements granular role-based access control, automated low-stock reorder triggers, real-time stock transfer journals, and high-performance transactional persistence with MySQL and Hibernate/JPA.',
      metrics: [
        { value: '100%', label: 'Transactional ACID Integrity' },
        { value: '< 120ms', label: 'Average REST API Response' },
        { value: 'Multi-Tier', label: 'Role-Based Access (RBAC)' },
        { value: 'Real-Time', label: 'Stock Threshold Reorder Triggers' }
      ],
      techStack: [
        'Angular',
        'TypeScript',
        'Spring Boot',
        'Java',
        'MySQL',
        'Hibernate / JPA',
        'Spring Security',
        'JWT Tokens',
        'Postman',
        'Maven',
        'RESTful APIs'
      ],
      highlights: [
        {
          icon: 'fa-solid fa-shield-halved',
          title: 'Stateless JWT Security & RBAC',
          description:
            'Robust Spring Security filter chain enforcing stateless JWT token validation, refresh token rotation, and method-level access authorization for admins, warehouse staff, and managers.'
        },
        {
          icon: 'fa-solid fa-database',
          title: 'Optimized Relational Schema & Indexing',
          description:
            'Constructed a normalized MySQL schema with Hibernate/JPA transactional boundaries, foreign key integrity, pessimistic locking for concurrent stock decrements, and automated audit logging.'
        },
        {
          icon: 'fa-solid fa-chart-line',
          title: 'Stock Movement Tracking & Automated Alerts',
          description:
            'Automated threshold trigger monitors calculating dynamic safety stock levels, dispatching replenishment alerts, and maintaining immutable audit journals for inter-warehouse transfers.'
        },
        {
          icon: 'fa-solid fa-network-wired',
          title: 'RESTful API Suite & OpenAPI Documentation',
          description:
            'High-throughput REST endpoints featuring standardized error responses, query pagination, filtering specifications, and regression test suites with Postman.'
        }
      ],
      capabilities: [
        'Stateless JWT authentication with granular role-based permission scoping',
        'Multi-warehouse inventory location mapping and bin-level tracking',
        'Automated low-stock notifications and supplier purchase order generation',
        'Batch product catalog import/export with CSV validation and error handling',
        'Real-time valuation reporting, stock turnover analytics, and movement audits',
        'Responsive UI engineered with Angular standalone components and reactive forms'
      ],
      link: 'https://github.com/sivabalakeerthick/InventoryManagementSystem',
      githubUrl: 'https://github.com/sivabalakeerthick/InventoryManagementSystem',
      category: 'fullstack',
      categoryLabel: 'Full Stack Architecture',
      featured: true
    },
    {
      id: 'portfolio',
      title: 'Personal Portfolio Website',
      subtitle: 'Developer Portfolio & Technical Presentation Platform',
      shortDescription:
        'High-performance portfolio built with Angular 22, TypeScript, SCSS, and automated CI/CD deployment via GitHub Actions.',
      description:
        'A modern, high-performance developer portfolio built from scratch with Angular 22, TypeScript, and modern SCSS architecture without external heavy component libraries. Designed with a cyber-glass visual language, Signal-based reactive state management, and progressive disclosure UI patterns. Features seamless real-time dark/light dual theme switching, WCAG AA accessibility compliance, automated GitHub Actions CI/CD workflows, and sub-second asset delivery hosted on Firebase cloud infrastructure.',
      metrics: [
        { value: '99+', label: 'Google Lighthouse Performance' },
        { value: '< 0.8s', label: 'First Contentful Paint (FCP)' },
        { value: '100%', label: 'Automated CI/CD Pipeline' },
        { value: '0', label: 'Build Warnings & Strict TS Typing' }
      ],
      techStack: [
        'Angular 22',
        'TypeScript',
        'SCSS Architecture',
        'Firebase Hosting',
        'GitHub Actions',
        'AOS Animations',
        'Font Awesome',
        'Karma / Jasmine'
      ],
      highlights: [
        {
          icon: 'fa-solid fa-bolt',
          title: 'Angular 22 Standalone Architecture',
          description:
            'Constructed using modern standalone components, Signal-based state reactivity, strict TypeScript typing, and modular configuration services for clean separation of concerns.'
        },
        {
          icon: 'fa-solid fa-palette',
          title: 'Adaptive Dual-Theme Cyber-Glass Engine',
          description:
            'Engineered instant, zero-flicker theme switching between dark cyber-neon and high-contrast light modes utilizing CSS custom variables and persistent user storage.'
        },
        {
          icon: 'fa-solid fa-cloud-arrow-up',
          title: 'Continuous Integration & Deployment',
          description:
            'Implemented GitHub Actions workflows running automated unit test suites (Karma/ChromeHeadless), type checks, and production bundle builds before Firebase Hosting deployment.'
        },
        {
          icon: 'fa-solid fa-universal-access',
          title: 'Accessible Dialog & Component System',
          description:
            'Built fully accessible modals and interactive controls with focus management, Escape key dismissals, backdrop traps, and comprehensive ARIA specifications.'
        }
      ],
      capabilities: [
        'Signal-based reactive state management with zero external UI libraries',
        'Dual-theme switching engine with persistent client-side preference sync',
        'Interactive responsive project showcase with modal case-study deep dives',
        'Interactive skill categorization and proficiency filter badges',
        'Client-side contact form with validation and animated feedback toasts',
        'Automated CI/CD deployment pipeline with GitHub Actions & Firebase'
      ],
      link: 'https://github.com/sivabalakeerthick/My-Portfolio',
      githubUrl: 'https://github.com/sivabalakeerthick/My-Portfolio',
      category: 'fullstack',
      categoryLabel: 'Modern Web Engineering',
      featured: true
    }
  ];

  get visibleProjects(): Project[] {
    const visibility = this.configService.currentConfig.projectVisibility || {};
    const featuredMap = this.configService.currentConfig.projectFeatured || {};

    return this.projects
      .filter(p => visibility[p.id] !== false)
      .map(p => ({
        ...p,
        featured: featuredMap[p.id] !== undefined ? featuredMap[p.id] : p.featured
      }));
  }

  get filteredProjects(): Project[] {
    if (this.selectedFilter === 'all') {
      return this.visibleProjects;
    }
    return this.visibleProjects.filter(p => p.category === this.selectedFilter);
  }

  setFilter(filter: 'all' | 'fullstack' | 'ai'): void {
    this.selectedFilter = filter;
    this.isProjectsExpanded = false;
  }

  toggleProjectsExpand(): void {
    this.isProjectsExpanded = !this.isProjectsExpanded;
  }

  trackProjectClick(projectId: string): void {
    this.configService.trackProjectClick(projectId);
  }

  // Case Study & Architecture Modal Handlers
  openModal(project: Project): void {
    this.activeModalProject = project;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.activeModalProject = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onFilterKeydown(event: KeyboardEvent, currentFilter: 'all' | 'fullstack' | 'ai'): void {
    const filters: Array<'all' | 'fullstack' | 'ai'> = ['all', 'fullstack', 'ai'];
    const currentIndex = filters.indexOf(currentFilter);
    const direction =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;

    if (!direction) return;
    event.preventDefault();
    const nextFilter = filters[(currentIndex + direction + filters.length) % filters.length];
    this.setFilter(nextFilter);
    document.getElementById(`project-filter-${nextFilter}`)?.focus();
  }
}

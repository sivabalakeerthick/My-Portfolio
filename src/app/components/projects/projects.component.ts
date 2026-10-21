import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioConfigService } from '../../services/portfolio-config.service';

export interface Project {
  id: string;
  title: string;
  link: string;
  description: string;
  techStack: string[];
  category: 'fullstack' | 'ai';
  categoryLabel: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  selectedFilter: 'all' | 'fullstack' | 'ai' = 'all';

  constructor(public configService: PortfolioConfigService) {}

  projects: Project[] = [
    {
      id: 'cognidoc',
      title: 'CogniDoc — Enterprise Agentic RAG Platform',
      description:
        'A production-grade, budget-aware multi-microservice Agentic RAG platform engineered with LangGraph, FastAPI, ChromaDB, and Angular 22. Integrates Google Gemini, Groq, and Claude APIs with hybrid dense vector + BM25 sparse retrieval, Auth0 authentication, self-correcting reflection loops, local document grading, citation verification, and comprehensive evaluation metrics (F1 score, Precision, Recall, LLM-as-a-judge).',
      techStack: [
        'FastAPI Microservices',
        'LangGraph',
        'Gemini / Groq / Claude APIs',
        'ChromaDB & BM25',
        'Auth0 Security',
        'PostgreSQL',
        'Angular 22',
        'GitHub Actions',
        'Docker'
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
      description:
        'A secure, production-grade inventory management platform engineered with Angular and Spring Boot. Implemented JWT authentication, role-based access control, MySQL data persistence, and comprehensive RESTful API integrations.',
      techStack: [
        'Angular',
        'TypeScript',
        'Spring Boot',
        'Java',
        'MySQL',
        'JWT Security',
        'Postman'
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
      description:
        'High-performance developer portfolio built with Angular 22, TypeScript, and modern SCSS architecture. Integrated automated CI/CD deployment pipelines via GitHub Actions and Firebase cloud hosting.',
      techStack: ['Angular 22', 'TypeScript', 'SCSS', 'Firebase', 'GitHub Actions'],
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
  }

  trackProjectClick(projectId: string): void {
    this.configService.trackProjectClick(projectId);
  }

  onFilterKeydown(event: KeyboardEvent, currentFilter: 'all' | 'fullstack' | 'ai'): void {
    const filters: Array<'all' | 'fullstack' | 'ai'> = ['all', 'fullstack', 'ai'];
    const currentIndex = filters.indexOf(currentFilter);
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;

    if (!direction) return;
    event.preventDefault();
    const nextFilter = filters[(currentIndex + direction + filters.length) % filters.length];
    this.setFilter(nextFilter);
    document.getElementById(`project-filter-${nextFilter}`)?.focus();
  }

  currentIndex = 0;

  get currentProject(): Project {
    return this.filteredProjects[this.currentIndex] || this.filteredProjects[0];
  }

  nextProject(): void {
    if (this.filteredProjects.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.filteredProjects.length;
  }

  prevProject(): void {
    if (this.filteredProjects.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.filteredProjects.length) % this.filteredProjects.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}

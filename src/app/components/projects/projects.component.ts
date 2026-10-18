import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  title: string;
  link: string;
  description: string;
  techStack: string[];
  category: 'fullstack' | 'ai' | 'bi';
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
  selectedFilter: 'all' | 'fullstack' | 'ai' | 'bi' = 'all';

  projects: Project[] = [
    {
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
      title: 'Personal Portfolio Website',
      description:
        'High-performance developer portfolio built with Angular 22, TypeScript, and modern SCSS architecture. Integrated automated CI/CD deployment pipelines via GitHub Actions and Firebase cloud hosting.',
      techStack: ['Angular 22', 'TypeScript', 'SCSS', 'Firebase', 'GitHub Actions'],
      link: 'https://github.com/sivabalakeerthick/My-Portfolio',
      githubUrl: 'https://github.com/sivabalakeerthick/My-Portfolio',
      category: 'fullstack',
      categoryLabel: 'Modern Web Engineering',
      featured: true
    },
    {
      title: 'Brain Tumour Prediction CNN',
      description:
        'A deep Convolutional Neural Network (CNN) built with Python and data science frameworks to detect brain tumours from MRI scans. Features high classification accuracy for automated early clinical diagnostics assistance.',
      techStack: ['Python', 'CNN Deep Learning', 'Pandas', 'NumPy', 'Matplotlib'],
      link: 'https://www.kaggle.com/code/sivabalakeerthickg/cnn-brain/notebook',
      demoUrl: 'https://www.kaggle.com/code/sivabalakeerthickg/cnn-brain/notebook',
      category: 'ai',
      categoryLabel: 'AI & Deep Learning',
      featured: false
    },
    {
      title: 'Bank Customer Insights Dashboard',
      description:
        'Interactive business intelligence dashboard built in Power BI to analyze bank customer demographics, transaction patterns, and churn risk. Delivers automated visual analytics for executive decision-making.',
      techStack: ['Power BI Desktop', 'Data Analytics', 'Interactive DAX', 'Visualization'],
      link: 'https://github.com/sivabalakeerthick/Bank-Customer-Insights-Dashboard',
      githubUrl: 'https://github.com/sivabalakeerthick/Bank-Customer-Insights-Dashboard',
      category: 'bi',
      categoryLabel: 'Business Intelligence',
      featured: false
    }
  ];

  get filteredProjects(): Project[] {
    if (this.selectedFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.selectedFilter);
  }

  setFilter(filter: 'all' | 'fullstack' | 'ai' | 'bi'): void {
    this.selectedFilter = filter;
  }

  onFilterKeydown(event: KeyboardEvent, currentFilter: 'all' | 'fullstack' | 'ai' | 'bi'): void {
    const filters: Array<'all' | 'fullstack' | 'ai' | 'bi'> = ['all', 'fullstack', 'ai', 'bi'];
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
    return this.projects[this.currentIndex];
  }

  nextProject(): void {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prevProject(): void {
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}

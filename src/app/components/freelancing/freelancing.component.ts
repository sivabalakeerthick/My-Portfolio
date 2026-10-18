import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class FreelancingComponent {
  freelanceProjects: FreelanceProject[] = [
    {
      id: 'sm-portfolio',
      title: 'Architectural Portfolio & Client Presentation Platform',
      subtitle: 'Custom Web Platform with Digital Book Viewer, Drawing Filters & Self-Service Admin Panel',
      clientType: 'Private Architectural Client',
      engagement: 'Freelance Client Project',
      myRole: 'Lead Full Stack Developer & Project Owner',
      timeline: '2026',
      status: 'Completed',
      category: 'Custom Web Application & CMS',
      link: 'https://github.com/sivabalakeerthick/website',
      githubUrl: 'https://github.com/sivabalakeerthick/website',
      overview:
        'Designed and developed a custom website for an architect to showcase design portfolios, project drawings, and 3D renderings to prospective clients. Handled the entire project end-to-end — from understanding the client’s vision to designing the user interface, building an interactive presentation reader, and creating an easy-to-use admin dashboard so the client can update their portfolio without writing code.',
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
          badge: 'Client & User Experience',
          title: 'Interactive Presentation & Viewing Tools',
          points: [
            'Built an interactive reader so potential clients can browse architectural sheets like turning pages in a book',
            'Added high-definition zoom and pan controls so visitors can closely inspect fine blueprint details and measurements',
            'Organized drawings by clear categories so clients can easily find floor plans, 3D views, and photo galleries'
          ]
        },
        {
          icon: 'fa-solid fa-sliders',
          badge: 'Client Empowerment',
          title: 'Easy Self-Service Admin Dashboard',
          points: [
            'Created a simple private management screen so the client can upload new drawings and edit project details without touching code',
            'Implemented instant one-click data backup and restore so all portfolio information stays safe',
            'Delivered the completed platform on schedule with a clear walkthrough and user guide'
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
        },
        {
          icon: 'fa-solid fa-sliders',
          title: 'Self-Serve Client Admin Panel',
          description:
            'A private, easy-to-use admin dashboard where the studio owner can add new projects, update images, and manage their portfolio independently.'
        }
      ],
      techStack: [
        'Angular',
        'TypeScript',
        'SCSS',
        'Responsive Design',
        'Interactive Viewer',
        'Custom Admin CMS',
        'GitHub Pages'
      ],
      featured: true
    }
  ];
}

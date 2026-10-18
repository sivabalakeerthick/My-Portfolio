import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Experience {
  position: string;
  role: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  responsibilities: string[];
  techStack?: string[];
  isCurrent?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  currentIndex = 0;
  totalExperienceMonths = 0;

  experiences: Experience[] = [
    {
      position: 'Programmer Analyst',
      role: 'Frontend Developer',
      company: 'Cognizant',
      startDate: new Date(2026, 6, 27),
      endDate: null,
      location: 'Bengaluru, India',
      isCurrent: true,
      techStack: ['Angular 22', 'TypeScript', 'Axis Framework (Client)', 'SCSS', 'REST APIs', 'Enterprise UI', 'Agile'],
      responsibilities: [
        'Working as a Frontend Developer on enterprise client projects using Angular and Axis framework',
        'Developed and maintained modular enterprise UI components using Angular and the Axis framework (proprietary client framework) for an enterprise insurance application',
        'Engineered responsive, highly accessible user workflows conforming strictly to client Axis framework standards and design guidelines',
        'Analyzed and resolved complex UI, state management, and performance defects, ensuring enterprise application stability',
        'Collaborated with cross-functional agile teams and client stakeholders across active sprint cycles to deliver business-aligned solutions'
      ]
    },
    {
      position: 'Programmer Analyst Trainee',
      role: 'Frontend Developer',
      company: 'Cognizant',
      startDate: new Date(2025, 6, 1),
      endDate: new Date(2026, 6, 27),
      location: 'Chennai, India',
      isCurrent: false,
      techStack: ['Angular', 'TypeScript', 'Axis Framework', 'SCSS', 'REST APIs', 'Agile', 'Enterprise UI'],
      responsibilities: [
        'Developed and maintained Angular-based UI components for an enterprise insurance application with high accessibility standards',
        'Built client-centric frontend modules integrated with the Axis client framework and backend RESTful APIs',
        'Debugged and resolved UI and logical defects, improving application stability and overall user experience',
        'Contributed to Angular version migration, addressing compatibility issues and reducing technical debt',
        'Collaborated with cross-functional teams in an Agile environment to deliver sprint deliverables'
      ]
    },
    {
      position: 'Intern',
      role: 'Full Stack Developer',
      company: 'Cognizant',
      startDate: new Date(2025, 3, 1),
      endDate: new Date(2025, 6, 1),
      location: 'Hyderabad, India',
      isCurrent: false,
      techStack: ['Angular', 'Spring Boot', 'Java', 'REST APIs', 'Git', 'Agile'],
      responsibilities: [
        'Worked as part of a development team to build and enhance full-stack features using Angular and Spring Boot',
        'Developed responsive frontend components using Angular and TypeScript, ensuring consistency across different screen sizes',
        'Implemented and integrated RESTful APIs using Spring Boot to support frontend functionality',
        'Used Git for version control and collaborated in an Agile development environment with regular sprint activities'
      ]
    }
  ];

  ngOnInit(): void {
    this.totalExperienceMonths = this.calculateTotalExperience();
  }

  get currentExperience(): Experience {
    return this.experiences[this.currentIndex];
  }

  getMonths(exp: Experience): number {
    const end = exp.endDate ?? new Date();
    const months = (end.getFullYear() - exp.startDate.getFullYear()) * 12 +
      (end.getMonth() - exp.startDate.getMonth());
    return Math.max(1, months);
  }

  getDuration(exp: Experience): string {
    const start = exp.startDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
    const end = exp.endDate
      ? exp.endDate.toLocaleString('default', { month: 'short', year: 'numeric' })
      : 'Present';
    return `${start} – ${end} (${this.getMonths(exp)} mos)`;
  }

  calculateTotalExperience(): number {
    return this.experiences.reduce((sum, exp) => sum + this.getMonths(exp), 0);
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.experiences.length) % this.experiences.length;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.experiences.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}

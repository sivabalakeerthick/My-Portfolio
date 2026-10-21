import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Role {
  position: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  responsibilities: string[];
  techStack?: string[];
  isCurrent?: boolean;
}

export interface CompanyExperience {
  company: string;
  companyIcon?: string;
  industry?: string;
  location?: string;
  isCurrent?: boolean;
  roles: Role[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  selectedCompanyIndex = 0;
  currentIndex = 0;
  totalExperienceMonths = 0;

  // Touch swipe support coordinates
  private touchStartX = 0;
  private touchStartY = 0;

  companyExperiences: CompanyExperience[] = [
    {
      company: 'Cognizant',
      companyIcon: 'fa-solid fa-building',
      industry: 'Enterprise Technology Services',
      location: 'Bengaluru, Chennai & Hyderabad, India',
      isCurrent: true,
      roles: [
        {
          position: 'Programmer Analyst',
          role: 'Software Developer',
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
          role: 'Software Developer',
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
      ]
    }
  ];

  ngOnInit(): void {
    this.totalExperienceMonths = this.calculateTotalExperience();
  }

  get currentCompany(): CompanyExperience {
    return this.companyExperiences[this.selectedCompanyIndex];
  }

  get experiences(): Role[] {
    return this.currentCompany?.roles ?? [];
  }

  get currentExperience(): Role {
    return this.experiences[this.currentIndex] ?? this.experiences[0];
  }

  selectCompany(index: number): void {
    this.selectedCompanyIndex = index;
    this.currentIndex = 0;
  }

  getRoleMonths(role: Role): number {
    const end = role.endDate ?? new Date();
    const months = (end.getFullYear() - role.startDate.getFullYear()) * 12 +
      (end.getMonth() - role.startDate.getMonth());
    return Math.max(1, months);
  }

  getRoleDuration(role: Role): string {
    const start = role.startDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
    const end = role.endDate
      ? role.endDate.toLocaleString('default', { month: 'short', year: 'numeric' })
      : 'Present';
    const months = this.getRoleMonths(role);
    return `${start} – ${end} (${months} ${months === 1 ? 'mo' : 'mos'})`;
  }

  getCompanyTotalDuration(company: CompanyExperience): string {
    if (!company.roles || company.roles.length === 0) return '';

    const startDates = company.roles.map(r => r.startDate.getTime());
    const earliestStart = new Date(Math.min(...startDates));

    const isCurrent = company.roles.some(r => r.endDate === null || r.isCurrent);
    let latestEnd: Date;
    let endStr: string;

    if (isCurrent) {
      latestEnd = new Date();
      endStr = 'Present';
    } else {
      const endDates = company.roles.map(r => (r.endDate ? r.endDate.getTime() : new Date().getTime()));
      latestEnd = new Date(Math.max(...endDates));
      endStr = latestEnd.toLocaleString('default', { month: 'short', year: 'numeric' });
    }

    const startStr = earliestStart.toLocaleString('default', { month: 'short', year: 'numeric' });
    const totalMonths = (latestEnd.getFullYear() - earliestStart.getFullYear()) * 12 +
      (latestEnd.getMonth() - earliestStart.getMonth());
    const months = Math.max(1, totalMonths);

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    let durationText = '';
    if (years > 0) {
      durationText += `${years} ${years === 1 ? 'yr' : 'yrs'}`;
      if (remMonths > 0) {
        durationText += ` ${remMonths} ${remMonths === 1 ? 'mo' : 'mos'}`;
      }
    } else {
      durationText = `${months} ${months === 1 ? 'mo' : 'mos'}`;
    }

    return `${startStr} – ${endStr} (${durationText})`;
  }

  calculateTotalExperience(): number {
    return this.companyExperiences.reduce((sum, company) => {
      return sum + company.roles.reduce((rSum, role) => rSum + this.getRoleMonths(role), 0);
    }, 0);
  }

  prev(): void {
    if (this.experiences.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.experiences.length) % this.experiences.length;
  }

  next(): void {
    if (this.experiences.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.experiences.length;
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.experiences.length) {
      this.currentIndex = index;
    }
  }

  // Mobile Touch Swipe Handlers
  onTouchStart(event: TouchEvent): void {
    if (event.touches && event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches && event.changedTouches.length > 0) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      // Ensure predominant horizontal movement and minimum 40px gesture distance
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          // Swiped Left -> advance to next slide
          this.next();
        } else {
          // Swiped Right -> go back to previous slide
          this.prev();
        }
      }
    }
  }
}

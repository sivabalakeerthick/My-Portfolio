import { Component } from '@angular/core';

interface Experience {
  position: string;
  role: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  responsibilities: string[];
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {

  currentIndex = 0;

  experiences: Experience[] = [
    {
      position: 'Programmer Analyst Trainee',
      role: 'Frontend Developer',
      company: 'Cognizant',
      startDate: new Date(2025, 6),
      endDate: null,
      location: 'Bengaluru, India',
      responsibilities: [
        'Worked on a project as a team',
        'Worked on Spring Boot & REST API integrations',
        'Built responsive UI with Angular',
        'Collaborated in Agile environment and Git'
      ]
    },
    {
      position: 'Intern',
      role: 'Full Stack Developer', 
      company: 'Cognizant',
      startDate: new Date(2025, 3),
      endDate: new Date(2025, 6),
      location: 'Hyderabad, India',
      responsibilities: [
        'Worked on a project as a team',
        'Worked on Spring Boot & REST API integrations',
        'Built responsive UI with Angular',
        'Collaborated in Agile environment and Git'
      ]
    }
  ];

  getMonths(exp: Experience): number {
    const end = exp.endDate ?? new Date();
    return (
      (end.getFullYear() - exp.startDate.getFullYear()) * 12 +
      (end.getMonth() - exp.startDate.getMonth())
    );
  }

  getDuration(exp: Experience): string {
    const start = exp.startDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });

    const end = exp.endDate
      ? exp.endDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })
      : 'Present';

    return `${start} – ${end} (${this.getMonths(exp)} months)`;
  }

  getTotalExperience(): number {
    return this.experiences.reduce(
      (sum, exp) => sum + this.getMonths(exp),
      0
    );
  }

  prev(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.experiences.length) %
      this.experiences.length;
  }

  next(): void {
    this.currentIndex =
      (this.currentIndex + 1) % this.experiences.length;
  }
}

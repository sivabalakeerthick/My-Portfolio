import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  experiences = [
    {
      role: 'Java Full Stack Developer Intern',
      company: 'Cognizant',
      duration: 'April 2025 – July 2025(3 months)',
      location: 'Hyderabad, India',
      responsibilities: [
        'Worked on a project as a team',
        'Worked on Spring Boot & REST API integrations',
        'Built responsive UI with Angular',
        'Collaborated in Agile environment and Git'
      ]
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}

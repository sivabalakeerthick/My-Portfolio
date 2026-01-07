import { Component, OnInit, OnDestroy } from '@angular/core';

interface Project {
  title: string;
  link: string;
  description: string;
  techStack: string[];
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [
    {
      title: 'Inventory Management System',
      description:
        'A secure full-stack inventory management application built using Angular and Spring Boot in a monolithic architecture. Implemented JWT-based authentication with Spring Security RESTful APIs tested via Postman and MySQL for reliable data persistence.',
      techStack: [
        'Angular',
        'TypeScript',
        'Spring Boot',
        'Java',
        'MySQL',
        'Postman',
        'Git',
        'JWT',
      ],
      link: 'https://github.com/sivabalakeerthick/InventoryManagementSystem',
    },
    {
      title: 'Personal Portfolio Website',
      description:
        'A modern, responsive personal portfolio built using Angular, TypeScript, and CSS. Automated deployment using a CI/CD pipeline with GitHub Actions and hosted on Firebase, ensuring fast, reliable, and scalable delivery.',
      techStack: ['Angular', 'TypeScript', 'CSS', 'Firebase', 'GitHub Actions'],
      link: 'https://github.com/sivabalakeerthick/My-Portfolio',
    },
    {
      title: 'Brain Tumour Prediction',
      description:
        'Implemented a Convolutional Neural Network (CNN) using Python and libraries to analyze MRI images for brain tumour detection. Achieved high accuracy in classifying tumour types, contributing to advancements in medical imaging analysis.',
      techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
      link: 'https://www.kaggle.com/code/sivabalakeerthickg/cnn-brain/notebook',
    },
    {
      title: 'Bank Insights Dashboard',
      description:
        'Developed an interactive Bank Customer Insights Dashboard using Power BI to visualize and analyze customer data. Implemented various charts and graphs to provide insights into customer demographics, account types, and transaction patterns, aiding in strategic decision-making.',
      techStack: ['Power BI Desktop'],
      link: 'https://github.com/sivabalakeerthick/Bank-Customer-Insights-Dashboard',
    }
  ];

  currentIndex = 0;
  private slideInterval: any;

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextProject();
    }, 7000);
  }
  nextProject() {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
  }

  prevProject() {
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }
}

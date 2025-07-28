import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects = [
    {
      title: 'Inventory Management System (Full Stack)',
      techStack: 'Angular, TypeScript, Spring Boot, Java, JavaScript, MySQL, GitHub, Git',
      link: 'https://github.com/sivabalakeerthick/InventoryManagementSystem'
    },
    {
      title: 'Chrome Homepage Clone (Front End)',
      techStack: 'HTML, CSS, JavaScript, OpenWeatherMap API',
      link: 'https://github.com/sivabalakeerthick/custom-chrome-startup-page'
    },
    {
      title: 'Bank Insights Dashboard (Analytics)',
      techStack: 'Power BI',
      link: 'https://github.com/sivabalakeerthick/Bank-Customer-Insights-Dashboard'
    },
    {
      title: 'Brain Tumour Prediction (Data Analysis)',
      techStack: 'Python, Pandas, NumPy, Matplotlib',
      link: 'https://github.com/sivabalakeerthick/Brain-tumour-Prediction'
    }
  ];

  currentIndex = 0;
  private slideInterval: any;

  ngOnInit() {

  }

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
    this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
  }
}

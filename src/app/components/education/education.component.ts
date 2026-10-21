import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  location?: string;
  details?: string;
  icon?: string;
  score?: string;
  url?: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  educationList: EducationItem[] = [
    {
      degree: 'B.E. – Computer Science and Engineering',
      institution: 'R.M.K. Engineering College',
      url: 'https://www.rmkec.ac.in/2023/',
      year: '2021 – 2025',
      location: 'Chennai, Tamil Nadu',
      details: 'Comprehensive study of Data Structures, Algorithms, Full Stack Architecture, DBMS & Operating Systems.',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      degree: 'Higher Secondary Certificate (HSC – 12th)',
      institution: 'Cambridge Matriculation Higher Secondary School',
      url: 'https://cambridgematricschool.in/index.php',
      year: '2021',
      location: 'Tamil Nadu, India',
      details: 'Computer Science, Mathematics, Physics and Chemistry foundation.',
      icon: 'fa-solid fa-school'
    },
    {
      degree: 'Secondary School Leaving Certificate (SSLC – 10th)',
      institution: 'Cambridge Matriculation Higher Secondary School',
      url: 'https://cambridgematricschool.in/index.php',
      year: '2019',
      location: 'Tamil Nadu, India',
      details: 'Secondary school education with high academic achievement.',
      icon: 'fa-solid fa-book-open'
    }
  ];
}

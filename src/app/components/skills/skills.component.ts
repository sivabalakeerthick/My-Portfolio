import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  name: string;
  icon: string;
  invertInDarkMode?: boolean;
}

export interface SkillCategory {
  title: string;
  icon: string;
  featured?: boolean;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  categories: SkillCategory[] = [
    {
      title: 'Generative AI & Agentic RAG',
      icon: 'fa-solid fa-brain',
      featured: true,
      skills: [
        { name: 'LangGraph', icon: 'assets/icons/langgraph.svg' },
        { name: 'LangChain', icon: 'https://cdn.simpleicons.org/langchain/1C3C3C' },
        { name: 'RAG Architecture', icon: 'assets/icons/rag.svg' },
        { name: 'ChromaDB', icon: 'assets/icons/chromadb.svg' },
        { name: 'Gemini, Groq & Claude APIs', icon: 'assets/icons/ai-models.svg' },
        { name: 'Hybrid Search (BM25)', icon: 'assets/icons/rag.svg' }
      ]
    },
    {
      title: 'Frontend & UI Architecture',
      icon: 'fa-solid fa-laptop-code',
      skills: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg' },
        { name: 'Axis Framework (Client)', icon: 'assets/icons/axis-framework.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3 / SCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' }
      ]
    },
    {
      title: 'Backend & Systems Architecture',
      icon: 'fa-solid fa-server',
      skills: [
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'REST APIs', icon: 'assets/icons/rest-api.svg' },
        { name: 'Microservices', icon: 'assets/icons/microservices.svg' },
        { name: 'Monolithic Architecture', icon: 'assets/icons/monolith.svg' }
      ]
    },
    {
      title: 'Security, Identity & Databases',
      icon: 'fa-solid fa-shield-halved',
      skills: [
        { name: 'Auth0', icon: 'https://cdn.simpleicons.org/auth0/EB5424' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' }
      ]
    },
    {
      title: 'Cloud, Hosting & CI/CD',
      icon: 'fa-solid fa-cloud-arrow-up',
      skills: [
        { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF' },
        { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/000000', invertInDarkMode: true },
        { name: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify/00C7B7' },
        { name: 'GitHub Pages', icon: 'assets/icons/github-pages.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' }
      ]
    },
    {
      title: 'DevOps & Development Tooling',
      icon: 'fa-solid fa-screwdriver-wrench',
      skills: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', invertInDarkMode: true },
        { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
        { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' }
      ]
    }
  ];
}

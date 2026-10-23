import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  name: string;
  icon: string;
  invertInDarkMode?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  shortTitle?: string;
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
  selectedCategory: string = 'all';

  get totalSkillCount(): number {
    return this.categories.reduce((acc, cat) => acc + cat.skills.length, 0);
  }

  get filteredCategories(): SkillCategory[] {
    if (this.selectedCategory === 'all') {
      return this.categories;
    }
    return this.categories.filter(cat => cat.id === this.selectedCategory);
  }

  selectCategory(id: string): void {
    this.selectedCategory = id;
  }

  categories: SkillCategory[] = [
    {
      id: 'genai',
      title: 'Generative AI & Agentic RAG',
      shortTitle: 'GenAI & RAG',
      icon: 'fa-solid fa-brain',
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
      id: 'frontend',
      title: 'Frontend & UI Architecture',
      shortTitle: 'Frontend',
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
      id: 'backend',
      title: 'Backend & Systems Architecture',
      shortTitle: 'Backend',
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
      id: 'databases',
      title: 'Security, Identity & Databases',
      shortTitle: 'Security & DB',
      icon: 'fa-solid fa-shield-halved',
      skills: [
        { name: 'Auth0', icon: 'https://cdn.simpleicons.org/auth0/EB5424' },
        { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' }
      ]
    },
    {
      id: 'cloud',
      title: 'Cloud, Hosting & CI/CD',
      shortTitle: 'Cloud & CI/CD',
      icon: 'fa-solid fa-cloud-arrow-up',
      skills: [
        { name: 'Render', icon: 'https://cdn.simpleicons.org/render/46E3B7' },
        { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/2088FF' },
        { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/000000', invertInDarkMode: true },
        { name: 'Netlify', icon: 'https://cdn.simpleicons.org/netlify/00C7B7' },
        { name: 'GitHub Pages', icon: 'assets/icons/github-pages.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' }
      ]
    },
    {
      id: 'tools',
      title: 'DevOps & Development Tooling',
      shortTitle: 'DevOps & Tools',
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

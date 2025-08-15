export interface Project {
  id: number;
  title: string;
  text: string;
  author: string;
  createdAt: string; // ISO date string, formatted as 'YYYY-MM-DD'
  image?: string; // Optional property, as it may be null
  tabs?: string[];
}

export interface CreateProject {
  title: string;
  text: string;
  author: string;
  image?: string; // Optional property, as it may be null
} 
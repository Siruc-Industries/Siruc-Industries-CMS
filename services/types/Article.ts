export interface Article {
  id: number;
  title: string;
  text: string;
  author: string;
  createdAt: string; // ISO date string, formatted as 'YYYY-MM-DD'
  image?: string; // Optional property, as it may be null
}



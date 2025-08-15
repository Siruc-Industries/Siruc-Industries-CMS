import type { Article, CreateArticle } from "../types/Article";

const API_BASE_URL = 'http://localhost:5000/api';


// GET list of articles
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    let data: Article[] = await response.json();
    data = data.map((article: any) => {
      return {
        ...article,
        createdAt: article.createdAt.split('T')[0]
      }
    })
    return data;
  } catch (error: any) {
    console.error('Fetch articles error:', error.message);
    // Allow the frontend to proceed even if the API call fails
    return [];
  }
};

// DELETE an article 
export const deleteArticle = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete article');
    }
  
    console.log('Article deleted successfully');
    
    return;
  } catch (error) {
    console.error('Error deleting article:', error);
  }
}

// POST new article
export const createArticle = async (formData: FormData) => {
  try {
    console.log('Attempting to create article...');
    console.log('API URL:', `${API_BASE_URL}/articles`);
    
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      throw new Error(`Failed to create article: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Article created successfully:', result);
    alert('Article created successfully.');
    return result;
  } catch (error: any) {
    console.error('Error creating article:', error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      alert('Network error: Cannot connect to backend server. Please check if the server is running on port 5000.');
    } else {
      alert(`Error creating article: ${error.message}`);
    }
    throw error;
  }
}
import type { Project, CreateProject } from "../types/Project";

const API_BASE_URL = 'http://localhost:5000/api';

// GET list of projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    let data: Project[] = await response.json();
    data = data.map((project: any) => {
      return {
        ...project,
        createdAt: project.createdAt.split('T')[0]
      }
    })
    return data;
  } catch (error: any) {
    console.error('Fetch projects error:', error.message);
    // Allow the frontend to proceed even if the API call fails
    return [];
  }
};

// DELETE a project 
export const deleteProject = async (id: number) => {
  // Implementation for delete project
}

// POST new project
export const createProject = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    const result = await response.json();
    alert('Project created successfully.');
    return result;
  } catch (error: any) {
    alert('Error!');
    console.error('Error creating project:', error);
  }
} 
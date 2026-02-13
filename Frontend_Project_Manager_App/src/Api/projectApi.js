import { api } from "./api"; 


export const allProjects = () => api.get("/project/all");

export const getProjectById = (id) => api.get(`/project/${id}`);

export const createProject = (projectData) => 
  api.post("/project/create", projectData);

export const deleteProject = (id) => api.delete(`/project/delete/${id}`);

export const voteProject = (id) => api.post(`/project/vote/${id}`);

export const commentProject = (id, commentData) => 
  api.post(`/project/comment/${id}`, commentData);


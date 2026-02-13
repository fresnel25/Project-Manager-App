import { api } from "./api"; 

export const loginUser = (credentials) => 
  api.post("/user/login", credentials);

export const createUser = (userData) => 
  api.post("/user/create", userData);

export const allUsers = () => api.get("/user/all");

export const getUserById = (id) => api.get(`/user/${id}`);

export const deleteUser = (id) => api.delete(`/user/delete/${id}`);

import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Types
export type Paste = {
  id: number;
  user_id: number;
  user: User;
  title: string;
  content: string;
  created_at: string;
  edited_at: string;
};

export type PastesResponse = {
  data: Paste[];
  page: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  hasNextPage: boolean;
};

export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type authUser = {
  username: string;
  password: string;
};

// Helper function to get auth token
function getAuthToken(): string {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Authentication token not found");
  return token;
}

// Helper function to handle API requests
async function apiRequest<T>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data?: unknown,
  requiresAuth: boolean = false
): Promise<T> {
  try {
    const headers = requiresAuth ? { Authorization: getAuthToken() } : {};
    const response: AxiosResponse<T> = await apiClient({
      method,
      url: endpoint,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Axios ${method.toUpperCase()} error:`, error);
    throw error;
  }
}

// Auth functions
export const login = (loginData: authUser) =>
  apiRequest<{ token: string }>("post", "/login", loginData);

export const register = (registerData: authUser) =>
  apiRequest<{ message: string }>("post", "/register", registerData);

// Paste functions
export const getPasteByID = (PasteID: number | string) =>
  apiRequest<Paste>("get", `/paste/${PasteID}`);

export const getPastes = (page: number = 1, limit: number = 50) =>
  apiRequest<PastesResponse>("get", `/pastes?page=${page}&limit=${limit}`);

export const updatePaste = (
  PasteID: number | string,
  pasteData: Omit<Paste, "id" | "user_id" | "created_at" | "edited_at" | "user">
) =>
  apiRequest<{ message: string }>("put", `/paste/${PasteID}`, pasteData, true);

export const deletePaste = (PasteID: number | string) =>
  apiRequest<{ message: string }>("delete", `/paste/${PasteID}`, {}, true);

export const getPastesByUserID = (
  UserID: number | string,
  page: number = 1,
  limit: number = 50
) =>
  apiRequest<PastesResponse>(
    "get",
    `/user/${UserID}/pastes?page=${page}&limit=${limit}`
  );

export const createPaste = (
  pasteData: Omit<Paste, "id" | "user_id" | "created_at" | "edited_at" | "user">
) => apiRequest<Paste>("post", "/paste", pasteData, true);

// User functions
export const getUser = () => apiRequest<User>("get", `/user`, {}, true);

export const getUserByID = (UserID: number | string) =>
  apiRequest<User>("get", `/user/${UserID}`);

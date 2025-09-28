// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  provider?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginResponse {
  user: User;
  // Backend may return tokens in one of two shapes
  // 1) { tokens: { accessToken, refreshToken, expiresIn? } }
  // 2) { accessToken, refreshToken }
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different HTTP status codes with specific messages
        let errorMessage = data.message || 'An error occurred';
        
        switch (response.status) {
          case 400:
            errorMessage = data.message || 'Invalid request. Please check your input and try again.';
            break;
          case 401:
            errorMessage = data.message || 'Authentication failed. Please check your credentials.';
            break;
          case 403:
            errorMessage = data.message || 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = data.message || 'Resource not found. Please check your request.';
            break;
          case 422:
            errorMessage = data.message || 'Validation failed. Please check your input.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
            break;
          case 500:
            errorMessage = data.message || 'Server error occurred. Please try again later.';
            break;
          case 502:
            errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
            break;
          case 503:
            errorMessage = 'Service maintenance in progress. Please try again later.';
            break;
          default:
            errorMessage = data.message || `Request failed with status ${response.status}`;
        }
        
        return {
          success: false,
          message: errorMessage,
          errors: data.errors,
          status: response.status,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      
      // Handle different types of network errors
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          return {
            success: false,
            message: '🌐 Unable to connect to server. Please check if the backend is running and try again.',
            status: 0,
          };
        } else if (error.message.includes('NetworkError')) {
          return {
            success: false,
            message: '📡 Network connection failed. Please check your internet connection.',
            status: 0,
          };
        }
      }
      
      return {
        success: false,
        message: '🔧 An unexpected error occurred. Please try again or contact support.',
        status: 0,
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set boundary for FormData
        Authorization: this.getAuthToken() ? `Bearer ${this.getAuthToken()}` : '',
      },
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ApiError, VariableDetectionResponse } from './types';

// Create axios instance with default config
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor for adding auth tokens (if needed in future)
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      // const token = getAccessToken();
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        statusCode: error.response?.status,
      };

      if (error.response?.data) {
        const errorData = error.response.data as Record<string, unknown>;
        apiError.message =
          (errorData.detail as string) || (errorData.message as string) || apiError.message;
        apiError.details = errorData.details as string;
      } else if (error.request) {
        apiError.message = 'Network error - please check your connection';
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Document API functions
export const documentApi = {
  /**
   * Upload a DOCX file and detect variables
   */
  async detectVariables(file: File): Promise<VariableDetectionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<VariableDetectionResponse>(
      '/documents/detect-variables',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Format a DOCX document (optional auto-formatting)
   */
  async formatDocument(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/documents/format', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    return response.data;
  },

  /**
   * Merge variables into a template and generate document
   */
  async mergeVariables(
    file: File,
    variables: Record<string, unknown>
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('variables', JSON.stringify(variables));

    const response = await apiClient.post(
      '/documents/merge-variables',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      }
    );

    return response.data;
  },
};

// Health check
export const healthApi = {
  async check(): Promise<{
    status: string;
    app_name: string;
    version: string;
  }> {
    const response = await axios.get('/health', {
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ||
        'http://localhost:8000',
    });
    return response.data;
  },
};

// Utility functions
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

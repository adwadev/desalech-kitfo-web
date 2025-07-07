// API configuration for different environments
const getApiUrl = () => {
  // In production (Railway), use relative URLs since backend serves frontend
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use localhost with backend port
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Feedback endpoints
  submitFeedback: `${API_BASE_URL}/api/feedback`,
  publicFeedback: `${API_BASE_URL}/api/feedback/public`,
  feedbackStats: `${API_BASE_URL}/api/feedback/stats`,
  
  // Auth endpoints
  login: `${API_BASE_URL}/api/auth/login`,
  verify: `${API_BASE_URL}/api/auth/verify`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  
  // Admin endpoints
  adminFeedback: `${API_BASE_URL}/api/admin/feedback`,
  adminStats: `${API_BASE_URL}/api/admin/stats`,
  adminProfile: `${API_BASE_URL}/api/admin/profile`,
  
  // Dynamic endpoints
  updateFeedbackStatus: (id: number) => `${API_BASE_URL}/api/admin/feedback/${id}/status`,
  deleteFeedback: (id: number) => `${API_BASE_URL}/api/admin/feedback/${id}`,
} as const;

// Helper function for API requests
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};
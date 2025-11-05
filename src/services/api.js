// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL configured:', API_BASE_URL);

// Helper function for making API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('📡 API Request:', {
    method: config.method || 'GET',
    url,
    headers: config.headers,
    hasBody: !!config.body
  });

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    console.log('📥 API Response:', {
      status: response.status,
      statusText: response.statusText,
      data
    });

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API Request Error:', error);
    throw error;
  }
}

// ===== Availability API =====
export async function getAvailability(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/availability${queryString ? `?${queryString}` : ''}`;
  return apiRequest(endpoint, { method: 'GET' });
}

// ===== Meetings API =====
export async function bookMeeting(bookingData) {
  return apiRequest('/meetings/book', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

export async function cancelMeeting(token) {
  return apiRequest('/meetings/cancel', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function getMeetings() {
  // Get all meetings for the authenticated SAM
  return apiRequest('/meetings/my-meetings', { method: 'GET' });
}

export async function getMeetingByToken(token) {
  return apiRequest(`/meetings/${token}`, { method: 'GET' });
}

// ===== SAM Management API =====
export async function manageSAM(samData) {
  return apiRequest('/sams', {
    method: 'POST',
    body: JSON.stringify(samData),
  });
}

export async function getSAMs() {
  return apiRequest('/sams', { method: 'GET' });
}

// ===== Authentication API =====
export async function login(credentials) {
  console.log('🔑 Calling login API with:', { email: credentials.email });
  
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (data.token) {
    console.log('🎫 Auth token received and stored');
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
}

export async function register(userData) {
  console.log('📋 Calling register API with:', { 
    name: userData.name, 
    email: userData.email 
  });
  
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (data.token) {
    console.log('🎫 Auth token received and stored');
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
}

export function logout() {
  localStorage.removeItem('authToken');
}

export function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}


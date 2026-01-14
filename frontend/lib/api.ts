import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (userData: {
    uid: string;
    email: string;
    name: string;
    phone?: string;
    role?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users');
  },
  
  getById: async (uid: string) => {
    return apiRequest(`/users/${uid}`);
  },
  
  update: async (uid: string, data: any) => {
    return apiRequest(`/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (uid: string) => {
    return apiRequest(`/users/${uid}`, {
      method: 'DELETE',
    });
  },
};

// Providers API
export const providersAPI = {
  getAll: async (filters?: { status?: string; category?: string; published?: boolean }) => {
    let queryString = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.published !== undefined) params.append('published', String(filters.published));
      queryString = params.toString();
    }
    return apiRequest(`/providers${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: async (id: string) => {
    return apiRequest(`/providers/${id}`);
  },
  
  getByUid: async (uid: string) => {
    return apiRequest(`/providers/user/${uid}`);
  },
  
  create: async (data: any) => {
    return apiRequest('/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/providers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  togglePublished: async (id: string, published: boolean) => {
    return apiRequest(`/providers/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/providers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Services API
export const servicesAPI = {
  getAll: async (filters?: { category?: string; available?: boolean }) => {
    const params = new URLSearchParams(filters as any);
    return apiRequest(`/services?${params}`);
  },
  
  getById: async (id: string) => {
    return apiRequest(`/services/${id}`);
  },
  
  getByProviderId: async (providerId: string) => {
    return apiRequest(`/services/provider/${providerId}`);
  },
  
  create: async (data: any) => {
    return apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    return apiRequest('/bookings');
  },
  
  getById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },
  
  getByUserId: async (userId: string) => {
    return apiRequest(`/bookings/user/${userId}`);
  },
  
  getByProviderId: async (providerId: string) => {
    return apiRequest(`/bookings/provider/${providerId}`);
  },
  
  getProviderBookedDates: async (providerId: string) => {
    return apiRequest(`/bookings/provider/${providerId}/dates`);
  },
  
  create: async (data: any) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadSingle: async (file: File) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload/single`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  },
  
  uploadMultiple: async (files: File[]) => {
    const token = await getAuthToken();
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data;
  },
  
  deleteImage: async (publicId: string) => {
    const encodedPublicId = encodeURIComponent(publicId);
    return apiRequest(`/upload/${encodedPublicId}`, {
      method: 'DELETE',
    });
  },
};

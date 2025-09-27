// Client-side management API utility
// This calls YOUR Next.js API routes, NOT the backend directly

// Types
export interface Template {
  id: string;
  name: string;
  description?: string;
  original_filename: string;
  file_size_bytes: number;
  variables_detected: {
    simple: string[];
    sections: string[];
    total_count: number;
  };
  tags: string[];
  category?: string;
  usage_count: number;
  is_favorite: boolean;
  created_at: string;
  last_used_at?: string;
}

export interface Document {
  id: string;
  template_id?: string;
  name: string;
  generated_filename: string;
  export_format: string;
  file_size_bytes: number;
  status: string;
  download_count: number;
  variables_used: Record<string, unknown>;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  templates_uploaded: number;
  documents_created: number;
  storage_bytes: number;
  plan_tier: string;
  last_activity: string;
}

export interface UserProfile {
  user: {
    id: string;
    auth0_user_id: string;
    email: string;
    name: string;
    subscription_tier: string;
    created_at: string;
    updated_at: string;
  };
  stats: {
    documents_created: number;
    templates_uploaded: number;
    storage_used_bytes: number;
    storage_quota_bytes: number;
    storage_percentage: number;
  };
  dashboard_state: 'first_time_user' | 'has_templates_no_docs' | 'returning_user';
  recent_templates: Template[];
  recent_documents: Document[];
  is_first_time_user: boolean;
  has_templates_no_docs: boolean;
}

export interface DownloadUrlResponse {
  download_url: string;
  expires_in: number;
  filename: string;
}

// API Client
export const managementApi = {
  templates: {
    list: async (params?: { limit?: number; skip?: number }): Promise<Template[]> => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.skip) searchParams.set('skip', params.skip.toString());

      const res = await fetch(`/api/management/templates?${searchParams}`);
      if (!res.ok) throw new Error('Failed to fetch templates');
      return res.json();
    },

    get: async (id: string): Promise<Template> => {
      const res = await fetch(`/api/management/templates/${id}`);
      if (!res.ok) throw new Error('Failed to fetch template');
      return res.json();
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const res = await fetch(`/api/management/templates/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete template');
      return res.json();
    },

    downloadUrl: async (id: string): Promise<DownloadUrlResponse> => {
      const res = await fetch(`/api/management/templates/${id}/download`);
      if (!res.ok) throw new Error('Failed to get download URL');
      return res.json();
    },

    toggleFavorite: async (id: string): Promise<{ is_favorite: boolean }> => {
      const res = await fetch(`/api/management/templates/${id}/favorite`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to toggle favorite');
      return res.json();
    }
  },

  documents: {
    list: async (params?: { limit?: number; skip?: number }): Promise<Document[]> => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.skip) searchParams.set('skip', params.skip.toString());

      const res = await fetch(`/api/management/documents?${searchParams}`);
      if (!res.ok) throw new Error('Failed to fetch documents');
      return res.json();
    },

    get: async (id: string): Promise<Document> => {
      const res = await fetch(`/api/management/documents/${id}`);
      if (!res.ok) throw new Error('Failed to fetch document');
      return res.json();
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const res = await fetch(`/api/management/documents/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete document');
      return res.json();
    },

    downloadUrl: async (id: string): Promise<DownloadUrlResponse> => {
      const res = await fetch(`/api/management/documents/${id}/download`);
      if (!res.ok) throw new Error('Failed to get download URL');
      return res.json();
    },

    toggleFavorite: async (id: string): Promise<{ is_favorite: boolean }> => {
      const res = await fetch(`/api/management/documents/${id}/favorite`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to toggle favorite');
      return res.json();
    }
  },

  stats: {
    get: async (): Promise<UserStats> => {
      const res = await fetch('/api/management/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    }
  },

  user: {
    getProfile: async (): Promise<UserProfile> => {
      const res = await fetch('/api/management/user-profile');
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return res.json();
    }
  }
};
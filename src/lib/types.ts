// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  details?: string;
  statusCode?: number;
}

// User Types (Auth0 based)
export interface User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

// Document Generation Types
export interface SimpleVariable {
  name: string;
  type: 'text' | 'email' | 'date' | 'number';
  value?: string;
  required?: boolean;
}

export interface TableRow {
  key: string;
  value: string;
}

export interface SectionVariable {
  name: string;
  title: string;
  table_rows: TableRow[];
}

export interface VariableDetectionResponse {
  simple: string[];
  sections: string[];
  total_count: number;
}

export interface DocumentGenerationRequest {
  simple_variables: Record<string, string>;
  section_variables: Record<string, SectionVariable[]>;
}

// Document Types
export interface GeneratedDocument {
  id: string;
  name: string;
  created_at: string;
  template_name: string;
  export_format: 'docx' | 'pdf';
  file_size: number;
  download_url?: string;
  variables_used: DocumentGenerationRequest;
}

// Upload Types
export interface FileUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

// Form Types
export interface GenerationStepData {
  step: 1 | 2 | 3 | 4;
  uploadedFile?: File;
  detectedVariables?: VariableDetectionResponse;
  filledVariables?: DocumentGenerationRequest;
  exportOptions?: {
    format: 'docx' | 'pdf';
    autoFormat: boolean;
  };
}

// UI Component Types
export interface ButtonVariants {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
}

export interface InputVariants {
  variant: 'default' | 'error' | 'success';
  size: 'sm' | 'md' | 'lg';
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// Settings Types
export interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  preferences: {
    defaultExportFormat: 'docx' | 'pdf';
    autoFormat: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

// Billing Types
export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeature[];
  current?: boolean;
}

export interface UsageStats {
  current_period: {
    documents_generated: number;
    storage_used: number; // in MB
  };
  limits: {
    documents_per_month: number;
    storage_limit: number; // in MB
  };
}

export type UserRole = 'admin' | 'officer' | 'coordinator' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  profilePhoto?: string;
  contactDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserSettings {
  language: 'en' | 'es' | 'fr' | 'tl';
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  offlineMode: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  aiAssistantStyle: 'concise' | 'detailed' | 'technical';
  aiSuggestionsEnabled: boolean;
}

export interface NotificationPreference {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  priorityLevel: 'all' | 'high' | 'critical';
  quietHoursStart?: string;
  quietHoursEnd?: string;
  riskCategories: string[];
  geographicZones: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'risk' | 'message' | 'system' | 'ai-insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SurveyResult {
  id: string;
  userId: string;
  surveyType: string;
  responses: Record<string, string | number>;
  submittedAt: string;
  riskScore?: number;
  recommendations?: string[];
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'red';
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name?: string;
  plan: string;
  leads_used_this_month: number;
  stripe_customer_id?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  product_description: string;
  tone: string;
  status: string;
  created_at: string;
  leads_count?: number;
  emails_generated?: number;
}

export interface Lead {
  id: string;
  campaign_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  website?: string;
  status: string;
  research_data?: any;
  created_at: string;
}

export interface Email {
  id: string;
  lead_id: string;
  subject: string;
  body: string;
  status: string;
  sent_at?: string;
  opened_at?: string;
  replied_at?: string;
  sequence_step: number;
  lead?: Lead;
}

export interface Sequence {
  id: string;
  campaign_id: string;
  step_number: number;
  follow_up_days: number;
  message_template: string;
}

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (e) {}
    throw new ApiError(response.status, errorMsg);
  }
  
  // Return null if response has no content
  if (response.status === 204) return null as T;
  
  return response.json();
}

export const api = {
  campaigns: {
    list: (token: string | null) => fetchApi<Campaign[]>('/campaigns', { method: 'GET' }, token),
    get: (id: string, token: string | null) => fetchApi<Campaign>(`/campaigns/${id}`, { method: 'GET' }, token),
    create: (data: any, token: string | null) => fetchApi<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(data) }, token),
    getLeads: (id: string, token: string | null) => fetchApi<Lead[]>(`/campaigns/${id}/leads`, { method: 'GET' }, token),
    getEmails: (id: string, token: string | null) => fetchApi<Email[]>(`/campaigns/${id}/emails`, { method: 'GET' }, token),
    uploadLeads: (id: string, leads: any[], token: string | null) => fetchApi<any>(`/campaigns/${id}/leads/bulk`, { method: 'POST', body: JSON.stringify(leads) }, token), // assuming endpoint based on normal patterns
    generateEmails: (id: string, token: string | null) => fetchApi<any>(`/campaigns/${id}/generate`, { method: 'POST' }, token),
  },
  emails: {
    update: (id: string, data: any, token: string | null) => fetchApi<Email>(`/emails/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
    approve: (id: string, token: string | null) => fetchApi<Email>(`/emails/${id}/approve`, { method: 'POST' }, token),
    bulkApprove: (ids: string[], token: string | null) => fetchApi<any>('/emails/bulk-approve', { method: 'POST', body: JSON.stringify({ email_ids: ids }) }, token),
    send: (id: string, token: string | null) => fetchApi<any>(`/emails/${id}/send`, { method: 'POST' }, token),
    bulkSend: (ids: string[], token: string | null) => fetchApi<any>('/emails/bulk-send', { method: 'POST', body: JSON.stringify({ email_ids: ids }) }, token),
  },
  sequences: {
    list: (campaignId: string, token: string | null) => fetchApi<Sequence[]>(`/campaigns/${campaignId}/sequences`, { method: 'GET' }, token),
    create: (campaignId: string, data: any, token: string | null) => fetchApi<Sequence>(`/campaigns/${campaignId}/sequences`, { method: 'POST', body: JSON.stringify(data) }, token),
  },
  billing: {
    checkout: (token: string | null) => fetchApi<any>('/billing/checkout', { method: 'POST' }, token),
    portal: (token: string | null) => fetchApi<any>('/billing/portal', { method: 'POST' }, token),
    status: (token: string | null) => fetchApi<any>('/billing/status', { method: 'GET' }, token),
  },
  users: {
    me: (token: string | null) => fetchApi<User>('/users/me', { method: 'GET' }, token),
  }
};

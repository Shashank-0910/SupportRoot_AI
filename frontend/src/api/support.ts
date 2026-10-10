import api from './axios';

export type ArticleStatus = 'processed' | 'processing' | 'failed';
export type ArticleType = 'pdf' | 'website' | 'text';

export interface KnowledgeArticle {
  id: number;
  title: string;
  content: string;
  source_type: ArticleType;
  status: ArticleStatus;
  size_label: string;
  pages: number | null;
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  customer_name: string;
  customer_email: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'in_progress' | 'resolved';
  assigned_to: string;
  ai_analysis: string;
  suggested_response: string;
  conversation_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  conversation_id: number;
  user_message: { id: number; content: string };
  ai_message: {
    id: number;
    content: string;
    confidence: number | null;
    source: string | null;
  };
  system_message: { id: number; content: string } | null;
}

export const supportApi = {
  listArticles: () =>
    api.get<KnowledgeArticle[]>('/support/articles/').then((r) => r.data),

  createArticle: (payload: Partial<KnowledgeArticle>) =>
    api.post<KnowledgeArticle>('/support/articles/', payload).then((r) => r.data),

  deleteArticle: (id: number) => api.delete(`/support/articles/${id}/`),

  chat: (message: string, conversationId?: number | null) =>
    api
      .post<ChatResponse>('/support/chat/', {
        message,
        conversation_id: conversationId ?? null,
      })
      .then((r) => r.data),

  listTickets: (params?: { status?: string; search?: string }) =>
    api
      .get<Ticket[]>('/support/tickets/', { params })
      .then((r) => r.data),

  getTicket: (id: number | string) =>
    api.get<Ticket>(`/support/tickets/${id}/`).then((r) => r.data),

  createTicket: (payload: {
    subject: string;
    customer_name: string;
    customer_email?: string;
    description?: string;
    priority?: string;
    assigned_to?: string;
    conversation_id?: number | null;
  }) => api.post<Ticket>('/support/tickets/', payload).then((r) => r.data),

  updateTicket: (id: number | string, payload: Partial<Ticket>) =>
    api.patch<Ticket>(`/support/tickets/${id}/`, payload).then((r) => r.data),
};

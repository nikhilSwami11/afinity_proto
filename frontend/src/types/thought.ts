export interface ThoughtCreate {
  content: string;
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private';
  prompt_source?: string;
}

export interface ThoughtUpdate {
  content?: string;
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private';
  prompt_source?: string;
}

export interface ThoughtResponse {
  id: number;
  user_id: number;
  content: string;
  status: string;
  visibility: string;
  prompt_source: string | null;
  created_at: string;
  updated_at: string;
}

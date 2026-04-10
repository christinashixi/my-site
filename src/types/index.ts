export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Note {
  id: string;
  user_id: string;
  chapter_id: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

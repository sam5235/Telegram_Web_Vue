export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Personsa {
  full_name: string;
  persona_image: string;
  persona_id: string;
}

export interface Message {
  id: string;
  message: string;
  role: 'Assistant' | 'User';
  timestamp?: string;
}

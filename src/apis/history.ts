import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

export async function get_chat_sessions(
  limit = 10,
  offset = 0
): Promise<AxiosResponse> {
  return await api.get('/chat/chat_history', {
    params: {
      limit,
      offset,
    },
  });
}

export async function get_chat_session(id: number) {
  return await api.get('/chat/chat_history/' + id);
}

export async function search_chat_sessions(
  search_text: string,
  limit = 10,
  offset = 0
) {
  return await api.get('/chat/search', {
    params: {
      search_query: search_text,
      limit,
      offset,
    },
  });
}

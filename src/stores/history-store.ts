import { defineStore } from 'pinia';
import { MetaData } from 'src/models/responseModel';

import { get_chat_sessions, search_chat_sessions } from 'src/apis/history';

import { ref } from 'vue';
import { ChatSession } from 'src/models/chatSession';
import { delete_chat } from 'src/apis/chat';

export const useChatHistory = defineStore('chatHistoryStore', () => {
  const chat_sessions = ref<ChatSession[]>([]);
  const meta_data = ref<MetaData>({
    total: 0,
    offset: 0,
    limit: 0,
    returned: 0,
  });

  const is_loading = ref<boolean>(false);

  const search_text = ref<string>('');

  const fetchAndMap = async <T>(...args: any[]): Promise<T> => {
    // Call the provided function with the arguments
    return await args[0](...args.slice(1));
  };

  async function searchChatSessions(
    limit = 10,
    offset = 0,
    reset = true
    ) {
    is_loading.value = true
    const response: any = await fetchAndMap(
      search_chat_sessions,
      search_text.value,
      limit,
      offset
    );
    is_loading.value = false;
    if (reset) {
      chat_sessions.value = [];
    }
    chat_sessions.value.push(...response.data.data);
    meta_data.value = response.data.meta_data;
  }

  const getChatSessions = async (
    limit = 10,
    offset = 0,
    reset = false,
  ) => {
    is_loading.value = true;
    const response: any = await fetchAndMap(
      get_chat_sessions,
      limit,
      offset
    );
    is_loading.value = false;
    if (reset) {
      chat_sessions.value = [];
    }
    chat_sessions.value.push(...response.data.data);
    meta_data.value = response.data.meta_data;
  };

  async function paginate() {
    await getChatSessions(
      meta_data.value.limit,
      meta_data.value.offset + meta_data.value.limit
    );
  }

  // async function searchPaginate() {
  //   await searchChatSessions(
  //     search_text.value,
  //     meta_data.value.limit,
  //     meta_data.value.offset + meta_data.value.limit,
  //   );
  // }

  async function deleteChatSession(chat_session_id: string) {
    return await delete_chat(chat_session_id)
  }

  async function reset_chat_history() {
    chat_sessions.value = [];
    meta_data.value = {
      total: 0,
      offset: 0,
      limit: 0,
      returned: 0,
    };
    search_text.value = ''
  }

  return {
    chat_sessions,
    meta_data,
    is_loading,
    getChatSessions,
    paginate,
    reset_chat_history,
    search_text,
    searchChatSessions,
    // searchPaginate,
    deleteChatSession
  };
})

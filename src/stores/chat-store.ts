import { defineStore } from 'pinia';
import { date } from 'quasar';
import { Message } from 'components/models';
import {
  fetch_chat_session,
  chat_ask,
  create_chat_session_with_persona,
  create_chat_session_with_sub_tool,
  SubTools,
} from 'src/apis/chat';

import { Ref, ref } from 'vue';
import { MetaData } from 'src/models/responseModel';

const { formatDate, addToDate } = date;

type NonNull<T> = T extends null | undefined ? never : T;

export const useChat = defineStore('chatStore', () => {
  const messages: Ref<Message[]> = ref<Message[]>([]);
  const index: Ref<number> = ref<number>(0);
  const chat_session_id: Ref<string> = ref<string>('');
  const persona_id: Ref<string> = ref<string>('');
  const sub_tool_id: Ref<string> = ref<string>('');
  const model: Ref<string> = ref<string>('Mistral');
  const isAssistantTyping = ref<boolean>(false);

  const meta_data = ref<MetaData>({
    total: 0,
    offset: 0,
    limit: 0,
    returned: 0,
  });

  function GetLocalizedTimeString(
    serverTimeString: string | null = null,
    format = 'hh:mm A'
  ): string {
    if (serverTimeString) {
      // Parse the UTC date string into a Date object.
      const utcDate: Date = new Date(serverTimeString);

      // Get the user's timezone offset.
      const timezoneOffset: number = new Date().getTimezoneOffset();
      console.log(timezoneOffset);

      // Add the timezone offset to the Date object.
      const localDate: Date = addToDate(utcDate, { minutes: -timezoneOffset });

      // Determine the appropriate format based on time difference
      if (localDate.getDate() === new Date().getDate()) {
        format = 'hh:mm A';
      } else if (localDate > addToDate(new Date(), { days: -7 })) {
        format = 'ddd hh:mm A';
      } else if (localDate.getFullYear() === new Date().getFullYear()) {
        format = 'MMM DD, hh:mm A';
      } else {
        format = 'MMM DD, YYYY hh:mm A';
      }

      // Convert the Date object back to a string in the desired format.
      return formatDate(localDate, format);
    }

    return formatDate(new Date(), format);
  }

  function ResetChat(): void {
    messages.value = [];
    index.value = 0;
    chat_session_id.value = '';
    persona_id.value = '';
    sub_tool_id.value = '';
  }

  async function Chat(question: NonNull<string>): Promise<void> {
    question = question.trim();
    if (question === '') return;
    let response;

    messages.value.push({
      id: index.value.toString(),
      message: question,
      role: 'User',
      timestamp: GetLocalizedTimeString(),
    });

    if (chat_session_id.value === '') {
      if (persona_id.value !== '') {
        response = await create_chat_session_with_persona(
          persona_id.value,
          question,
          model.value
        ).catch((err) => {
          console.log('Error in chat store, Persona', err);
          messages.value.pop();
        });
      } else if (sub_tool_id.value !== '') {
        response = await create_chat_session_with_sub_tool(
          question,
          sub_tool_id.value,
          model.value
        ).catch((err) => {
          console.log('Error in chat store, Subtotal', err);
          messages.value.pop();
          throw err;
        });
      } else {
        // TODO: Handle this case
        return;
      }
      console.log(response);
      chat_session_id.value = response.data.id;

      messages.value.push({
        id: response.data.chat_messages[1].id,
        message: response.data.chat_messages[1].message,
        role: 'Assistant',
        timestamp: GetLocalizedTimeString(
          response.data.chat_messages[1].timestamp
        ),
      });
    } else {
      response = await chat_ask(
        chat_session_id.value,
        question,
        model.value
      ).catch(() => {
        messages.value.pop();
      });

      messages.value.push({
        id: response.data[1].id,
        message: response.data[1].message,
        role: 'Assistant',
        timestamp: GetLocalizedTimeString(response.data[1].timestamp),
      });
    }

    index.value += 1;
  }

  async function LoadChatMessages(limit = 10, offset = 0) {
    const response = await fetch_chat_session(
      chat_session_id.value,
      limit,
      offset
    );
    console.log(response.data.data);
    messages.value = [
      ...response.data.data.map((message: any) => ({
        id: message.id,
        message: message.message,
        role: message.role,
        timestamp: GetLocalizedTimeString(message.timestamp),
      })),
      ...messages.value,
    ];

    // response.data.data.forEach((message: any) => {
    //   messages.value.unshift({
    //     id: message.id,
    //     message: message.message,
    //     role: message.role,
    //     timestamp: GetLocalizedTimeString(message.timestamp),
    //   });
    // });
    meta_data.value = response.data.meta_data;
  }

  async function paginate() {
    await LoadChatMessages(
      meta_data.value.limit,
      meta_data.value.offset + meta_data.value.limit
    );
  }

  return {
    messages,
    Chat,
    persona_id,
    sub_tool_id,
    chat_session_id,
    ResetChat,
    LoadChatMessages,
    paginate,
    meta_data,
    model,
    isAssistantTyping,
  };
});

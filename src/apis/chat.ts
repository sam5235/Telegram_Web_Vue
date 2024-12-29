import { api } from 'boot/axios';
import { AxiosResponse } from 'axios';
import { useModels } from 'src/stores/model-store';
import { storeToRefs } from 'pinia';

const { selected_model } = storeToRefs(useModels());

export enum SubTools {
  EditImage = '3aeeaef7-5032-485b-8b88-b5875d01902e',
  DescribeImage = '0d834cb1-3069-4811-8c87-d95922ab9f0c',
  GenerateImage = 'a9e8644e-0293-44bd-8310-3edfeec0bd2c',
  TargetedResume = '55e0bd3c-c25f-4357-b52c-0b6217884f9f',
  ImitateCharacter = '0b0eb217-89a2-4fa2-926c-ee0dad222036',
  ToneChecking = '0bfd148f-e470-40a9-9453-9565303765cd',
  Outlines = '37f78fe4-42f1-4c64-9e7c-235885ad8c17',
  ExpanderAndSummarize = '630ca76a-9c8a-4808-a77f-ab38fe9a209f',
  Script = '1217f2bf-a1ed-44f3-8cb8-b2cf0eee3af5',
  Formatting = 'c64058f0-c005-4cc3-a09f-b60c15ef2152',
  ParaphrasingContent = '37fd6efc-6eb9-416b-8263-c55b12820832',
  Brainstorming = '14f448a5-5471-4f47-8f2a-f7eaf88769bb',
}

export enum Personas {
  AfroChat = '48122ec5-5f65-4588-a012-0c7bfe15802f',
}

export function create_chat_session_with_persona(
  persona_id: string,
  question: string,
  model: string
): Promise<any> {
  return api.post('/chat/new_chat', {
    persona_id,
    question,
    message_from: 2,
    model,
  })// message_from: 2 = telegram_mini_app
    .catch((err) => {
      console.log('Error in chat api, Persona', err);

    });
}

export function create_chat_session_with_sub_tool(
  question: string,
  sub_tool_id: SubTools | string,
  model = 'Gemini Pro',
  image_url?: string,
): Promise<AxiosResponse> {
  return api.post('/chat/new_chat', {
    question,
    sub_tool_id,
    message_from: 2,
    model,
    image_url,
    image_model: selected_model.value? selected_model.value.name: "Stable Diffusion",
  }); // message_from: 2 = telegram_mini_app
}

export function chat_ask(
  chat_session_id: string,
  question: string,
  model: string
): Promise<any> {
  return api.post('/chat/ask', {
    chat_session_id,
    question,
    message_from: 2,
    model,
  }); // message_from: 2 = telegram_mini_app
}

export async function fetch_chat_session(
  chat_session_id: string,
  limit = 10,
  offset = 0
): Promise<AxiosResponse> {
  console.log('fetch_chat_session', chat_session_id);
  return await api.get(`/chat/chat_history/${chat_session_id}`, {
    params: {
      limit,
      offset,
    },
  });
}

export function delete_chat(chat_session_id: string): Promise<AxiosResponse> {
  return api.delete(`/chat/delete?chat_session_id=${chat_session_id}`);
}

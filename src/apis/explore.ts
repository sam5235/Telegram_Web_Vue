import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

function get_explore_tags(): Promise<AxiosResponse> {
  return api.get('/explore/get_tags');
}
const get_explores = async (tag = 'Recommended', limit = 5, offset = 0) => {
  return await api.get('/explore/get_by_tag', {
    params: {
      tag,
      limit,
      offset,
    },
  });
};

async function get_response (
  query = 'What is AI?',
  model = 'GPT 3.5',
  message_from = 2
) {
  return await api.post('/ask/ask', {
    question: query,
    model,
    message_from,
  });
};

const togglePreferable = async (id = '', idType = '') => {
  console.log('this is id type', id, idType);

  let requestBody: Record<string, string>;

  if (idType === 'Persona') {
    requestBody = { persona_id: id };
  } else if (idType === 'Tool') {
    requestBody = { tool_id: id };
  } else {
    throw new Error('Invalid idType');
  }

  return await api.post('/explore/toggle_preferable_entity', requestBody);
};

export { get_explore_tags, get_explores, togglePreferable, get_response };

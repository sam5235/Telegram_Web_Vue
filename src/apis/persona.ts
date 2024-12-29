import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

const get_all_personas = async (limit = 10, offset = 0) => {
  return await api.get('/persona/get_all', {
    params: {
      limit,
      offset,
    },
  });
};
const get_all_personas_by_category = async (
  category: string,
  limit = 10,
  offset = 0
) => {
  return await api.get('/persona/get_by_category', {
    params: {
      category,
      limit,
      offset,
    },
  });
};

const search_personas = async (
  persona_name: string,
  limit = 10,
  offset = 0,
  persona_type?: string
) => {
  return await api.get('/persona/search', {
    params: {
      persona_name,
      limit,
      offset,
      persona_type,
    },
  });
};

function get_persona_by_id(persona_id: string): Promise<AxiosResponse> {
  return api.get(`/persona/get_by_id/{id}?persona_id=${persona_id}`);
}

function get_all_persona_types(): Promise<AxiosResponse> {
  return api.get('/persona/get_all_types');
}

export {
  get_all_personas,
  get_all_personas_by_category,
  search_personas,
  get_persona_by_id,
  get_all_persona_types,
};

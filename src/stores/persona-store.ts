import { defineStore } from 'pinia';
import { MetaData } from 'src/models/responseModel';
import { Persona } from 'src/models/persona';
import {
  get_all_personas,
  get_all_personas_by_category,
  search_personas,
  get_all_persona_types,
} from 'src/apis/persona';
import { ref } from 'vue';

export const usePersona = defineStore('personaStore', () => {
  const personas = ref<Persona[]>([]);
  const meta_data = ref<MetaData>({
    total: 0,
    offset: 0,
    limit: 0,
    returned: 0,
  });

  const is_loading = ref<boolean>(false);

  const all_persona_types = ref<string[]>(['All']);
  const selected_persona_type = ref<string>('All');

  const fetchAndMap = async <T>(...args: any[]): Promise<T> => {
    // Call the provided function with the arguments
    return await args[0](...args.slice(1));
  };

  const searchPersonas = async (
    persona_name: string,
    selected_persona_type?: string,
    limit = 10,
    offset = 0,
    reset = true
  ) => {
    is_loading.value = true;
    const response: any = await fetchAndMap(
      search_personas,
      persona_name,
      limit,
      offset,
      (selected_persona_type =
        selected_persona_type !== 'All' ? selected_persona_type : undefined)
    );
    is_loading.value = false;
    if (reset) {
      personas.value = [];
    }
    personas.value.push(...response.data.data);
    meta_data.value = response.data.meta_data;
  };
  const getPersonas = async (
    limit = 10,
    offset = 0,
    category = selected_persona_type.value,
    reset = false
  ) => {
    let response: any;

    if (selected_persona_type.value === 'All') {
      is_loading.value = true;
      response = await fetchAndMap(get_all_personas, limit, offset);
      is_loading.value = false;
    } else {
      // Replace 'category' parameter with 'selected_persona_type.value'
      is_loading.value = true;
      response = await fetchAndMap(
        get_all_personas_by_category,
        category,
        limit,
        offset
      );
      is_loading.value = false;
    }

    if (reset) {
      personas.value = [];
    }
    personas.value.push(...response.data.data);
    meta_data.value = response.data.meta_data;
  };

  const paginate = async () => {
    await getPersonas(
      meta_data.value.limit,
      meta_data.value.offset + meta_data.value.limit
    );
  };
  const searchPaginate = async (
    persona_name: string,
    selected_persona_type: string
  ) => {
    await searchPersonas(
      persona_name,
      selected_persona_type,
      meta_data.value.limit,
      meta_data.value.offset + meta_data.value.limit,
      false
    );
  };

  const reset = async () => {
    personas.value = [];
    meta_data.value = {
      total: 0,
      offset: 0,
      limit: 0,
      returned: 0,
    };
  };

  return {
    personas,
    meta_data,
    getPersonas,
    paginate,
    reset,
    all_persona_types,
    selected_persona_type,
    searchPersonas,
    searchPaginate,
    is_loading,
  };
});

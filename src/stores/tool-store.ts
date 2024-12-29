import { defineStore } from 'pinia';
import { MetaData } from 'src/models/responseModel';
import { Tool } from 'src/models/tool';
import {
  get_all_tools,
  search_tools
} from 'src/apis/tool';
import { ref } from 'vue';

export const useTool = defineStore('toolStore', () => {
  const tools = ref<Tool[]>([]);
  const meta_data = ref<MetaData>({
    total: 0,
    offset: 0,
    limit: 0,
    returned: 0,
  });

  const is_loading = ref<boolean>(false);
  const fetchAndMap = async <T>(...args: any[]): Promise<T> => {
    // Call the provided function with the arguments
    return await args[0](...args.slice(1));
  };

  
  const getTools = async (
  ) => {
    // let response: any;

    is_loading.value = true;
    const response: any = await fetchAndMap(get_all_tools);
    console.log(response)
    is_loading.value = false;

    tools.value = [...response.data];

  };

  const paginate = async () => {
    await getTools(
    );
  };
  const searchPaginate = async (
    tool_name: string,
  ) => {
    await getTools();
  };

  const reset = async () => {
    tools.value = [];
    meta_data.value = {
      total: 0,
      offset: 0,
      limit: 0,
      returned: 0,
    };
  };

  return {
    tools,
    meta_data,
    getTools,
    paginate,
    reset,
    // searchTools,
    searchPaginate,
    is_loading,
  };
});

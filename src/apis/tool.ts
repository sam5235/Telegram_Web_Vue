import { api } from 'src/boot/axios';

const get_all_tools = async () => {
  return await api.get('/tool/get_all', {
  });
};

const search_tools = async (
  tool_name: string,
) => {
  return await api.get('/tool/search_tools_sub_tools', {
    params: {
      search: tool_name,
    },
  });
};

export { get_all_tools, search_tools };

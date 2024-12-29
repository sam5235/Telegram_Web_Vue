  interface SubTool{
    tool_id: string,
    sub_tool_name: string,
    sub_tool_description: string,
    sub_tool_initial_prompt: string,
    sub_tool_image: string,
    sub_tool_id: string
  }

  interface Tool {
    tool_name: string;
    tool_desc: string;
    tool_image: string;
    default_color: string;
    tool_id: string;
    sub_tools: SubTool[];
  }

  export type { Tool, SubTool };
  
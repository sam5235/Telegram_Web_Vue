
const ChatSessionType = {
  Persona: 'Persona',
  Tool: 'Tool',
}

export type ChatSessionType = (typeof ChatSessionType)[keyof typeof ChatSessionType]

interface ChatSession {
  id: string
  first_message: string
  created_at: string
  updated_at: string
  is_pinned: boolean
  persona_id: string
  sub_tool_id: string
  data: {
    chat_session_type: ChatSessionType
    name: string
    description: string
    picture: string
  }
}

export type { ChatSession }

// the data from api looks like:
// {
//   "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "first_message": "string",
//   "created_at": "2023-12-26T13:00:53.687Z",
//   "updated_at": "2023-12-26T13:00:53.687Z",
//   "is_pinned": true,
//   "share_able_link": "string",
//   "total_tokens": 0,
//   "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "persona_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "sub_tool_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "data": {
//      "chat_session_type": "Persona",
//      "name": "string",
//      "description": "string",
//      "picture": "string"
//   }
// }

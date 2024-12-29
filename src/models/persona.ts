
interface Quote {
  quote: string;
}

interface Persona {
  full_name: string;
  persona_type: string;
  persona_image: string;
  default_color: string;
  description: string;
  long_description:string;
  id: string;
  creator_uuid: string;
  created_at: string;
  quotes?: Quote[];
}

export type { Persona, Quote };

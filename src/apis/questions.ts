import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

function get_questions(): Promise<AxiosResponse> {
    return  api.get("ask/get_questions")
  }
export { get_questions}

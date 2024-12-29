import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';

function get_models(model_type = "llm_models") {
  return api.get(`chat/models?model_type=${model_type}`);
}

export { get_models}
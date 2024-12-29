import { defineStore } from 'pinia';
import { ref } from 'vue';
import { get_response } from 'src/apis/explore';

export interface AskResponse {
  id: string;
  question: string;
  summary: string;
  llm_model: string;
  sources: { title: string; short_description: string; URL: string }[];
  recommendations: string[];
}

export const useQuestions = defineStore('questions-store', () => {
  const questionsList = ref<string[]>([]);
  const ask_responses = ref<AskResponse[]>([]);
  const loading_response = ref<boolean>(false);
  const last_question = ref('');
  const ask_model = ref('GPT 3.5');

  async function fetchSearchData(question: string, token: string) {
    try {
      loading_response.value = true;
      last_question.value = question;

      setTimeout(() => {
        const loadingIndicator: HTMLElement | null =
          document.getElementById('placeholder');
        loadingIndicator?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);

      const response = await get_response(question, ask_model.value)
        .then((response) => {
          const length_of_responses = ask_responses.value.length;
          if (length_of_responses > 0) {
            ask_responses.value[
              ask_responses.value.length - 1
            ].recommendations = [];
          }

          return response;
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          loading_response.value = false;
        });

      ask_responses.value.push({
        id: response.data.id,
        question: question,
        summary: response.data.summary,
        llm_model: response.data.llm_model,
        sources: response.data.sources,
        recommendations: response.data.recommendations,
      });

      setTimeout(() => {
        const loadingIndicator: HTMLElement | null = document.getElementById(
          response.data.id
        );
        loadingIndicator?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error) {
      throw error.response.data.detail;
    }
  }

  return {
    ask_responses,
    fetchSearchData,
    questionsList,
    loading_response,
    last_question,
    ask_model,
  };
});

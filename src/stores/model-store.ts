import { defineStore } from 'pinia';
import { ref } from 'vue';
import { get_models } from 'src/apis/model';

export interface ModelSchema {
  name: string
  image: string
  is_permium: boolean // FIXME: fix spelling
}

// export const defaultModel = {
//   name: 'Gemini Pro',
//   image: 'https://res.cloudinary.com/afrochat/image/upload/v1710313752/nxx81sfgyr3tgv0iyvhf.png',
//   is_permium: false
// }


export const useModels = defineStore('model-store', () => {
  const models = ref<any[]>([]);
  const selected_model = ref<ModelSchema>();
  const model_type = ref<'llm_models' | 'image_models'>('llm_models');
  const modelsOptions = ref([]);

  async function populate_models(model_type="llm_models") {
    await get_models(model_type).then((response) => {
      models.value = response.data?.map((model: any) => model);
      modelsOptions.value = response.data?.map((model: any) => ({
        label: model.name,
        value: model.name,
      }));


      if (models.value && models.value.length > 0) {
        selected_model.value = models.value[0];

      }
    });
  }


  return { models, model_type, selected_model, modelsOptions, populate_models };
});

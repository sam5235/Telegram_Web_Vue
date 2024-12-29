<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModels, ModelSchema } from 'src/stores/model-store';
import { useQuestions } from 'src/stores/questions-store';
import { watch } from 'vue';

const { ask_model } = storeToRefs(useQuestions());

const { models, selected_model, model_type } = storeToRefs(useModels());

watch(ask_model, () => {
  console.log(ask_model.value)
})

function handleClick(clicked_model: ModelSchema) {
  selected_model.value = clicked_model;
  if (model_type.value == "llm_models"){
    ask_model.value = clicked_model.name;
  }
  console.log(model_type.value)

}
</script>

<template>
  <div class="models">
    <div class="row no-wrap">
      <div
        v-for="(model, index) in models"
        :key="index"
        class="q-pa-sm"
        @click="handleClick(model)"
      >
        <div
          class="model-items q-p-xs row no-wrap items-center"
          :class="
            model.name === selected_model?.name
              ? 'bg-accent text-info'
              : 'bg-secondary text-warning'
          "
        >
          <img
            :src="model.image"
            style="
              height: 25px;
              width: 40px;
              vertical-align: middle;
              margin-right: 5px;
            "
          />
          {{ model.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.models {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.model-items {
  border-radius: 25px;
  border: 1px solid gray;
  padding: 0.5rem;
  white-space: nowrap;
}
</style>

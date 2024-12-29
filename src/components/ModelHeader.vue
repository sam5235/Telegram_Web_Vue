<!-- ModelHeader.vue -->
<script setup>
import { ref } from 'vue';
// const aiModels = ['Chat gpt 3.5', 'Novo ai', 'Gemini'];
const aiModels = ['Chat gpt 3.5'];
const modes = ['Chat', 'Ask'];

const selectedModel = ref(aiModels[0]);
const selectedMode = ref(modes[0]);
</script>

<template>
  <div class="navbar bg-secondary">
    <div class="header-selection bg-secondary">
      <q-select
        v-model="selectedModel"
        :options="aiModels"
        label="AI Model"
        class="text-warning bg-primary"
        outlined
        dense
      />
      <q-select
        v-model="selectedMode"
        :options="modes"
        label="Mode"
        class="text-warning bg-primary"
        outlined
        dense
      />
    </div>
  </div>
</template>

<style>
.header-selection {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem auto;
  justify-content: space-between;
}

.header-selector {
  width: 33%;
}

.navbar {
  display: block;
}
</style>

<script setup lang="ts">
import { defineProps } from 'vue';
import { AskResponse } from 'src/stores/questions-store';
import { useQuasar } from 'quasar';

interface Props {
  ask_response: AskResponse;
  fetchSearchData: (question: string, token: string) => Promise<void>;
  executeRecaptcha: (action: string) => Promise<string>;
}

const $q = useQuasar();

const ChipColors: Record<string, string> = {
  'GPT 3.5': 'orange',
  'GPT 4': 'purple',
  'Gemini Pro': 'blue',
  Mistral: 'green',
  'Llama 3': 'teal',
  'Llama 2': 'teal',
  Gemma: 'yellow',
  'Claude 3 Opus': 'red',
  'Claude 3 Sonnet': 'red',
  'Claude 3 Haiku': 'red'
};

function returnColor(llm_model: string) {
  console.log(ChipColors[llm_model])
  return ChipColors[llm_model];
}

const props = defineProps<Props>();

const { ask_response, executeRecaptcha, fetchSearchData } = props;
const addResponsePage = async (question: string) => {
  const token = await executeRecaptcha('add_response_page');
  fetchSearchData(question, token).catch(() => {
    $q.notify({
      message: 'Request failed',
      color: 'negative',
      position: 'top',
      timeout: 2000,
    });
  });
};

const goToLink = (url: string) => {
  window.open(url, '_blank');
};

const copySummaryAndSources = () => {
  const question = ask_response.question;
  const summary = ask_response.summary;
  let sources = '';

  if (ask_response.sources) {
    sources = ask_response.sources
      .map((source) => `${source.title}: ${source.URL}`)
      .join('\n');
  }

  const summaryAndSources = `${question}\n\nSummary:\n${summary}\n\nSources:\n${sources}`;

  navigator.clipboard
    .writeText(summaryAndSources)
    .then(() => {
      console.log('Summary, sources, and question copied to clipboard');
    })
    .catch((err) => {
      console.error('Failed to copy summary, sources, and question: ', err);
    });
};
</script>

<template>
  <q-page class="main-page bg-secondary text-info">
    <div :id="ask_response.id"></div>

    <div>
      <h1 v-if="ask_response.question" class="question">
        {{ ask_response.question }}
      </h1>
    </div>

    <div class="summary-container">
      <div class="icon-container">
        <i class="material-icons">description</i>
        <h6>Summary</h6>
      </div>

      <div class="chip_container">
        <q-chip :color="returnColor(ask_response.llm_model)" class="text-info">
          {{ ask_response.llm_model }}
        </q-chip>
      </div>

      <q-btn
        @click="copySummaryAndSources"
        icon="content_copy"
        class="copy-button"
        flat
        round
        dense
      ></q-btn>
    </div>

    <p v-if="ask_response.summary">{{ ask_response.summary }}</p>

    <div
      v-if="ask_response.sources.length > 0"
      class="sources-container bg-secondary shadow-2 rounded-borders"
    >
      <div class="icon-container">
        <i class="material-icons">link</i>
        <h6>Sources</h6>
      </div>

      <div class="source-list" v-if="ask_response.sources.length > 0">
        <div
          v-for="(source, index) in ask_response.sources"
          :key="index"
          class="source-item bg-primary shadow-1"
          @click="goToLink(source.URL)"
        >
          <h6 class="source-title text-info">{{ source.title }}</h6>
        </div>
      </div>
    </div>

    <div v-if="ask_response.recommendations.length > 0" class="icon-container">
      <i class="material-icons">recommend</i>
      <h6>Related Questions</h6>
    </div>

    <ul
      v-if="
        ask_response.recommendations && ask_response.recommendations.length > 0
      "
    >
      <li
        v-for="(recommendation, index) in ask_response.recommendations"
        :key="index"
      >
        <button
          @click="addResponsePage(recommendation)"
          class="recommendation-button bg-primary text-info"
        >
          {{ recommendation }}
        </button>
      </li>
    </ul>
  </q-page>
</template>

<style scoped>
.chip_container {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

.main-page {
  margin-left: 3vh;
  margin-right: 3vh;
  min-height: fit-content !important;
}

.question {
  font-size: 1.5em;
  line-height: 1.4;
}

.sources-container {
  padding: 2%;
  margin-bottom: 15px !important;
}

.shimmer-container {
  height: 18vh; /* Set the height to 100% of the viewport height */
  width: 95%;
  margin-bottom: 3%;
  margin-left: 3%;
  border-radius: 1vh;
}

.summary-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure the container takes up the full width */
}

.copy-button {
  margin-left: auto; /* Push the copy button to the far right */
}

.icon-container {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}

.material-icons {
  margin-right: 10px;
  font-size: 20px;
}

.text-container {
  grid-column: 2 / -1;
}

.text-container p {
  margin: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

.recommendation-button {
  border: none;
  border-bottom: 10px;
  padding: 10px 20px;
  text-align: left; /* Align text to the left */
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
}

li {
  border-bottom: 1px solid #ccc;
  margin-bottom: -1px;
}

.q-pa-md {
  padding: 20px;
}

.q-toolbar {
  width: 100%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.q-toolbar-title {
  font-family: Inter, serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 62px;
  letter-spacing: 0;
  text-align: left;
}

input {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 10px;
  font-size: 17px;
  padding: 8px 10px 8px 30px;
  border: none;
}

input:focus {
  outline: none;
}

.half-width {
  width: 50%;
}

.input-field-container {
  display: flex;
  align-items: center;
  padding: 0 10px; /* Adjust padding as needed */
  border-radius: 25px; /* Rounded corners */
}

.input-field {
  flex: 1; /* Take up remaining space */
  border: none;
  background-color: transparent;
  font-size: 16px;
  line-height: 1.5;
  padding: 10px 15px;
  outline: none;
  resize: none; /* Prevent resizing */
}

.input-field:focus {
  /* Adjust focus styles */
  border: none;
  box-shadow: none;
}

.icon-container {
  display: flex;
  align-items: center;
}

.icon-container h6 {
  margin-left: 10px;
}

.source-list {
  display: flex;
  overflow-x: auto;
}

.source-item {
  padding: 10px;
  margin-right: 10px;
  border-radius: 8px;
  min-width: 150px; /* Set a minimum width for each source item */
}

.source-title {
  font-size: 12.5px; /* Decrease the font size of the source titles */
  line-height: 1.5;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Adjust height as needed */
}

.loading-icon {
  font-size: 30px; /* Adjust size as needed */
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

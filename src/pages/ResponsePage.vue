<script setup lang="ts">
import ResponseComponent from 'components/ResponseComponent.vue';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useQuestions } from 'stores/questions-store';
import SearchBar from 'components/SearchBar.vue';
import LoadingComponent from 'components/LoadingComponent.vue';
import { useTelegram } from 'src/stores/telegram';

import { useReCaptcha } from 'vue-recaptcha-v3';

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const { fetchSearchData } = useQuestions();
const { ask_responses, loading_response, last_question } = storeToRefs(
  useQuestions()
);

const recaptchaIsLoaded = ref(false);
const { showBack } = useTelegram();

onBeforeUnmount(() => {
  ask_responses.value = [];
});

onMounted(async () => {
  recaptchaIsLoaded.value = await recaptchaLoaded();
  showBack();
});
</script>

<template>
  <div class="response bg-secondary text-info">
    <div class="chat-response-container">
      <!-- Iterate through ask_responses and pass each ask_response into ResponseComponent -->
      <div v-for="(response, index) in ask_responses" :key="index">
        <ResponseComponent
          :ask_response="response"
          :fetchSearchData="fetchSearchData"
          :executeRecaptcha="executeRecaptcha"
        />
        <hr class="line" v-if="index !== ask_responses.length - 1" />
      </div>
      <div v-if="loading_response">
        <LoadingComponent :question="last_question" />
      </div>
    </div>
    <SearchBar v-if="recaptchaIsLoaded" :executeRecaptcha="executeRecaptcha" />
    <div v-else></div>
  </div>
</template>

<style scoped>
.chat-response-container {
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
}

.response {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  min-height: 100%;
  width: 100%;
}

.line {
  margin-bottom: 2.5rem; /* Adjust the value as per your requirement */
  margin-top: 2.5rem;
}
</style>

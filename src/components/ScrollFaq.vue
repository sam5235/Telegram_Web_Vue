<script setup>
import { get_questions } from 'src/apis/questions';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuestions } from 'src/stores/questions-store';
import { useSearchInput } from 'src/stores/search-store';
import { useRouter } from 'vue-router';

const router = useRouter();
const { fetchSearchData } = useQuestions();
const { questionsList, ask_responses } = storeToRefs(useQuestions());
onMounted(async () => {
  await get_questions()
    .then((response) => {
      response.data?.questions.forEach((question) => {
        questionsList.value.push(question);
      });
      console.log('fetched correctly', questionsList.value);
    })
    .catch((error) => console.error(error));
});

const infiniteLoop = (array) => {
  const displayArray = [];
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < array.length; j++) {
      displayArray.push(array[j]);
    }
  }
  shuffleArray(displayArray);
  return displayArray;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const { searchInput } = storeToRefs(useSearchInput());
const faqClicked = (faq) => {
  searchInput.value = faq;
  console.log('from faq', searchInput.value);

  ask_responses.value = [];
  fetchSearchData(faq);
  router.push({ name: 'response' });
};
</script>

<template>
  <div class="row-item">
    <div>
      <div class="row no-wrap">
        <div
          v-for="(faq, index) in infiniteLoop(questionsList)"
          :key="index"
          class="q-pa-sm"
        >
          <q-btn
            class="faq-items text-warning bg-primary"
            @click="faqClicked(faq)"
            push
            >{{ faq }}</q-btn
          >
        </div>
      </div>
      <div class="row no-wrap" style="margin-left: 25px">
        <div
          v-for="(faq, index) in infiniteLoop(questionsList)"
          :key="index"
          class="q-pa-sm"
        >
          <q-btn
            class="faq-items text-warning bg-primary"
            @click="faqClicked(faq)"
            push
            >{{ faq }}</q-btn
          >
        </div>
      </div>
      <div class="row no-wrap">
        <div
          v-for="(faq, index) in infiniteLoop(questionsList)"
          :key="index"
          class="q-pa-sm"
        >
          <q-btn
            class="faq-items text-warning bg-primary"
            @click="faqClicked(faq)"
            push
            >{{ faq }}</q-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.faq-scroll {
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  height: auto;
  overflow-x: scroll;
  justify-content: center;
  align-items: center;
  gap: 1px;
  position: absolute;
  bottom: 15rem;
}

.row-item {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}

.faq-items {
  border-radius: 15px;
  padding: 0.5rem;
  white-space: nowrap;
}
</style>

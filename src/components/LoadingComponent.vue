<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import Shimmer from 'vue3-loading-shimmer';

interface Props {
  question: string;
}

const props = defineProps<Props>();

const { question } = props;

onMounted(() => {
  console.log(question);
  console.log('LoadingComponent mounted');
});
</script>

<template>
  <q-page class="main-page bg-secondary text-info">
    <div id="placeholder"></div>
    <h1 class="question">
      {{ question }}
    </h1>

    <div class="summary-container">
      <div class="icon-container">
        <i class="material-icons">description</i>
        <h6>Summary</h6>
      </div>
    </div>

    <Shimmer class="shimmer-container" bg-color="secondary" />

    <div class="sources-container bg-secondary shadow-2 rounded-borders">
      <div class="icon-container">
        <i class="material-icons">link</i>
        <h6>Sources</h6>
      </div>

      <Shimmer class="shimmer-container" bg-color="secondary" />
    </div>

    <div class="icon-container">
      <i class="material-icons">recommend</i>
      <h6>Related Questions</h6>
    </div>

    <Shimmer class="shimmer-container" bg-color="secondary" />
  </q-page>
</template>

<style scoped>
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

.q-pa-md {
  padding: 20px;
}

.icon-container {
  display: flex;
  align-items: center;
}

.icon-container h6 {
  margin-left: 10px;
}
</style>

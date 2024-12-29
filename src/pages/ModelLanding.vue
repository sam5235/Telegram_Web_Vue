<script setup lang="ts">
import SearchBar from 'components/SearchBar.vue';
import ModelButtons from 'src/components/ModelButtons.vue';
import afro from 'src/assets/afro.svg';
import { onMounted, ref } from 'vue';
import { useModels } from 'src/stores/model-store';
import { useTelegram } from 'src/stores/telegram';

import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

import { useReCaptcha } from 'vue-recaptcha-v3';

const $q = useQuasar();
const { hideBack } = useTelegram();

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const { populate_models } = useModels();
const { model_type } = storeToRefs(useModels());

const recaptchaIsLoaded = ref(false);

onMounted(async () => {
  recaptchaIsLoaded.value = await recaptchaLoaded();

  model_type.value = 'llm_models';
  hideBack();
  await populate_models().catch((error) => {
    console.log(error);

    $q.notify({
      message: 'Failed to fetch models',
      color: 'negative',
      position: 'top',
      timeout: 2000,
    });
  });
});
</script>

<template>
  <div class="home-page">
    <div class="logo-container">
      <div class="row">
        <img
          :src="afro"
          alt="image"
          width="60"
          height="60"
          style="display: block"
        />
        <h3 class="text-bold q-ml-xs text-info">AfroChat</h3>
        <p class="text-weight-thin text-h6 text-info" style="padding-top: 1rem">
          Generative AI for Africa
        </p>
      </div>
    </div>

    <div>
      <ModelButtons />

      <SearchBar
        v-if="recaptchaIsLoaded"
        :executeRecaptcha="executeRecaptcha"
      />
      <div v-else></div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  min-height: 100%;
  width: 100%;
}

.logo-container {
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.row {
  margin-top: 8rem;
  width: 18rem;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  align-content: center;
}
</style>

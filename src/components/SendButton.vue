<script setup lang="ts">
import { useTelegram } from 'stores/telegram';

const { theme_data } = useTelegram();

interface Props {
  sendMessage: () => void;
}

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <svg
    class="send-button"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    :fill="theme_data.button_color"
    xmlns="http://www.w3.org/2000/svg"
    @click="sendMessage"
  >
    <path
      d="M14.6678 3.39453C18.1494 2.23399 20.041 4.13472 18.8896 7.61635L16.3035 15.3746C14.5672 20.5925 11.7161 20.5925 9.97991 15.3746L9.2123 13.0718L6.9095 12.3042C1.69163 10.568 1.69163 7.726 6.9095 5.98062L11.113 4.58249"
      :stroke="theme_data.button_color"
      stroke-opacity="0.9"
      stroke-width="1.37072"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.38672 12.679L12.6582 9.39844"
      :stroke="theme_data.button_color"
      stroke-opacity="0.9"
      stroke-width="1.37072"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped lang="scss">
.send-button {
  margin-right: 1rem;
  margin-left: 1rem;
  margin-top: 0.7rem;
}

.send-button:active {
  color: #1976d2;
}
</style>

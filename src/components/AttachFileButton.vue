<script setup lang="ts">

import { useTelegram } from "stores/telegram";

const { theme_data } = useTelegram();

interface Props {
  attachFile: () => void
}

withDefaults(defineProps<Props>(), {

})

</script>

<template>
  <svg
    class="attach-file-icon"
    width="30"
    height="30"
    viewBox="0 0 90 100"
    :fill="theme_data.accent"
    xmlns="http://www.w3.org/2000/svg"
    @click="attachFile"
  >
    <rect y="40" width="10" height="20" rx="5" :fill="theme_data.accent"/>
    <rect x="20" y="20" width="10" height="60" rx="5" :fill="theme_data.accent"/>
    <rect x="40" width="10" height="100" rx="5" :fill="theme_data.accent"/>
    <rect x="60" y="10" width="10" height="80" rx="5" :fill="theme_data.accent"/>
    <rect x="80" y="40" width="10" height="20" rx="5" :fill="theme_data.accent"/>
  </svg>

</template>

<style scoped lang="scss">
.attach-file-icon {
  margin-left: 1rem;
  margin-right: 1rem;
}

</style>

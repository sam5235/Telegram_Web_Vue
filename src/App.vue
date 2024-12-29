<template>
  <router-view />
</template>

<script setup lang="ts">
import { useTelegram } from 'src/stores/telegram';
import { onMounted } from 'vue';
const { theme_data, webapp } = useTelegram();
onMounted(async () => {
  // FIXME : run the auth later on
  webapp.setHeaderColor(theme_data.secondary_bg_color);
  console.log('app mountedd');
});
</script>

<script setup>
import NavbarFooter from 'components/NavbarFooter.vue';

import { useTelegram } from 'src/stores/telegram';
import { onMounted } from 'vue';

const { enableCloseConfirm } = useTelegram();

onMounted(() => {
  enableCloseConfirm();
});
</script>

<template>
  <div class="main-container bg-secondary">
    <div class="item">
      <router-view />
    </div>

    <NavbarFooter />
  </div>
</template>

<style>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  margin: 0 !important;
}

.item {
  display: flex;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}
</style>

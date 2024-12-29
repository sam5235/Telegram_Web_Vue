<script setup lang="ts"></script>
<template>
  <q-page padding>
    <!-- content -->
    <main>
      <q-btn color="primary"> Click Me </q-btn>
      {{ $q }}
    </main>
  </q-page>
</template>

<style lang="scss">
main {
  border: 3px solid purple;
  height: 100vh;
}
</style>

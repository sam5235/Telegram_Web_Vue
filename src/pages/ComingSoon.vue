<script setup lang="ts">
import afro from 'src/assets/afro.svg';
</script>

<template>
  <div class="container">
    <div class="logo-container">
      <div class="row">
        <img
          :src="afro"
          alt="image"
          width="60"
          height="60"
          style="display: block"
        />
        <h3 class="text-bold q-ml-xs">AfroChat</h3>
        <p class="text-weight-thin text-h6" style="padding-top: 1rem">
          Generative AI for Africa
        </p>
      </div>
    </div>

    <h5>Under Maintainance</h5>
    <h6>Design update on the way.</h6>
  </div>
</template>

<style scoped>
.logo-container {
  align-items: center;
  justify-content: center;
}

.container {
  background: linear-gradient(to right, #9cb3d4, #e3e7ed);
  height: 100vh; /* Fills the entire viewport */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.row {
  margin-bottom: 10rem;
  width: 18rem;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  align-content: center;
}

h5 {
  font-family: sans-serif; /* Choose a modern font */
  font-size: 3rem;
  color: #933;
  text-align: center;
  animation: blink 1.5s infinite alternate;
  margin-bottom: 1rem;
}

h6 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; /* Choose a modern font */
  font-size: 1.1rem;
  color: rgb(66, 39, 39);
  text-align: center;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>

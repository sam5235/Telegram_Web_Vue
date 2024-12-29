<script setup>
import ExploreCard from 'components/ExploreCard.vue'
import { storeToRefs } from 'pinia';
import { useExplore } from 'src/stores/explore-store';
import { ref } from 'vue';
const {meta_data, explore_list} = storeToRefs(useExplore())
const {paginateExplores} = useExplore()
const isScrollEnd = ref(false);

async function onLoad(index, done) {
  if (explore_list.value.length > 0){
    await paginateExplores().then(
    () => {
      done();
      if (
        meta_data.value.offset + ( 2 * meta_data.value.limit) >= meta_data.value.total
      ) {
        isScrollEnd.value = true;
      }
    }
  );
  return;

  }

}
</script>
<template>
  <q-page class="explore-wrapper">
    <q-infinite-scroll
      class="persona-card-container"
      @load="onLoad"
      :offset="10"
      debounce="500"
      :disable="isScrollEnd"
    >
    <ExploreCard/>
    <template v-slot:loading>
        <div class="loader-container">
          <q-spinner-dots class="loader" color="accent" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
     

</template>
<style scoped>
.persona-card-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
  width: 100%;
  scroll-behavior: smooth;
  margin-top: 2rem;
  padding: 1rem;
}

.loader-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem auto;
}
.loader {
  margin: 0 9rem;
}

</style>
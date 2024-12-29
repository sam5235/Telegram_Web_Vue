<script setup>
import ExploreList from 'components/ExploreLists.vue';
import { get_explore_tags } from 'src/apis/explore';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useExplore } from 'stores/explore-store';
const { explore_tags, selected_tag } = storeToRefs(useExplore());
const selected_description = ref('');

const onFilter = (category, description) => {
  selected_tag.value = category;
  selected_description.value = description;
};

onMounted(async () => {
  await get_explore_tags()
    .then((response) => {
      explore_tags.value = response.data?.categories;
      console.log(explore_tags.value);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template>
  <div class="page-container">
    <div class="category-chip-container text-info">
      <div
        class="category-chip text-weight-medium"
        v-for="personaType in explore_tags"
        :key="personaType.title"
        :aria-current="personaType.title === selected_tag"
        @click="onFilter(personaType.title, personaType.description)"
        :class="
          personaType.title === selected_tag
            ? 'bg-primary text-info'
            : 'bg-primary text-warning'
        "
      >
        <span>{{ personaType.title }}</span>
      </div>
    </div>
    <div class="tag-description bg-primary">
      <p class="tag-title text-info">
        {{ selected_tag }}
      </p>
      <p class="text-warning">
        {{ selected_description }}
      </p>
    </div>

    <ExploreList />
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
}
.category-chip-container {
  display: flex;
  width: 100%;
  overflow-x: auto;
  height: 3rem;
}
.tag-description p {
  margin-bottom: 0.1rem;
}
.tag-description {
  width: 90%;
  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  padding: 0.4rem 1.5rem;
  border-radius: 50rem;
}
.tag-title {
  font: x-large;
}
.category-chip {
  min-width: fit-content;
  display: inline-block;
  border-radius: 100px;
  border: 1px solid rgba(22, 21, 21, 0.3);
  padding: 0.2rem 1.2rem 0 1.2rem;
  height: 31px;
  margin: 0.3rem;
  cursor: pointer;
}
</style>

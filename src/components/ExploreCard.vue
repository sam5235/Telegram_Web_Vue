<script setup lang="ts">
import { useChat } from 'src/stores/chat-store';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useExplore } from 'src/stores/explore-store';
import { togglePreferable } from 'src/apis/explore';
const router = useRouter();

const { explore_list, selected_tag, meta_data } = storeToRefs(useExplore());
const { get_explore_lists } = useExplore();
const { ResetChat } = useChat();
const { persona_id: persona_id_store, sub_tool_id: sub_tool_id_store } = storeToRefs(useChat());

onMounted(async () => {
  await get_explore_lists();
});

watch(selected_tag, async (newTag, oldTag) => {
  meta_data.value.offset = 0;
  if (newTag !== oldTag) {
    await get_explore_lists();
  }
});
async function toggleFavourite(explore) {
  console.log('this is first explore type', explore.type);
  await togglePreferable(explore.id, explore.type).then(
    () => (explore.is_preferable_entity = !explore.is_preferable_entity)
  );
}

const cardClicked = (
  id: string,
  full_name: string,
  image_url: string,
  type: 'Persona' | 'Tool'
) => {
  ResetChat();
  if (type === 'Persona')
    persona_id_store.value = id;
  else
    sub_tool_id_store.value = id;

  router.push({
    name: 'chat',
    params: { id: id },
    query: {
      name: full_name,
      image: image_url,
    },
  });
};
</script>

<template>
  <div
    v-for="explore in explore_list"
    class="persona-card bg-primary"
    :key="explore.id"
    @click="cardClicked(explore.id, explore.name, explore.image, explore.type)"
  >
    <div class="persona-image">
      <q-avatar size="64px" style="margin: 0.6rem">
        <img
          :src="explore.image"
          :alt="explore.name"
          style="object-fit: cover"
        />
      </q-avatar>
      <div class="message-count">
        <q-icon name="forum" class="forum-message text-info" size="sm" />
        <p class="text-info">{{ explore.total_messages }}</p>
      </div>
    </div>

    <div class="card-section">
      <div class="text-info">
        <h6>{{ explore.name }}</h6>
      </div>
      <div class="text-warning">
        <p>{{ explore.description }}</p>
      </div>
    </div>
    <div class="svg-image" @click.stop="toggleFavourite(explore)">
      <svg
        v-if="explore.is_preferable_entity"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="2em"
        height="2em"
        fill="yellow"
        style="cursor: pointer"
      >
        <path
          d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="2em"
        height="2em"
        style="cursor: pointer"
      >
        <path
          d="M21.919 10.127a1 1 0 0 0-.845-1.136l-5.651-.826l-2.526-5.147a1.037 1.037 0 0 0-1.795.001L8.577 8.165l-5.651.826a1 1 0 0 0-.556 1.704l4.093 4.013l-.966 5.664a1.002 1.002 0 0 0 1.453 1.052l5.05-2.67l5.049 2.669a1 1 0 0 0 1.454-1.05l-.966-5.665l4.094-4.014a1 1 0 0 0 .288-.567m-5.269 4.05a.502.502 0 0 0-.143.441l1.01 5.921l-5.284-2.793a.505.505 0 0 0-.466 0L6.483 20.54l1.01-5.922a.502.502 0 0 0-.143-.441L3.07 9.98l5.912-.864a.503.503 0 0 0 .377-.275L12 3.46l2.64 5.382a.503.503 0 0 0 .378.275l5.913.863z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.persona-card {
  position: relative;
  display: flex;
  cursor: pointer;
  width: 100%;
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
}
.persona-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}
.svg-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.message-count {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.card-section {
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 10px;
}

.text-info h6 {
  font-family: Roboto, serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 12px;
  letter-spacing: 0;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
}

.text-warning p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Roboto, serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  text-align: left;
}
</style>

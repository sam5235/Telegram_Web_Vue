<script setup lang="ts">
interface Persona {
  id: string;
  full_name: string;
  description: string;
  persona_image: string;
}

interface Props {
  personas: Persona[];
  personaClicked: (
    persona_id: string,
    full_name: string,
    persona_image: string
  ) => void;
}

const props = withDefaults(defineProps<Props>(), {
  personas: () => [],
});
</script>

<template> 
  <div
    v-for="persona in props.personas"
    class="persona-card bg-primary"
    :key="persona.id"
    @click="
      personaClicked(persona.id, persona.full_name, persona.persona_image)
    "
  >
    <q-avatar size="64px" style="margin: 0.6rem">
      <img
        :src="persona.persona_image"
        :alt="persona.full_name"
        style="object-fit: cover"
      />
    </q-avatar>
    <div class="card-section">
      <div class="card-section-item text-info">
        <h6>{{ persona.full_name }}</h6>
      </div>
      <div class="card-section-item text-warning">
        <p>{{ persona.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.persona-card {
  display: inline-block;
  min-width: 9rem;
  max-width: 9rem;
  height: 200px;
  overflow: hidden;
  border-radius: 16px;

  padding: 0.5rem;

  box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 20px -5px 43px -25px rgba(0, 0, 0, 0.34);
}

.card-section {
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 10px;
}

.card-section-item {
  display: inline-block;
}

.card-section-item > p {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to display */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  font-family: Roboto, serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 13px;
  text-align: left;
}

.card-section-item > h6 {
  font-family: Roboto, serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 12px;
  letter-spacing: 0;
  text-align: left;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

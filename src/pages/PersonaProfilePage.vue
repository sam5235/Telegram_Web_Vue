<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter} from 'vue-router';
import { Persona } from 'src/models/persona';
import { usePersona } from 'src/stores/persona-store';
import { useTool } from 'stores/tool-store';
import { storeToRefs } from 'pinia';
import { get_persona_by_id } from 'src/apis/persona';


const router = useRouter()
const { tools } = storeToRefs(useTool());
const { personas } = storeToRefs(usePersona());
const persona_id = useRoute().params.id;

const {
  searchPersonas,
} = usePersona();

const selectedPersona = ref<Persona | null>(null);

const isExpanded = ref(false);
const searchQuery = ref<string>('');


function toggleExpansion() {
  isExpanded.value = !isExpanded.value;
}


onMounted(async () => {
  const persona = await get_persona_by_id(persona_id.toString())

  if (persona.data) {
    selectedPersona.value = persona.data;
  }
});


</script>

<template>
      <q-card class="my-card bg-secondary" >
        <q-img :src="selectedPersona?.persona_image" alt="Person" class="height-img">
          <div class="absolute-bottom text-h6">
            {{ selectedPersona?.full_name }}
          </div>
        </q-img>
      
        <q-card-section >
          <div class="about-section text-info">
              <h6 >About</h6>
              <div v-if="!isExpanded">{{ selectedPersona?.description }}</div>
              <div v-else class="description">{{ selectedPersona?.long_description }}</div>
              <br>
              <div class="row justify-center">
                  <q-btn
                      round
                      dense
                      class="bg-accent"
                      @click="toggleExpansion"
                  >
                    <q-icon color="white" :name="isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" size="24px" />
                </q-btn>

              </div>
          </div>
        </q-card-section>
      </q-card>
  </template>
  
  
  <style lang="scss">

  .my-card {
    &.expanded {
      .q-card-section {
        max-height: none;
      }
    }
    .back-button {
        position: absolute;
        top: 31px; 
        left: 23px; 
        z-index: 300; 
        border-radius: 50%; 
        padding: 8px; 
        color: white;
        font-size: 16px;
        background-color: rgba(66, 144, 245, 0.2); 
    }
  
    .q-card-section {
      max-height: 100px; 
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
  
      padding: 15px;
      border-radius: 10px;
      
    }

    .height-img {
    height: 25rem; 
  }
  }


  </style>
  
  
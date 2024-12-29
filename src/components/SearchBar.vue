<script setup lang="ts">
import { ref, computed, toRaw, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSearchInput } from 'src/stores/search-store';
import { useQuestions } from 'src/stores/questions-store';
import { useRouter } from 'vue-router';
import ImageModal from 'src/components/ImageModal.vue';
import { useTelegram } from 'src/stores/telegram';
import { useQuasar } from 'quasar';
import { useChat } from 'src/stores/chat-store';
import { Personas, SubTools } from 'src/apis/chat';
import { useModels } from 'src/stores/model-store';

interface Props {
  executeRecaptcha: (action: string) => Promise<string>;
}

const props = defineProps<Props>();

const { executeRecaptcha } = props;

const { populate_models } = useModels();
const { model_type } = storeToRefs(useModels());
const { fetchSearchData } = useQuestions();
const { ask_responses, loading_response } = storeToRefs(useQuestions());

const { is_dark_theme } = useTelegram();

const { Chat, ResetChat } = useChat();
const { persona_id, sub_tool_id } = storeToRefs(useChat());

const $q = useQuasar();
const input = ref('');
const chatType = ref<'Ask' | 'Generate image' | 'Chat'>('Ask');
const isChatOpens = ref(false);

const is_loading = ref(false);
const router = useRouter();

// Watch for changes in chatType.value
watch(
  () => chatType.value,
  async (newValue) => {
    isChatOpens.value = false;
    if (newValue === 'Generate image') {
      model_type.value = 'image_models';
      await populate_models('image_models');
    } else {
      model_type.value = 'llm_models';
      await populate_models('llm_models');
    }
  }
);

const show_send_button = computed<boolean>(() => {
  return (
    input.value !== '' ||
    toRaw(ask_responses.value).length > 0 ||
    router.currentRoute.value.name === 'response'
  );
});

// Image modal
const image_modal = ref(false);
function openImageChoice() {
  ResetChat();
  image_modal.value = !image_modal.value;
}

const openChatChoice = () => {
  isChatOpens.value = !isChatOpens.value;
};

const { searchInput } = storeToRefs(useSearchInput());

async function sendData() {
  try {
    // reCaptcha
    const token = await executeRecaptcha('sendData');
    console.log('token:', token);

    // loading indicator
    is_loading.value = true;
    // validate input
    if (input.value === '') {
      $q.notify({
        message: 'Write your questions first!',
        timeout: 700,
      });

      return;
    }

    if (chatType.value === 'Generate image') {
      ResetChat();

      sub_tool_id.value = SubTools.GenerateImage;
      persona_id.value = '';

      await Chat(input.value);

      await router.push({
        name: 'chat',
        params: { id: SubTools.GenerateImage },
        query: {
          name: 'Generate Image',
          image:
            'https://res.cloudinary.com/afrochat/image/upload/v1699543455/imag.png',
        },
      });
    } else if (chatType.value === 'Chat') {
      ResetChat();

      persona_id.value = Personas.AfroChat;
      await Chat(input.value);

      await router.push({
        name: 'chat',
        params: { id: Personas.AfroChat },
        query: {
          name: 'AfroChat',
          image:
            'https://res.cloudinary.com/afrochat/image/upload/v1701867563/wwld5uwkhakuf4lufrxx.png',
        },
      });
      return;
    } else if (chatType.value === 'Ask') {
      searchInput.value = input.value;
      fetchSearchData(input.value, token)
        .catch((error) => {
          // TODO: Handle error
          $q.notify({
            message: error,
            timeout: 700,
            color: 'negative',
          });
        })
        .finally(() => {
          input.value = '';
        });
      await router.push({ name: 'response' });
    }
  } catch (error) {
    console.error('Error sending data:', error);
    $q.notify({
      message: 'Error sending data!',
      timeout: 700,
      color: 'negative',
    });
  } finally {
    is_loading.value = false;
  }
}
</script>

<template>
  <ImageModal :image_modal="image_modal" />

  <q-dialog class="blur-effect" v-model="isChatOpens">
    <div class="column chats bg-secondary text-info">
      <q-radio left-label v-model="chatType" val="Ask" label="Ask" color="blue" :dark="is_dark_theme" />
      <q-radio left-label v-model="chatType" val="Chat" class="text-left" label="Chat" color="blue"
        :dark="is_dark_theme" />
      <q-radio left-label v-model="chatType" val="Generate image" label="Generate image" color="blue"
        :dark="is_dark_theme" />
    </div>
  </q-dialog>

  <div class="floating-search-bar bg-secondary">
    <q-input borderless rounded :dark="is_dark_theme" v-model="input" :placeholder="chatType"
      class="search-input bg-primary text-info" @keydown.enter="sendData"
      :disable="is_loading || loading_response == true" :loading="is_loading || loading_response == true">
      <template v-slot:prepend v-if="router.currentRoute.value.name !== 'response'">
        <div class="left q-ml-md">
          <q-icon @click="openChatChoice" dense flat name="arrow_drop_down" />
        </div>
      </template>

      <!-- TODO: this is a placeholder -->
      <template v-slot:prepend v-else>
        <div class="left q-ml-md"></div>
      </template>

      <template v-slot:append v-if="show_send_button">
        <q-icon @click="sendData" class="q-mr-md" name="send" />
      </template>

      <template v-slot:append v-else>
        <q-icon @click="openImageChoice" class="q-mr-md" name="photo_library" />
      </template>
    </q-input>
  </div>
</template>

<style scoped>
.shimmer-container {
  height: 5vh;
  width: 100%;
  border-radius: 15%;
  margin-bottom: 3%;
  margin-left: 3%;
}

.floating-search-bar {
  width: 100%;
  margin: 1px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.q-radio {
  display: flex;
  justify-content: space-between;
}

.search-input {
  border-radius: 3rem;
  width: 90%;
  margin-bottom: 0.8rem;
}

.left {
  cursor: pointer;
  height: 100%;
  padding: 7px 5px 5px 1px;
}

.image-icon {
  margin-right: 10px;
}

.blur-effect {
  backdrop-filter: blur(2px);
  background-color: rgba(255, 255, 255, 0.4);
  margin-bottom: 15px;
}

.chats {
  position: fixed;
  top: 23rem;
  left: 1rem;
  border-radius: 40px;
  padding: 20px;
}
</style>

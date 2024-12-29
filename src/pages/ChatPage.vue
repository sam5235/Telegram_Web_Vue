<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { useRoute, useRouter } from 'vue-router';
import SendButton from 'components/SendButton.vue';
import { useChat } from 'stores/chat-store';
import { storeToRefs } from 'pinia';
import { useTelegram } from 'stores/telegram';
import { computed, onMounted, ref, watch } from 'vue';
import { delete_chat, SubTools } from 'src/apis/chat';
import { sendMessageBackend } from 'src/apis/utils';
import ImageModal from 'src/components/ImageModal.vue';
import { useModels } from 'stores/model-store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router_nav = useRouter();
const id = useRoute().params.id;
const name = useRoute().query.name;
const image = useRoute().query.image;
const session_id_from_route = useRoute().query.session_id;
const selectedModel = ref(null);
const {
  messages,
  chat_session_id,
  sub_tool_id,
  meta_data,
  model,
  isAssistantTyping,
} = storeToRefs(useChat());

const { Chat, LoadChatMessages, ResetChat, paginate } = useChat();
const { populate_models } = useModels();
const { modelsOptions } = storeToRefs(useModels());

const isScrollEnd = computed(
  () =>
    meta_data.value.returned < meta_data.value.limit ||
    meta_data.value.returned === meta_data.value.total
);

const { is_dark_theme, webapp, showBack } = useTelegram();

const message = ref<string>('');

const showModal = ref<boolean>(false);
const selectedImage = ref<string>('');
const isImageEnlarged = ref<boolean>(false);
const isChatVisible = computed(() => !isImageEnlarged.value);
const showMenu = ref<boolean>(false);
const deletedClicked = ref<boolean>(false);
const image_modal = ref(false);

function isImageUrl(str: string) {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(str);
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function parseMarkdown(message: string, isAssistant = false) {
  if (!isAssistant) {
    return message;
  }
  const modifiedMarkdown = message.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );

  return md.render(modifiedMarkdown);
}

function expandImage(imageUrl: string) {
  selectedImage.value = imageUrl; // Store the clicked image URL
  showModal.value = true; // Show the modal
  isImageEnlarged.value = true; // Set to true when the image is enlarged
}

function closeModal() {
  selectedImage.value = ''; // Clear the selected image URL
  showModal.value = false; // Close the modal
  isImageEnlarged.value = false; // Set to false when the modal is closed
}

async function downloadImage() {
  if (selectedImage.value) {
    const imageUrl = selectedImage.value;
    console.log('Downloading image:', imageUrl);

    await sendMessageBackend(
      webapp.initDataUnsafe.hash,
      webapp.initData,
      webapp.initDataUnsafe.user,
      selectedImage.value
    ).then((response) => {
      if (response.status == 200) {
      } else {
      }
    });
  }
}

async function sendMessage() {
  if (message.value === '' || isAssistantTyping.value) return;
  const chatsContainer: HTMLElement | null =
    document.getElementById('chat-container');

  // FIXME: scroll to the bottom of the chat container
  setTimeout(() => {
    const loadingIndicator: HTMLElement | null =
      document.getElementById('bottom-of-chat');
    loadingIndicator?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 100);

  isAssistantTyping.value = true;

  await Chat(message.value)
    .then(() => {
      message.value = '';

      // re-focus on the input field, after the assistant has finished typing
      const inputField: HTMLElement | null =
        document.getElementById('input-field');
      inputField?.focus();
    })
    .finally(() => {
      isAssistantTyping.value = false;
      if (chatsContainer)
        chatsContainer.scrollTop = chatsContainer.scrollHeight;
    });
}

async function deleteItem() {
  delete_chat(chat_session_id.value).then((response: any) => {
    if (response.status == 200) {
      ResetChat();
      router_nav.back();
    } else {
      console.error('Delete request failed:', response);
    }
  });
}
async function newChat() {
  ResetChat();
}
function assigningModel() {
  if (selectedModel.value) {
    model.value = selectedModel.value?.value;
    console.log(
      'this is model value in chatpage',
      selectedModel?.value?.value,
      model.value
    );
  }
}
watch(selectedModel, assigningModel);
async function showHistory() {
  await router_nav.push({ name: 'chat-history' });
}

async function onLoad(index: number, done: () => void) {
  // check if there is more data to load
  if (isScrollEnd.value) {
    done();
    return;
  }

  await paginate().then(() => {
    done();
  });
}

function openImageChoice() {
  image_modal.value = !image_modal.value;
}

// FIXME: fetch sub-tool again or make it go back only one route, if sub-tool

function handleFocusLost() {
  const chatsContainer: HTMLElement | null =
    document.getElementById('chat-container');
  if (chatsContainer)
    chatsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function handleMoreClicked() {
  showMenu.value = !showMenu.value;
}

function navigateToPersonaProfile() {
  if (!sub_tool_id.value) {
    router_nav.push({
      name: 'profile',
      params: { id: id },
    });
  }
}

onMounted(async () => {
  showBack();
  if (session_id_from_route) {
    const chatsContainer: HTMLElement | null =
      document.getElementById('chat-container');
    ResetChat();
    chat_session_id.value = session_id_from_route.toString();
    await LoadChatMessages();
    if (chatsContainer) chatsContainer.scrollTop = chatsContainer.scrollHeight;
  }

  await populate_models().catch((error) => {
    console.log(error);

    $q.notify({
      message: 'Failed to fetch models',
      color: 'negative',
      position: 'top',
      timeout: 2000,
    });
  });
});
</script>

<template>
  <q-page>
    <!-- content -->

    <div class="chat-session bg-secondary">
      <!-- Toolbar -->
      <div class="toolbar bg-secondary">
        <q-toolbar>
          <q-avatar @click="navigateToPersonaProfile">
            <img
              v-if="image"
              :src="image"
              :alt="name"
              style="object-fit: cover"
            />
            <span
              v-else
              class="text-info"
              style="width: 1rem; padding: 0.2rem"
              >{{ name[0] }}</span
            >
          </q-avatar>
          <q-toolbar-title
            class="text-info"
            @click="navigateToPersonaProfile"
            >{{ name }}</q-toolbar-title
          >
          <!-- QBtn to trigger the QMenu -->
          <q-btn
            flat
            round
            dense
            icon="more_vert"
            class="text-info"
            @click="handleMoreClicked"
          >
            <!-- QMenu that appears when the QBtn is clicked -->
            <q-menu
              touch-position
              menu-class="custom-menu"
              :dark="is_dark_theme"
              class="bg-primary text-info"
            >
              <!-- Menu content here -->
              <q-list>
                <q-select
                  :dark="is_dark_theme"
                  v-model="selectedModel"
                  :options="modelsOptions"
                  color="info"
                  label="AI Model"
                  filled
                  outlined
                />
                <!-- Delete item -->
                <q-item
                  :dark="is_dark_theme"
                  clickable
                  v-close-popup
                  @click="deleteItem"
                  :disable="deletedClicked"
                >
                  <q-item-section v-if="!deletedClicked">
                    <q-icon
                      name="delete"
                      class="text-info"
                      @click="ResetChat()"
                    />
                  </q-item-section>
                  <q-item-section
                    class="custom-label-section text-info"
                    v-if="!deletedClicked"
                    >Clear History</q-item-section
                  >
                </q-item>
                <q-item
                  :dark="is_dark_theme"
                  clickable
                  v-close-popup
                  @click="newChat"
                  :disable="deletedClicked"
                >
                  <q-item-section v-if="!deletedClicked">
                    <q-icon name="add" class="text-info" @click="ResetChat()" />
                  </q-item-section>
                  <q-item-section
                    class="custom-label-section text-info"
                    v-if="!deletedClicked"
                    >New Chat</q-item-section
                  >
                </q-item>
                <q-item
                  :dark="is_dark_theme"
                  clickable
                  v-close-popup
                  @click="showHistory"
                  :disable="deletedClicked"
                >
                  <q-item-section v-if="!deletedClicked">
                    <q-icon name="history" class="text-info" />
                  </q-item-section>
                  <q-item-section
                    class="custom-label-section text-info"
                    v-if="!deletedClicked"
                  >
                    History</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </div>
      <!-- END: Toolbar -->

      <!-- Chat container -->
      <div
        id="chat-container"
        class="q-pa-md row justify-center chat-container"
      >
        <div style="width: 100%">
          <q-infinite-scroll
            @load="onLoad"
            :offset="250"
            debounce="500"
            :disable="isScrollEnd"
            :reverse="true"
            scroll-target="#chat-container"
          >
            <div id="inner-chat-container">
              <!-- Display chat messages -->
              <q-chat-message
                v-for="message in messages"
                :key="message.id"
                :sent="message.role.toUpperCase() === 'USER'"
                :stamp="message.timestamp"
                :bg-color="
                  message.role.toUpperCase() === 'ASSISTANT'
                    ? 'primary'
                    : 'accent'
                "
                text-color="info"
                :style="
                  message.role.toUpperCase() === 'ASSISTANT'
                    ? 'max-width: 75%'
                    : 'margin-left: 25%; max-width: 75%'
                "
              >
                <q-img
                  v-if="isImageUrl(message.message)"
                  class="custom-image-class"
                  :src="message.message"
                  @click="() => expandImage(message.message)"
                />

                <p
                  v-else
                  :class="
                    message.role.toUpperCase() === 'ASSISTANT' &&
                    'markdown_message'
                  "
                  v-html="
                    parseMarkdown(
                      message.message,
                      message.role.toUpperCase() === 'ASSISTANT'
                    )
                  "
                ></p>
              </q-chat-message>
            </div>
          </q-infinite-scroll>

          <q-chat-message bg-color="primary" v-if="isAssistantTyping">
            <q-spinner-dots size="2rem" class="text-info" />
          </q-chat-message>

          <div id="bottom-of-chat" />
        </div>
      </div>
      <!-- END: Chat container -->
      <q-modal v-if="!isChatVisible" v-model="showModal" class="image-modal">
        <div class="button-container">
          <q-btn
            class="download-btn bg-accent"
            @click="downloadImage"
            flat
            icon="get_app"
          />
          <q-btn
            class="modal-close-btn bg-accent"
            @click="closeModal"
            flat
            icon="close"
          />
        </div>
        <q-img :src="selectedImage" class="enlarged-image" />
      </q-modal>

      <!-- Input field -->
      <div
        v-if="sub_tool_id == SubTools.DescribeImage"
        class="d-flex justify-center align-center"
      >
        <q-btn
          class="upload-button bg-accent"
          label="Upload Another Image"
          icon="cloud_upload"
          @click="openImageChoice"
          :loading="isAssistantTyping"
          :disable="isAssistantTyping"
        />
      </div>

      <div v-else class="input-field-container bg-secondary">
        <q-input
          autofocus
          autogrow
          :dark="is_dark_theme"
          v-model="message"
          id="input-field"
          placeholder="Type a message"
          class="input-field bg-primary text-info"
          @keydown.enter="sendMessage"
          @focusout="handleFocusLost"
          :loading="isAssistantTyping"
          :disable="isAssistantTyping"
        />
        <SendButton :send-message="sendMessage" />
      </div>
      <!-- END: Input field -->
      <ImageModal :image_modal="image_modal" />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.toolbar {
  margin: 0;
  box-shadow: 20px 5px 33px -10px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: 20px 5px 33px -10px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 20px 5px 33px -10px rgba(0, 0, 0, 0.34);
}

#inner-chat-container {
  min-width: 100%;
}

.chat-session {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-container {
  flex-grow: 2;
  overflow-y: scroll;

  scroll-behavior: smooth;
}

.send-button:active {
  color: #1976d2;
}

.input-field-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 6rem;
  margin: 0;
  justify-content: space-between;
  align-items: center;
  box-shadow: 20px -5px 33px -10px rgba(0, 0, 0, 0.34);
  -webkit-box-shadow: 20px -5px 33px -10px rgba(0, 0, 0, 0.34);
  -moz-box-shadow: 20px -5px 33px -10px rgba(0, 0, 0, 0.34);
}

.input-field {
  margin-bottom: 0;
  margin-left: 1rem;
  flex-grow: 1;

  max-height: 90%;
  overflow-y: auto;
  padding: 0 73.1px 0 9.14px;
  border-radius: 14.62px;
  gap: 95.04px;
  border-bottom: none;
}

.input-field-container > label {
  box-shadow: none;
  padding: 0 0 0 1rem;
}
.custom-label-section {
  margin-right: 10px;
}

.custom-image-class {
  width: 200px; /* Adjust the percentage as needed */
  height: auto;
}

.image-modal {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  gap: 1rem;
  top: 0;
  left: 0;
  z-index: 100;
  backdrop-filter: brightness(0.7) blur(8px); /* Adjust the brightness and blur values as needed */
}

.modal-content {
  position: relative;
  background-color: rgba(0, 0, 0, 0.8); /* Adjust the opacity as needed */
  border-radius: 10px; /* Add border-radius to the modal content if desired */
}

.enlarged-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.button-container {
  margin-right: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: flex-end;
  // z-index: 2;
}

.modal-close-btn,
.download-btn {
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem auto;
}

.markdown_message {
  padding-left: 0.8rem;
}

.upload-button {
  border-radius: 999px; /* Make it rounder */
}

.bg-accent {
  background-color: #f0f0f0; /* Change background color if needed */
}

.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

// .download-btn {
//   margin-left: 1rem;
// }
</style>

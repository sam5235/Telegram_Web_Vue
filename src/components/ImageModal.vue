<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, QRejectedEntry } from 'quasar';
import { create_chat_session_with_sub_tool, SubTools } from 'src/apis/chat';

import { useChat } from 'src/stores/chat-store';
import { storeToRefs } from 'pinia';
import { useTelegram } from 'src/stores/telegram';

const { isAssistantTyping } = storeToRefs(useChat());



const $q = useQuasar();

const { Chat } = useChat();

const { sub_tool_id, chat_session_id } = storeToRefs(useChat());

const router = useRouter();

interface Props {
  image_modal: boolean;
}

let props = defineProps<Props>();

const image_tools = ref<'edit' | 'describe'>('describe');
const image_modal = ref(props.image_modal);
const image_url = ref('');
const edit_description = ref('');

const { is_dark_theme } = useTelegram();

const file = ref<File | null>(null);
function onRejected(data: QRejectedEntry[]) {
  console.log(data);
  $q.notify({
    color: 'negative',
    message: 'error',
  });
}

async function uploadImage(image: File) {
  if (!image) return;
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'tools_image'); // Replace with your upload preset
  formData.append('cloud_name', 'afrochat'); // Replace with your cloud name
  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/afrochat/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    console.log(data.url);
    image_url.value = data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

function validateInputs() {
  if (image_url.value === '') {
    $q.notify({
      color: 'negative',
      message: 'Upload an Image first!',
    });
    return false;
  }

  if (image_tools.value === 'edit' && !edit_description.value) {
    $q.notify({
      color: 'negative',
      message: 'Please describe the edit information',
    });
    return false;
  }
  return true;
}

async function handleImageSubmit() {
  if (!validateInputs()) return;

  if (image_tools.value === 'describe') {
    if (chat_session_id.value === ''){
      router.push({
        name: 'chat',
        params: { id: SubTools.DescribeImage },
        query: {
          name: 'Describe Image',
          image:
            'https://res.cloudinary.com/afrochat/image/upload/v1699543455/imag.png',
        },
      });
    }

    isAssistantTyping.value = true;
    sub_tool_id.value = SubTools.DescribeImage;
    image_modal.value = !image_modal.value; 
      
    setTimeout(() => {
      const loadingIndicator: HTMLElement | null =
        document.getElementById('bottom-of-chat');
      loadingIndicator?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    
    await Chat(image_url.value).then(() => {
      isAssistantTyping.value = false;
    });

    

      
    } else if (image_tools.value === 'edit') {
      // TODO: maybe later
      const response = await create_chat_session_with_sub_tool(
        edit_description.value,
        SubTools.EditImage,
        'Gemini Pro',
        image_url.value
      );

    console.log(response.data);
  }
}

watchEffect(() => {
  image_modal.value = props.image_modal;
});

function editClicked() {
  console.log('Edit clicked');
  $q.notify({
    color: 'light-blue-8',
    message: 'Edit is not available yet!',
    timeout: 200,
  });
}
</script>

<template>
  <!-- Image modal -->
  <q-dialog class="image-modal" v-model="image_modal">
    <q-card
      style="min-width: 300px; border-radius: 4.4%"
      class="q-px-sm q-pb-md bg-secondary text-info"
    >
      <q-card-section>
        <q-radio
          @click="editClicked"
          :dark="is_dark_theme"
          v-model="image_tools"
          val="edit"
          label="Edit Image"
          disable
        />
        <q-radio
          :dark="is_dark_theme"
          v-model="image_tools"
          val="describe"
          label="Describe Image"
        />
      </q-card-section>

      <q-item-label header>Upload</q-item-label>
      <q-card-section>
        <q-file
          bg-color="primary"
          color="info"
          :dark="is_dark_theme"
          style="max-width: 300px"
          v-model="file"
          outlined
          accept="image/*"
          label="Max file size (2MB)"
          @rejected="onRejected"
          @update:model-value="uploadImage"
        />
      </q-card-section>

      <q-card-section v-if="image_tools === 'edit'">
        <q-input
          v-model="edit_description"
          filled
          clearable
          autogrow
          class="bg-primary"
          label="Describe the edit information"
        />
      </q-card-section>

      <q-card-section v-if="image_url">
        <q-img
          :src="image_url"
          spinner-color="info"
          style="max-width: 100%; object-fit: cover"
        />
      </q-card-section>

      <q-card-actions class="bottom-card-action">
        <q-btn
          flat
          label="Cancel"
          class="bg-warning text-info"
          @click="() => (image_modal = false)"
        />
        <q-btn
          flat
          label="Submit"
          class="bg-accent text-info"
          @click="handleImageSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.bottom-card-action {
  display: flex;
  justify-content: space-around;
}
</style>

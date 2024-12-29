<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTool } from 'stores/tool-store';
import { Tool, SubTool } from 'src/models/tool';
import { useRouter } from 'vue-router';
import { useChat } from 'src/stores/chat-store';
import { onMounted } from 'vue';
import { useTelegram } from 'stores/telegram';

const { webapp, is_dark_theme } = useTelegram();

const route = useRoute();
const { tools } = storeToRefs(useTool());
const { sub_tool_id: sub_tool_id_store } = storeToRefs(useChat());

const toolId = ref(route.query.tool_id);
const toolName = ref(route.query.tool_name);
const toolImage = ref(route.query.tool_image);
const router = useRouter();
const { ResetChat, Chat} = useChat();


const selectedTool: Tool | undefined = tools.value.find((tool: Tool) => tool.tool_id === toolId.value);
const subTools: SubTool[] = selectedTool ? selectedTool.sub_tools : [];
const selectedSubTool = ref<SubTool | null>(subTools.length > 0 ? subTools[0] : null);
const continueClicked = ref<boolean>(false);

const handleContinue = async () => {
  continueClicked.value = true
  ResetChat();

  const { sub_tool_id, sub_tool_name, sub_tool_image } = selectedSubTool.value || {};
  sub_tool_id_store.value = sub_tool_id || "";
  await Chat(textFieldInfo.value)
  router.push({
    name: 'chat',
    params: { id: sub_tool_id },
    query: {
      name: sub_tool_name,
      image: sub_tool_image },
  });

};

onMounted(() => {
  if (selectedTool==undefined){
    router.push({
      name:'tool'
    })
  }
  webapp.BackButton.hide()
});

const textFieldInfo = ref<string>('');
</script>

<template>
    <q-page >
    <!-- content -->

    <div >
      <!-- Toolbar -->
      <div class="toolbar bg-primary">
        <q-toolbar>

          <q-avatar>
            <img
              v-if="toolImage"
              :src="toolImage"
              :alt="toolName"
              style="object-fit: cover"
            />
            <span
              v-else
              class="text-info"
              style="width: 1rem; padding: 0.2rem"
              >{{ toolName }}</span
            >
          </q-avatar>
          <q-toolbar-title class="text-info">{{ toolName }}</q-toolbar-title>
        </q-toolbar>
      </div>
      <div>
    </div>

      <!-- END: Toolbar -->
    <div class="container" >
      <div class="dropdown-container" >
        <!-- Quasar Dropdown -->
        <q-select
          v-if="subTools && subTools.length > 0"
          v-model="selectedSubTool"
          :dark="is_dark_theme"
          label="Select Subtool"
          filled
          outlined
          :options="subTools"
          option-label="sub_tool_name"
          option-value="sub_tool_id"
          dense
          color="accent"
        />
        <div v-if="selectedSubTool" class="subtool-description bg-primary">
          <p class="text-info">{{ selectedSubTool.sub_tool_description }}</p>
        </div>
        <p v-else>No subtools available for this tool.</p>
      </div>

        <!-- Multiline Textfield below the subtool description -->
        <textarea
          :dark="is_dark_theme"
          v-model="textFieldInfo"
          placeholder="Write here..."
          class="custom-textarea bg-secondary text-info">
        </textarea>

        <!-- Continue button below the textfield -->
        <button @click="handleContinue" class="continue-button bg-accent" :disabled="continueClicked">
          <span v-if="continueClicked">Loading ...</span>
          <span v-else>Continue</span>
        </button>

    </div>
        </div>
   </q-page>
</template>


<style scoped lang="scss">


.container {
  display: flex;
  padding: 30px;
  flex-direction: column;
  height: 91vh;
}

.dropdown-container {
  margin-bottom: 20px;
  position: relative;

  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
  }

  .subtool-description {
    margin-top: 10px;

    p {
      margin-bottom: 10px;
    }
  }
}

.custom-textarea::placeholder {
  text-align: center;
  line-height: 46vh;
}

.custom-textarea {
  flex-grow: 1;
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem; /* Add margin at the bottom */
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
}

.continue-button {
  width: 100%;
  margin-top: 15px;
  padding: 10px 20px;

  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}


</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTool } from 'stores/tool-store';
import { storeToRefs } from 'pinia';
import ToolCard from 'components/ToolCard.vue';
import { useRouter } from 'vue-router';
import { useTelegram } from 'src/stores/telegram';
import { useChat } from 'src/stores/chat-store';

const isScrollEnd = ref<boolean>(false);
const searchQuery = ref<string>('');
const router = useRouter();

const { showBack, theme_data, enableCloseConfirm } = useTelegram();
const { tools, meta_data, is_loading } = storeToRefs(
  useTool()
);

const {
  reset,
  getTools,
  searchPaginate,
} = useTool();

const { ResetChat } = useChat();

async function onLoad(index: number, done: () => void) {
  // fetch and set tools

  await searchPaginate(searchQuery.value).then(
    () => {
      done();
      if (
        meta_data.value.returned < meta_data.value.limit ||
        meta_data.value.returned === meta_data.value.total
      ) {
        isScrollEnd.value = true;
      }
    }
  );
  return;
}

const toolClicked = (
  tool_id: string,
  tool_name: string,
  tool_image: string,
) => {
  ResetChat();
  router.push({
    name: 'sub_tool',
    query: {
      tool_name,
      tool_image,
      tool_id,
    },
  });
};


onMounted(async () => {
  showBack();
  enableCloseConfirm();
  await reset();
  isScrollEnd.value = false;
  await getTools();
  console.log('tool page mounted');
});
</script>
<template>
  <q-page class="bg-secondary">
    <div class="q-pa-md bg-secondary">
      <div class="header-section text-info">

        <div class="toolbar-container">
          <q-toolbar>
            <q-btn
              dense
              round
              icon="history"
              class="text-warning bg-primary"
              @click="router.push({name: 'chat-history'})"
            />
            <q-toolbar-title class="text-info">
              <h4>Explore Tools</h4>
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>
    </div>

    <!--   Tool card container     -->
    <q-infinite-scroll
      class="tool-card-container"
      @load="onLoad"
      :offset="250"
      debounce="500"
      :disable="isScrollEnd"
    >
      <ToolCard
        v-if="tools.length"
        :tools="tools"
        :tool-clicked="toolClicked"
      />

      <div class="no-result" v-else-if="tools.length == 0 && !is_loading">
        <svg
          width="246"
          height="210"
          viewBox="0 0 246 210"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M205.598 58.4287L104.823 86.8584L139.444 209.487L240.219 181.057L205.598 58.4287Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M220.098 55.6367H146.388V184.293H245.847V81.9519L220.105 55.6367H220.098Z"
            fill="url(#paint0_linear_3471_61947)"
          />
          <path
            d="M218.362 62.2305V91.0878L245.674 81.9454L221.799 83.3157L218.362 62.2305Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M146.381 183.678L245.926 103.223L245.84 183.678"
            :fill="theme_data.button_color"
          />
          <path
            d="M198.746 148.763H161.302V156.654H198.746V148.763Z"
            fill="white"
          />
          <path
            d="M215.707 134.146H161.302V142.043H215.707V134.146Z"
            fill="white"
          />
          <path
            d="M215.707 117.913H161.302V125.811H215.707V117.913Z"
            fill="white"
          />
          <path
            d="M184.157 55.4512C178.845 99.7931 147.778 126.724 111.029 126.724C109.44 126.724 107.764 125.976 105.777 125.877V133.046C107.764 133.139 109.44 133.88 111.029 133.88C151.745 133.88 184.852 103.686 190.249 55.9609L184.157 55.4512Z"
            fill="white"
          />
          <path
            d="M49.2393 121.977L58.3918 114.331L63.9018 121.282L52.4645 129.081L49.2393 121.977Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M14.0795 168.074L60.0142 131.22C56.491 119.469 48.2855 116.357 48.2855 116.357L1.53613 152.987C5.03952 155.066 10.6026 158.945 14.0861 168.074H14.0795Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M179.978 29.6528C163.626 -0.296931 121.844 -9.00246 86.6579 10.1961C51.4717 29.3946 36.2064 69.2348 52.5578 99.1779C68.9025 129.128 110.692 137.84 145.878 118.635C181.057 99.4427 196.329 59.6024 179.978 29.6528ZM140.162 108.797C110.168 125.162 74.7636 118.105 61.0745 93.0277C47.3855 67.9505 60.5977 34.3663 90.5851 18.0012C120.579 1.64278 155.984 8.69327 169.673 33.7639C183.362 58.8411 170.15 92.4319 140.156 108.79L140.162 108.797Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M93.3466 26.1573C122.466 10.6396 157.057 17.7166 170.607 41.9729C171.07 42.8004 171.494 43.6345 171.898 44.4753C171.03 41.6088 169.858 38.7952 168.348 36.0942C154.798 11.8378 120.069 4.8403 90.7837 20.4507C61.4982 36.0611 48.743 68.3675 62.293 92.6239C62.5777 93.127 62.8758 93.6103 63.1804 94.0935C53.0676 70.4132 65.8295 40.821 93.3466 26.1573Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M188.554 50.1689C191.792 76.8747 175.825 106.109 146.831 121.932C111.777 141.057 70.5311 133.596 52.6963 105.56C53.4579 107.361 54.1864 109.208 55.2526 110.889C74.465 140.998 114.42 150.445 150.056 131.001C182.202 113.458 198.772 80.582 188.554 50.1689Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M0 153.755C0 153.755 9.67571 159.667 12.1725 168.697C12.1725 168.697 4.36434 167.498 0 153.755Z"
            :fill="theme_data.button_color"
          />
          <path
            d="M166.759 41.9531C155.553 20.3978 123.93 14.6317 96.1349 29.0769C68.3396 43.5221 54.889 72.6972 66.0945 94.2525C77.3001 115.808 108.923 121.574 136.719 107.129C164.514 92.6902 177.965 63.5084 166.759 41.9531Z"
            fill="url(#paint1_radial_3471_61947)"
          />
          <path
            opacity="0.5"
            d="M140.043 96.1985L151.705 35.1406C151.705 35.1406 180.11 63.2896 140.043 96.1985Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_3471_61947"
              x1="208.826"
              y1="84.8648"
              x2="160.367"
              y2="218.71"
              gradientUnits="userSpaceOnUse"
            >
              <stop :stop-color="theme_data.button_color" />
              <stop offset="1" :stop-color="theme_data.button_color" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_3471_61947"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(142.917 35.664) scale(50.776 50.7569)"
            >
              <stop :stop-color="theme_data.button_color" />
              <stop
                offset="1"
                :stop-color="theme_data.button_color"
                stop-opacity="0"
              />
            </radialGradient>
          </defs>
        </svg>
        <h4 class="text-accent q-mt-xl">No Result Found</h4>
      </div>

      <template v-slot:loading>
        <div class="loader-container">
          <q-spinner-dots class="loader" color="accent" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <!--    END: Tool card container    -->
  </q-page>
</template>

<style scoped lang="scss">
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.toolbar-container {
  width: 100%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
form {
  background: grey;
  border-radius: 25px;
  position: relative;
}
input {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 10px;
  font-size: 17px;
  padding: 8px 10px 8px 30px;
  border: none;
}
input:focus {
  outline: none;
}

button {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 18px;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.loader {
  margin: 0 9rem;
}

.tool-card-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  scroll-behavior: smooth;
  // margin-top: 2rem;
  padding: 1rem;
}

.loader-container {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem auto;
}

.header-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toolbar > h4 {
  font-family: Inter, serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 62px;
  letter-spacing: 0;
  text-align: left;

  color: #f9ffff;
}

.toolbar > h4 {
  font-family: Inter, serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 62px;
  letter-spacing: 0;
  text-align: left;
}

.search-query {
  font-family: Inter, serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 29px;
  letter-spacing: 0;
  text-align: left;
  padding: 0.2rem 0;
  border-radius: 16px;

  gap: 280px;
}

.category-chip {
  display: inline-block;
  border-radius: 100px;
  border: 1px solid rgba(22, 21, 21, 0.3);
  padding: 0.2rem 20px 0 20px;
  height: 31px;
  gap: 10px;
  margin: 0.3rem;
  cursor: pointer;
}
</style>

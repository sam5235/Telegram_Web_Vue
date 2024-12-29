<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useTelegram } from 'stores/telegram';
import { storeToRefs } from 'pinia';
import { useChatHistory } from 'stores/history-store';
import { date } from 'quasar';
import addToDate = date.addToDate;
import { ChatSession } from 'src/models/chatSession';
import { useChat } from 'stores/chat-store';
import { useRouter } from 'vue-router';
import {
  ErrorNotification,
  SuccessNotification,
} from 'src/services/Notification';

const { showBack, theme_data, webapp } = useTelegram();

const { chat_sessions, is_loading, search_text, meta_data } = storeToRefs(
  useChatHistory()
);
const {
  paginate,
  reset_chat_history,
  searchChatSessions,
  getChatSessions,
  deleteChatSession,
} = useChatHistory();

const isScrollEnd = computed(
  () =>
    meta_data.value.returned < meta_data.value.limit ||
    meta_data.value.returned === meta_data.value.total
);

const { ResetChat } = useChat();
const router = useRouter();

async function confirm(chat_session_id: string, reset: () => void) {
  webapp.showConfirm(
    'Are you sure you want to delete?',
    (confirmed: boolean) => {
      if (confirmed) {
        handleDeleteChatSession(chat_session_id, reset)
          .then(() => SuccessNotification('Chat session deleted'))
          .catch(() => ErrorNotification('Failed to delete chat session'));
      } else {
        reset();
      }
    }
  );
}

function handleItemClick(chat_session: ChatSession) {
  console.log(
    chat_session.id,
    ' of the type ',
    chat_session.data.chat_session_type
  );
  ResetChat();

  router.push({
    name: 'chat',
    params: {
      id:
        chat_session.data.chat_session_type == 'Persona'
          ? chat_session.persona_id
          : chat_session.sub_tool_id,
    },
    query: {
      name: chat_session.data.name,
      image: chat_session.data.picture,
      session_id: chat_session.id,
    },
  });
}

async function handleDeleteChatSession(
  chat_session_id: string,
  reset: () => void
) {
  console.log(chat_session_id);
  // FIXME: save the chat session to be deleted and restore it if the deletion fails
  chat_sessions.value = chat_sessions.value.filter(
    (chat_session: ChatSession) => chat_session.id !== chat_session_id
  );
  deleteChatSession(chat_session_id).finally(() => {
    reset();
  });
}

async function onLoad(index: number, done: () => void) {
  // check if there is more data to load
  if (isScrollEnd.value) {
    done();
    return;
  }
  // simulate an async operation with a setTimeout
  await paginate().then(() => {
    done();
  });
}

function getReadableDateTime(dt: string): string {
  /*
  Converts a datetime string to a human-readable format.

    Args:
  dt: A datetime string

    Returns:
  A human-readable string representing the datetime
  */

  // Parse the input datetime string
  const utcDT = new Date(dt);
  // Get the user's timezone offset
  const userTimezoneOffset = new Date().getTimezoneOffset(); // Minutes difference from UTC
  // Adjust the parsed date to the user's timezone
  const parsedDt = addToDate(utcDT, { minutes: -userTimezoneOffset });

  // Get the current date and time, in the user's timezone
  const now = new Date();
  now.setMinutes(now.getMinutes() - userTimezoneOffset);

  // Determine the appropriate format based on the time difference
  if (parsedDt.toDateString() === now.toDateString()) {
    // If it's today, show the time in 12-hour format with AM/PM
    return parsedDt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
  } else if (parsedDt > addToDate(now, { days: -7 })) {
    // If it's within the last week, show the day of the week
    return parsedDt.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    // Otherwise, show the month and day
    return parsedDt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}

async function handleSearch() {
  await searchChatSessions();
}

onMounted(async () => {
  showBack();
  await reset_chat_history();
  await getChatSessions();
});

let debounceTimeoutID: ReturnType<typeof setTimeout> | null = null;
watch(search_text, async (newVal, oldVal) => {
  if (newVal === oldVal) {
    return;
  }

  // Clear the previous timeout if it exists
  if (debounceTimeoutID) {
    clearTimeout(debounceTimeoutID);
  }

  // Set a new timeout to search after 300ms
  debounceTimeoutID = setTimeout(async () => {
    await searchChatSessions();
  }, 300);
});
</script>

<template>
  <q-page class="bg-secondary page_container">
    <!-- Toolbar -->
    <div class="toolbar text-info">
      <h4>Chat History</h4>
      <div class="scroll-sticky">
        <q-toolbar class="search_toolbar">
          <form>
            <input
              class="text-caption text-accent bg-primary"
              type="text"
              placeholder="Search..."
              v-model="search_text"
              @keydown.enter="handleSearch"
              @change="console.log('changed')"
            />
            <q-btn
              @click="handleSearch"
              icon="search"
              color="accent"
              flat
              rounded
              dense
              size="15px"
              :disable="is_loading"
              :loading="is_loading"
            ></q-btn>
          </form>
        </q-toolbar>
      </div>
    </div>
    <!-- END: Toolbar -->

    <q-infinite-scroll
      class="history_container"
      @load="onLoad"
      :offset="250"
      debounce="500"
      :disable="isScrollEnd"
    >
      <div v-if="chat_sessions.length">
        <q-list
          class="history_list rounded-borders"
          style="width: 100%; padding: 0; margin: 0"
          v-for="chat_session in chat_sessions"
          :key="chat_session.id"
        >
          <q-slide-item
            @right="({ reset }) => confirm(chat_session.id, reset)"
            right-color="red"
            class="bg-primary slide_item"
          >
            <template v-slot:right>
              <span class="slider_text">Delete |</span>
              <q-icon name="archive" />
            </template>
            <q-item
              class="history_item bg-primary"
              clickable
              v-ripple
              @click="() => handleItemClick(chat_session)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    style="object-fit: cover"
                    :src="chat_session.data.picture"
                    alt="avatar"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-info">{{
                  chat_session.data.name
                }}</q-item-label>
                <q-item-label class="text-warning" caption lines="2">
                  {{ chat_session.first_message }}
                </q-item-label>
              </q-item-section>

              <q-item-section class="text" side bottom>
                {{ getReadableDateTime(chat_session.updated_at) }}
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </div>

      <div
        class="no-result"
        v-else-if="chat_sessions.length == 0 && !is_loading"
      >
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

.slide_item {
  border-radius: 1rem;

  margin: 0.4rem 1rem 0.3rem 1rem;
}

.history_item {
  // pass
}

.history_list {
  margin-bottom: 1rem;
}

.search_toolbar {
  width: 100%;
  padding: 0;
  margin: 0;
  position: sticky !important;
  top: 0 !important;
}

.scroll-sticky {
  display: block;
}

.history_container {
  width: 100%;
  scroll-behavior: smooth;
  display: block;
}

.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem auto;
}

.page_container {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: scroll;
}

.toolbar {
  padding: 1rem;
  overflow: scroll;
}

.slider_text {
  font-weight: 600;
  font-size: 1.2em;
}

.pull_to_refresh_container {
  width: 100%;
  padding: 0;
  margin: 0;
}

form {
  width: 100%;
  border-radius: 25px;
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

.toolbar > h4 {
  font-family: Inter, serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 62px;
  letter-spacing: 0;
  text-align: left;
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
</style>

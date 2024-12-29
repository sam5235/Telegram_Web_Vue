<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCounterStore } from 'src/stores/example-store';
import { useTelegram } from 'src/stores/telegram';
import { checkUserNameExists } from 'src/apis/auth';
import { ErrorNotification } from 'src/services/Notification';
import { useRouter } from 'vue-router';
import { useQuasar, LocalStorage } from 'quasar';
import { User } from 'src/models/user';

const router = useRouter();
const $q = useQuasar();
const {} = useCounterStore();
const {
  user,
  showMainButton,
  hideMainButton,
  webapp,
  theme_data,
  is_dark_theme,
  login,
} = useTelegram();

const validateEmail = (email: string) => {
  const bool = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  console.log(bool);
  return bool != null;
};

const username = ref<string>(user?.username || '');
const is_username_valid = ref<boolean>(false);
const is_loading = ref<boolean>(false);
const checkUsername = async (username: string) => {
  if (username === '') {
    return 'Username is required';
  }
  is_loading.value = true;
  await checkUserNameExists(username)
    .then((res) => {
      console.log('res', res);
      if (res.data.is_available) {
        is_username_valid.value = true;
        return true;
      }
      is_username_valid.value = false;
      return false;
    })
    .catch((err) => {
      console.log('err', err);
      is_username_valid.value = false;
      return false;
    });
  is_loading.value = false;
  return is_username_valid.value || 'Username is already taken';
};
// add computed property to check if the password and confirm password are the same

onMounted(async () => {
  // check if phone number exists inside the database and if it doesn't log app not found

  showMainButton('Sign up', () => {
    if (username.value === '') {
      ErrorNotification('Username is required');
      return;
    }
    if (!is_username_valid.value) {
      ErrorNotification('Username is already taken');
      return;
    }
    login(username.value)
      .then((response) => {
        if (response?.status != 200) {
          // webapp.close();
          return;
        }
        console.log(response?.data);
        if (!response?.data?.access_token) {
          console.log('no token');
          router.push({
            name: 'signup',
          });
          return;
        }
        console.log('got token', response?.data?.access_token);
        console.log('got response from login', response);
        const user: User = response.data.user;
        LocalStorage.set('user', user);
        LocalStorage.set('access_token', response.data.access_token);
        router.push({
          name: 'landing',
        });
      })
      .catch((error) => {
        console.log(error.response?.data?.detail);
      })
      .finally(() => {
        hideMainButton();
        $q.loading.hide();
      });
  });
  setTimeout(() => {
    checkUsername(username.value);
  }, 500);

  // signUpUser(
  //   username.value,
  //   phone_number.value,
  //   email_address.value,
  //   password.value,
  //   user.id.toString()
  // )
  //   .then((res) => {
  //     console.log('res', res);
  //     if (res.status === 200) {
  //       SuccessNotification('User Created Successfully');
  //       hideMainButton();
  //       router.push({
  //         name: 'home',
  //       });
  //       return;
  //     } else {
  //       ErrorNotification('Error Creating User');
  //     }
  //   })
  //   .catch((err) => {
  //     console.log('err', err);
  //     ErrorNotification('Error Creating User');
  //   });
});
</script>

<template>
  <q-page class="field bg-secondary">
    <svg
      width="177"
      height="175"
      viewBox="0 0 77 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M76.4986 32.647C76.083 35.0711 76.4342 37.0595 76.992 38.8963L77.0025 38.8858C76.3285 42.1846 76.0157 45.3866 75.8284 48.4544C74.4964 50.5116 73.8399 52.6488 73.6519 54.7771C71.9935 56.3515 71.2273 58.1674 70.8098 60.0462C68.6655 61.0642 68.3839 62.4201 68.1199 63.7346C65.8172 65.1716 64.2948 66.9162 63.1778 68.7403C60.9932 69.3037 59.4318 70.6255 58.194 72.3134C56.4445 72.5815 55.1343 73.3254 54.1788 74.4204C50.0916 76.2646 45.483 73.2612 45.483 68.7403V64.8201C45.483 61.6903 47.9958 59.1612 51.0821 59.1612L52.865 59.1822C58.5788 59.1822 63.1665 54.3136 62.7911 48.4544C62.447 43.101 57.8176 39.0649 52.521 39.0649H39.884H36.3181H23.6812C18.3845 39.0649 13.7551 43.1116 13.411 48.4544C13.0357 54.3136 17.6233 59.1822 23.3371 59.1822L25.12 59.1612C28.2167 59.1612 30.7191 61.7008 30.7191 64.8201V68.3926C30.7191 72.9556 26.0167 76.0011 21.9503 74.041C20.9905 73.3476 19.9085 72.8033 18.7598 72.3134C17.8717 71.1757 16.4564 70.293 14.753 69.5306C13.3958 68.1849 11.997 66.8063 10.4186 65.5222C9.18799 63.6219 6.17199 60.0462 6.17199 60.0462L3.33498 54.7771L1.16185 48.4544L0.35044 44.239C0.35044 44.239 1.07944 40.0671 0 37.9161C0.00752984 37.6008 0.0337567 36.9678 0.0337567 36.9678C0.492435 35.5887 0.482917 32.647 0.482917 32.647L1.71567 27.378L3.77781 22.1089C3.77781 22.1089 5.80026 19.4622 6.12311 17.8936C7.3411 17.2625 8.37422 14.7322 8.37422 14.7322L12.2283 10.5169C12.2283 10.5169 14.9724 6.95205 17.5388 6.30168C19.2065 5.87906 20.5322 5.3573 21.8878 3.81651C23.1292 3.5944 25.0158 2.45937 25.0158 2.45937C25.0158 2.45937 26.9999 1.30207 27.1011 1.7325C27.2022 2.16293 30.229 0.889697 30.229 0.889697L33.357 0.327651L37.3086 0L43.6525 0.327651C43.6525 0.327651 48.2638 1.1236 51.0821 2.10823C52.6253 2.6474 53.9256 3.34857 55.1331 3.9997C56.1909 4.57015 57.1776 5.10219 58.194 5.45324C59.8937 8.44754 60.8789 8.49193 61.8045 8.53365C62.1312 8.54837 62.4504 8.56276 62.7911 8.7064C64.3587 11.2391 65.4482 11.9134 66.4377 12.5258C66.7534 12.7212 67.059 12.9103 67.3667 13.1515C69.0716 18.1976 69.9203 18.3503 70.6656 18.4843C70.9635 18.5379 71.2449 18.5885 71.5578 18.9475C71.9818 22.0492 72.7219 22.7324 73.4088 23.3664C73.6743 23.6115 73.9318 23.8493 74.1601 24.2165C74.7057 28.0481 75.576 30.7059 76.4986 32.647ZM23.9311 42.7217H52.8543C56.4202 42.7217 59.3083 45.6407 59.3083 49.2448C59.3083 52.8488 56.4202 55.7679 52.8543 55.7679H23.9311C20.3652 55.7679 17.4771 52.8488 17.4771 49.2448C17.4771 45.6407 20.3652 42.7217 23.9311 42.7217ZM21.4079 49.2343C21.4079 51.521 23.2325 53.3652 25.4846 53.3652C27.7368 53.3652 29.5614 51.5105 29.5614 49.2343C29.5614 46.958 27.7368 45.1138 25.4846 45.1138C23.2325 45.1138 21.4079 46.9475 21.4079 49.2343ZM46.4733 49.2343C46.4733 51.521 48.2979 53.3652 50.55 53.3652C52.8126 53.3652 54.6372 51.5105 54.6372 49.2343C54.6372 46.958 52.8022 45.1138 50.55 45.1138C48.2979 45.1138 46.4733 46.9475 46.4733 49.2343Z"
        :fill="theme_data.button_color"
      />
    </svg>

    <h3 class="text-accent">Sign up</h3>
    <div class="form-fields">
      <q-input
        style="width: 300px"
        :label-color="theme_data.text_color"
        :dark="is_dark_theme"
        rounded
        outlined
        v-model="username"
        label="User Name"
        color="accent"
        debounce="500"
        :loading="is_loading"
        :rules="[(val) => checkUsername(val)]"
      >
        <template v-slot:prepend>
          <q-icon name="account_circle" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.form-fields {
  padding-top: 20px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
}

// select the last component inside the form-fields
.form-fields > *:last-child {
  margin-top: -15px;
}
.btn {
  background-color: 'red' !important;
}
.text-brand {
  color: #a2aa33 !important;
}
.bg-brand {
  background: #a2aa33 !important;
}
.input_class {
  color: #a2aa33;
}

.field {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

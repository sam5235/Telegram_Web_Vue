import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { TelegramWebApps } from 'telegram-webapps-types-new';
import { checkTelegramAuth, telegramLogin } from 'src/apis/auth';
import { useQuasar } from 'quasar';
import { setCssVar } from 'quasar';

import WebApp from '@twa-dev/sdk';
declare global {
  interface Window {
    Telegram: TelegramWebApps.SDK;
  }
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  username?: string;
  full_name: string;
}

export interface TelegramWebAppLoginSchema {
  telegram_user: TelegramUser;
  hash_str: string;
  initData: string;
}

export const useTelegram = defineStore('telegramStore', () => {
  const webapp = WebApp;
  const $q = useQuasar();

  webapp.expand();
  webapp.ready();
  const is_dark_theme: boolean = webapp.colorScheme === 'dark';
  const router = useRouter();
  const token = ref();
  const user = webapp.initDataUnsafe.user;
  const theme_data = webapp.themeParams;

  setCssVar('primary', theme_data.bg_color || '#ffffff');
  setCssVar('secondary', theme_data.secondary_bg_color || '#efeff3');
  setCssVar('accent', theme_data.button_color || '#ff7519');
  setCssVar('info', theme_data.text_color || '#000000');
  setCssVar('warning', theme_data.hint_color || '#999999');

  const mainButton = webapp.MainButton;
  function enableCloseConfirm() {
    webapp.enableClosingConfirmation();
  }

  function disableCloseConfirm() {
    webapp.disableClosingConfirmation();
  }

  webapp.BackButton.onClick(() => {
    if (window.history.length) {
      router.go(-1);
    } else {
      router.push({ name: 'index' });
    }
  });

  const showBack = () => {
    webapp.BackButton.show();
  };

  const hideBack = () => {
    webapp.BackButton.hide();
  };
  webapp.BackButton.onClick(() => {
    router.back();
  });
  const showMainButton = (text: string, fn: () => void) => {
    mainButton.show();
    mainButton.text = text; // get the text
    mainButton.enable(); // enable
    mainButton.onClick(fn);
  };

  const disableMainButton = () => {
    mainButton.disable();
  };

  const hideMainButton = () => {
    mainButton.isVisible = false;
  };

  const confirm = (fn: () => void) => {
    webapp.showConfirm('Are you sure?', (agree: boolean) => {
      if (agree) {
        fn();
      }
    });
  };

  const showAlert = function (text: string) {
    webapp.showAlert(text);
  };
  const requestUsersContact = () => {
    // webapp.requestContact((res: boolean) => {
    //   console.log(res);
    // });
  };
  const close_app = () => {
    // webapp.close();
  };

  // async auth
  async function auth() {
    console.log('sending request');
    if (!webapp.initDataUnsafe.hash) {
      console.log('no hash closing app');
      // webapp.close();
      return;
    }

    $q.loading.show();
    await checkTelegramAuth(webapp.initDataUnsafe.hash, webapp.initData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        webapp.showAlert('Error');
      })
      .finally(() => {
        $q.loading.hide();
      });
  }

  // FIXME we can merge the auth and login in to one function
  const login = async (username: string | undefined = undefined) => {
    // FIXME: enable this function before production
    if (!webapp.initDataUnsafe.hash) {
      console.log('no hash closing app');
      // webapp.close();
      return;
    }
    $q.loading.show({
      message: 'Checking User Authentication...',
    });

    const telegramUser: TelegramUser = {
      // id: webapp.initDataUnsafe.user.id,
      id: webapp.initDataUnsafe.user?.id || -1,
      is_bot: webapp.initDataUnsafe.user?.is_bot || false,
      username: username,
      full_name:
        webapp.initDataUnsafe.user?.first_name +
        ' ' +
        webapp.initDataUnsafe.user?.last_name,
    };

    return telegramLogin({
      telegram_user: telegramUser,
      hash_str: webapp.initDataUnsafe.hash,
      initData: webapp.initData,
    });
  };

  return {
    user,
    showAlert,
    showMainButton,
    theme_data,
    requestUsersContact,
    webapp,
    showBack,
    hideBack,
    confirm,
    enableCloseConfirm,
    disableCloseConfirm,
    hideMainButton,
    disableMainButton,
    token,
    close_app,
    auth,
    mainButton,
    is_dark_theme,
    login,
  };
});

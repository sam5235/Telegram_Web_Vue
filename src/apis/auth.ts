import { api } from 'src/boot/axios';
import { TelegramWebAppLoginSchema } from 'stores/telegram';

const checkTelegramAuth = async (hash_str: string, initData: string) => {
  return await api.post('/auth/check_telegram_hash', {
    hash_str,
    initData,
  });
};

const telegramLogin = async (data: TelegramWebAppLoginSchema) => {
  return await api.post('/auth/telegram_signin', data);
};

const checkUserNameExists = async (username: string) => {
  return await api.get('/auth/username/' + username);
};

export { checkTelegramAuth, telegramLogin, checkUserNameExists };

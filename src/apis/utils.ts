import { api } from 'src/boot/axios';

/**
 * Sends a message with the provided data to the Telegram API.
 * @param hash_str - The hash string.
 * @param initData - The initial data.
 * @param telegram_user - The Telegram user object.
 * @param image_url - The URL of the image.
 * @returns A promise that resolves to the response from the API.
 */
const sendMessageBackend = async (
  hash_str: string,
  initData: string,
  telegram_user: any,
  image_url: string
) => {
  console.log('before request', telegram_user);
  /*

  {
  "telegram_schema": {
    "hash_str": "string",
    "initData": "string",
    "telegram_user": {
      "id": 0,
      "first_name": "string",
      "last_name": "string",
      "username": "string",
      "language_code": "string",
      "allows_write_to_pm": true
    }
  },
  "image_url": "https://example.com/"
}
  */
  return await api.post('/image/send_image', {
    telegram_schema: {
      hash_str,
      initData,
      telegram_user,
    },
    image_url,
  });
};

export { sendMessageBackend };

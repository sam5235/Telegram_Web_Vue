import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  Logout,
  setAccessToken,
  setRefreshToken,
} from 'src/services/Auth';
import { generateToken } from 'src/services/Api_Token';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = 'https://afrochat-bot-telegram-ij7jnmwh2q-zf.a.run.app/api_v1/';
// const baseURL = 'http://localhost:8000/api_v1/';
const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(async (config) => {
  config.headers['Authorization'] = `Bearer ${getAccessToken()}`;
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-API-TOKEN'] = `${await generateToken()}`
  return config;
});

api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return new Promise((resolve) => {
      resolve(response);
    });
  },
  async function (error) {
    const response = error.response;
    // if it's a 401 error then try to get a new access_token and retry the request
    if (response.status == 401 && !response.config.url.includes('login')) {
      // get request from example.com from example.com
      try {
        const Newresponse = await axios.post(
          `${baseURL}auth/refresh_token`,
          '',
          {
            headers: {
              accept: 'application/json',
              'refresh-token': getRefreshToken().toString(),
              'content-type': 'application/x-www-form-urlencoded',
            },
          }
        );
        if (Newresponse?.status == 200) {
          setAccessToken(Newresponse.data.access_token);
          return await api.request(response.config);
        }
      } catch (e) {
        Logout();
        return;
      }
    }
    if (
      error.response.status == 401 &&
      !response.config.url.includes('login')
    ) {
      Logout();
      return;
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

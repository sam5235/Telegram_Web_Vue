import { LocalStorage } from 'quasar';
import { my_router } from 'src/boot/router';
import { User } from 'src/models/user';
const getAccessToken = () => {
  return LocalStorage.getItem('access_token') || '';
};

const setUserData = (user: User) => {
  LocalStorage.set('user', user);
};

const getUserData = () => {
  return LocalStorage.getItem('user');
};

const setAccessToken = (token: string) => {
  LocalStorage.set('access_token', token);
};

const getRefreshToken = () => {
  return LocalStorage.getItem('refresh_token') || '';
};
const setRefreshToken = (token: string) => {
  LocalStorage.set('refresh_token', token);
};

const isLoggedIn = () => {
  return !!getAccessToken();
};
const getRole = () => {
  null;
};

const getUser = () => {
  return LocalStorage.getItem('user');
};
const Logout = () => {
  LocalStorage.remove('access_token');
  LocalStorage.remove('refresh_token');
  LocalStorage.remove('user');
  my_router.push({ name: 'login' });
};
export {
  getAccessToken,
  isLoggedIn,
  Logout,
  getUser,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setUserData,
  getUserData,
};

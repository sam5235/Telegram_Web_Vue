import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MainPage.vue') },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('pages/Auth/SignUpPage.vue'),
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/MainPage.vue'),
      },
      {
        path: 'persona',
        name: 'persona',
        component: () => import('pages/PersonaPage.vue'),
      },
      {
        path: 'persona/profile/:id',
        name: 'profile',
        component: () => import('pages/PersonaProfilePage.vue'),
      },
      {
        path: 'tool',
        name: 'tool',
        component: () => import('pages/ToolsPage.vue'),
      },
      {
        path: 'sub_tool',
        name: 'sub_tool',
        component: () => import('pages/SubToolPage.vue'),
      },
      {
        path: 'chat/:id',
        name: 'chat',
        component: () => import('pages/ChatPage.vue'),
      },
      {
        path: 'landing',
        name: 'landing',
        component: () => import('pages/ModelSelection.vue'),
        children: [
          {
            path: '',
            name: 'Home',
            component: () => import('pages/ModelLanding.vue'),
          },
          {
            path: 'response',
            name: 'response',
            component: () => import('pages/ResponsePage.vue'),
          },
          {
            path: 'explore',
            name: 'Explore',
            component: () => import('pages/ExplorePage.vue'),
          },
          {
            path: 'chat-history',
            name: 'History',
            component: () => import('pages/ChatSessionHistoryPage.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/comingsoon',
    component: () => import('pages/ComingSoon.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

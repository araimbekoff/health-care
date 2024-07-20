import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/patient', component: () => import('pages/PatientPage.vue') }
    ]
  },

  // Test components
  {
    path: '/sandbox',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'patient', component: () => import('pages/PatientPage.vue') },
      {
        path: 'TopNavBarTestView',
        component: () => import('../sandbox/TopNavBarTestView.vue')
      }, {
        path: 'ProjectsListTestView',
        component: () => import('../sandbox/ProjectsListTestView.vue')
      }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;

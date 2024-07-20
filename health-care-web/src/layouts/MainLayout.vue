<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface EssentialLink {
  title: string;
  caption: string;
  icon: string;
  link: string;
}

const essentialLinks: EssentialLink[] = [
  {
    title: 'Home',
    caption: 'Dashboard',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Patients',
    caption: 'Manage patients',
    icon: 'people',
    link: '/patients'
  },
  {
    title: 'Documents',
    caption: 'Medical records',
    icon: 'description',
    link: '/documents'
  },
  {
    title: 'Report',
    caption: 'Generate reports',
    icon: 'assessment',
    link: '/report'
  },
  {
    title: 'Payments',
    caption: 'Billing and payments',
    icon: 'payments',
    link: '/payments'
  },
  {
    title: 'Settings',
    caption: 'App configuration',
    icon: 'settings',
    link: '/settings'
  }
];

const leftDrawerOpen = ref(false);
const router = useRouter();

// useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function navigateTo(link: string) {
  router.push(link);
  if (leftDrawerOpen.value) {
    leftDrawerOpen.value = false;
  }
}

const search = ref<string>('');
const logout = () => {
  console.log('logout');
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          MedExCRM
        </q-toolbar-title>

        <q-input dense standout="bg-primary text-white" v-model="search" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn flat round dense icon="notifications" class="q-ml-sm">
          <q-badge color="red" floating>2</q-badge>
        </q-btn>
        <q-btn flat round>
          <q-avatar size="26px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="navigateTo('/profile')">
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="navigateTo('/settings')">
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Menu
        </q-item-label>

        <q-item
          v-for="link in essentialLinks"
          :key="link.title"
          v-ripple
          clickable
          @click="navigateTo(link.link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.q-toolbar {
  height: 64px;
}

.q-avatar {
  width: 32px;
  height: 32px;
}
</style>

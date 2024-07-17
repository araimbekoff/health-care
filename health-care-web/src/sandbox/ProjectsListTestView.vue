<template>
  <div class="projects-list-test">
    <TopNavBar />
    <div class="content-area q-pa-md">
      <ProjectsList />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from '../components/TopNavBar.vue';
import ProjectsList from '../components/ProjectsList.vue';
</script>

<style scoped lang="scss">
.projects-list-test {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
</style>

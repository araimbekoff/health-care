<template>
  <div class="TopNavBar-test">
    <TopNavBar />
    <div class="content">
      <!-- Placeholder content -->
      <h2>Content Area</h2>
      <p>This is where the main content of the app would go.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNavBar from '../components/TopNavBar.vue'
</script>

<style scoped lang="scss">
.TopNavBar-test {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    padding: 20px;
  }
}
</style>

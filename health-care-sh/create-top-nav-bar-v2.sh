#!/bin/bash

# ... (предыдущий код остается без изменений)

cat > "$COMPONENT_FILE" << EOL
<template>
  <q-header class="bg-grey-2 text-black">
    <q-toolbar class="q-px-lg">
      <q-input 
        v-model="search" 
        dense 
        placeholder="Search" 
        class="q-mr-sm"
        style="width: 300px;"
        borderless
        bg-color="white"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn flat dense round icon="notifications" class="q-mr-sm">
        <q-badge color="red" floating>2</q-badge>
      </q-btn>
      <q-avatar size="32px">
        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
      </q-avatar>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
</script>

<style scoped lang="scss">
.q-header {
  border-bottom: 1px solid #e0e0e0;
}

.q-toolbar {
  height: 60px;
}

.q-input ::v-deep(.q-field__control) {
  border-radius: 4px;
}
</style>
EOL

# ... (остальной код остается без изменений)
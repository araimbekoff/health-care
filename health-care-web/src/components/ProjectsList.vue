<template>
  <div class="projects-list q-pa-md">
    <h5 class="q-mt-none q-mb-md">Пациенты</h5>
    <q-list bordered separator>
      <q-item v-for="patient in patients" :key="patient.id" clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ patient.name }}</q-item-label>
          <q-item-label caption>{{ patient.id }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round color="blue" icon="chevron_right" @click="viewDetails(patient.id)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Patient {
  id: string;
  name: string;
}

const patients = ref<Patient[]>([
  { id: 'P000001', name: 'Иванов Иван' },
  { id: 'P000002', name: 'Петрова Анна' },
  { id: 'P000003', name: 'Сидоров Алексей' }
]);

const viewDetails = (id: string) => {
  console.log('Просмотр деталей пациента:', id);
  // Здесь будет логика для перехода к деталям пациента
};
</script>

<style scoped lang="scss">
.projects-list {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
}

.q-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>

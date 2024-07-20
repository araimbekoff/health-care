<script setup lang="ts">
import { ref } from 'vue';
import { MedicalReportDto } from 'src/types/medicine-dto';

defineProps<{
  patientData: MedicalReportDto;
}>();

const expandedPanel = ref(true);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="patient-info-accordion q-pa-md">
    <q-expansion-item
      v-model="expandedPanel"
      group="patient-info"
      icon="person"
      label="Информация о пациенте"
      header-class="text-primary"
    >
      <q-card>
        <q-card-section>
          <div><strong>ФИО:</strong> {{ patientData.patient.fullName }}</div>
          <div><strong>Дата рождения:</strong> {{ formatDate(patientData.patient.dateOfBirth) }}</div>
          <div><strong>Пол:</strong> {{ patientData.patient.gender }}</div>
          <div><strong>Телефон:</strong> {{ patientData.patient.phone }}</div>
          <div><strong>Email:</strong> {{ patientData.patient.email }}</div>
          <div><strong>Адрес:</strong> {{ patientData.patient.address }}</div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      group="patient-info"
      icon="medical_services"
      label="Жалобы и диагнозы"
      header-class="text-primary"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Жалобы</div>
          <ul>
            <li v-for="(complaint, index) in patientData.complaints" :key="index">
              {{ complaint }}
            </li>
          </ul>
          <div class="text-h6 q-mt-md">Диагнозы</div>
          <ul>
            <li v-for="(diagnosis, index) in patientData.diagnoses" :key="index">
              {{ diagnosis.description }} ({{ diagnosis.type }})
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      group="patient-info"
      icon="monitor_heart"
      label="Показатели здоровья"
      header-class="text-primary"
    >
      <q-card>
        <q-card-section>
          <div v-for="(metric, index) in patientData.healthMetrics" :key="index">
            <strong>{{ metric.name }}</strong>
            <span v-if="metric.value"> - {{ metric.value }}</span>
            <span v-if="metric.unit"> {{ metric.unit }}</span>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      group="patient-info"
      icon="medication"
      label="Рекомендации"
      header-class="text-primary"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Медикаменты</div>
          <ul>
            <li v-for="(med, index) in patientData.recommendations.medication" :key="index">
              {{ med.name }} - {{ med.dosage }}, {{ med.frequency }}
            </li>
          </ul>
          <div class="text-h6 q-mt-md">Другие рекомендации</div>
          <ul>
            <li v-for="(rec, index) in patientData.recommendations.other" :key="index">
              {{ rec.name }} - {{ rec.frequency }}
            </li>
          </ul>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      group="patient-info"
      icon="event"
      label="Следующий прием"
      header-class="text-primary"
    >
      <q-card>
        <q-card-section>
          <div><strong>Дата:</strong> {{ formatDate(patientData.nextAppointment) }}</div>
          <div v-if="patientData.additionalNotes"><strong>Примечания:</strong> {{ patientData.additionalNotes }}</div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<style lang="scss" scoped>
.patient-info-accordion {
  .q-expansion-item {
    margin-bottom: 8px;
  }
}
</style>

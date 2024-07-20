<template>
  <q-page padding>
    <div v-if="loading">
      <q-spinner-dots size="40px" color="primary" />
      Loading patient data...
    </div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else-if="patientData" class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ patientData.patient.fullName }}</div>
            <q-space />
            <q-btn flat round icon="more_vert">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle2">
              {{ formatDate(patientData.patient.dateOfBirth) }} • {{ patientData.patient.gender }}
            </div>
            <div class="text-caption">
              {{ patientData.patient.phone }} • {{ patientData.patient.email }}
            </div>
          </q-card-section>

          <div class="q-pa-md">
            <h1 class="text-h4 q-mb-md">Информация о пациенте</h1>
            <PatientInfoAccordion v-if="patientData" :patientData="patientData" />
            <div v-else>Загрузка данных...</div>
          </div>

        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Actions</div>
          </q-card-section>
          <q-card-section class="q-gutter-sm">
            <q-btn color="primary" icon="add" label="New Appointment" />
            <q-btn color="secondary" icon="edit" label="Edit Patient" />
            <q-btn color="accent" icon="print" label="Print Report" />
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Timeline</div>
          </q-card-section>
          <q-card-section>
            <q-timeline color="secondary">
              <q-timeline-entry
                title="Next Appointment"
                subtitle="Follow-up"
                avatar="https://cdn.quasar.dev/img/avatar2.jpg"
              >
                <div>{{ formatDate(patientData.nextAppointment) }}</div>
              </q-timeline-entry>
              <q-timeline-entry
                title="Last Visit"
                subtitle="Check-up"
                avatar="https://cdn.quasar.dev/img/avatar3.jpg"
              >
                <div>{{ formatDate(patientData.doctor.appointmentDate) }}</div>
              </q-timeline-entry>
              <!-- Добавьте больше записей в timeline по необходимости -->
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { useRoute } from 'vue-router';
import { MedicalReportDto } from 'src/types/medicine-dto';
import { loadPatentData } from 'src/utils/loadData';
// import HealthMetrics from 'components/HealthMetrics.vue';
import PatientInfoAccordion from 'components/PatientInfoAccordion.vue';

// const route = useRoute();
const patientData = ref<MedicalReportDto | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// const tabs = [
//   { name: 'Overview', icon: 'dashboard' },
//   { name: 'Clinical data', icon: 'science' },
//   { name: 'Medications', icon: 'medication' },
//   { name: 'Care plans', icon: 'assignment' },
//   { name: 'Patient profile', icon: 'person' },
//   { name: 'Benefits', icon: 'health_and_safety' },
//   { name: 'Relationships', icon: 'people' },
//   { name: 'Unified health score', icon: 'favorite' },
//   { name: 'Schedule', icon: 'event' }
// ];

// const selectedTab = ref('Overview');

onMounted(async () => {
  try {
    // patientData.value = await loadData('openai-example-3-extraction.json');
    patientData.value = await loadPatentData('openai-example-2-extraction.json');
    loading.value = false;
  } catch (e) {
    error.value = 'Failed to load patient data';
    loading.value = false;
  }
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>


<style lang="scss" scoped>
// Add any custom styles here
</style>

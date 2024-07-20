<template>
  <div class="health-metrics q-pa-md">
    <div class="text-h6 q-mb-md">Last Measurements</div>
    <div class="row q-col-gutter-md">
      <div v-for="(metric, index) in latestMetrics" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card v-if="metric" flat bordered class="metric-card">
          <q-card-section>
            <div class="text-subtitle2">{{ metric.name }}</div>
            <div class="text-h5">{{ formatMetricValue(metric) }}</div>
            <div v-if="metric.date" class="text-caption">{{ new Date(metric.date).toLocaleDateString() }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { HealthMetricDto } from 'src/types/medicine-dto';

const props = defineProps<{
  metrics: HealthMetricDto[];
}>();

const formatMetricValue = (metric: HealthMetricDto) => {
  return `${metric.value}${metric.unit ? ' ' + metric.unit : ''}`;
};

const latestMetrics = computed(() => {
  const categories = ['Heart Rate', 'Blood Pressure', 'Weight', 'Height'];
  return categories.map(category => {
    return props.metrics.find(metric => metric.category.toLowerCase() === category.toLowerCase()) || null;
  });
});
</script>


<style lang="scss" scoped>
.health-metrics {
  .metric-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { HealthMetricDto } from 'src/types/medicine-dto';

const props = defineProps<{
  metrics: HealthMetricDto[];
}>();

const groupedMetrics = computed(() => {
  return props.metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, HealthMetricDto[]>);
});

const categoryTranslations: Record<string, string> = {
  'антропометрия': 'антропометрия',
  'жизненные показатели': 'жизненные показатели',
  'лабораторные результаты': 'лабораторные результаты'
};

const getMetricValue = (name: string): string => {
  const matches = name.match(/:\s*(.+)/);
  return matches ? matches[1] : name;
};

const getMetricName = (name: string): string => {
  return name.split(':')[0].trim();
};
</script>

<template>
  <div class="grouped-health-metrics q-pa-md">
    <div v-for="(metrics, category) in groupedMetrics" :key="category" class="q-mb-lg">
      <div class="text-h6 q-mb-md">{{ categoryTranslations[category] || category }}</div>
      <q-list bordered separator>
        <q-item v-for="metric in metrics" :key="metric.name">
          <q-item-section>
            <q-item-label>{{ getMetricName(metric.name) }}</q-item-label>
            <q-item-label caption>{{ getMetricValue(metric.name) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grouped-health-metrics {
  .q-item {
    padding: 12px 16px;
  }

  .q-item-label {
    font-size: 16px;
  }

  .q-item-label.caption {
    font-size: 18px;
    color: $primary;
    font-weight: bold;
  }
}
</style>

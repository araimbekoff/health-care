#!/bin/bash

# Определение корневой директории проекта
PROJECT_ROOT=$(pwd)

# Проверка, находимся ли мы в корне проекта
if [ ! -f "$PROJECT_ROOT/quasar.config.js" ]; then
    echo "Ошибка: Скрипт должен быть запущен из корневой директории проекта Quasar."
    exit 1
fi

# Создание компонента ProjectsList
COMPONENT_NAME="ProjectsList"
COMPONENT_FILE="$PROJECT_ROOT/src/components/${COMPONENT_NAME}.vue"
TEST_FILE="$PROJECT_ROOT/src/sandbox/${COMPONENT_NAME}TestView.vue"

# Создание компонента
mkdir -p "$PROJECT_ROOT/src/components"
cat > "$COMPONENT_FILE" << EOL
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
import { ref } from 'vue'

interface Patient {
  id: string;
  name: string;
}

const patients = ref<Patient[]>([
  { id: 'P000001', name: 'Иванов Иван' },
  { id: 'P000002', name: 'Петрова Анна' },
  { id: 'P000003', name: 'Сидоров Алексей' },
])

const viewDetails = (id: string) => {
  console.log('Просмотр деталей пациента:', id)
  // Здесь будет логика для перехода к деталям пациента
}
</script>

<style scoped lang="scss">
.projects-list {
  width: 300px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
}
</style>
EOL

echo "Компонент ${COMPONENT_NAME} создан в ${COMPONENT_FILE}"

# Создание тестового файла
mkdir -p "$PROJECT_ROOT/src/sandbox"
cat > "$TEST_FILE" << EOL
<template>
  <div class="projects-list-test">
    <ProjectsList />
  </div>
</template>

<script setup lang="ts">
import ProjectsList from '../components/ProjectsList.vue'
</script>

<style scoped lang="scss">
.projects-list-test {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-start;
}
</style>
EOL

echo "Тестовый файл для ${COMPONENT_NAME} создан в ${TEST_FILE}"

# Добавление маршрута для тестового представления
ROUTE_FILE="$PROJECT_ROOT/src/router/routes.ts"
NEW_ROUTE="      { path: '${COMPONENT_NAME}TestView', component: () => import('../sandbox/${COMPONENT_NAME}TestView.vue') },"

# Проверка наличия файла маршрутов
if [ ! -f "$ROUTE_FILE" ]; then
    echo "Ошибка: Файл маршрутов не найден в $ROUTE_FILE"
    exit 1
fi

# Добавление нового маршрута
sed -i "/path: '\/sandbox',/,/children:/s/children: \[/children: [\n${NEW_ROUTE}/" "$ROUTE_FILE"

echo "Маршрут для тестового представления ${COMPONENT_NAME} добавлен в $ROUTE_FILE"

echo "Компонент ${COMPONENT_NAME} и его тестовое представление успешно созданы."
echo "Вы можете просмотреть компонент, перейдя по адресу: http://localhost:9000/#/sandbox/${COMPONENT_NAME}TestView"
echo "Не забудьте запустить сервер разработки командой 'quasar dev', если он еще не запущен."

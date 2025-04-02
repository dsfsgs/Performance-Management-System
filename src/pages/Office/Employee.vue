<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import DivisionList from 'src/components/DivisionList.vue';
// import AddEmployee from 'src/components/AddEmployee.vue';

const currentView = ref('division');

const navigateToAddEmployee = () => {
  currentView.value = 'addEmployee';
};

const goBackToDivision = () => {
  currentView.value = 'division';
};
</script>

<template>
  <div class="employee-container">
    <DivisionList v-if="currentView === 'division'" @navigate="navigateToAddEmployee" />
    <AddEmployee v-if="currentView === 'addEmployee'" @back="goBackToDivision" />
  </div>
</template>

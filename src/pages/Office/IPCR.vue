<template>
  <q-page class="q-pa-md">
    <!-- Show either the main table or employee view -->
    <template v-if="!selectedEmployee">
      <!-- Title -->
      <div class="text-h5 q-mb-md">IPCR</div>

      <!-- Dropdown -->
      <div class="row q-mb-md">
        <q-select
          v-model="selectedPeriod"
          :options="['All Target Periods', ...uniqueTargetPeriods]"
          label="Select Target Period"
          outlined
          dense
          style="width: 250px"
        />
      </div>

      <!-- Main IPCR Table (your existing table) -->
      <q-card flat bordered>
        <q-table
          flat
          bordered
          :rows="filteredRows"
          :columns="columns"
          row-key="division"
          hide-bottom
          class="balanced-alignment-table"
          @row-click="onRowClick"
        />
      </q-card>
    </template>

    <!-- Employee IPCR View -->
    <EmployeeIPCR
      v-else
      :division="selectedEmployee.division"
      :targetPeriod="selectedEmployee.target_period"
      @back="selectedEmployee = null"
    />
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import EmployeeIPCR from 'components/EmployeeIPCR.vue';

// Your existing columns definition
const columns = [
  {
    name: 'division',
    label: 'DIVISION',
    field: 'division',
    align: 'left',
    style: 'width: 50%; min-width: 300px; padding-left: 16px',
    headerStyle: 'padding-left: 16px'
  },
  {
    name: 'target_period',
    label: 'TARGET PERIOD',
    field: 'target_period',
    align: 'center',
    style: 'width: 25%; min-width: 180px',
    headerStyle: ''
  },
  {
    name: 'date_created',
    label: 'DATE CREATED',
    field: 'date_created',
    align: 'right',
    style: 'width: 25%; min-width: 150px; padding-right: 24px',
    headerStyle: 'padding-right: 24px'
  },
];

// Your existing rows data
const rows = ref([
  {
    division: 'Recruitment, Selection and Records Management Division',
    target_period: 'January - June 2025',
    date_created: 'December 2024',
  },
  {
    division: 'Human Resource Development Division',
    target_period: 'July - December 2025',
    date_created: 'March 2025',
  },
  {
    division: 'Performance Management and Evaluation Division',
    target_period: 'January - June 2026',
    date_created: 'May 2025',
  },
]);

const selectedPeriod = ref('All Target Periods');
const selectedEmployee = ref(null);

// Your existing computed properties
const uniqueTargetPeriods = computed(() => {
  return [...new Set(rows.value.map(row => row.target_period))];
});

const filteredRows = computed(() => {
  if (selectedPeriod.value === 'All Target Periods') {
    return rows.value;
  }
  return rows.value.filter(row => row.target_period === selectedPeriod.value);
});

// New method for handling row clicks
const onRowClick = (evt, row) => {
  selectedEmployee.value = row;
};
</script>

<style scoped>
/* Your existing styles - completely unchanged */
::v-deep(.balanced-alignment-table) {
  table {
    table-layout: fixed;
    width: 100%;
  }

  /* Header styling */
  thead tr {
    background-color: #e0e0e0 !important;
  }

  th {
    font-weight: 600;
    font-size: 0.875rem;
    padding: 12px 16px;
    text-transform: uppercase;
    color: #333;
    white-space: nowrap;
  }

  /* Cell styling with adjusted right padding */
  td {
    padding: 12px 16px;
    vertical-align: middle;
  }

  /* Date Created column - moved left */
  td.column-date_created {
    padding-right: 24px !important; /* Reduced from 30px */
  }

  /* Hover effect */
  tbody tr:hover {
    background-color: #f9f9f9;
  }
}

.q-card {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Add cursor pointer to indicate clickable rows */
::v-deep(.balanced-alignment-table tbody tr) {
  cursor: pointer;
}
</style>

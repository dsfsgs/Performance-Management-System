<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<template>
  <div class="opcr-container">
    <!-- Title -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5 text-weight-bold">OPCR</div>
      <q-space />
    </div>

    <!-- Target Period Filter -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedPeriod"
          :options="sortedPeriodOptions"
          outlined
          dense
          emit-value
          map-options
          label="Filter by Target Period"
        />
      </div>
    </div>

    <!-- Table container -->
    <div class="table-container q-mb-xl">
      <q-card flat bordered class="custom-table-container shadow-1">
        <!-- OPCR Table -->
        <q-table
          flat
          bordered
          :rows="sortedOpcr"
          :columns="opcrColumns"
          row-key="id"
          hide-bottom
          class="balanced-alignment-table"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props" :class="statusClass(props.row.status)">
              {{ props.row.status }}
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedPeriod = ref(null);

// OPCR Data - Only for Office of the City Mayor
const opcrRows = ref([
  {
    id: 1,
    office: 'Office of the City Mayor',
    targetPeriod: 'January - June 2023',
    dateCreated: '2022-12-15',
    status: 'Locked',
    periodEnd: '2023-06-30'
  },
  {
    id: 2,
    office: 'Office of the City Mayor',
    targetPeriod: 'July - December 2023',
    dateCreated: '2023-06-10',
    status: 'On Process',
    periodEnd: '2023-12-31'
  },
  {
    id: 3,
    office: 'Office of the City Mayor',
    targetPeriod: 'January - June 2024',
    dateCreated: '2023-12-20',
    status: 'On Process',
    periodEnd: '2024-06-30'
  },
]);

// Extract period end dates for sorting
const getPeriodEndDate = (period) => {
  const match = period.match(/(January|July) - (June|December) (\d{4})/);
  if (!match) return new Date();
  const [, , endMonth, year] = match;
  return new Date(`${endMonth} 30, ${year}`);
};

// Available periods (6-month intervals) sorted by current first
const periodOptions = computed(() => {
  const periods = [...new Set(opcrRows.value.map(opcr => opcr.targetPeriod))];
  return periods.map(period => ({
    label: period,
    value: period,
    endDate: getPeriodEndDate(period)
  }));
});

// Sort periods with current first
const sortedPeriodOptions = computed(() => {

  return [
    { label: 'All Periods', value: null },
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    ...periodOptions.value.sort((a, b) => b.endDate - a.endDate)
  ];
});

// Filter OPCR based on selected period
const filteredOpcr = computed(() => {
  if (!selectedPeriod.value) return opcrRows.value;
  return opcrRows.value.filter(opcr => opcr.targetPeriod === selectedPeriod.value);
});

// Sort OPCR: current periods first, then by status (On Process before Locked)
const sortedOpcr = computed(() => {
  return [...filteredOpcr.value].sort((a, b) => {
    // First sort by period end date (newest first)
    const dateCompare = new Date(b.periodEnd) - new Date(a.periodEnd);
    if (dateCompare !== 0) return dateCompare;

    // Then sort by status (On Process before Locked)
    if (a.status === 'On Process' && b.status === 'Locked') return -1;
    if (a.status === 'Locked' && b.status === 'On Process') return 1;
    return 0;
  });
});

// Status styling
const statusClass = (status) => {
  return status === 'Locked' ? 'text-grey' : 'text-warning';
};

// Table Columns
const opcrColumns = [
  {
    name: 'office',
    label: 'OFFICE',
    field: 'office',
    align: 'left',
    style: 'width: 30%; min-width: 250px; padding-left: 16px'
  },
  {
    name: 'targetPeriod',
    label: 'TARGET PERIOD (6 Months)',
    field: 'targetPeriod',
    align: 'left',
    style: 'width: 25%; min-width: 200px'
  },
  {
    name: 'dateCreated',
    label: 'DATE CREATED',
    field: 'dateCreated',
    align: 'left',
    style: 'width: 25%; min-width: 200px'
  },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'center',
    style: 'width: 20%; min-width: 150px'
  },
];
</script>

<style scoped>
/* Main container */
.opcr-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Table container */
.table-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Adjust table width */
.custom-table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* Table Styling */
::v-deep(.balanced-alignment-table) {
  table {
    table-layout: fixed;
    width: 100%;
  }

  /* Header styling */
  thead tr {
    background-color: #f5f5f5 !important;
    border-bottom: 2px solid #e0e0e0;
  }

  th {
    font-weight: 600;
    font-size: 0.875rem;
    padding: 12px 16px;
    text-transform: uppercase;
    color: #424242;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* Cell styling */
  td {
    padding: 12px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.9rem;
  }

  /* Status colors */
  .text-warning {
    color: #f2c037 !important;
    font-weight: 500;
  }

  .text-grey {
    color: #9e9e9e !important;
    font-weight: 500;
  }

  /* Right padding for last column */
  td:last-child {
    padding-right: 16px;
  }

  /* Hover effect */
  tbody tr:hover {
    background-color: #f5f9ff;
  }
}

/* Card Styling */
.q-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>

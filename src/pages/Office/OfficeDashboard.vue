<template>
  <q-page class="q-pa-md bg-grey-1 full-width">
    <!-- Header with Target Period -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold text-primary">Performance Dashboard</div>
        <div class="text-subtitle1 text-grey-8">
          Current Target Period: <strong>{{ currentTargetPeriod }}</strong>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="people" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">Total Employees</div>
                <div class="text-h6 text-weight-bold">435</div>
              </div>
            </div>
            <q-linear-progress size="xs" :value="1" color="positive" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">OPCR Status</div>
            <div class="text-h6 text-weight-bold q-mb-sm">25</div>
            <q-linear-progress size="xs" :value="15 / 25" color="positive" />
            <div class="row justify-between q-mt-sm">
              <span class="text-caption">Approved: <strong class="text-positive">15</strong></span>
              <span class="text-caption">Pending: <strong class="text-warning">10</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">IPCR Status</div>
            <div class="text-h6 text-weight-bold q-mb-sm">25</div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="12 / 25" color="positive" />
              <span class="text-caption">Approved: <strong class="text-positive">12</strong></span>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="5 / 25" color="grey" />
              <span class="text-caption">Not Reviewed: <strong class="text-grey">5</strong></span>
            </div>
            <div>
              <q-linear-progress size="xs" :value="8 / 25" color="negative" />
              <span class="text-caption">Incomplete: <strong class="text-negative">8</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">Unit Work Plan</div>
            <div class="text-h6 text-weight-bold q-mb-sm">10</div>
            <q-linear-progress size="xs" :value="6 / 10" color="positive" />
            <div class="row justify-between q-mt-sm">
              <span class="text-caption">Approved: <strong class="text-positive">6</strong></span>
              <span class="text-caption">Pending: <strong class="text-warning">4</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>



    <!-- Activity Logs Section -->
    <q-card class="bg-white shadow-3">
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-md">Activity Logs</div>
        <q-table :rows="activityLogs" :columns="activityColumns" row-key="id" flat bordered
          :pagination="{ rowsPerPage: 5 }" class="dashboard-table">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.value)" class="q-pa-xs">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

// Current target period calculation
const currentTargetPeriod = computed(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month >= 0 && month <= 5) {
    return `January - June ${year}`;
  } else {
    return `July - December ${year}`;
  }
});

// Activity Logs Data
const activityLogs = ref([
  {
    id: 1,
    date: '2023-05-15 09:30',
    action: 'OPCR Submission',
    office: 'HR Division',
    status: 'Approved',
    remarks: 'Approved by Director'
  },
  // ... (rest of your existing activity logs)
]);

const activityColumns = [
  { name: 'date', label: 'Date & Time', field: 'date', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'left', sortable: true },
  { name: 'office', label: 'Office', field: 'office', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'remarks', label: 'Remarks', field: 'remarks', align: 'left' }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'positive';
    case 'Completed': return 'positive';
    case 'Pending': return 'warning';
    case 'Rejected': return 'negative';
    default: return 'grey';
  }
};
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  width: 100%;
}

.q-card {
  border-radius: 8px;
}

.text-h4 {
  letter-spacing: -0.5px;
}

/* Card and table alignment */
.full-height {
  height: 100%;
}

.dashboard-table {
  border-radius: 8px;
  overflow: hidden;
}

/* Consistent spacing */
.q-mb-lg {
  margin-bottom: 24px;
}

.q-mb-sm {
  margin-bottom: 8px;
}

/* Table styling */
:deep(.q-table th) {
  font-weight: 600;
  background-color: #f5f5f5;
}

:deep(.q-table__container) {
  border-radius: 8px;
}

/* Notification unread highlight */
.bg-blue-1 {
  background-color: #e3f2fd;
}
</style>

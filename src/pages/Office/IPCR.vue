<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">IPCR</h6>
    </div>

    <div class="row q-mb-lg">
      <div class="col-12 col-md-4">
        <q-input v-model="searchText" outlined dense placeholder="Search employees..." clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card flat bordered class="custom-table-container shadow-1">
      <q-table :rows="filteredEmployees" :columns="employeeColumns" row-key="name" @row-click="onRowClick" hide-bottom
        class="balanced-alignment-table">
        <!-- Header Slot -->
        <template v-slot:header>
          <q-tr>
            <q-th v-for="col in employeeColumns" :key="col.name"
              :style="`background-color: #EBEBEB; text-align: ${col.align || 'left'};`">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Status Cell Slot -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props" style="text-align: left;">
            <q-badge :color="getStatusColor(props.row.status)" :text-color="getStatusTextColor(props.row.status)"
              align="middle" class="q-px-md q-py-xs" rounded>
              <q-icon :name="getStatusIcon(props.row.status)" class="q-mr-xs" />
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- IPCR Report Component (replaces modal) -->
    <q-dialog v-model="showIPCRReport" full-width>
      <IPCRReport v-if="showIPCRReport" :employee="selectedEmployee" @close="showIPCRReport = false"
        @approve="confirmApproval" />
    </q-dialog>

    <!-- Confirmation -->
    <q-dialog v-model="showConfirmation" persistent>
      <q-card style="min-width: 350px" class="confirmation-card">
        <q-card-section class="q-pa-lg text-center">
          <q-icon name="help_outline" color="primary" size="lg" class="q-mb-md" />
          <div class="text-h6 text-weight-medium q-mb-xs">Confirm Approval</div>
          <div class="text-grey-8">
            Are you sure you want to approve the IPCR for<br>
            <span class="text-weight-medium">{{ selectedEmployee?.name }}</span>?
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup class="q-mr-sm" />
          <q-btn label="Confirm" color="positive" @click="approveIPCR" icon="check" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import IPCRReport from 'src/components/office/IPCRReport.vue';

const $q = useQuasar();

const showIPCRReport = ref(false);
const showConfirmation = ref(false);
const selectedEmployee = ref(null);
const searchText = ref('');

// Sample employees with 3 status types
const employeeRows = ref([
  { name: 'JANYLENE A. PALERMO', position: 'City HR Officer', division: 'HR', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
  { name: 'DAVE MARK P.', position: 'Senior Admin Assistant', division: 'IT', strategic: '4', core: '4', support: '3', rating: '4', status: 'Approved' },
  { name: 'JUAN DELA CRUZ', position: 'Finance Officer', division: 'Finance', strategic: '2', core: '2', support: '2', rating: '2', status: 'Incomplete' },
]);

// Sorting priority
const statusOrder = {
  'Incomplete': 0,
  'Not Reviewed': 1,
  'Approved': 2,
};

// Table columns
const employeeColumns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'position', label: 'Position', field: 'position', align: 'left' },
  { name: 'strategic', label: 'Strategic Function', field: 'strategic', align: 'center' },
  { name: 'core', label: 'Core Function', field: 'core', align: 'center' },
  { name: 'support', label: 'Support Function', field: 'support', align: 'center' },
  { name: 'rating', label: 'Adjectival Rating', field: 'rating', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' }
];

// Filter by search text
const filteredEmployees = computed(() => {
  if (!searchText.value) {
    return [...employeeRows.value].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }

  const searchLower = searchText.value.toLowerCase();
  return employeeRows.value
    .filter(emp =>
      emp.name.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower) ||
      emp.division.toLowerCase().includes(searchLower) ||
      emp.status.toLowerCase().includes(searchLower)
    )
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
});

// IPCR report actions
const onRowClick = (evt, row) => {
  selectedEmployee.value = row;
  showIPCRReport.value = true;
};

const confirmApproval = () => {
  showIPCRReport.value = false;
  showConfirmation.value = true;
};

const approveIPCR = () => {
  if (selectedEmployee.value) {
    const index = employeeRows.value.findIndex(emp => emp.name === selectedEmployee.value.name);
    if (index !== -1) {
      employeeRows.value[index].status = 'Approved';
      $q.notify({
        type: 'positive',
        message: 'IPCR approved successfully!',
        position: 'top',
        timeout: 2000
      });
    }
  }
  showConfirmation.value = false;
};

// Status style helpers
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'positive';
    case 'Incomplete': return 'orange';
    case 'Not Reviewed': return 'grey-6';
    default: return 'grey';
  }
};

const getStatusTextColor = (status) => {
  return status === 'Not Reviewed' ? 'white' : 'white';
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved': return 'check_circle';
    case 'Incomplete': return 'error_outline';
    case 'Not Reviewed': return 'hourglass_empty';
    default: return 'help_outline';
  }
};
</script>

<style scoped>
.custom-table-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.confirmation-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
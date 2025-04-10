<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">IPCR</h6>
    </div>

    <div class="row q-mb-lg">
      <div class="col-12 col-md-4">
        <q-select v-model="selectedDivision" :options="divisionOptions" outlined dense emit-value map-options
          class="division-selector" />
      </div>
    </div>

    <q-card flat bordered class="custom-table-container shadow-1">
      <q-table :rows="sortedEmployees" :columns="employeeColumns" row-key="name" @row-click="onRowClick" hide-bottom
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

    <!-- Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 500px" class="q-pa-md">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">IPCR Evaluation Details</div>
          <q-separator class="q-my-md" />
        </q-card-section>

        <q-card-section v-if="selectedEmployee" class="q-pt-none">
          <div class="text-subtitle1 q-mb-sm"><span class="text-weight-medium">Employee:</span> {{ selectedEmployee.name
          }}
          </div>
          <div class="text-subtitle1 q-mb-sm"><span class="text-weight-medium">Position:</span> {{
            selectedEmployee.position
          }}</div>
          <div class="text-subtitle1 q-mb-sm"><span class="text-weight-medium">Division:</span> {{
            selectedEmployee.division
          }}</div>
          <div class="text-subtitle1 q-mb-sm"><span class="text-weight-medium">Status:</span> {{ selectedEmployee.status
          }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pt-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn label="Approve" color="positive" @click="confirmApproval"
            :disable="selectedEmployee?.status === 'Approved'" />
        </q-card-actions>
      </q-card>
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

const $q = useQuasar();

const showModal = ref(false);
const showConfirmation = ref(false);
const selectedEmployee = ref(null);
const selectedDivision = ref(null);

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

// Division options
const divisionOptions = computed(() => {
  const divisions = [...new Set(employeeRows.value.map(emp => emp.division))];
  return [{ label: 'Select Division', value: null }, ...divisions.map(d => ({ label: d, value: d }))];
});

// Filter by division
const filteredEmployees = computed(() => {
  return !selectedDivision.value
    ? employeeRows.value
    : employeeRows.value.filter(emp => emp.division === selectedDivision.value);
});

// Sort by status order
const sortedEmployees = computed(() => {
  return [...filteredEmployees.value].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
});

// Modal actions
const onRowClick = (evt, row) => {
  selectedEmployee.value = row;
  showModal.value = true;
};

const confirmApproval = () => {
  showModal.value = false;
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
.division-selector {
  border-radius: 8px;
}

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

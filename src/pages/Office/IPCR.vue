<template>
  <div class="ipcr-container">
    <!-- Title with better spacing and visual weight -->
    <div class="row items-center q-mb-lg">
      <div class="text-h5 text-weight-bold">IPCR Evaluation</div>
      <q-space />
    </div>

    <!-- Division Dropdown with improved styling -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-4">
        <q-select
          v-model="selectedDivision"
          :options="divisionOptions"
          outlined
          dense
          emit-value
          map-options
          class="division-selector"
        />
      </div>
    </div>

    <!-- Table container with subtle shadow and border radius -->
    <div class="table-container q-mb-xl">
      <q-card flat bordered class="custom-table-container shadow-1">
        <!-- IPCR Table with enhanced visual styling -->
        <q-table
          flat
          bordered
          :rows="sortedEmployees"
          :columns="employeeColumns"
          row-key="name"
          hide-bottom
          class="balanced-alignment-table"
          @row-click="onRowClick"
        />
      </q-card>
    </div>

    <!-- Enhanced IPCR Modal with better structure -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 500px" class="q-pa-md">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">IPCR Evaluation Details</div>
          <q-separator class="q-my-md" />
        </q-card-section>

        <q-card-section v-if="selectedEmployee" class="q-pt-none">
          <div class="text-subtitle1 q-mb-sm">
            <span class="text-weight-medium">Employee:</span> {{ selectedEmployee.name }}
          </div>
          <div class="text-subtitle1 q-mb-sm">
            <span class="text-weight-medium">Position:</span> {{ selectedEmployee.position }}
          </div>
          <div class="text-subtitle1 q-mb-sm">
            <span class="text-weight-medium">Division:</span> {{ selectedEmployee.division }}
          </div>
          <div class="text-subtitle1 q-mb-sm">
            <span class="text-weight-medium">Status:</span>
            <span :class="statusClass(selectedEmployee.status)">
              {{ selectedEmployee.status }}
            </span>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pt-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            label="Approve"
            color="positive"
            @click="confirmApproval"
            class="q-px-md"
            :disable="selectedEmployee?.status === 'Approved'"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Enhanced Confirmation Dialog -->
    <q-dialog v-model="showConfirmation" persistent>
      <q-card style="min-width: 350px" class="confirmation-card">
        <q-card-section class="q-pa-lg text-center">
          <q-icon
            name="help_outline"
            color="primary"
            size="lg"
            class="q-mb-md"
          />
          <div class="text-h6 text-weight-medium q-mb-xs">Confirm Approval</div>
          <div class="text-grey-8">
            Are you sure you want to approve the IPCR for<br>
            <span class="text-weight-medium">{{ selectedEmployee?.name }}</span>?
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            v-close-popup
            class="q-mr-sm"
          />
          <q-btn
            label="Confirm"
            color="positive"
            @click="approveIPCR"
            icon="check"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const showModal = ref(false);
const showConfirmation = ref(false);
const selectedEmployee = ref(null);
const selectedDivision = ref(null);

// Employee Data - only Not Reviewed and Approved statuses
const employeeRows = ref([
  { name: 'JANYLENE A. PALERMO, MM', position: 'City HR Officer - 25', division: 'HR', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
  { name: 'FRUNNIE A. BOISER', position: 'Supervising Admin Officer - 22', division: 'HR', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
  { name: 'DAVE MARK P.', position: 'Senior Admin Assistant - 13', division: 'IT', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
  { name: 'JOGRAD M. MAHUSAY', position: 'Computer Programmer II', division: 'IT', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
  { name: 'JUAN DELA CRUZ', position: 'Finance Officer', division: 'Finance', strategic: '5', core: '5', support: '5', rating: '5', status: 'Not Reviewed' },
]);

// Status order for sorting (1 = first, 2 = last)
const statusOrder = {
  'Not Reviewed': 1,
  'Approved': 2
};

// Helper functions
const statusClass = (status) => {
  return status === 'Approved' ? 'text-positive' : 'text-grey';
};

// Extract unique divisions + "Select All" option
const divisionOptions = computed(() => {
  const divisions = [...new Set(employeeRows.value.map(emp => emp.division))];
  return [{ label: 'Select All', value: null }, ...divisions.map(division => ({ label: division, value: division }))];
});

// Filter employees based on selected division
const filteredEmployees = computed(() => {
  if (!selectedDivision.value) return employeeRows.value;
  return employeeRows.value.filter(emp => emp.division === selectedDivision.value);
});

// Sort employees by status order
const sortedEmployees = computed(() => {
  return [...filteredEmployees.value].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
});

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

      // Show success notification
      $q.notify({
        type: 'positive',
        message: 'IPCR approved successfully!',
        position: 'top',
        timeout: 2500
      });
    }
  }
  showConfirmation.value = false;
};

// Table Columns
const employeeColumns = [
  { name: 'name', label: 'NAME', field: 'name', align: 'left', style: 'width: 24%; min-width: 200px; padding-left: 16px' },
  { name: 'position', label: 'POSITION', field: 'position', align: 'left', style: 'width: 24%; min-width: 200px' },
  { name: 'strategic', label: 'STRATEGIC FUNCTION', field: 'strategic', align: 'center', style: 'width: 12%; min-width: 120px' },
  { name: 'core', label: 'CORE FUNCTION', field: 'core', align: 'center', style: 'width: 12%; min-width: 120px' },
  { name: 'support', label: 'SUPPORT FUNCTION', field: 'support', align: 'center', style: 'width: 12%; min-width: 120px' },
  { name: 'rating', label: 'ADJECTIVAL RATING', field: 'rating', align: 'center', style: 'width: 10%; min-width: 100px' },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'center',
    style: 'width: 10%; min-width: 100px; padding-right: 16px',
    classes: (row) => statusClass(row.status)
  },
];
</script>

<style scoped>
/* Main container */
.ipcr-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Table container */
.table-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Division selector */
.division-selector {
  border-radius: 8px;
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
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.9rem;
  }

  /* Right padding for last column */
  td:last-child {
    padding-right: 16px;
  }

  /* Hover effect */
  tbody tr:hover {
    background-color: #f5f9ff;
  }

  /* Status text colors */
  .text-positive {
    color: #21ba45 !important;
    font-weight: 500;
  }

  .text-grey {
    color: #9e9e9e !important;
    font-weight: 500;
  }
}

/* Card Styling */
.q-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Confirmation Card Styling */
.confirmation-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.confirmation-card .q-icon {
  font-size: 3rem;
}

.confirmation-card .q-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
}

.confirmation-card .q-btn[color="positive"] {
  background-color: #21BA45;
  color: white;
}

.confirmation-card .q-btn[color="positive"]:hover {
  background-color: #1a9f3a;
}

.confirmation-card .q-separator {
  background: rgba(0, 0, 0, 0.08);
}
</style>

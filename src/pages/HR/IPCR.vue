<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">IPCR</h6>
    </div>

    <!-- Search Section -->
    <div class="row q-mb-lg">
      <div class="col-12 col-md-4">
        <q-input v-model="searchText" outlined dense placeholder="Search employees..." clearable
          @keyup.enter="handleSearch">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Employee Table -->
    <q-card flat bordered class="custom-table-container shadow-1">
      <q-table :rows="filteredEmployees" :columns="columns" row-key="name" :loading="isLoading" @row-click="onRowClick"
        hide-bottom class="balanced-alignment-table">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-grey-2">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" style="text-align: left;">
            <q-badge :color="getStatusColor(props.row.status)" :text-color="getStatusTextColor(props.row.status)"
              align="middle" class="q-px-md q-py-xs" rounded>
              <q-icon :name="getStatusIcon(props.row.status)" class="q-mr-xs" />
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </q-card>

    <!-- IPCR Report Dialog -->
    <q-dialog v-model="showIPCRReport" full-width persistent>
      <IPCRReport v-if="showIPCRReport" :employee="selectedEmployee" @close="handleReportClose"
        @approve="confirmApproval" />
    </q-dialog>

    <!-- Approval Confirmation Dialog -->
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
          <q-btn label="Confirm" color="positive" :loading="isApproving" @click="approveIPCR" icon="check" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import IPCRReport from 'src/components/office/IPCRReport.vue';
import { useIPCRStatus } from 'src/composables/useIPCRStatus';

const $q = useQuasar();

// State
const showIPCRReport = ref(false);
const showConfirmation = ref(false);
const selectedEmployee = ref(null);
const searchText = ref('');
const isLoading = ref(false);
const isApproving = ref(false);

// Constants
const INITIAL_EMPLOYEES = [
  {
    name: 'JANYLENE A. PALERMO',
    position: 'City HR Officer',
    division: 'HR',
    strategic: '5',
    core: '5',
    support: '5',
    rating: '5',
    status: 'Not Reviewed'
  },
  {
    name: 'DAVE MARK P.',
    position: 'Senior Admin Assistant',
    division: 'IT',
    strategic: '4',
    core: '4',
    support: '3',
    rating: '4',
    status: 'Approved'
  },
  {
    name: 'JUAN DELA CRUZ',
    position: 'Finance Officer',
    division: 'Finance',
    strategic: '2',
    core: '2',
    support: '2',
    rating: '2',
    status: 'Incomplete'
  }
];

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
  { name: 'strategic', label: 'Strategic Function', field: 'strategic', align: 'center' },

  { name: 'core', label: 'Core Function', field: 'core', align: 'center' },
  { name: 'support', label: 'Support Function', field: 'support', align: 'center' },
  { name: 'rating', label: 'Adjectival Rating', field: 'rating', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true }
];

const employeeRows = ref(INITIAL_EMPLOYEES);

// Status helpers from composable
const { getStatusColor, getStatusTextColor, getStatusIcon } = useIPCRStatus();

// Computed
const filteredEmployees = computed(() => {
  const searchLower = searchText.value.toLowerCase().trim();

  if (!searchLower) {
    return sortByStatus([...employeeRows.value]);
  }

  return sortByStatus(
    employeeRows.value.filter(emp =>
      Object.values(emp)
        .join(' ')
        .toLowerCase()
        .includes(searchLower)
    )
  );
});

// Methods
const sortByStatus = (employees) => {
  const statusOrder = {
    'Incomplete': 0,
    'Not Reviewed': 1,
    'Approved': 2
  };

  return employees.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
};

const handleSearch = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

const onRowClick = (evt, row) => {
  selectedEmployee.value = { ...row };
  showIPCRReport.value = true;
};

const handleReportClose = () => {
  showIPCRReport.value = false;
  selectedEmployee.value = null;
};

const confirmApproval = () => {
  showIPCRReport.value = false;
  showConfirmation.value = true;
};

const approveIPCR = async () => {
  if (!selectedEmployee.value) return;

  try {
    isApproving.value = true;
    const index = employeeRows.value.findIndex(
      emp => emp.name === selectedEmployee.value.name
    );

    if (index === -1) throw new Error('Employee not found');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    employeeRows.value[index].status = 'Approved';

    $q.notify({
      type: 'positive',
      message: 'IPCR approved successfully!',
      position: 'top',
      timeout: 2000
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Failed to approve IPCR: ${error.message}`,
      position: 'top'
    });
  } finally {
    isApproving.value = false;
    showConfirmation.value = false;
    selectedEmployee.value = null;
  }
};

// Lifecycle
onMounted(() => {
  handleSearch();
});
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

.bg-grey-2 {
  background-color: #EBEBEB;
}
</style>

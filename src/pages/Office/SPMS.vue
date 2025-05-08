<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <!-- Target Period Filter -->
        <div class="row justify-end q-mb-md">
          <q-select outlined dense v-model="targetPeriod" :options="periodOptions" label="Target Period"
            style="width: 200px" />
        </div>

        <!-- Main Office Section -->
        <div class="org-section q-mb-lg">
          <div class="org-header row items-center justify-between q-pa-sm q-mb-md">
            <div class="text-h6">{{ mainOffice.label }}</div>
            <div>
              <q-btn color="positive" label="Create UWP" size="sm" class="q-mr-xs" />
              <q-btn color="primary" label="OPCR" size="sm" class="q-mr-xs" />
              <q-btn color="primary" label="UWP" size="sm" />
            </div>
          </div>

          <!-- Main Office Employees Table -->
          <q-table :rows="[mainOffice.employee, ...mainOffice.subordinates]" :columns="columns" row-key="id" bordered
            class="clean-table" :pagination="{ rowsPerPage: 0 }">
            <template v-slot:body="props">
              <q-tr :props="props" :class="{ 'head-row': props.row.isHead }">
                <!-- Name column with dropdown for head -->
                <q-td key="name" :props="props">
                  <div class="row items-center no-wrap">
                    <q-btn v-if="props.row.isHead" flat round dense
                      :icon="expandedEmployees[props.row.id] ? 'expand_more' : 'chevron_right'"
                      @click.stop="toggleEmployee(props.row.id)" color="primary" size="sm" class="q-mr-md" />
                    <span :class="{ 'text-weight-bold': props.row.isHead }">{{ props.row.name }}</span>
                  </div>
                </q-td>

                <!-- Regular columns -->
                <q-td key="rank" :props="props">
                  {{ props.row.rank }}
                </q-td>
                <q-td key="ipcr_status" :props="props">
                  <q-badge :color="getStatusColor(props.row)" :label="getIPCRStatusLabel(props.row)" />
                </q-td>
                <q-td key="actions" :props="props" class="text-center">
                  <div>
                    <!-- Special actions for main office head -->
                    <template v-if="props.row.id === mainOffice.employee.id">
                      <q-btn flat round color="teal" icon="add" size="sm">
                        <q-tooltip>Add Input</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" icon="assessment" size="sm">
                        <q-tooltip>OPCR</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" icon="assignment" size="sm">
                        <q-tooltip>UWP</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" icon="edit" size="sm">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="negative" icon="delete" size="sm">
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </template>
                    <!-- Standard actions for other employees -->
                    <template v-else>
                      <q-btn flat round color="primary" icon="description" size="sm">
                        <q-tooltip>IPCR</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" icon="assignment" size="sm">
                        <q-tooltip>UWP</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="primary" icon="edit" size="sm">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn flat round color="negative" icon="delete" size="sm">
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </template>
                  </div>
                </q-td>
              </q-tr>

              <!-- Expanded divisions row when main office head is expanded -->
              <q-tr
                v-if="props.row.isHead && expandedEmployees[props.row.id] && props.row.id === mainOffice.employee.id">
                <q-td colspan="4">
                  <div class="q-pa-md q-my-sm nested-content">
                    <!-- Divisions under the main office -->
                    <div v-for="division in divisions" :key="division.id" class="q-mb-md">
                      <div class="org-header row items-center justify-between q-pa-sm q-mb-md">
                        <div class="text-subtitle1 text-weight-medium">{{ division.label }}</div>
                        <div>
                          <q-btn color="primary" icon="person_add" size="sm" class="q-mr-xs">
                            <q-tooltip>Add Employee</q-tooltip>
                          </q-btn>
                          <q-btn color="secondary" icon="preview" size="sm">
                            <q-tooltip>Preview UWP</q-tooltip>
                          </q-btn>
                        </div>
                      </div>

                      <!-- Division Employees Table -->
                      <q-table :rows="[division.employee, ...division.subordinates]" :columns="columns" row-key="id"
                        bordered class="clean-table" :pagination="{ rowsPerPage: 0 }">
                        <template v-slot:body="divProps">
                          <q-tr :props="divProps" :class="{ 'head-row': divProps.row.isHead }">
                            <!-- Name column with dropdown for head -->
                            <q-td key="name" :props="divProps">
                              <div class="row items-center no-wrap">
                                <q-btn v-if="divProps.row.isHead" flat round dense
                                  :icon="expandedEmployees[divProps.row.id] ? 'expand_more' : 'chevron_right'"
                                  @click.stop="toggleEmployee(divProps.row.id)" color="primary" size="sm"
                                  class="q-mr-md" />
                                <span :class="{ 'text-weight-bold': divProps.row.isHead }">{{ divProps.row.name
                                }}</span>
                              </div>
                            </q-td>

                            <!-- Regular columns -->
                            <q-td key="rank" :props="divProps">
                              {{ divProps.row.rank }}
                            </q-td>
                            <q-td key="ipcr_status" :props="divProps">
                              <q-badge :color="getStatusColor(divProps.row)"
                                :label="getIPCRStatusLabel(divProps.row)" />
                            </q-td>
                            <q-td key="actions" :props="divProps" class="text-center">
                              <div>
                                <q-btn flat round color="primary" icon="description" size="sm">
                                  <q-tooltip>IPCR</q-tooltip>
                                </q-btn>
                                <q-btn flat round color="primary" icon="assignment" size="sm">
                                  <q-tooltip>UWP</q-tooltip>
                                </q-btn>
                                <q-btn flat round color="primary" icon="edit" size="sm">
                                  <q-tooltip>Edit</q-tooltip>
                                </q-btn>
                                <q-btn flat round color="negative" icon="delete" size="sm">
                                  <q-tooltip>Delete</q-tooltip>
                                </q-btn>
                              </div>
                            </q-td>
                          </q-tr>

                          <!-- Expanded sections row when division head is expanded -->
                          <q-tr
                            v-if="divProps.row.isHead && expandedEmployees[divProps.row.id] && divProps.row.id === division.employee.id">
                            <q-td colspan="4">
                              <div class="q-pa-md q-my-sm nested-content">
                                <!-- Sections under this division -->
                                <div v-for="section in getSectionsForDivision(division.id)" :key="section.id"
                                  class="q-mb-md">
                                  <div class="org-header row items-center justify-between q-pa-sm q-mb-md">
                                    <div class="text-subtitle1 text-weight-medium">{{ section.label }}</div>
                                    <div>
                                      <q-btn color="primary" icon="person_add" size="sm" class="q-mr-xs">
                                        <q-tooltip>Add Employee</q-tooltip>
                                      </q-btn>
                                      <q-btn color="secondary" icon="preview" size="sm">
                                        <q-tooltip>Preview UWP</q-tooltip>
                                      </q-btn>
                                    </div>
                                  </div>

                                  <!-- Section Employees Table -->
                                  <q-table :rows="[section.employee, ...section.subordinates]" :columns="columns"
                                    row-key="id" bordered class="clean-table" :pagination="{ rowsPerPage: 0 }">
                                    <template v-slot:body="secProps">
                                      <q-tr :props="secProps" :class="{ 'head-row': secProps.row.isHead }">
                                        <q-td key="name" :props="secProps">
                                          <div class="row items-center no-wrap">
                                            <div class="q-pl-xl"><!-- Empty space to align with levels above --></div>
                                            <span :class="{ 'text-weight-bold': secProps.row.isHead }">{{
                                              secProps.row.name }}</span>
                                          </div>
                                        </q-td>
                                        <q-td key="rank" :props="secProps">
                                          {{ secProps.row.rank }}
                                        </q-td>
                                        <q-td key="ipcr_status" :props="secProps">
                                          <q-badge :color="getStatusColor(secProps.row)"
                                            :label="getIPCRStatusLabel(secProps.row)" />
                                        </q-td>
                                        <q-td key="actions" :props="secProps" class="text-center">
                                          <div>
                                            <q-btn flat round color="primary" icon="description" size="sm">
                                              <q-tooltip>IPCR</q-tooltip>
                                            </q-btn>
                                            <q-btn flat round color="primary" icon="assignment" size="sm">
                                              <q-tooltip>UWP</q-tooltip>
                                            </q-btn>
                                            <q-btn flat round color="primary" icon="edit" size="sm">
                                              <q-tooltip>Edit</q-tooltip>
                                            </q-btn>
                                            <q-btn flat round color="negative" icon="delete" size="sm">
                                              <q-tooltip>Delete</q-tooltip>
                                            </q-btn>
                                          </div>
                                        </q-td>
                                      </q-tr>
                                    </template>
                                  </q-table>
                                </div>
                              </div>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue';

const targetPeriod = ref('Jan-June 2024');
const periodOptions = ref([
  'Jan-June 2024', 'July-Dec 2024', 'Jan-June 2025', 'July-Dec 2025'
]);

const columns = ref([
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'rank', align: 'left', label: 'Rank', field: 'rank', sortable: true },
  { name: 'ipcr_status', align: 'left', label: 'IPCR Status', field: 'ipcr_status' },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' },
]);

// Track expanded employees
const expandedEmployees = reactive({});

// Toggle employee expansion
const toggleEmployee = (employeeId) => {
  expandedEmployees[employeeId] = !expandedEmployees[employeeId];
};

// Status helper functions
const getStatusColor = (employee) => {
  if (employee.isHead) return 'blue';
  const id = employee.id;
  if (id % 2 === 0) return 'green';
  return 'orange';
};

const getIPCRStatusLabel = (employee) => {
  if (employee.isHead) return 'Managerial';

  // Determine based on rank
  const rank = employee.rank.toLowerCase();
  if (rank.includes('deputy') || rank.includes('supervisor')) {
    return 'Supervisory';
  }
  return 'Rank and File';
};

// Main Office data
const mainOffice = ref({
  id: 'cictmo',
  label: 'CICTMO',
  employee: { id: 1, name: 'John Doe', rank: 'Director', isHead: true },
  subordinates: [
    { id: 2, name: 'Jane Smith', rank: 'Deputy Director', isHead: false },
    { id: 3, name: 'Alice Johnson', rank: 'Staff', isHead: false },
  ]
});

// Division data with their employees
const divisions = ref([
  {
    id: 'technical_division',
    label: 'Technical Division',
    employee: { id: 4, name: 'Bob Wilson', rank: 'Division Head', isHead: true },
    subordinates: [
      { id: 5, name: 'Carol Brown', rank: 'Engineer', isHead: false },
    ],
  },
  {
    id: 'network_division',
    label: 'Network Division',
    employee: { id: 8, name: 'Frank Martin', rank: 'Division Head', isHead: true },
    subordinates: [
      { id: 9, name: 'Grace Taylor', rank: 'Network Admin', isHead: false },
    ],
  }
]);

// Sections data grouped by division
const sections = ref([
  {
    id: 'section_1',
    divisionId: 'technical_division',
    label: 'Section 1',
    employee: { id: 6, name: 'David Lee', rank: 'Section Head', isHead: true },
    subordinates: [
      { id: 7, name: 'Emma Davis', rank: 'Technician', isHead: false },
    ],
  },
  {
    id: 'section_a',
    divisionId: 'network_division',
    label: 'Section A',
    employee: { id: 10, name: 'Henry Clark', rank: 'Section Head', isHead: true },
    subordinates: [
      { id: 11, name: 'Isabella White', rank: 'Analyst', isHead: false },
    ],
  },
]);

// Helper function to get sections for a specific division
const getSectionsForDivision = (divisionId) => {
  return sections.value.filter(section => section.divisionId === divisionId);
};
</script>

<style scoped>
.nested-content {
  background-color: #f9f9f9;
  border-left: 3px solid #1976d2;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.org-header {
  background-color: #e3f2fd;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.clean-table {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

/* Highlight head rows */
.head-row {
  background-color: #f5f5f5;
}

/* Override Quasar table styles for a cleaner look */
:deep(.q-table th) {
  font-weight: bold;
  background-color: #e3f2fd;
}

:deep(.q-table) {
  border-radius: 4px;
  overflow: hidden;
}
</style>

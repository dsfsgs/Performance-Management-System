// Vue component update
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding class="q-pa-md">
        <!-- Page Header -->
        <div class="row items-center justify-between q-mb-lg">
          <!-- <h4 class="q-my-none text-primary">{{ officeName }}</h4> -->
          <div class="row q-gutter-sm">
            <!-- <q-select outlined dense v-model="targetPeriod" :options="periodOptions" label="Target Period"
              class="period-select" style="width: 180px" /> -->
            <!-- <q-btn color="primary" icon="refresh" flat round @click="refreshData">
              <q-tooltip>Refresh Data</q-tooltip>
            </q-btn> -->
          </div>
        </div>

        <!-- Organization Tree -->
        <div class="row q-mb-lg">
          <div class="col-12 col-md-4">
            <q-card flat bordered>
              <q-card-section>
                <q-tree :nodes="organizationTree" node-key="id" v-model:selected="selectedNodeId"
                  :filter-method="filterMethod" default-expand-all @update:selected="onNodeSelect"
                  :loading="orgStore.loading">

                  <template v-slot:default-header="scope">
                    <div class="row items-center">
                      <q-icon :name="getNodeIcon(scope.node)" :color="getNodeColor(scope.node)" size="md"
                        class="q-mr-sm" />
                      <div>
                        <div :class="{ 'text-weight-bold': scope.node.isHead }">
                          {{ scope.node.label }}
                        </div>
                        <div class="text-caption text-grey-7" v-if="scope.node.isHead">
                          {{ scope.node.position }}
                        </div>
                      </div>
                    </div>
                  </template>

                </q-tree>
              </q-card-section>
            </q-card>
          </div>

          <!-- Employee Table -->
          <div class="col-12 col-md-8">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md" v-if="selectedNode">
                  {{ selectedNode.label }}
                  <!-- <q-btn color="primary" icon="person_add" label="Add Employee" dense class="q-ml-sm"
                    @click="addEmployee" /> -->

                  <div class="row justify-end q-mt-sm">
                    <q-btn color="green" icon="person_add" label="Create Unit Work Plan" dense @click="addEmployee" />
                  </div>

                </div>
                <q-table :rows="employees" :columns="columns" row-key="id" flat bordered class="clean-table"
                  :pagination="{ rowsPerPage: 0 }" :loading="loading">
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="name" :props="props">
                        <div class="row items-center">
                          <q-icon name="person" color="grey" size="md" class="q-mr-sm" />
                          <div>
                            <div>{{ props.row.label }}</div>
                            <div class="text-caption text-grey-7">{{ props.row.position }}</div>
                          </div>
                        </div>
                      </q-td>
                      <q-td key="rank" :props="props">
                        <div class="text-body2">{{ props.row.rank || '-' }}</div>
                      </q-td>
                      <q-td key="ipcr_status" :props="props">
                        <q-badge :color="getStatusColor(props.row)" :label="props.row.ipcrStatus || '-'"
                          class="status-badge" />
                      </q-td>
                      <q-td key="actions" :props="props" class="text-center">
                        <div class="row justify-center q-gutter-xs">
                          <q-btn flat round color="blue" icon="assignment_ind" size="md"
                            @click="unitWorkplanEmployee(props.row)">
                            <q-tooltip>Iprc</q-tooltip>
                          </q-btn>
                          <q-btn flat round color="green" icon="article" size="md"
                            @click="unitWorkplanEmployee(props.row)">
                            <q-tooltip>UnitWorkPlan</q-tooltip>
                          </q-btn>
                          <q-btn flat round color="amber" icon="edit" size="md" @click="editEmployee(props.row)">
                            <q-tooltip>Edit</q-tooltip>
                          </q-btn>
                          <q-btn flat round color="negative" icon="delete" size="md" @click="deleteEmployee(props.row)">
                            <q-tooltip>Delete</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>


      </q-page>
    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useOrganizationStore } from 'src/stores/office/spmsStore';
import { useUserStore } from 'src/stores/userStore';

const orgStore = useOrganizationStore();
const userStore = useUserStore();

// const targetPeriod = ref('Jan-June 2024');
// const periodOptions = ref([
//   'Jan-June 2024',
//   'July-Dec 2024',
//   'Jan-June 2025',
//   'July-Dec 2025',
// ]);

const getNodeIcon = (node) => {
  if (node.isHead) {
    // Heads get person icons with different styles
    switch (node.type) {
      case 'office': return 'account_balance';
      case 'division': return 'supervisor_account';
      case 'section': return 'manage_accounts';
      case 'unit': return 'person';
      default: return 'person';
    }
  }

  // Non-head nodes get type-specific icons
  switch (node.type) {
    case 'office': return 'account_balance';
    case 'division': return 'corporate_fare'; // Building icon for divisions
    case 'section': return 'view_quilt'; // Grid icon for sections
    case 'unit': return 'widgets'; // Puzzle pieces for units
    case 'employee': return 'person';
    default: return 'help_outline';
  }
};

const getNodeColor = (node) => {
  if (node.isHead) return 'blue';
  switch (node.type) {
    case 'office': return 'purple';
    case 'division': return 'deep-purple';
    case 'section': return 'teal';
    case 'unit': return 'indigo';
    case 'employee': return 'grey';
    default: return 'grey';
  }
};

const selectedNodeId = ref(null);
const loading = ref(false);

const columns = ref([
  { name: 'name', align: 'left', label: 'Name', field: 'label', sortable: true },
  { name: 'rank', align: 'left', label: 'Rank', field: 'rank' },
  { name: 'ipcr_status', align: 'left', label: 'IPCR Status', field: 'ipcrStatus' },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions' },
]);

// Required method for q-tree but not implemented in your code
const filterMethod = (node, filter) => {
  return node.label && node.label.toLowerCase().indexOf(filter.toLowerCase()) > -1;
};

// Implement onNodeSelect function which was referenced but not defined
const onNodeSelect = (nodeId) => {
  selectedNodeId.value = nodeId;
  // Additional logic can be added here if needed
};

// Implement getStatusColor function which was referenced but not defined
const getStatusColor = (row) => {
  const status = row.ipcrStatus?.toLowerCase() || '';
  if (status.includes('approved')) return 'positive';
  if (status.includes('pending')) return 'warning';
  if (status.includes('review')) return 'info';
  if (status.includes('rejected')) return 'negative';
  return 'grey';
};

// Implement employee-related functions

// eslint-disable-next-line no-unused-vars
const UnitWorkPlanEmployee = (employee) => {
  // Implementation for editing employee
  console.log('Edit employee:', employee.label);
};

const editEmployee = (employee) => {
  // Implementation for editing employee
  console.log('Edit employee:', employee.label);
};

const deleteEmployee = (employee) => {
  // Implementation for deleting employee
  console.log('Delete employee:', employee.label);
};

// Computed properties
const organizationTree = computed(() => orgStore.structure);
// const officeName = computed(() => orgStore.officeName || userStore.officeName || 'Organization');

const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null;

  // Find the node in the tree
  const findNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === selectedNodeId.value) return node;
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findNode(orgStore.structure);
});

const employees = computed(() => {
  if (!selectedNode.value) return [];

  // If the selected node is an employee itself (shouldn't happen as they're leaf nodes)
  if (selectedNode.value.type === 'employee') {
    return [selectedNode.value];
  }

  // If the node has children that are employees
  if (selectedNode.value.children) {
    return selectedNode.value.children.filter(child => child.type === 'employee');
  }

  return [];
});

// Methods
const refreshData = async () => {
  loading.value = true;
  await orgStore.fetchStructure();
  loading.value = false;
};

// Watch for changes in the user's office ID
watch(() => userStore.officeId, async (newOfficeId) => {
  if (newOfficeId) {
    await refreshData();
  }
});

// Lifecycle hooks
onMounted(async () => {
  await userStore.loadUserData(); // Ensure user data is loaded first
  await refreshData();
});
</script>

<style scoped>
.q-page {
  background-color: #f7fafc;
}

.clean-table {
  border-radius: 8px;
}

.status-badge {
  border-radius: 4px;
  padding: 4px 8px;
}
</style>

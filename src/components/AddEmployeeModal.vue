<template>
  <q-dialog :model-value="showModal" @update:model-value="closeModal" persistent>
    <q-card class="employee-selection-modal">
      <q-card-section class="modal-header">
        <div class="text-h6">Select Employees</div>
      </q-card-section>

      <q-card-section class="filter-section">
        <div class="row q-gutter-md items-center">
          <q-input v-model="searchQuery" placeholder="Search by name, position, or office..." dense outlined clearable
            class="col-grow">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-toggle v-model="showAllOffices" label="Show all offices" color="primary" left-label />
        </div>
      </q-card-section>

      <q-card-section class="table-section">
        <q-table :rows="filteredEmployees" :columns="columns" row-key="name" flat bordered :pagination="pagination"
          class="employee-table" :filter="searchQuery" :loading="employeeStore.loading">
          <template v-slot:body-cell-selection="props">
            <q-td :props="props">
              <q-checkbox v-model="props.row.selected" dense />
            </q-td>
          </template>

          <template v-slot:body-cell-office="props">
            <q-td :props="props">
              {{ props.row.office }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="modal-actions">
        <q-btn label="Cancel" color="grey" flat @click="closeModal" class="action-btn" />
        <q-btn label="Add Employee" color="primary" :disable="!hasSelection" @click="addEmployee" icon="add"
          class="action-btn" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useEmployeeStore } from 'src/stores/office/employeeStore'

const props = defineProps({
  showModal: Boolean
})
const emit = defineEmits(['update:showModal', 'add'])

const searchQuery = ref('')
const showAllOffices = ref(false)
const employeeStore = useEmployeeStore()

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const columns = [
  {
    name: 'selection',
    label: 'Select',
    field: 'selected',
    align: 'left'
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'position',
    label: 'Position',
    field: 'position',
    align: 'left',
    sortable: true
  },

]

// Load employees when modal is shown or when showAllOffices changes
watch([() => props.showModal, showAllOffices], async ([showModalValue, showAll]) => {
  if (showModalValue) {
    if (showAll) {
      await employeeStore.fetchAllEmployees()
    } else {
      await employeeStore.fetchEmployeesByOffice()
    }
  }
}, { immediate: true })

const employees = computed(() => employeeStore.employees)

const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (!showAllOffices.value && employeeStore.userOffice) {
    filtered = filtered.filter(emp => emp.office === employeeStore.userOffice)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      (emp.office && emp.office.toLowerCase().includes(query))
    )
  }

  return filtered
})


const hasSelection = computed(() => {
  return employees.value.some(emp => emp.selected)
})

function closeModal() {
  employeeStore.employees.forEach(emp => emp.selected = false)
  searchQuery.value = ''
  showAllOffices.value = false
  emit('update:showModal', false)
}

function addEmployee() {
  const selectedEmployees = employees.value
    .filter(emp => emp.selected)
    .map(({ id, name, position }) => ({
      id,
      name,
      position
    }));

  emit('add', selectedEmployees);
  closeModal();
}
</script>

<style scoped lang="scss">
.employee-selection-modal {
  width: 900px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .modal-header {
    padding-bottom: 0;
  }

  .filter-section {
    padding-bottom: 0;
  }

  .table-section {
    padding-top: 0;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .employee-table {
    flex: 1;

    :deep(.q-table__middle) {
      max-height: calc(70vh - 150px);
      overflow-y: auto;
    }

    :deep(.q-table__top) {
      padding-top: 0;
    }
  }

  .modal-actions {
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    .action-btn {
      min-width: 120px;
    }
  }
}
</style>

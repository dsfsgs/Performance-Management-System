<template>
  <q-dialog
    :model-value="showModal"
    @update:model-value="closeModal"
    persistent
  >
    <q-card class="employee-selection-modal">
      <q-card-section class="modal-header">
        <div class="text-h6">Select Employees</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="searchQuery"
          placeholder="Search by name or position..."
          dense
          outlined
          clearable
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="table-section">
        <q-table
          :rows="filteredEmployees"
          :columns="columns"
          row-key="name"
          flat
          bordered
          hide-pagination
          :rows-per-page-options="[0]"
          class="employee-table"
          :filter="searchQuery"
        >
          <template v-slot:body-cell-selection="props">
            <q-td :props="props">
              <q-checkbox
                v-model="props.row.selected"
                dense
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="modal-actions">
        <q-btn
          label="Cancel"
          color="grey"
          flat
          @click="closeModal"
        />
        <q-btn
          label="Add Selected"
          color="primary"
          :disable="!hasSelection"
          @click="addEmployee"
          icon="add"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
const COLUMNS = [
  {
    name: 'selection',
    label: '',
    field: 'selected',
    align: 'left',
    headerStyle: 'width: 50px'
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
  }
];

const EMPLOYEES = [
  { name: "JANYLENE A. PALERMO, MM", position: "City Human Resource Management Officer - 25", selected: false },
  { name: "FRUNNIE A. BOISER", position: "Supervising Administrative Officer (HRMO IV) - 22", selected: false },
  { name: "DAVE MARK P. LUZANO", position: "Senior Administrative Assistant I (Data Controller IV) - 13", selected: false },
  { name: "JOGRAD M. MAHUSAY", position: "Computer Programmer II", selected: false },
  { name: "NEW EMPLOYEE 1", position: "Example Position", selected: false },
  { name: "NEW EMPLOYEE 2", position: "Example Position", selected: false },
  { name: "NEW EMPLOYEE 3", position: "Example Position", selected: false }
];

export default {
  props: {
    showModal: Boolean
  },

  data() {
    return {
      searchQuery: "",
      employees: [...EMPLOYEES],
      columns: COLUMNS
    };
  },

  computed: {
    filteredEmployees() {
      if (!this.searchQuery) return this.employees;

      const query = this.searchQuery.toLowerCase();
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query)
      );
    },

    hasSelection() {
      return this.employees.some(emp => emp.selected);
    }
  },

  methods: {
    closeModal() {
      // Reset selections when closing
      this.employees.forEach(emp => emp.selected = false);
      this.searchQuery = "";
      this.$emit("update:showModal", false);
    },

    addEmployee() {
      const selectedEmployees = this.employees
        .filter(emp => emp.selected)
        .map(({ name, position }) => ({ name, position }));

      this.$emit("add", selectedEmployees);
      this.closeModal();
    }
  }
};
</script>

<style scoped lang="scss">
.employee-selection-modal {
  width: 800px;
  max-width: 95vw;

  .modal-header {
    padding-bottom: 0;
  }

  .search-input {
    margin-bottom: 16px;
  }

  .table-section {
    padding-top: 0;
    max-height: 60vh;
  }

  .employee-table {
    height: 100%;

    :deep(.q-table__top) {
      padding-top: 0;
    }
  }

  .modal-actions {
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>

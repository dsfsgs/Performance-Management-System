<template>
  <q-dialog :model-value="showModal" @update:model-value="closeModal">
    <q-card class="add-employee-modal">
      <q-card-section>
        <q-input
          dense
          filled
          v-model="searchQuery"
          placeholder="Search by name, position, or others..."
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="table-container">
        <q-table
          :rows="filteredEmployees"
          :columns="columns"
          row-key="name"
          flat
          bordered
          hide-pagination
          dense
          class="scroll-table"
        >
          <template v-slot:body-cell-select="props">
            <q-td :props="props">
              <q-checkbox v-model="props.row.selected" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
  <q-btn label="Cancel" color="red" flat @click="closeModal" />
  <q-btn color="green" @click="addEmployee">
    <q-icon name="add" />
  </q-btn>
</q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    showModal: Boolean
  },
  data() {
    return {
      searchQuery: "",
      employees: [
        { name: "JANYLENE A. PALERMO, MM", position: "City Human Resource Management Officer - 25", selected: false },
        { name: "FRUNNIE A. BOISER", position: "Supervising Administrative Officer (HRMO IV) - 22", selected: false },
        { name: "DAVE MARK P. LUZANO", position: "Senior Administrative Assistant I (Data Controller IV) - 13", selected: false },
        { name: "JOGRAD M. MAHUSAY", position: "Computer Programmer II", selected: false },
        { name: "NEW EMPLOYEE 1", position: "Example Position", selected: false },
        { name: "NEW EMPLOYEE 2", position: "Example Position", selected: false },
        { name: "NEW EMPLOYEE 3", position: "Example Position", selected: false }
      ],
      columns: [
        { name: "select", label: "", field: "selected", align: "left" },
        { name: "name", label: "Name", field: "name", align: "left" },
        { name: "position", label: "Position", field: "position", align: "left" }
      ]
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    closeModal() {
      this.$emit("update:showModal", false);
    },
    addEmployee() {
      const selectedEmployees = this.employees.filter(emp => emp.selected);
      this.$emit("add", selectedEmployees);
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.add-employee-modal {
  width: 800px;
  max-width: 95vw;
  padding: 20px;
}

.search-input {
  margin-bottom: 10px;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.scroll-table {
  max-height: 300px;
  overflow-y: auto;
}
</style>

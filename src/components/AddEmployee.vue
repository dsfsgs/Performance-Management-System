<template>
  <div class="add-employee-container">
    <div class="header-container">
      <q-btn flat dense icon="arrow_back" class="back-btn" @click="goBack" />
      <h3 class="title">List of Employee</h3>
    </div>

    <div class="actions-container">
      <div class="right-actions">
        <q-input
          dense
          filled
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <button class="add-employee-btn" @click="showModal = true">
          <q-icon name="add" /> Add Employee
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Strategic Function</th>
            <th>Core Function</th>
            <th>Support Function</th>
            <th>Adjectival Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in filteredEmployees" :key="index">
            <td>{{ employee.name }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.strategicFunction }}</td>
            <td>{{ employee.coreFunction }}</td>
            <td>{{ employee.supportFunction }}</td>
            <td>{{ employee.adjectivalRating }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Employee Modal -->
    <AddEmployeeModal :showModal="showModal" @update:showModal="showModal = $event" @add="handleAddedEmployees" />

  </div>
</template>

<script>
import AddEmployeeModal from "../components/AddEmployeeModal.vue";

export default {
  components: {
    AddEmployeeModal
  },
  emits: ["back"],
  data() {
    return {
      searchQuery: "",
      showModal: false,
      employees: [
        { name: "JANYLENE A. PALERMO, MM", position: "City Human Resource Management Officer - 25", strategicFunction: 5, coreFunction: 5, supportFunction: 5, adjectivalRating: 5 },
        { name: "FRUNNIE A. BOISER", position: "Supervising Administrative Officer (HRMO IV) - 22", strategicFunction: 5, coreFunction: 5, supportFunction: 5, adjectivalRating: 5 },
        { name: "DAVE MARK P. LUZANO", position: "Senior Administrative Assistant I (Data Controller IV) - 13", strategicFunction: 5, coreFunction: 5, supportFunction: 5, adjectivalRating: 5 },
        { name: "JOGRAD M. MAHUSAY", position: "Computer Programmer II", strategicFunction: 5, coreFunction: 5, supportFunction: 5, adjectivalRating: 5 }
      ]
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    goBack() {
      this.$emit("back");
    },
    handleAddedEmployees(selectedEmployees) {
      console.log("Added Employees:", selectedEmployees);
      this.showModal = false;
    }
  }
};
</script>


<style scoped>
.add-employee-container {
  padding: 20px;
  background: #f9f9f9;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 250px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th, .employee-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.employee-table th {
  background: #e0e0e0;
  font-weight: bold;
}

.add-employee-btn {
  padding: 10px 15px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.add-employee-btn:hover {
  background: #45a049;
}

.back-btn {
  color: #333;
}
</style>

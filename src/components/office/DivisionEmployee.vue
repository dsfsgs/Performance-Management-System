<template>
  <div>
    <!-- Header with navigation -->
    <div class="row items-center justify-between q-mb-sm">
      <div class="text-h7">{{ division }}</div>
      <q-btn flat icon="arrow_back" label="Back" color="grey-8" class="q-ml-auto" @click="$emit('back')" />
    </div>
    <q-separator class="q-mb-md" />

    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-md-4 q-pr-sm">
        <q-input v-model="search" outlined dense placeholder="Search employees" clearable>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="row q-gutter-sm">
        <q-btn :style="{ backgroundColor: '#077A37' }" icon="add" label="Add Other Employee" @click="$emit('create')"
          text-color="white" icon-color="white" unelevated no-caps />
      </div>
    </div>

    <!-- Employee Table -->
    <q-card flat bordered>
      <q-table :rows="filteredEmployees" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }"
        :loading="loading" :filter="search" binary-state-sort>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="background-color: #EBEBEB;">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-md text-grey-7">
            <q-icon name="sentiment_dissatisfied" size="24px" class="q-mr-sm" />
            No employees found for this division
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row items-center justify-center q-gutter-x-sm">
              <q-btn flat round size="sm" color="info" icon="visibility" @click="viewEmployee(props.row)" />
              <q-btn flat round size="sm" color="primary" icon="edit" @click="editEmployee(props.row)" />
              <q-btn flat round size="sm" color="negative" icon="delete" @click="deleteEmployee(props.row)" />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- View Employee Modal -->
    <employee-view-modal v-model="showViewModal" :employee="selectedEmployee"
      :performance-standards="selectedEmployee?.performanceStandards || []" />

    <!-- Edit Employee Modal -->
    <employee-edit-modal v-model="showEditModal" :employee="selectedEmployee"
      :performance-standards="selectedEmployee?.performanceStandards || []" @save="handleSaveEmployee" />
  </div>
</template>

<script>
import EmployeeViewModal from './EmployeeViewModal.vue';
import EmployeeEditModal from './EmployeeEditModal.vue';

export default {
  components: {
    EmployeeViewModal,
    EmployeeEditModal
  },
  props: {
    division: {
      type: String,
      required: true
    },
    employeeData: {
      type: Object,
      default: null
    }
  },
  emits: ['back', 'create'],
  data() {
    return {
      search: "",
      loading: false,
      columns: [
        { name: 'name', label: 'Employee Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
      ],
      employees: [],
      selectedEmployee: null,
      showViewModal: false,
      showEditModal: false
    };
  },
  computed: {
    filteredEmployees() {
      // If we have employee data from the prop, add it to the employees array
      let allEmployees = [...this.employees];

      if (this.employeeData && this.employeeData.employeeName) {
        // Check if the employee already exists in the array
        const exists = allEmployees.some(emp =>
          emp.name === this.employeeData.employeeName &&
          emp.position === this.employeeData.position
        );

        if (!exists) {
          allEmployees.push({
            id: `new-${Date.now()}`,
            name: this.employeeData.employeeName,
            position: this.employeeData.position,
            rank: this.employeeData.rank,
            performanceStandards: this.employeeData.performanceStandards || []
          });
        }
      }

      if (!this.search) return allEmployees;

      const searchLower = this.search.toLowerCase();
      return allEmployees.filter(employee => {
        return Object.values(employee).some(
          value => typeof value === 'string' && value.toLowerCase().includes(searchLower)
        );
      });
    }
  },
  methods: {
    fetchEmployees() {
      this.loading = true;
      setTimeout(() => {
        const data = {
          "Recruitment, Selection and Records Management Division": [
            {
              id: 1,
              name: "Alice Santos",
              position: "HR Officer",
              rank: "SG-18",
              performanceStandards: [
                {
                  coreCompetency: "DSE-4",
                  leadershipCompetency: "TSC-4",
                  technicalCompetency: "RM-3",
                  successIndicator: "100% of HR reports submitted on time",
                  requiredOutput: "Monthly HR reports",
                  mfo1: "A",
                  mfo2: "M1",
                  mfo3: "O1",
                  standardOutcomeRows: [
                    { rating: '5', quantity: '100%', timeliness: 'Before deadline', effectiveness: 'Excellent' },
                    { rating: '4', quantity: '90-99%', timeliness: 'On time', effectiveness: 'Very good' },
                    { rating: '3', quantity: '80-89%', timeliness: '1 day late', effectiveness: 'Good' },
                    { rating: '2', quantity: '70-79%', timeliness: '2 days late', effectiveness: 'Fair' },
                    { rating: '1', quantity: 'Below 70%', timeliness: '3+ days late', effectiveness: 'Poor' }
                  ]
                }
              ]
            },
            {
              id: 2,
              name: "Miguel Cruz",
              position: "Records Specialist",
              rank: "SG-12",
              performanceStandards: []
            },
            {
              id: 3,
              name: "Sofia Reyes",
              position: "Recruitment Specialist",
              rank: "SG-14",
              performanceStandards: []
            }
          ],
          "Performance, Management, Incentives, Rewards and Recognition Division": [
            {
              id: 4,
              name: "Juan Dela Cruz",
              position: "Performance Manager",
              rank: "SG-21",
              performanceStandards: []
            },
            {
              id: 5,
              name: "Maria Garcia",
              position: "Rewards Specialist",
              rank: "SG-14",
              performanceStandards: []
            }
          ],
          "Employees Compensation, Welfare and Benefits Division": [
            {
              id: 6,
              name: "Pedro Reyes",
              position: "Benefits Coordinator",
              rank: "SG-17",
              performanceStandards: []
            },
            {
              id: 7,
              name: "Linda Lim",
              position: "Compensation Analyst",
              rank: "SG-15",
              performanceStandards: []
            }
          ],
          "Human Resource Development Division": [
            {
              id: 8,
              name: "Roberto Tan",
              position: "Training Manager",
              rank: "SG-20",
              performanceStandards: []
            },
            {
              id: 9,
              name: "Ana Gomez",
              position: "Development Specialist",
              rank: "SG-14",
              performanceStandards: []
            }
          ]
        };
        this.employees = data[this.division] || [];
        this.loading = false;
      }, 500);
    },
    viewEmployee(employee) {
      this.selectedEmployee = { ...employee };
      this.showViewModal = true;
    },
    editEmployee(employee) {
      this.selectedEmployee = { ...employee };
      this.showEditModal = true;
    },
    deleteEmployee(employee) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${employee.name}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.employees = this.employees.filter(emp => emp.id !== employee.id);

        // If the deleted employee is currently selected, clear the selection
        if (this.selectedEmployee && this.selectedEmployee.id === employee.id) {
          this.selectedEmployee = null;
        }

        this.$q.notify({
          message: `Employee ${employee.name} deleted`,
          color: 'negative',
          icon: 'delete',
          position: 'top-right'
        });
      });
    },
    handleSaveEmployee(data) {
      const { employee, performanceStandards } = data;

      // Find the employee in the employees array
      const index = this.employees.findIndex(emp => emp.id === employee.id);

      if (index !== -1) {
        // Update existing employee
        this.employees[index] = {
          ...this.employees[index],
          name: employee.name,
          position: employee.position,
          rank: employee.rank,
          performanceStandards: performanceStandards
        };
      } else {
        // Add new employee
        const newEmployee = {
          id: `emp-${Date.now()}`,
          name: employee.name,
          position: employee.position,
          rank: employee.rank,
          performanceStandards: performanceStandards
        };

        this.employees.push(newEmployee);
      }

      this.$q.notify({
        message: `Employee ${employee.name} successfully saved`,
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
    }
  },
  mounted() {
    this.fetchEmployees();
  },
  watch: {
    // If employeeData changes (a new employee is added), refresh the filtered employees
    employeeData: {
      handler(newVal) {
        if (newVal && newVal.employeeName) {
          // Handle the new employee data
          this.$nextTick(() => {
            const newEmployee = this.filteredEmployees.find(
              emp => emp.name === newVal.employeeName && emp.position === newVal.position
            );
            if (newEmployee) {
              // Optionally show this employee in the view modal
              // this.selectedEmployee = newEmployee;
              // this.showViewModal = true;
            }
          });
        }
      },
      deep: true
    }
  }
};
</script>
<!--Division Employee-->
<template>
  <div>
    <div class="row items-center justify-between">
      <div class="text-h7">{{ division }}</div>
      <!-- <div class="text-caption text-grey-8">Target Period: {{ targetPeriod }}</div> -->
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
        <q-btn v-if="showAdd" :style="{ backgroundColor: '#077A37' }" icon="add" label="Add Employee"
          @click="handleAddEmployee" text-color="white" icon-color="white" unelevated no-caps />
      </div>
    </div>

    <!-- Employee Table -->
    <div class="text-caption text-grey-8">Target Period: {{ targetPeriod }}</div>
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
              <q-btn v-if="showEdit" flat round size="sm" color="primary" icon="edit"
                @click="editEmployee(props.row)" />
              <q-btn v-if="showDelete" flat round size="sm" color="negative" icon="delete"
                @click="deleteEmployee(props.row)" />
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
import { useUnitWorkPlanStore } from 'src/stores/office/unit_work_plantStore';
import { api } from 'src/boot/axios'

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
    targetPeriod: {
      type: String,
      default: ""
    },
    employeeData: {
      type: Object,
      default: null
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back', 'create', 'add-employee'],
  data() {
    return {
      search: "",
      loading: false,
      columns: [
        { name: 'name', label: 'Employee Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
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
      let allEmployees = [...this.employees];

      if (this.employeeData && this.employeeData.employeeName) {
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
            status: 'Pending',
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

    async fetchEmployees() {
      this.loading = true;
      try {
        const store = useUnitWorkPlanStore();
        await store.fetchEmployeesByDivision(this.division, this.targetPeriod);

        // Map the API response to our expected format
        this.employees = store.employeesWithWorkPlans.map(emp => ({
          id: emp.id,
          name: emp.employee_name,
          position: emp.position,
          category: emp.category,
          mfo: emp.mfo,
          output: emp.output,
          rank: emp.rank,
          status: emp.status || 'Pending',
          performanceStandards: emp.performance_standards || []
        }));
      } catch (error) {
        console.error('Error fetching employees:', error);
        this.$q.notify({
          message: 'Failed to fetch employees',
          color: 'negative',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
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


    async handleSaveEmployee(data) {
      const { employee, performanceStandards } = data;
      // eslint-disable-next-line no-unused-vars
      const store = useUnitWorkPlanStore();

      try {
        this.loading = true;

        // Prepare the payload for the update
        const payload = {
          employee_id: employee.id,
          rank: employee.rank,
          position: employee.position,
          category: employee.category,
          mfo: employee.mfo,
          output: employee.output,
          performance_standards: performanceStandards.map(standard => ({
            success_indicator: standard.successIndicator,
            required_output: standard.requiredOutput,
            standard_outcomes: standard.standardOutcomeRows,
            core_competency: standard.coreCompetency,
            technical_competency: standard.technicalCompetency,
            leadership_competency: standard.leadershipCompetency
          }))
        };

        // Call the API to update the employee
        // eslint-disable-next-line no-unused-vars
        const response = await api.post(`/employee/${employee.id}/update/unitworkplan`, payload);

        // Update local state if API call is successful
        const index = this.employees.findIndex(emp => emp.id === employee.id);
        if (index !== -1) {
          this.employees[index] = {
            ...this.employees[index],
            ...employee,
            performanceStandards: performanceStandards
          };
        }

        this.$q.notify({
          message: `Employee ${employee.name} successfully updated`,
          color: 'positive',
          icon: 'check_circle',
          position: 'top-right'
        });

        this.showEditModal = false;
      } catch (error) {
        console.error('Error updating employee:', error);
        this.$q.notify({
          message: 'Failed to update employee',
          color: 'negative',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    handleAddEmployee() {
      this.$emit('add-employee', {
        division: this.division,
        targetPeriod: this.targetPeriod
      });
    }
  },
  mounted() {
    this.fetchEmployees();
  },
  watch: {
    employeeData: {
      handler(newVal) {
        if (newVal && newVal.employeeName) {
          this.$nextTick(() => {
            const newEmployee = this.filteredEmployees.find(
              emp => emp.name === newVal.employeeName && emp.position === newVal.position
            );
            if (newEmployee) {
              this.selectedEmployee = newEmployee;
              this.showViewModal = true;
            }
          });
        }
      },
      deep: true
    }
  }
};
</script>

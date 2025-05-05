<!-- eslint-disable vue/multi-word-component-names -->
<!-- employee.vue -->
<template>
  <div>
    <div class="row items-center justify-between">
      <div class="text-h7">{{ division }} {{ targetPeriod }}</div>
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
    </div>

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
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <employee-view-modal v-model="showViewModal" :employee="selectedEmployee"
      :performance-standards="selectedEmployee?.performanceStandards || []" />
  </div>
</template>
<script>
import EmployeeViewModal from '../unitworkplan/EmployeeViewModal.vue';
import { api } from 'src/boot/axios'

export default {
  components: {
    EmployeeViewModal,
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
    officeId: {
      type: [String, Number],
      required: true
    },
  },
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
        const response = await api.get('/planning/unit_work_plan/employees', {
          params: {
            division: this.division,
            target_period: this.targetPeriod,
            office_id: this.officeId
          }
        });

        this.employees = response.data.map(emp => {
          const workPlans = emp.unit_work_plans || [];

          return {
            id: emp.id,
            name: emp.name,
            position: emp.position,
            rank: emp.rank,
            status: workPlans.length > 0 ? workPlans[0].status : 'Pending',
            workPlans: workPlans.map(plan => ({
              id: plan.id,
              mfo: plan.mfo,
              category: plan.category,
              output: plan.output,
              successIndicator: plan.success_indicator,
              requiredOutput: plan.required_output,
              coreCompetency: plan.core || {},
              technicalCompetency: plan.technical || {},
              leadershipCompetency: plan.leadership || {},
              standardOutcomes: plan.standard_outcomes || [],
              status: plan.status || 'Pending'
            }))
          };
        });
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
      this.selectedEmployee = {
        ...employee,
        performanceStandards: employee.workPlans.map(plan => ({
          ...plan,
          core_competency: plan.coreCompetency,
          technical_competency: plan.technicalCompetency,
          leadership_competency: plan.leadershipCompetency,
          standard_outcomes: plan.standardOutcomes,
          success_indicator: plan.successIndicator,
          required_output: plan.requiredOutput
        }))
      };
      this.showViewModal = true;
    },
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

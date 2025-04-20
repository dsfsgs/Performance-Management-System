<template>
  <q-page class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section style="background-color: #205540;">
        <div class="text-h7 text-white">Create Unit Work Plan</div>
      </q-card-section>

      <q-separator />

      <!-- Common fields section -->
      <q-card-section class="common-fields-section">
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="selectedDivision" :options="divisionOptions" label="Division" stack-label
              @update:model-value="fetchEmployees" class="no-bottom-margin"
              :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="targetPeriod" :options="periodOptions" label="Target Period" stack-label
              class="no-bottom-margin" :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="targetYear" :options="yearOptions" label="Year" stack-label
              class="no-bottom-margin" :rules="[val => !!val || 'Field is required']" use-input input-debounce="0"
              @filter="filterYears" behavior="menu" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Employee work plans (tabbed interface) -->
      <q-tabs v-model="activeTab" class="text-primary" align="left" narrow-indicator>
        <q-tab v-for="(workPlan, index) in employeeWorkPlans" :key="index" :name="'emp-' + index"
          :label="`Employee ${index + 1}${workPlan.employeeName ? ': ' + workPlan.employeeName : ''}`" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel v-for="(workPlan, empIndex) in employeeWorkPlans" :key="empIndex" :name="'emp-' + empIndex">
          <!-- Employee selection -->
          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-sm-12">
              <q-select filled v-model="workPlan.employeeId" :options="getFilteredEmployeeOptions(empIndex)"
                label="Employee Name" stack-label option-label="name" option-value="id" emit-value map-options
                @update:model-value="(val) => {
                  clearEmployeeData(empIndex);
                  fillEmployeeDetails(val, empIndex);
                }" class="q-mb-sm" :rules="[val => !!val || 'Field is required']" />
            </div>
            <div class="col-md-4 col-sm-12">
              <q-input filled v-model="workPlan.rank" label="Rank" stack-label class="q-mb-sm" readonly
                :rules="[val => !!val || 'Field is required']" />
            </div>
            <div class="col-md-4 col-sm-12">
              <q-input filled v-model="workPlan.position" label="Position" stack-label class="q-mb-sm" readonly
                :rules="[val => !!val || 'Field is required']" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Performance Standards for this employee -->
          <div v-for="(standard, stdIndex) in workPlan.performanceStandards" :key="'std-' + empIndex + '-' + stdIndex">
            <div class="performance-standard-container q-pa-md" :class="{ 'bg-grey-1': stdIndex % 2 === 0 }">
              <div class="standard-header row items-center justify-between q-mb-md">
                <div class="text-h7 text-weight-medium">Performance Standard {{ stdIndex + 1 }}</div>
                <q-btn v-if="stdIndex > 0" icon="delete" color="negative" flat round dense
                  @click="removePerformanceStandard(empIndex, stdIndex)" class="q-ml-sm" />
              </div>

              <performance-standards :ref="`perfStd_${empIndex}_${stdIndex}`"
                :employee-competencies="employeeWorkPlans[empIndex].competencies"
                :initialMergedCoreCompetency="standard.coreCompetency"
                :initialMergedLeadershipCompetency="standard.leadershipCompetency"
                :initialMergedTechnicalCompetency="standard.technicalCompetency" />
            </div>

            <q-separator v-if="stdIndex < workPlan.performanceStandards.length - 1" />
          </div>

          <!-- Add performance standard button -->
          <div class="text-center q-pt-md">
            <q-btn icon="add" label="Add Another Performance Standard" color="primary" outline
              @click="addPerformanceStandard(empIndex)" />
          </div>

          <!-- Remove employee button (except for first one) -->
          <div v-if="empIndex > 0" class="text-right q-pt-md">
            <q-btn icon="person_remove" label="Remove This Employee" color="negative" outline
              @click="removeEmployee(empIndex)" />
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <div class="row full-width justify-between items-center">
          <div>
            <q-btn icon="person_add" label="Add Other Employee" color="secondary" outline @click="addEmployee"
              :disabled="!canAddMoreEmployees" class="q-mr-sm" />
          </div>
          <div>
            <q-btn label="Reset" color="grey-7" flat @click="confirmReset" class="q-mr-sm" />
            <q-btn icon="save" label="Save Work Plan" color="primary" unelevated @click="saveForm" />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import PerformanceStandards from "../office/PerformanceStandard.vue";
import { useUserStore } from 'src/stores/userStore';
import { useUnitWorkPlanStore } from 'src/stores/office/unit_work_plantStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

export default {
  components: {
    PerformanceStandards
  },

  setup() {
    // eslint-disable-next-line no-unused-vars
    const userStore = useUserStore();
    const unitWorkPlanStore = useUnitWorkPlanStore();

    // Active tab tracker
    const activeTab = ref('emp-0');

    // Array to store employee work plans (employee + their performance standards)
    const employeeWorkPlans = ref([
      {
        employeeId: null,
        employeeName: '',
        rank: '',
        position: '',
        performanceStandards: [{}]
      }
    ]);

    // Destructure reactive state from the store
    const {
      selectedDivision,
      divisionOptions,
      employeeOptions,
      targetPeriod,
      targetYear,
      periodOptions,
      yearOptions,
      filteredYears
    } = storeToRefs(unitWorkPlanStore);

    // Check if more employees can be added
    const canAddMoreEmployees = computed(() => {
      // Get all currently selected employee IDs
      const selectedIds = employeeWorkPlans.value
        .map(plan => plan.employeeId)
        .filter(id => id !== null);

      // Count available unselected employees
      const availableEmployees = employeeOptions.value.filter(emp => !selectedIds.includes(emp.id));

      return availableEmployees.length > 0;
    });

    // Destructure actions
    const {
      fetchDivisions,
      fetchEmployees,
      saveWorkPlan,
      resetForm,
      filterYears
    } = unitWorkPlanStore;

    return {
      selectedDivision,
      divisionOptions,
      employeeOptions,
      targetPeriod,
      targetYear,
      periodOptions,
      yearOptions,
      filteredYears,
      activeTab,
      employeeWorkPlans,
      canAddMoreEmployees,
      fetchDivisions,
      fetchEmployees,
      saveWorkPlan,
      resetForm,
      filterYears
    };
  },

  async created() {
    const userStore = useUserStore();
    if (userStore.officeId) {
      await this.fetchDivisions();
    }
  },

  methods: {
    clearEmployeeData(empIndex) {
      this.employeeWorkPlans[empIndex].performanceStandards = [{}];
      this.employeeWorkPlans[empIndex].competencies = {
        core: {},
        technical: {},
        leadership: {}
      };
    },

    // Get filtered employee options (excluding already selected employees)
    getFilteredEmployeeOptions(currentIndex) {
      // Get all employee IDs that are currently selected (except the current one)
      const selectedIds = this.employeeWorkPlans
        .map((plan, index) => index !== currentIndex ? plan.employeeId : null)
        .filter(id => id !== null);

      // Return only employees that aren't already selected
      return this.employeeOptions.filter(emp => !selectedIds.includes(emp.id));
    },

    // Add a new employee with initial performance standard
    addEmployee() {
      // Check if we can add more employees
      if (!this.canAddMoreEmployees) {
        this.$q.notify({
          message: 'No more employees available to add',
          color: 'warning',
          icon: 'warning',
          position: 'top-right'
        });
        return;
      }

      const newIndex = this.employeeWorkPlans.length;
      this.employeeWorkPlans.push({
        employeeId: null,
        employeeName: '',
        rank: '',
        position: '',
        performanceStandards: [{}]
      });

      // Switch to the new employee tab
      this.activeTab = 'emp-' + newIndex;

      this.$q.notify({
        message: 'New employee added',
        color: 'secondary',
        icon: 'person_add',
        position: 'top-right'
      });
    },

    // Remove an employee
    removeEmployee(index) {
      this.$q.dialog({
        title: 'Confirm Removal',
        message: 'Are you sure you want to remove this employee?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.employeeWorkPlans.splice(index, 1);
        this.activeTab = 'emp-0';

        this.$q.notify({
          message: 'Employee removed',
          color: 'info',
          icon: 'person_remove',
          position: 'top-right'
        });
      });
    },

    // Add a performance standard to an employee
    addPerformanceStandard(employeeIndex) {
      this.employeeWorkPlans[employeeIndex].performanceStandards.push({
        coreCompetency: null,
        leadershipCompetency: null,
        technicalCompetency: null
      });
    },

    // Remove a performance standard from an employee
    removePerformanceStandard(employeeIndex, standardIndex) {
      this.employeeWorkPlans[employeeIndex].performanceStandards.splice(standardIndex, 1);
    },

    async fillEmployeeDetails(employeeId, empIndex) {
      const store = useUnitWorkPlanStore(); // Get store instance
      const employee = this.employeeOptions.find(e => e.id === employeeId);

      if (employee) {
        this.employeeWorkPlans[empIndex].rank = employee.rank || '';
        this.employeeWorkPlans[empIndex].position = employee.position || '';
        this.employeeWorkPlans[empIndex].employeeName = employee.name || '';

        try {
          const competencies = await store.fetchEmployeeCompetencies(employeeId);
          this.employeeWorkPlans[empIndex].competencies = competencies || {
            core: {},
            technical: {},
            leadership: {}
          };
        } catch (error) {
          console.error('Error loading competencies:', error);
          this.employeeWorkPlans[empIndex].competencies = {
            core: {},
            technical: {},
            leadership: {}
          };
        }
      }
    },

    async saveForm() {
      try {
        // Validate that at least one employee is selected
        const valid = this.employeeWorkPlans.some(plan => plan.employeeId);
        if (!valid) {
          this.$q.notify({
            message: 'Please select at least one employee',
            color: 'negative',
            icon: 'warning',
            position: 'top-right'
          });
          return;
        }

        // Collect data from all employee work plans
        const allWorkPlans = [];

        for (let empIndex = 0; empIndex < this.employeeWorkPlans.length; empIndex++) {
          const plan = this.employeeWorkPlans[empIndex];

          // Skip empty employee selections
          if (!plan.employeeId) continue;

          const employeeData = {
            employeeId: plan.employeeId,
            performanceData: []
          };

          // Get performance standards data for this employee
          for (let stdIndex = 0; stdIndex < plan.performanceStandards.length; stdIndex++) {
            const refName = `perfStd_${empIndex}_${stdIndex}`;
            const compRef = this.$refs[refName];
            if (compRef && compRef[0]) {
              const standardData = compRef[0].getFormData();
              if (standardData) {
                employeeData.performanceData.push(standardData);
              }
            }
          }

          allWorkPlans.push(employeeData);
        }

        // Save all employee work plans
        await this.saveWorkPlan(allWorkPlans);

        this.$q.notify({
          message: 'Work plans saved successfully',
          color: 'positive',
          icon: 'check_circle',
          position: 'top-right'
        });

        this.resetFormData();
      } catch (error) {
        console.error('Error saving work plans:', error);
        this.$q.notify({
          message: 'Failed to save work plans: ' + (error.response?.data?.message || error.message),
          color: 'negative',
          icon: 'error',
          position: 'top-right'
        });
      }
    },

    confirmReset() {
      this.$q.dialog({
        title: 'Confirm Reset',
        message: 'Are you sure you want to reset all fields?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.resetFormData();

        this.$q.notify({
          message: 'Form has been reset',
          color: 'info',
          icon: 'info',
          position: 'top-right'
        });
      });
    },

    resetFormData() {
      // Reset the store form data
      this.resetForm();

      // Reset employee work plans
      this.employeeWorkPlans = [
        {
          employeeId: null,
          employeeName: '',
          rank: '',
          position: '',
          performanceStandards: [
            {
              coreCompetency: null,
              leadershipCompetency: null,
              technicalCompetency: null
            }
          ]
        }
      ];

      // Reset active tab
      this.activeTab = 'emp-0';

      // Refetch the divisions
      const userStore = useUserStore();
      if (userStore.officeId) {
        this.fetchDivisions();
      }
    }
  }
};
</script>

<style scoped>
.my-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.performance-standard-container {
  position: relative;
  transition: all 0.3s ease;
}

.performance-standard-container:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.standard-header {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.q-field--filled .q-field__control {
  border-radius: 6px;
}

.q-separator {
  background-color: rgba(0, 0, 0, 0.08);
}

.q-tab-panels {
  background-color: white;
}

/* Fix the spacing under division */
.common-fields-section {
  padding-bottom: 8px;
}

.no-bottom-margin {
  margin-bottom: 0 !important;
}

/* Override Quasar's default bottom padding for fields in this section */
.common-fields-section .q-field__bottom {
  padding-top: 2px;
  min-height: 16px;
}

.q-card-actions .row {
  width: 100%;
}
</style>

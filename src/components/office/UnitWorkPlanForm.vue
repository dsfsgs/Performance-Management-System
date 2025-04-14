<template>
  <q-page class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section style="background-color: #205540;">
        <div class="text-h7 text-white">Create Unit Work Plan</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="selectedDivision" :options="divisionOptions" label="Division" stack-label
              @update:model-value="fetchEmployees" class="q-mb-sm" :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="targetPeriod" :options="periodOptions" label="Target Period" stack-label
              class="q-mb-sm" :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="targetYear" :options="yearOptions" label="Year" stack-label class="q-mb-sm"
              :rules="[val => !!val || 'Field is required']" use-input input-debounce="0" @filter="filterYears"
              behavior="menu" />
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-sm-12">
            <q-select filled v-model="selectedEmployee" :options="employeeOptions" label="Employee Name" stack-label
              option-label="name" option-value="id" emit-value map-options @update:model-value="fillEmployeeDetails"
              class="q-mb-sm" :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-input filled v-model="rank" label="Rank" stack-label class="q-mb-sm" readonly
              :rules="[val => !!val || 'Field is required']" />
          </div>
          <div class="col-md-4 col-sm-12">
            <q-input filled v-model="position" label="Position" stack-label class="q-mb-sm" readonly
              :rules="[val => !!val || 'Field is required']" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Performance Standards Section -->
      <q-card-section class="q-pa-none">
        <div v-for="(standard, index) in performanceStandards" :key="index">
          <div class="performance-standard-container q-pa-md" :class="{ 'bg-grey-1': index % 2 === 0 }">
            <div class="standard-header row items-center justify-between q-mb-md">
              <div class="text-h7 text-weight-medium">Performance Standard {{ index + 1 }}</div>
              <q-btn v-if="index > 0" icon="delete" color="negative" flat round dense
                @click="removePerformanceStandard(index)" class="q-ml-sm" />
            </div>

            <performance-standards :ref="'performanceStandards_' + index"
              :initialMergedCoreCompetency="standard.coreCompetency"
              :initialMergedLeadershipCompetency="standard.leadershipCompetency"
              :initialMergedTechnicalCompetency="standard.technicalCompetency" />
          </div>

          <q-separator v-if="index < performanceStandards.length - 1" />
        </div>
      </q-card-section>

      <!-- Add button section -->
      <q-card-section class="text-center q-pt-md">
        <q-btn icon="add" label="Add Another Performance Standard" color="primary" outline
          @click="addPerformanceStandard" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Reset" color="grey-7" flat @click="resetForm" class="q-mr-sm" />
        <q-btn icon="save" label="Save Work Plan" color="primary" unelevated @click="saveForm" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script>
import PerformanceStandards from "../office/PerformanceStandard.vue";
import { useUserStore } from 'src/stores/userStore';
import { useUnitWorkPlanStore } from 'src/stores/office/unit_work_plantStore';
import { storeToRefs } from 'pinia';

export default {
  components: {
    PerformanceStandards
  },

  setup() {
    // eslint-disable-next-line no-unused-vars
    const userStore = useUserStore();
    const unitWorkPlanStore = useUnitWorkPlanStore();

    // Destructure reactive state from the store
    const {
      selectedDivision,
      divisionOptions,
      selectedEmployee,
      employeeOptions,
      rank,
      position,
      targetPeriod,
      targetYear,
      periodOptions,
      yearOptions,
      filteredYears,
      performanceStandards
    } = storeToRefs(unitWorkPlanStore);

    // Destructure actions
    const {
      fetchDivisions,
      fetchEmployees,
      fillEmployeeDetails,
      filterYears,
      saveWorkPlan,
      resetForm,
      addPerformanceStandard,
      removePerformanceStandard
    } = unitWorkPlanStore;

    return {
      selectedDivision,
      divisionOptions,
      selectedEmployee,
      employeeOptions,
      rank,
      position,
      targetPeriod,
      targetYear,
      periodOptions,
      yearOptions,
      filteredYears,
      performanceStandards,
      fetchDivisions,
      fetchEmployees,
      fillEmployeeDetails,
      filterYears,
      saveWorkPlan,
      resetForm,
      addPerformanceStandard,
      removePerformanceStandard
    };
  },

  async created() {
    const userStore = useUserStore();
    if (userStore.officeId) {
      await this.fetchDivisions();
    }
  },

  methods: {
    async saveForm() {
      try {
        const performanceData = this.performanceStandards.map((_, index) => {
          const refName = 'performanceStandards_' + index;
          const compRef = this.$refs[refName];
          return compRef && compRef[0] ? compRef[0].getFormData() : null;
        }).filter(data => data !== null);

        await this.saveWorkPlan(performanceData);

        this.$q.notify({
          message: 'Work plan saved successfully',
          color: 'positive',
          icon: 'check_circle',
          position: 'top-right'
        });

        this.resetForm();
      } catch (error) {
        console.error('Error saving work plan:', error);
        this.$q.notify({
          message: 'Failed to save work plan: ' + (error.response?.data?.message || error.message),
          color: 'negative',
          icon: 'error',
          position: 'top-right'
        });
      }
    },

    // eslint-disable-next-line vue/no-dupe-keys
    resetForm() {
      this.$q.dialog({
        title: 'Confirm Reset',
        message: 'Are you sure you want to reset all fields?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.resetForm();

        // Reset the first performance standards component
        const refName = 'performanceStandards_0';
        if (this.$refs[refName] && this.$refs[refName][0]) {
          this.$refs[refName][0].resetComponentData();
        }

        const userStore = useUserStore();
        if (userStore.officeId) {
          this.fetchDivisions();
        }

        this.$q.notify({
          message: 'Form has been reset',
          color: 'info',
          icon: 'info',
          position: 'top-right'
        });
      });
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
</style>

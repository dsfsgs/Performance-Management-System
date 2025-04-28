<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h6 class="text-h6 q-mb-xs">Unit Work Plan</h6>
      </div>
      <q-btn v-if="showUWP" flat round icon="close" @click="showUWP = false" color="negative" class="q-pa-none" />
    </div>

    <!-- Unit Work Plan Form -->
    <div v-if="showUWP">
      <UnitWorkPlanForm @form-saved="onFormSaved" :prefilledData="prefilledFormData" />
    </div>

    <!-- Combined Filter and Table Component -->
    <MainTable v-if="!showUWP && !selectedDivision" :rows="rows" @create="showUWP = true" @row-click="onDivisionClick"
      :showOfficeFilter="false" :showOfficeColumn="false" :hideOPCRButton="true" :hideUnitWorkPlanButton="false"
      :showTargetPeriodFilter="true" @generate-uwp="generateUnitWorkPlan" />

    <!-- Division Detail -->
    <div v-if="selectedDivision && !showUWP" class="division-employee-container">
      <DivisionEmployee :division="selectedDivision" :targetPeriod="selectedRow ? selectedRow.targetPeriod : ''"
        :employeeData="selectedEmployeeData" @back="handleBack" @add-employee="openUnitWorkPlanForm" />
    </div>
  </q-page>
</template>

<script>
import UnitWorkPlanForm from 'src/components/unitworkplan/UnitWorkPlanForm.vue';
import DivisionEmployee from 'src/components/office/DivisionEmployee.vue';
import MainTable from 'src/components/office/MainTable.vue';
import { useUnitWorkPlanStore } from 'src/stores/office/unit_work_plantStore';

export default {
  components: {
    UnitWorkPlanForm,
    DivisionEmployee,
    MainTable
  },
  data() {
    return {
      showUWP: false,
      selectedDivision: null,
      selectedRow: null,
      selectedEmployeeData: null,
      latestEmployeeAdded: null,
      prefilledFormData: null,
      rows: []
    };
  },
  async created() {
    await this.fetchDivisionStatus();
  },
  methods: {

    async fetchDivisionStatus() {
      const store = useUnitWorkPlanStore();
      try {
        await store.fetchDivisionsWithStatus();
        this.rows = store.divisions.map(division => ({
          id: division.id,
          division: division.division,
          targetPeriod: division.target_period,
          dateCreated: new Date(division.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: division.status
        }));
      } catch (error) {
        console.error('Error fetching division status:', error);
        this.$q.notify({
          message: 'Failed to load division data',
          color: 'negative',
          icon: 'error'
        });
      }
    },
    onDivisionClick(row) {
      this.selectedDivision = row.division;
      this.selectedRow = row;
      if (this.latestEmployeeAdded && this.latestEmployeeAdded.division === row.division) {
        this.selectedEmployeeData = this.latestEmployeeAdded;
      } else {
        this.selectedEmployeeData = null;
      }
    },
    openUnitWorkPlanForm(data) {
      this.prefilledFormData = {
        division: data.division,
        targetPeriod: data.targetPeriod
      };
      this.showUWP = true;
    },
    handleBack() {
      this.selectedDivision = null;
      this.selectedRow = null;
    },
    onFormSaved(formData) {
      this.showUWP = false;

      const existingRowIndex = this.rows.findIndex(
        row => row.division === formData.division && row.targetPeriod === formData.targetPeriod
      );

      if (existingRowIndex === -1) {
        const newRow = {
          id: this.rows.length + 1,
          division: formData.division,
          targetPeriod: formData.targetPeriod,
          dateCreated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: "Pending"
        };
        this.rows.unshift(newRow);
        this.selectedRow = newRow;
      } else {
        this.selectedRow = this.rows[existingRowIndex];
      }

      this.latestEmployeeAdded = {
        division: formData.division,
        employeeName: formData.employeeName,
        position: formData.position,
        rank: formData.rank,
        performanceStandards: formData.performanceStandards
      };

      this.selectedDivision = formData.division;
      this.selectedEmployeeData = this.latestEmployeeAdded;

      this.$q.notify({
        message: 'Work plan saved successfully',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
    },
    async generateUnitWorkPlan() {
      try {
        const divisions = await this.store.fetchDivisionsWithWorkPlans(this.targetPeriodFilter);
        if (divisions.length > 0) {
          await this.selectDivision(divisions[0].division, divisions[0].target_period);
        }
        this.showUnitWorkPlanModal = true;
      } catch (error) {
        console.error('Error generating unit work plan:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to generate unit work plan. Please try again.'
        });
      }
    }
  }
};
</script>

<style scoped>
.division-employee-container {
  position: relative;
}
</style>

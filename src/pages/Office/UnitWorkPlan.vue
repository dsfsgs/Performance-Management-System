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
      <UnitWorkPlanForm @form-saved="onFormSaved" />
    </div>

    <!-- Combined Filter and Table Component -->
    <MainTable v-if="!showUWP && !selectedDivision" :rows="rows" @create="showUWP = true" @row-click="onDivisionClick"
      :showOfficeFilter="false" :showOfficeColumn="false" :hideOPCRButton="true" :hideUnitWorkPlanButton="false"
      :showTargetPeriodFilter="true" @generate-uwp="generateUnitWorkPlan" />

    <!-- Division Detail -->
    <div v-if="selectedDivision" class="division-employee-container">
      <DivisionEmployee :division="selectedDivision" :employeeData="selectedEmployeeData"
        @back="selectedDivision = null" />
    </div>
  </q-page>
</template>

<script>
import UnitWorkPlanForm from 'src/components/office/UnitWorkPlanForm.vue';
import DivisionEmployee from 'src/components/office/DivisionEmployee.vue';
import MainTable from 'src/components/office/MainTable.vue';

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
      selectedEmployeeData: null,
      latestEmployeeAdded: null,
      rows: [
        {
          id: 1,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2025",
          dateCreated: "December 3, 2024",
          status: "Pending"
        },
        {
          id: 2,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "December 3, 2024",
          status: "Approved"
        },
        {
          id: 3,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2024",
          status: "Pending"
        },
        {
          id: 4,
          division: "Human Resource Development Division",
          targetPeriod: "July - December 2023",
          dateCreated: "December 3, 2024",
          status: "Approved"
        },
        {
          id: 5,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2023",
          dateCreated: "June 3, 2024",
          status: "Pending"
        },
        {
          id: 6,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2022",
          dateCreated: "June 3, 2024",
          status: "Approved"
        }
      ]
    };
  },
  methods: {
    onDivisionClick(row) {
      this.selectedDivision = row.division;
      // If we have a latest employee added for this division, select it
      if (this.latestEmployeeAdded && this.latestEmployeeAdded.division === row.division) {
        this.selectedEmployeeData = this.latestEmployeeAdded;
      } else {
        this.selectedEmployeeData = null;
      }
    },
    onFormSaved(formData) {
      // Close the UWP form
      this.showUWP = false;

      // Create a new row for the table
      const newRow = {
        id: this.rows.length + 1,
        division: formData.division,
        targetPeriod: formData.targetPeriod,
        dateCreated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: "Pending"
      };

      // Add to rows
      this.rows.unshift(newRow);

      // Store the employee data for potential display in DivisionEmployee
      this.latestEmployeeAdded = {
        division: formData.division,
        employeeName: formData.employeeName,
        position: formData.position,
        rank: formData.rank,
        performanceStandards: formData.performanceStandards
      };

      // Set the division and employee data to view in DivisionEmployee component
      this.selectedDivision = formData.division;
      this.selectedEmployeeData = this.latestEmployeeAdded;

      // Show notification
      this.$q.notify({
        message: 'Work plan saved successfully',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
    },
    generateUnitWorkPlan() {
      // Implement the logic for generating unit work plan
      console.log('Generating Unit Work Plan');

      this.$q.notify({
        message: 'Unit Work Plan generated successfully',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
    }
  }
};
</script>

<style scoped>
.division-employee-container {
  position: relative;
  padding-top: 16px;
}
</style>
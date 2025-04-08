<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h6 class="text-h6 q-mb-xs">Unit Work Plan</h6>
      </div>
      <q-btn v-if="showUWP" flat round icon="close" @click="showUWP = false" color="negative" class="q-pa-none" />
    </div>

    <div class="row justify-end" v-if="!showUWP && !selectedRow">
      <q-btn elevated rounded :style="{ backgroundColor: '#077A37' }" label="Create Unit Work Plan"
        @click="showUWP = !showUWP" icon="person_add" text-color="white" icon-color="white" />
    </div>
    <br>
    <q-page v-if="showUWP">
      <UnitWorkPlanForm />
    </q-page>

    <div v-if="!showUWP && !selectedRow">
      <q-table :rows="filteredRows" :columns="columns" row-key="id" @row-click="onRowClick">
        <template v-slot:header>
          <q-tr>
            <q-th v-for="col in columns" :key="col.name" style="background-color: #EBEBEB; text-align: left;">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
      </q-table>
    </div>
    <!-- UWP Details View -->
    <div v-if="selectedRow && !selectedDivision">
      <div class="row items-center justify-between q-mb-md">
        <q-btn flat label="Back" icon="arrow_back" @click="selectedRow = null" />
        <q-btn elevated rounded color="primary" label="Generate OPCR" icon="print" />
      </div>

      <q-table :rows="detailsRows" :columns="detailsColumns" row-key="id" class="q-mb-md" @row-click="onDivisionClick">
        <template v-slot:header>
          <q-tr>
            <q-th v-for="col in detailsColumns" :key="col.name" style="background-color: #EBEBEB; text-align: left;">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- DivisionEmployee View -->
    <div v-if="selectedDivision">
      <DivisionEmployee :division="selectedDivision" @back="selectedDivision = null" />
    </div>
  </q-page>
</template>

<script>
import UnitWorkPlanForm from 'src/components/office/UnitWorkPlanForm.vue';
import DivisionEmployee from 'src/components/office/DivisionEmployee.vue';

export default {
  components: {
    UnitWorkPlanForm,
    DivisionEmployee
  },
  data() {
    return {
      showUWP: false,
      search: "",
      selectedRow: null,
      selectedDivision: null,
      columns: [
        { name: "targetPeriod", label: "Target Period", field: "targetPeriod", align: "left" },
        { name: "dateCreated", label: "Date Created", field: "dateCreated", align: "left" },
        { name: "status", label: "Status", field: "status", align: "left" }
      ],
      rows: [
        { id: 1, targetPeriod: "January - June 2025", dateCreated: "December 3, 2024", status: "Pending" },
        { id: 2, targetPeriod: "July - December 2024", dateCreated: "June 3, 2024", status: "Reviewed" },
        { id: 3, targetPeriod: "January - June 2024", dateCreated: "December 3, 2023", status: "Reviewed" },
        { id: 4, targetPeriod: "July - December 2023", dateCreated: "June 3, 2023", status: "Reviewed" },
        { id: 5, targetPeriod: "January - June 2023", dateCreated: "December 3, 2022", status: "Reviewed" }
      ],
      detailsColumns: [
        { name: "division", label: "Division", field: "division", align: "left" },
        { name: "datecreated", label: "Date Created", field: "datecreated", align: "left" },
      ],
      detailsRows: [
        { division: "Recruitment, Selection and Records Management Division", datecreated: "December 3, 2024" },
        { division: "Performance, Management, Incentives, Rewards and Recognition Division", datecreated: "December 3, 2024" },
        { division: "Employees Compensation, Welfare and Benefits Division", datecreated: "December 3, 2024" },
        { division: "Human Resource Development Division", datecreated: "December 3, 2024" },
      ]
    };
  },
  computed: {
    filteredRows() {
      if (!this.search) return this.rows;
      const lowerSearch = this.search.toLowerCase();
      return this.rows.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(lowerSearch)
        )
      );
    }
  },
  methods: {
    onRowClick(evt, row) {
      this.selectedRow = row;
    },
    onDivisionClick(evt, row) {
      this.selectedDivision = row.division;
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}
</style>

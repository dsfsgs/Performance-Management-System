<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="col-auto flex items-center">
        <h6 class="text-h6 q-mb-xs">Unit Work Plan</h6>
      </div>
      <div class="col-auto flex items-center">
        <q-select
          v-model="selectedOffice"
          :options="officeOptions"
          label="Select Office"
          outlined
          dense
          clearable
          emit-value
          map-options
          @update:model-value="onOfficeChange"
          style="min-width: 200px; align-self: center; margin-top: 40px;"
        />
      </div>
    </div>

    <div v-if="!selectedOffice" class="flex flex-center q-mt-xl q-mb-xl" style="height: 40vh;">
      <div class="text-h6 text-grey-7 text-center">
        Please select an office to proceed.
      </div>
    </div>

    <!-- Office Selection & MainTable (shown when no division is selected) -->
    <div v-if="selectedOffice && !selectedDivision">
      <MainTable
        :rows="filteredRows"
        @row-click="onDivisionClick"
        :hideCreateButton="true"
        :hideOPCRButton="true"
        :showOfficeColumn="true"
      />
    </div>

    <!-- Division Detail -->
    <div v-if="selectedDivision && selectedOffice" class="division-employee-container">
      <DivisionEmployee
        :division="selectedDivision"
        :targetPeriod="selectedTargetPeriod"
        :employeeData="null"
        @back="handleBack"
        :readOnly="true"
        :showAdd="false"
        :showEdit="false"
        :showDelete="false"
      />
    </div>
  </q-page>
</template>

<script>
import MainTable from 'src/components/office/MainTable.vue';
import DivisionEmployee from 'src/components/unitworkplan/DivisionEmployee.vue';

export default {
  components: {
    MainTable,
    DivisionEmployee
  },
  data() {
    return {
      selectedDivision: null,
      selectedOffice: null,
      selectedRow: null,
      selectedTargetPeriod: null,
      offices: [
        { label: "CICTMO", value: "CICTMO" },
        { label: "HR", value: "HR" },
        { label: "CMO", value: "CMO" }
      ],
      rows: [
        {
          id: 1,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2025",
          dateCreated: "December 3, 2024",
          status: "Pending",
          office: "CICTMO"
        },
        {
          id: 2,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "December 3, 2024",
          status: "Approved",
          office: "CICTMO"
        },
        {
          id: 3,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2024",
          status: "Pending",
          office: "HR"
        },
        {
          id: 4,
          division: "Human Resource Development Division",
          targetPeriod: "July - December 2023",
          dateCreated: "December 3, 2024",
          status: "Approved",
          office: "HR"
        },
        {
          id: 5,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2023",
          dateCreated: "June 3, 2024",
          status: "Pending",
          office: "CMO"
        },
        {
          id: 6,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2022",
          dateCreated: "June 3, 2024",
          status: "Approved",
          office: "CMO"
        }
      ]
    };
  },
  computed: {
    officeOptions() {
      return this.offices;
    },
    targetPeriodOptions() {
      // Get unique target periods from filtered rows for the selected office
      const periods = this.filteredRows.map(row => row.targetPeriod);
      return [...new Set(periods)].sort((a, b) => this.comparePeriods(b, a)); // Descending (latest first)
    },
    filteredRows() {
      if (!this.selectedOffice) {
        return [];
      }
      return this.rows.filter(row => row.office === this.selectedOffice);
    },
  },
  methods: {
    onDivisionClick(row) {
      this.selectedDivision = row.division;
      this.selectedRow = row;
      // When a division is selected, set the target period to the latest for that division
      const divisionRows = this.filteredRows.filter(r => r.division === row.division);
      if (divisionRows.length > 0) {
        // Sort by target period descending
        divisionRows.sort((a, b) => this.comparePeriods(b.targetPeriod, a.targetPeriod));
        this.selectedTargetPeriod = divisionRows[0].targetPeriod;
      }
    },
    handleBack() {
      this.selectedDivision = null;
      this.selectedRow = null;
      // Optionally reset target period to latest for office
      if (this.targetPeriodOptions.length > 0) {
        this.selectedTargetPeriod = this.targetPeriodOptions[0];
      } else {
        this.selectedTargetPeriod = null;
      }
    },
    onOfficeChange() {
      // Reset division and selected row when office changes
      this.selectedDivision = null;
      this.selectedRow = null;
      // Set target period to latest for this office
      if (this.targetPeriodOptions.length > 0) {
        this.selectedTargetPeriod = this.targetPeriodOptions[0];
      } else {
        this.selectedTargetPeriod = null;
      }
    },
    onTargetPeriodChange() {
      // Optionally, handle logic if needed when target period changes
    },
    fetchOffices() {
      // This would normally fetch from the API, but we're using static data for now
      // In a real implementation, you would use axios or fetch to get data from
      // the API endpoint at http://10.0.2.81:8000/api/fetch_office
      console.log('Fetching offices...');
    },
    // Helper to compare target periods in format 'Month - Month Year'
    comparePeriods(a, b) {
      // Example: 'July - December 2024', 'January - June 2025'
      const parse = p => {
        const [range, year] = p.split(' ');
        const [startMonth] = range.split('-');
        const months = {
          January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
          July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };
        return { year: parseInt(year, 10), month: months[startMonth.trim()] };
      };
      const pa = parse(a);
      const pb = parse(b);
      if (pa.year !== pb.year) return pa.year - pb.year;
      return pa.month - pb.month;
    }
  },
  mounted() {
    this.fetchOffices();
  }
};
</script>

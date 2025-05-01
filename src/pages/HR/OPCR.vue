<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="col-auto flex items-center">
        <h6 class="text-h6 q-mb-xs">OPCR</h6>
      </div>
      <div class="col-auto flex items-center">
        <q-select v-model="selectedOffice" :options="officeOptions" label="Select Office" outlined dense clearable
          emit-value map-options @update:model-value="onOfficeChange"
          style="min-width: 200px; align-self: center; margin-top: 40px;" />
      </div>
    </div>

    <div v-if="!selectedOffice" class="flex flex-center q-mt-xl q-mb-xl" style="height: 40vh;">
      <div class="text-h6 text-grey-7 text-center">
        Please select an office to proceed.
      </div>
    </div>

    <div v-if="selectedOffice">
      <MainTable :rows="filteredRows" @create="showUWP = true" :hideCreateButton="true" :hideUnitWorkPlanButton="true"
        :showOfficeColumn="true" :showTargetPeriodFilter="true" :showOfficeFilter="false" :hideDivisionColumn="true"
        :hideInputButton="true" @row-click="onDivisionClick" />
    </div>
  </q-page>
</template>

<script>
import MainTable from 'src/components/office/MainTable.vue';

export default {
  components: {
    MainTable
  },
  data() {
    return {
      selectedDivision: null,
      selectedOffice: null,
      showUWP: false,
      targetPeriodFilter: null,
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
      const uniqueOffices = [...new Set(this.rows.map(row => row.office))];
      return uniqueOffices.map(office => ({
        label: office,
        value: office
      }));
    },
    filteredRows() {
      if (!this.selectedOffice) {
        return [];
      }
      return this.rows.filter(row => row.office === this.selectedOffice);
    }
  },
  methods: {
    onDivisionClick(row) {
      this.selectedDivision = row.division;
    },
    onOfficeChange() {
      this.selectedDivision = null;
      this.targetPeriodFilter = null;
    },
    fetchOffices() {
      console.log('Fetching offices...');
    }
  },
  mounted() {
    this.fetchOffices();
  }
};
</script>

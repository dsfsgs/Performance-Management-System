<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">OPCR</h6>
    </div>

    <MainTable :rows="rows" @create="showUWP = true" :hideCreateButton="true" :hideUnitWorkPlanButton="true" />
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
      rows: [
        // January - June 2024 (5 items)
        {
          id: 1,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Pending"
        },
        {
          id: 2,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Approved"
        },
        {
          id: 3,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Pending"
        },
        {
          id: 4,
          division: "Human Resource Development Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Approved"
        },
        {
          id: 5,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2024",
          dateCreated: "June 3, 2023",
          status: "Pending"
        },
        // July - December 2024 (5 items)
        {
          id: 6,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Approved"
        },
        {
          id: 7,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Approved"
        },
        {
          id: 8,
          division: "Human Resource Development Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Approved"
        },
        {
          id: 9,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Pending"
        },
        {
          id: 10,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Approved"
        }
      ]
    };
  },
  methods: {
    onDivisionClick(row) {
      this.selectedDivision = row.division;
    }
  }
};
</script>

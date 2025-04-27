<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">OPCR</h6>
    </div>

    <MainTable :rows="rows" @create="showGenerateModal = true" @update-status="updateStatus" :hideCreateButton="true"
      :hideUnitWorkPlanButton="true" />

    <GenerateOPCR v-model="showGenerateModal" @save="handleSave" />
  </q-page>
</template>

<script>
import MainTable from 'src/components/office/MainTable.vue';
import GenerateOPCR from 'src/components/office/GenerateOPCR.vue';
export default {
  components: {
    MainTable,
    GenerateOPCR

  },
  data() {
    return {
      showGenerateModal: false,
      rows: [
        {
          id: 1,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Draft"
        },
        {
          id: 2,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Draft"
        },
        {
          id: 3,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Draft"
        },
        {
          id: 4,
          division: "Human Resource Development Division",
          targetPeriod: "January - June 2024",
          dateCreated: "December 3, 2023",
          status: "Draft"
        },
        {
          id: 5,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "January - June 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        },
        {
          id: 6,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        },
        {
          id: 7,
          division: "Employees Compensation, Welfare and Benefits Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        },
        {
          id: 8,
          division: "Human Resource Development Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        },
        {
          id: 9,
          division: "Recruitment, Selection and Records Management Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        },
        {
          id: 10,
          division: "Performance, Management, Incentives, Rewards and Recognition Division",
          targetPeriod: "July - December 2024",
          dateCreated: "June 3, 2023",
          status: "Draft"
        }
      ]
    };
  },
  methods: {
    updateStatus(targetPeriod, newStatus) {
      this.rows = this.rows.map(row => {
        if (row.targetPeriod === targetPeriod) {
          return { ...row, status: newStatus };
        }
        return row;
      });
    },
    handleSave(data) {
      console.log('Saved data:', data);
      this.$q.notify({
        message: 'OPCR saved successfully!',
        color: 'positive',
        icon: 'check_circle'
      });
    }
  }
};
</script>

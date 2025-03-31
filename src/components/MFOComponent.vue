<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md text-bold">Major Final Outputs (MFO)</div>

    <!-- Buttons -->
    <div class="q-mb-md">
      <q-btn color="green" icon="add" label="Add MFO" class="q-mr-sm" @click="openMfoModal" />
      <q-btn color="green" icon="add" label="Add Output" @click="openOutputModal" />
    </div>

    <!-- Table -->
    <q-card flat bordered class="bg-grey-2 mfo-table">
      <!-- Column Headers -->
      <q-card-section class="row q-pa-none header-row">
        <div class="col-4 header-cell">A. STRATEGIC FUNCTION</div>
        <div class="col-4 header-cell">B. CORE FUNCTION</div>
        <div class="col-4 header-cell">C. SUPPORT FUNCTION</div>
      </q-card-section>

      <q-separator />

      <!-- Table Content -->
      <template v-for="(row, rowIndex) in tableData" :key="rowIndex">
        <q-card-section class="row q-pa-none">
          <div class="col-4 q-pa-sm" v-if="row.strategic">{{ row.strategic }}</div>
          <div class="col-4 q-pa-sm" v-if="row.core">{{ row.core }}</div>
          <div class="col-4 q-pa-sm" v-if="row.support">{{ row.support }}</div>
        </q-card-section>
        <q-separator />
      </template>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { strategic: "MFO 1. Enhance Competency of Workforce", core: "", support: "" },
        { strategic: "", core: "MFO 1. Information System Development & Deployment", support: "" },
        { strategic: "", core: "Output 1: No. of Information System Managed", support: "Output 1: Individual Performance Commitment & Review" },
        { strategic: "", core: "Output 2: No. of Information System Installed", support: "Output 2: Health & Wellness" },
        { strategic: "", core: "MFO 2. Information System Maintenance & Report Generation", support: "" },
        { strategic: "", core: "Output 1: Information System debug and maintained", support: "Output 3: Attendance to Flag Ceremony" },
        { strategic: "", core: "Output 2: Information System Users trained", support: "Output 4: Daily Time Record" },
        { strategic: "", core: "Output 3: Reports generation requested and edited", support: "" },
      ]
    };
  }
};
</script>

<style scoped>
.mfo-table {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-cell {
  background: #4caf50;
  color: white;
  font-weight: bold;
  padding: 12px;
  text-align: center;
  font-size: 1.2em;
}

.header-row {
  border-bottom: 2px solid #ddd;
}

.q-card-section {
  display: flex;
  align-items: center;
}

.col-4 {
  min-height: 50px;
  font-size: 1.1em;
  padding: 15px;
  border-right: 1px solid #ddd;
}

.col-4:last-child {
  border-right: none;
}
</style>

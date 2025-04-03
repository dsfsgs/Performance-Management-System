<template>
  <div>
    <!-- Back button and title in one row -->
    <div class="row items-center q-mb-md">
      <q-btn
        flat
        round
        icon="arrow_back"
        @click="$emit('back')"
        class="q-mr-sm"
      />
      <div class="text-h5">Employee IPCR</div>
      <q-space />
    </div>

    <!-- Employee info section -->
    <div class="q-mb-lg">
      <div class="text-h6">{{ division }}</div>
      <div class="text-caption text-grey">Target Period: {{ targetPeriod }}</div>
    </div>

    <!-- Print button positioned above the table, right-aligned -->
    <div class="row justify-end q-mb-sm">
      <q-btn
        flat
        round
        icon="print"
        @click="printTable"
      />
    </div>

    <!-- IPCR Table -->
    <q-card flat bordered>
      <q-table
        flat
        bordered
        :rows="employeeRows"
        :columns="employeeColumns"
        row-key="name"
        hide-bottom
        class="balanced-alignment-table"
      />
    </q-card>
  </div>
</template>

<script setup>
const printTable = () => {
  window.print();
};

defineProps({
  division: {
    type: String,
    required: true
  },
  targetPeriod: {
    type: String,
    required: true
  }
});

const employeeColumns = [
  {
    name: 'name',
    label: 'NAME',
    field: 'name',
    align: 'left',
    style: 'width: 25%; min-width: 200px; padding-left: 16px',
    headerStyle: 'padding-left: 16px'
  },
  {
    name: 'position',
    label: 'POSITION',
    field: 'position',
    align: 'left',
    style: 'width: 25%; min-width: 200px'
  },
  {
    name: 'strategic',
    label: 'STRATEGIC FUNCTION',
    field: 'strategic',
    align: 'center',
    style: 'width: 10%; min-width: 100px'
  },
  {
    name: 'core',
    label: 'CORE FUNCTION',
    field: 'core',
    align: 'center',
    style: 'width: 10%; min-width: 100px'
  },
  {
    name: 'support',
    label: 'SUPPORT FUNCTION',
    field: 'support',
    align: 'center',
    style: 'width: 10%; min-width: 100px'
  },
  {
    name: 'rating',
    label: 'ADJECTIVAL RATING',
    field: 'rating',
    align: 'center',
    style: 'width: 10%; min-width: 100px'
  },
  {
    name: 'status',
    label: 'STATUS',
    field: 'status',
    align: 'center',
    style: 'width: 10%; min-width: 100px; padding-right: 16px',
    headerStyle: 'padding-right: 16px'
  },
];

const employeeRows = [
  {
    name: 'JANYLENE A. PALERMO, MM',
    position: 'City Human Resource Management Officer - 25',
    strategic: '5',
    core: '5',
    support: '5',
    rating: '5',
    status: 'Review'
  },
  {
    name: 'FRUNNIE A. BOISER',
    position: 'Supervising Administrative Officer (HRM) DVI - 22',
    strategic: '5',
    core: '5',
    support: '5',
    rating: '5',
    status: 'Review'
  },
  {
    name: 'DAVE MARK P.',
    position: 'Senior Administrative Assistant 1 (Data Controller IV) - 13',
    strategic: '5',
    core: '5',
    support: '5',
    rating: '5',
    status: 'Review'
  },
  {
    name: 'JOGRAD M. MAHUSAY',
    position: 'Computer Programmer II',
    strategic: '5',
    core: '5',
    support: '5',
    rating: '5',
    status: 'Review'
  }
];
</script>

<style scoped>
/* Matching the IPCR.vue table style */
::v-deep(.balanced-alignment-table) {
  table {
    table-layout: fixed;
    width: 100%;
  }

  /* Header styling */
  thead tr {
    background-color: #e0e0e0 !important;
  }

  th {
    font-weight: 600;
    font-size: 0.875rem;
    padding: 12px 16px;
    text-transform: uppercase;
    color: #333;
    white-space: nowrap;
  }

  /* Cell styling */
  td {
    padding: 12px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Right padding for last column */
  td:last-child {
    padding-right: 16px;
  }

  /* Hover effect */
  tbody tr:hover {
    background-color: #f9f9f9;
  }
}

.q-card {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
</style>

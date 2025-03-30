<template>
  <q-table flat bordered :rows="rows" :columns="columns" row-key="name">
    <template v-slot:body-cell-action="props">
      <q-td :props="props" class="text-center"> </q-td>
    </template>
  </q-table>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const columns = [
      { name: 'offices', label: 'OFFICES', align: 'left', field: (row) => row.offices },
      { name: 'name', label: 'NAME', align: 'center', field: (row) => row.name },
      {
        name: 'datecreated',
        label: 'DATE CREATED',
        align: 'center',
        field: (row) => row.datecreated,
      },
    ]

    const rows = ref([
      {
        name: 'Mahusay, Jograd M.',
        offices: 'City of Human Resource Management Office',
        datecreated: 'June 22, 2025',
      },
      {
        name: 'Mahusay, Jograd M.',
        offices: 'City of Information, Communication and Technology Management Office',
        datecreated: 'June 22, 2025',
      },
      {
        name: 'Mahusay, Jograd M.',
        offices: 'City of Accounting Office',
        datecreated: 'June 22, 2025',
      },
      { name: 'Mahusay, Jograd M.', offices: 'City Mayor’s Office', datecreated: 'June 22, 2025' },
      { name: 'Mahusay, Jograd M.', offices: 'City Mayor’s Office', datecreated: 'June 22, 2025' },
    ])

    return { columns, rows }
  },
}
</script>

<style scoped>
.q-table {
  border-radius: 8px;
  overflow: hidden;
}
.q-th {
  background: #f0f0f0;
  font-weight: bold;
}
</style>

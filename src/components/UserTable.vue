<template>
  <q-page class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="offices"
      table-style="min-width: 100%"
      :pagination="{ rowsPerPage: 5 }"
      :rows-per-page-options="[5, 10, 15]"
    />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { name: 'offices', required: true, label: 'OFFICES', align: 'left', field: 'offices' },
        { name: 'name', required: true, label: 'NAME', align: 'left', field: 'name' },
        {
          name: 'date_created',
          required: true,
          label: 'DATE CREATED',
          align: 'left',
          field: 'date_created',
        },
      ],
      rows: [
        {
          offices: 'City of Human Resource Management Office',
          name: 'Mahusay, Jograd M.',
          date_created: 'June 22, 2025',
        },
        {
          offices: 'City of Information, Communication and Technology Management Office',
          name: 'Mahusay, Jograd M.',
          date_created: 'June 22, 2025',
        },
        {
          offices: 'City of Accounting Office',
          name: 'Mahusay, Jograd M.',
          date_created: 'June 22, 2025',
        },
        {
          offices: 'City Mayor’s Office',
          name: 'Mahusay, Jograd M.',
          date_created: 'June 22, 2025',
        },
      ],
    }
  },
}
</script>

<style>
.q-table__control {
  display: flex;
  align-items: center;
}
</style>

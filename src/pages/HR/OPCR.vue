<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">OPCR</div>

    <div class="q-mb-md">
      <q-input v-model="search" outlined dense placeholder="Search offices..." clearable class="search-input">
        <template v-slot:prepend>
          <q-icon name="search" size="xs" />
        </template>
      </q-input>
    </div>

    <q-table :rows="sortedAndFilteredRows" :columns="columns" row-key="id" flat bordered class="my-table"
      :dense="$q.screen.lt.md" @row-click="onRowClick">
      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-no-wrap">
          <q-chip :color="getStatusColor(props.value)" text-color="white" dense class="text-weight-bold">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
    </q-table>

    <!-- OPCR Details Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">OPCR Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="selectedRow" class="q-gutter-y-md">
            <div>
              <strong>Office:</strong> {{ selectedRow.offices }}
            </div>
            <div>
              <strong>Status:</strong>
              <q-chip :color="getStatusColor(selectedRow.status)" text-color="white" dense>
                {{ selectedRow.status }}
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Print OPCR" color="primary" icon="print" @click="printOPCR" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      showModal: false,
      selectedRow: null,
      columns: [
        {
          name: 'offices',
          required: true,
          label: 'Offices',
          align: 'left',
          field: row => row.offices,
          sortable: true,
          classes: 'text-no-wrap'
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'center',
          field: row => row.status,
          sortable: true,
          classes: 'text-no-wrap'
        }
      ],
      rows: [
        {
          id: 1,
          offices: 'City of Human Resource Management Office',
          status: 'Approved'
        },
        {
          id: 2,
          offices: 'City Planning and Development Office',
          status: 'On Process'
        },
        {
          id: 3,
          offices: 'City Budget Office',
          status: 'Approved'
        },
        {
          id: 4,
          offices: 'City Treasurer\'s Office',
          status: 'On Process'
        },
        {
          id: 5,
          offices: 'City Health Office',
          status: 'On Process'
        },
        {
          id: 6,
          offices: 'City Social Welfare and Development Office',
          status: 'Approved'
        },
        {
          id: 7,
          offices: 'City Engineering Office',
          status: 'On Process'
        },
        {
          id: 8,
          offices: 'City Environment and Natural Resources Office',
          status: 'Approved'
        }
      ]
    }
  },
  computed: {
    filteredRows() {
      return this.rows.filter(row =>
        row.offices.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    sortedAndFilteredRows() {
      // First filter the rows
      const filtered = this.filteredRows;
      // Then sort with "On Process" first
      return [...filtered].sort((a, b) => {
        if (a.status === 'On Process' && b.status !== 'On Process') return -1;
        if (a.status !== 'On Process' && b.status === 'On Process') return 1;
        return 0;
      });
    }
  },
  methods: {
    getStatusColor(status) {
      return status === 'Approved' ? 'positive' : 'orange'
    },
    onRowClick(evt, row) {
      this.selectedRow = row
      this.showModal = true
    },
    printOPCR() {
      // Create printable content
      const printContent = `
        <div style="padding: 20px; font-family: Arial;">
          <h2 style="text-align: center; margin-bottom: 20px;">OPCR Document</h2>
          <div style="margin-bottom: 15px;">
            <strong>Office:</strong> ${this.selectedRow.offices}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Status:</strong> ${this.selectedRow.status}
          </div>
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            Printed on ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;

      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>OPCR Print</title>
            <style>
              @media print {
                body { visibility: hidden; }
                #print-content { visibility: visible; position: absolute; left: 0; top: 0; }
              }
            </style>
          </head>
          <body>
            <div id="print-content">${printContent}</div>
            <script>
              setTimeout(function() {
                window.print();
                window.close();
              }, 100);
            <\\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
</script>

<style lang="scss">
.my-table {

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #f5f5f5;
  }

  td,
  th {
    padding: 12px 16px;
    vertical-align: middle;
  }

  .text-no-wrap {
    white-space: nowrap;
  }

  .q-table__grid-content .q-chip {
    margin: 0 auto;
  }

  tbody tr {
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
}

.search-input {
  max-width: 400px;

  .q-field__control {
    height: 36px;
  }

  .q-icon {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .my-table {

    td,
    th {
      padding: 8px 12px;
    }
  }

  .search-input {
    width: 100%;
  }
}
</style>

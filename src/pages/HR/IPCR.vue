<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-mb-md">IPCR</div>

    <div class="q-mb-md">
      <q-input v-model="search" outlined dense placeholder="Search by name, position..." clearable class="search-input">
        <template v-slot:prepend>
          <q-icon name="search" size="xs" />
        </template>
      </q-input>
    </div>

    <q-table :rows="filteredEmployees" :columns="columns" row-key="id" flat bordered class="my-table"
      :dense="$q.screen.lt.md" @row-click="onRowClick" :pagination="pagination">
      <template v-slot:body-cell-strategic="props">
        <q-td :props="props" class="text-center">
          <div class="rating-value">5</div>
        </q-td>
      </template>
      <template v-slot:body-cell-core="props">
        <q-td :props="props" class="text-center">
          <div class="rating-value">5</div>
        </q-td>
      </template>
      <template v-slot:body-cell-support="props">
        <q-td :props="props" class="text-center">
          <div class="rating-value">5</div>
        </q-td>
      </template>
      <template v-slot:body-cell-rating="props">
        <q-td :props="props" class="text-center">
          <div class="rating-value">5</div>
        </q-td>
      </template>
    </q-table>

    <!-- IPCR Details Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">IPCR Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="selectedRow" class="q-gutter-y-md">
            <div>
              <strong>Name:</strong> {{ selectedRow.name }}
            </div>
            <div>
              <strong>Position:</strong> {{ selectedRow.position }}
            </div>
            <div>
              <strong>Strategic Function:</strong> {{ selectedRow.strategic }}
            </div>
            <div>
              <strong>Core Function:</strong> {{ selectedRow.core }}
            </div>
            <div>
              <strong>Support Function:</strong> {{ selectedRow.support }}
            </div>
            <div>
              <strong>Adjectival Rating:</strong> {{ selectedRow.rating }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Print IPCR" color="primary" icon="print" @click="printIPCR" />
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
      pagination: {
        sortBy: 'name',
        rowsPerPage: 5
      },
      columns: [
        {
          name: 'name',
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true,
          classes: 'text-no-wrap'
        },
        {
          name: 'position',
          label: 'Position',
          align: 'left',
          field: 'position',
          sortable: true,
          classes: 'text-no-wrap'
        },
        {
          name: 'strategic',
          label: 'Strategic Function',
          align: 'center',
          field: 'strategic',
          classes: 'text-no-wrap'
        },
        {
          name: 'core',
          label: 'Core Function',
          align: 'center',
          field: 'core',
          classes: 'text-no-wrap'
        },
        {
          name: 'support',
          label: 'Support Function',
          align: 'center',
          field: 'support',
          classes: 'text-no-wrap'
        },
        {
          name: 'rating',
          label: 'Adjectival Rating',
          align: 'center',
          field: 'rating',
          classes: 'text-no-wrap'
        }
      ],
      employees: [
        {
          id: 1,
          name: 'JANYLENE A. PALERMO, MM',
          position: 'City Human Resources Management Officer - 25',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        },
        {
          id: 2,
          name: 'FRUNNIE A. RODIER',
          position: 'Supervising Administrative Officer (HMMOV) - 22',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        },
        {
          id: 3,
          name: 'DAVE MARX D. LUZANO',
          position: 'Senior Administrative Assistant 1 Data Controller IV/1 - 13',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        },
        {
          id: 4,
          name: 'JODRIJO M. MANUSAY',
          position: 'Computer Programmer II',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        },
        {
          id: 5,
          name: 'Employee 5',
          position: 'Position 5',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        },
        {
          id: 6,
          name: 'Employee 6',
          position: 'Position 6',
          strategic: '5',
          core: '5',
          support: '5',
          rating: '5'
        }
      ]
    }
  },
  computed: {
    filteredEmployees() {
      const searchTerm = this.search.toLowerCase()
      return this.employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm)
      )
    }
  },
  methods: {
    onRowClick(evt, row) {
      this.selectedRow = row
      this.showModal = true
    },
    printIPCR() {
      const printContent = `
        <div style="padding: 20px; font-family: Arial;">
          <h2 style="text-align: center; margin-bottom: 20px;">IPCR Document</h2>
          <div style="margin-bottom: 10px;">
            <strong>Name:</strong> ${this.selectedRow.name}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Position:</strong> ${this.selectedRow.position}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Strategic Function:</strong> ${this.selectedRow.strategic}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Core Function:</strong> ${this.selectedRow.core}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Support Function:</strong> ${this.selectedRow.support}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Adjectival Rating:</strong> ${this.selectedRow.rating}
          </div>
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            Printed on ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>IPCR Print</title>
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

  .rating-value {
    font-weight: bold;
    color: #333;
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

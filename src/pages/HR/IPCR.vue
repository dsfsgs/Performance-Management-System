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

    <!-- Enhanced IPCR Details Modal with OPCR Style -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 1000px; max-width: 1200px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Employee Performance Details - {{ selectedRow?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <!-- Tabs -->
        <q-tabs v-model="activeTab" align="left" class="bg-grey-3 text-grey-8" narrow-indicator>
          <q-tab name="ps" label="Performance Standard" />
          <q-tab name="ipcr" label="IPCR" />
          <q-tab name="po" label="Performance Objectives" />
        </q-tabs>

        <q-separator />

        <!-- Tab Panels -->
        <q-tab-panels v-model="activeTab" animated>
          <!-- Performance Standard Tab -->
          <q-tab-panel name="ps" class="q-pa-md">
            <div class="text-subtitle1 q-mb-md">Performance Standard</div>
            <div class="text-body1">Performance Standard content goes here.</div>
          </q-tab-panel>

          <!-- IPCR Tab -->
          <q-tab-panel name="ipcr" class="q-pa-md">
            <div class="text-subtitle1 q-mb-md">IPCR Details</div>
            <div v-if="selectedRow" class="q-gutter-y-md">
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div><strong>Name:</strong> {{ selectedRow.name }}</div>
                  <div><strong>Position:</strong> {{ selectedRow.position }}</div>
                </div>
              </div>

              <q-table flat bordered :rows="[
                {
                  function: 'Strategic Function',
                  rating: selectedRow.strategic,
                  description: 'Key strategic contributions to organizational goals'
                },
                {
                  function: 'Core Function',
                  rating: selectedRow.core,
                  description: 'Primary responsibilities of the position'
                },
                {
                  function: 'Support Function',
                  rating: selectedRow.support,
                  description: 'Supporting roles and responsibilities'
                }
              ]" :columns="[
                { name: 'function', label: 'Function', field: 'function', align: 'left' },
                { name: 'rating', label: 'Rating', field: 'rating', align: 'center' },
                { name: 'description', label: 'Description', field: 'description', align: 'left' }
              ]" row-key="function" class="q-mt-md" />
            </div>
          </q-tab-panel>

          <!-- Performance Objectives Tab -->
          <q-tab-panel name="po" class="q-pa-md">
            <div class="text-subtitle1 q-mb-md">Performance Objectives</div>
            <div class="text-body1">Performance Objectives content goes here.</div>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-card-actions align="right" class="q-px-md q-py-md">
          <q-btn label="Print" color="primary" icon="print" @click="printCurrentTab" />
          <q-btn label="Close" color="grey" v-close-popup />
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
      activeTab: 'ipcr',
      pagination: {
        sortBy: 'name',
        rowsPerPage: 5
      },
      columns: [
        { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true, classes: 'text-no-wrap' },
        { name: 'position', label: 'Position', align: 'left', field: 'position', sortable: true, classes: 'text-no-wrap' },
        { name: 'strategic', label: 'Strategic Function', align: 'center', field: 'strategic', classes: 'text-no-wrap' },
        { name: 'core', label: 'Core Function', align: 'center', field: 'core', classes: 'text-no-wrap' },
        { name: 'support', label: 'Support Function', align: 'center', field: 'support', classes: 'text-no-wrap' },
        { name: 'rating', label: 'Adjectival Rating', align: 'center', field: 'rating', classes: 'text-no-wrap' }
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
      this.activeTab = 'ipcr'
    },
    printCurrentTab() {
      let printContent = ''
      const date = new Date().toLocaleDateString()

      switch (this.activeTab) {
        case 'ps':
          printContent = 'Performance Standard content goes here.'
          break
        case 'ipcr':
          printContent = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Function</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Rating</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Strategic Function</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${this.selectedRow.strategic}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">Key strategic contributions to organizational goals</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Core Function</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${this.selectedRow.core}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">Primary responsibilities of the position</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">Support Function</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${this.selectedRow.support}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">Supporting roles and responsibilities</td>
                </tr>
              </tbody>
            </table>
          `
          break
        case 'po':
          printContent = 'Performance Objectives content goes here.'
          break
      }

      const printWindow = window.open('', '_blank')
      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>${this.getPrintTitle()} - Print</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h2 { text-align: center; margin-bottom: 20px; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h2>${this.getPrintTitle()}</h2>
            <div>Employee: ${this.selectedRow.name}</div>
            <div>Position: ${this.selectedRow.position}</div>
            ${printContent}
            <div class="footer">Printed on ${date}</div>
            <script>
              setTimeout(function() {
                window.print()
                window.close()
              }, 100)
            <\\/script>
          </body>
        </html>
      `)
      printWindow.document.close()
    },
    getPrintTitle() {
      switch (this.activeTab) {
        case 'ps': return 'Performance Standard'
        case 'ipcr': return 'IPCR Details'
        case 'po': return 'Performance Objectives'
        default: return 'Employee Performance'
      }
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

  .q-dialog__inner--minimized>div {
    min-width: 90vw !important;
  }
}
</style>

<template>
  <q-card class="report-preview-dialog" style="max-width: 1000px">
    <!-- Dialog Header -->
    <q-card-section class="bg-green-9 text-white">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">Unit Work Plan Report</div>
        </div>
        <div class="col-auto">
          <q-btn flat round dense icon="close" @click="$emit('close')" />
        </div>
      </div>
    </q-card-section>

    <!-- Dialog Content -->
    <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
      <div class="report-content" id="print-section">
        <!-- Header with Logo -->
        <div class="header-container">
          <div class="city-logo">
            <img src="/api/placeholder/120/120" alt="City of Tagum Logo" class="city-logo-img" />
          </div>
          <div class="header-text">
            <div class="text-green-9 text-caption">REPUBLIC OF THE PHILIPPINES</div>
            <div class="text-green-9 text-caption">PROVINCE OF DAVAO DEL NORTE</div>
            <div class="text-green-9 text-h5 text-weight-bold">CITY OF TAGUM</div>
          </div>
        </div>

        <!-- Green Banner -->
        <div class="green-banner">
          CITY HUMAN RESOURCE MANAGEMENT OFFICE
        </div>

        <!-- Main Content -->
        <div class="q-mt-md">
          <h2 class="text-center text-weight-bold text-h4">UNIT WORK PLAN</h2>
          <table class="full-width info-table">
            <tbody>
              <tr>
                <td><strong>Division:</strong> Recruitment, Selection and Records Management Division</td>
              </tr>
              <tr>
                <td><strong>Target Period:</strong> {{ targetPeriod || 'January - June 2025' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Main Table -->
          <table class="full-width main-table">
            <thead>
              <tr>
                <th class="text-center mfo-column">MFO</th>
                <th class="text-center">REQUIRED COMPETENCY<br>& PROFICIENCY LEVEL</th>
                <th class="text-center">REQUIRED<br>OUTPUT</th>
                <th class="text-center" colspan="5">STANDARDS PER OUTPUT/SUCCESS INDICATOR</th>
              </tr>
              <tr>
                <th colspan="3" class="text-left">CORE FUNCTIONS: CORE TECHNICAL LEADERSHIP SUCCESS INDICATOR</th>
                <th class="text-center">5</th>
                <th class="text-center">4</th>
                <th class="text-center">3</th>
                <th class="text-center">2</th>
                <th class="text-center">1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Employee:</td>
                <td colspan="7">JANYLENE A. PALERMO, MM</td>
              </tr>
              <tr>
                <td>Position/SG:</td>
                <td colspan="7">City Human Resource Management Officer - 25</td>
              </tr>
              <tr>
                <td>Employee Rank:</td>
                <td colspan="7">Managerial</td>
              </tr>
              <tr>
                <td rowspan="12" class="mfo-cell">MFO 1<br>Recruitment, Selection and Placement</td>
                <td>
                  DSE - 4<br>
                  EI - 4<br>
                  IS - 4
                </td>
                <td>
                  P&O - 4<br>
                  M&E - 4<br>
                  RM - 4<br>
                  P&N - 4<br>
                  PM - 4<br>
                  ATD - 4
                </td>
                <td rowspan="2">
                  1,030 Recruitment, Selection and Placement related documents/activities approved and signed without
                  lapses as per schedule
                </td>
                <td>
                  per RSP related documents or activities approved/signed<br><br>
                  Q - 1,339 or more<br>
                  E - without lapses<br>
                  T - before the schedule
                </td>
                <td>
                  Q - 1,184-1,338<br>
                  E - -<br>
                  T - -
                </td>
                <td>
                  Q - 1,030-1,183<br>
                  E - -<br>
                  T - as per schedule
                </td>
                <td>
                  Q - 525-1,029<br>
                  E - with lapses<br>
                  T - -
                </td>
                <td>
                  Q - 524 or less<br>
                  E - -<br>
                  T - after the schedule
                </td>
              </tr>
              <tr>
                <td>
                  TSC - 4<br>
                  PSDM - 4<br>
                  BCIWR - 4<br>
                  MPCR - 4
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <!-- Add more rows as needed -->
              <tr>
                <td rowspan="2" class="mfo-cell">MFO 2<br>Performance Management</td>
                <td>
                  DSE - 4<br>
                  EI - 4<br>
                  IS - 4
                </td>
                <td>
                  P&O - 4<br>
                  M&E - 4<br>
                  RM - 4
                </td>
                <td rowspan="2">
                  100% of performance management related documents processed without lapses as per schedule
                </td>
                <td>
                  Q - 100%<br>
                  E - without lapses<br>
                  T - before the schedule
                </td>
                <td>
                  Q - 90-99%<br>
                  E - -<br>
                  T - -
                </td>
                <td>
                  Q - 80-89%<br>
                  E - -<br>
                  T - as per schedule
                </td>
                <td>
                  Q - 70-79%<br>
                  E - with lapses<br>
                  T - -
                </td>
                <td>
                  Q - 69% or less<br>
                  E - -<br>
                  T - after the schedule
                </td>
              </tr>
              <tr>
                <td>
                  TSC - 4<br>
                  PSDM - 4
                </td>
                <td>
                  P&N - 4<br>
                  PM - 4<br>
                  ATD - 4
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td rowspan="2" class="mfo-cell">MFO 3<br>Learning and Development</td>
                <td>
                  DSE - 4<br>
                  EI - 4<br>
                  IS - 4
                </td>
                <td>
                  P&O - 4<br>
                  M&E - 4<br>
                  RM - 4
                </td>
                <td rowspan="2">
                  12 L&D interventions conducted as per schedule
                </td>
                <td>
                  Q - 16 or more<br>
                  E - excellent<br>
                  T - before the schedule
                </td>
                <td>
                  Q - 14-15<br>
                  E - very satisfactory<br>
                  T - -
                </td>
                <td>
                  Q - 12-13<br>
                  E - satisfactory<br>
                  T - as per schedule
                </td>
                <td>
                  Q - 8-11<br>
                  E - unsatisfactory<br>
                  T - -
                </td>
                <td>
                  Q - 7 or less<br>
                  E - poor<br>
                  T - after the schedule
                </td>
              </tr>
              <tr>
                <td>
                  TSC - 4<br>
                  PSDM - 4
                </td>
                <td>
                  P&N - 4<br>
                  PM - 4<br>
                  ATD - 4
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <!-- Signature Section -->
          <div class="q-mt-xl row">
            <div class="col-6">
              <div class="text-center">Prepared by:</div>
              <div class="text-center q-mt-lg">
                <div class="text-weight-bold">JANYLENE A. PALERMO, MM</div>
                <div>City Human Resource Management Officer</div>
              </div>
            </div>
            <div class="col-6">
              <div class="text-center">Approved by:</div>
              <div class="text-center q-mt-lg">
                <div class="text-weight-bold">HON. REY T. UY</div>
                <div>City Mayor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Dialog Footer -->
    <q-card-section class="bg-grey-2 flex justify-end">
      <q-btn color="green-9" icon="print" label="Print Report" @click="printReport" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'UnitWorkPlanReport',
  props: {
    targetPeriod: {
      type: String,
      default: null
    }
  },
  emits: ['close'],
  methods: {
    printReport() {
      // Using browser's print functionality
      const printContent = document.getElementById('print-section').innerHTML;

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unit Work Plan Report</title>
            <style>
              @page {
                size: landscape;
                margin: 15mm;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              .header-container {
                display: flex;
                align-items: center;
                width: 100%;
              }
              .city-logo-img {
                width: 120px;
                height: 120px;
              }
              .header-text {
                margin-left: 20px;
                color: #00703C;
              }
              .header-text div:first-child {
                font-size: 14px;
              }
              .header-text div:nth-child(2) {
                font-size: 14px;
              }
              .header-text div:last-child {
                font-size: 24px;
                font-weight: bold;
              }
              .green-banner {
                background-color: #00703C;
                color: white;
                font-weight: bold;
                font-size: 18px;
                padding: 8px 0;
                text-align: center;
                margin-top: 10px;
                width: 100%;
              }
              h2 {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
              }
              .info-table {
                width: 100%;
                border-collapse: collapse;
              }
              .info-table td {
                border: 1px solid #000;
                padding: 8px;
              }
              .main-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              .main-table th, .main-table td {
                border: 1px solid #000;
                padding: 8px;
                font-size: 12px;
              }
              .main-table th {
                background-color: #f2f2f2;
              }
              .mfo-column {
                width: 80px;
              }
              .mfo-cell {
                font-weight: bold;
              }
              .row {
                display: flex;
                width: 100%;
              }
              .col-6 {
                width: 50%;
              }
              .text-center {
                text-align: center;
              }
              .text-weight-bold {
                font-weight: bold;
              }
              .q-mt-lg {
                margin-top: 32px;
              }
              .q-mt-xl {
                margin-top: 48px;
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for resources to load before printing
      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    }
  }
}
</script>

<style scoped>
.report-preview-dialog {
  width: 100%;
  max-width: 1000px;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.city-logo {
  flex-shrink: 0;
}

.city-logo-img {
  width: 120px;
  height: 120px;
}

.header-text {
  margin-left: 20px;
}

.green-banner {
  background-color: #00703C;
  color: white;
  font-weight: bold;
  font-size: 18px;
  padding: 8px 0;
  text-align: center;
  margin-top: 10px;
  width: 100%;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  border: 1px solid #000;
  padding: 8px;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 8px;
  font-size: 12px;
}

.main-table th {
  background-color: #f2f2f2;
}

.mfo-column {
  width: 80px;
}

.mfo-cell {
  font-weight: bold;
}

.full-width {
  width: 100%;
}

@media print {
  @page {
    size: landscape;
  }
}
</style>

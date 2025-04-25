<template>
  <div class="app-container">
    <!-- App Header -->
    <div class="app-header">
      <div class="header-content">
        <div class="text-h6 text-white">CITY OF TAGUM - HUMAN RESOURCE MANAGEMENT OFFICE</div>
      </div>
      <div class="col-auto">
        <q-btn flat round dense text-color="white" icon="close" @click="$emit('close')" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Fixed Left Navigation -->
      <div class="division-nav">
        <div class="division-nav-header">
          <div class="text-h6">Divisions</div>
        </div>
        <q-list padding class="division-list">
          <q-item v-for="(division, index) in divisions" :key="index" clickable v-ripple
            :active="selectedDivision === index" @click="selectedDivision = index" active-class="active-division">
            <q-item-section>
              <q-item-label>{{ division.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- Approved Button at the bottom -->
        <div v-if="showApprovedButton" class="row justify-center q-mt-lg q-pb-lg">
          <q-btn label="Approve" color="green" class="q-mt-md" />
        </div>
      </div>
      

      <!-- Report Content Area - Single Scrollable Container -->
      <div class="report-container">
        <!-- Fixed Report Header -->
        <div class="report-header">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ divisions[selectedDivision].name }}</div>
              <div class="text-subtitle2">Target Period: {{ targetPeriod }}</div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn color="green-9" icon="print" label="Print" @click="directPrint" :loading="isPrinting" />
              <q-btn color="green-9" icon="download" label="Download PDF" @click="downloadPdf"
                :loading="isGeneratingPdf" />
              <q-tooltip>Download as PDF</q-tooltip>
            </div>
          </div>
        </div>

        <!-- Scrollable Report Content -->
        <div class="report-content-scroll">
          <div class="report-content" id="print-section">
            <!-- Header with Logo -->
            <div class="header-container">
              <div class="green-line">
                <div class="line"></div>
              </div>
              <div class="city-logo">
                <img class="logo" alt="City of Tagum Logo"
                  src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png" />
              </div>
              <div class="header-text">
                <div class="text-green-9 text-caption padded-text">REPUBLIC OF THE PHILIPPINES</div>
                <div class="text-green-9 text-caption padded-text">PROVINCE OF DAVAO DEL NORTE</div>
                <div class="text-green-9 text-h5 text-weight-bold padded-text">CITY OF TAGUM</div>

                <div class="green-banner">
                  <div class="padded-text">CITY HUMAN RESOURCE MANAGEMENT OFFICE</div>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="q-mt-md">
              <h2 class="text-center text-weight-bold text-h4">UNIT WORK PLAN</h2>
              <table class="full-width info-table">
                <tbody>
                  <tr>
                    <td><strong>Division:</strong> {{ divisions[selectedDivision].name }}</td>
                  </tr>
                  <tr>
                    <td><strong>Target Period:</strong> {{ targetPeriod }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Main Table -->
              <div class="table-container">
                <table class="full-width main-table">
                  <thead class="no-repeat-header">
                    <tr>
                      <th class="text-center mfo-column">MFO</th>
                      <th colspan="3" class="text-center competency-header">REQUIRED COMPETENCY & PROFICIENCY LEVEL</th>
                      <th rowspan="2" class="text-center indicator-column">SUCCESS INDICATOR</th>
                      <th rowspan="2" class="text-center output-column">REQUIRED OUTPUT</th>
                      <th class="text-center standards-header" colspan="5">STANDARDS PER OUTPUT/SUCCESS INDICATOR</th>
                    </tr>
                    <tr>
                      <th class="text-left">CORE FUNCTIONS</th>
                      <th class="text-left competency-column">CORE</th>
                      <th class="text-left competency-column">TECHNICAL</th>
                      <th class="text-left competency-column">LEADERSHIP</th>
                      <th class="text-center standard-column">5</th>
                      <th class="text-center standard-column">4</th>
                      <th class="text-center standard-column">3</th>
                      <th class="text-center standard-column">2</th>
                      <th class="text-center standard-column">1</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(employee, empIndex) in divisions[selectedDivision].employees" :key="empIndex">
                      <tr>
                        <td>Employee:</td>
                        <td colspan="10">{{ employee.name }}</td>
                      </tr>
                      <tr>
                        <td>Position/SG:</td>
                        <td colspan="10">{{ employee.position }}</td>
                      </tr>
                      <tr>
                        <td>Employee Rank:</td>
                        <td colspan="10">{{ employee.rank }}</td>
                      </tr>
                      <tr v-for="(output, outIndex) in employee.outputs" :key="`${empIndex}-${outIndex}`">
                        <td class="mfo-cell" v-html="output.name"></td>
                        <td v-html="output.core"></td>
                        <td v-html="output.technical"></td>
                        <td v-html="output.leadership"></td>
                        <td v-html="output.indicator"></td>
                        <td v-html="output.required"></td>
                        <td v-html="output.standard5"></td>
                        <td v-html="output.standard4"></td>
                        <td v-html="output.standard3"></td>
                        <td v-html="output.standard2"></td>
                        <td v-html="output.standard1"></td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>

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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'UnitWorkPlanTabs',
  props: {
    showApprovedButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedDivision: 0,
      targetPeriod: 'January - June 2025',
      isGeneratingPdf: false,
      isPrinting: false,
      divisions: [
        {
          name: 'Recruitment, Selection and Records Management Division',
          employees: [
            {
              name: 'JANYLENE A. PALERMO, MM',
              position: 'City Human Resource Management Officer - 25',
              rank: 'Managerial',
              outputs: [
                {
                  name: 'MFO 1<br>Recruitment, Selection and Placement',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'P&O - 4<br>M&E - 4<br>RM - 4<br>P&N - 4<br>PM - 4<br>ATD - 4',
                  leadership: 'TSC - 4<br>PSDM - 4<br>BCIWR - 4<br>MPCR - 4',
                  indicator: '1,030 Recruitment, Selection and Placement related documents/activities approved and signed without lapses as per schedule',
                  required: 'per RSP related documents or activities approved/signed<br><br>',
                  standard5: 'Q - 1,184-1,338<br>E - -<br>T - -',
                  standard4: 'Q - 1,030-1,183<br>E - -<br>T - as per schedule',
                  standard3: 'Q - 525-1,029<br>E - with lapses<br>T - -',
                  standard2: 'Q - 524 or less<br>E - -<br>T - after the schedule',
                  standard1: 'Q - 1,339 or more<br>E - without lapses<br>T - before the schedule'
                }
              ]
            },
            {
              name: 'REIL R. IGONA, MM, CHRA',
              position: 'Acting SAO / HRMO III - 18',
              rank: 'Supervisory',
              outputs: [
                {
                  name: 'Output 1: <br>IPCR (with SMPOR,PS and CAF)',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'P&O - 4<br>M&E - 4<br>RM - 4<br>ATD - 4',
                  leadership: 'TSC - 4<br>PSDM - 4<br>BCIWR - 4<br>MPCR - 4',
                  indicator: '500 IPCR and other attachments reviewed accurately 2 days after receipt of documents',
                  required: 'per IPCR and other attachments reviewed',
                  standard5: 'Q - 650 or more <br>E - accurately <br>T - upon receipt of documents',
                  standard4: 'Q - 575-649 <br>E - - <br>T - 1 day after receipt of documents',
                  standard3: 'Q - 500-574 <br>E - inaccurately <br>T - 2 days after receipt of documents',
                  standard2: 'Q - 255-499 <br>E - - <br>T - 3 days after receipt of documents',
                  standard1: 'Q - 254 or less <br>E - - <br>T - 4 days and beyond after receipt of documents'
                }
              ]
            }
          ]
        },
        {
          name: 'Human Resource Development Division',
          employees: [
            {
              name: 'MARIA L. SANTOS, MM',
              position: 'Human Resource Development Officer IV - 22',
              rank: 'Supervisory',
              outputs: [
                {
                  name: 'MFO 1<br>Learning and Development',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'HRDP - 4<br>TNA - 4<br>L&D - 4<br>PM - 4',
                  leadership: 'TSC - 4<br>PSDM - 4<br>BCIWR - 4',
                  indicator: '12 training programs developed and facilitated as scheduled',
                  required: 'per training program developed and facilitated',
                  standard5: 'Q - 15-17<br>E - excellently<br>T - ahead of schedule',
                  standard4: 'Q - 12-14<br>E - satisfactorily<br>T - as scheduled',
                  standard3: 'Q - 9-11<br>E - acceptably<br>T - slight delay',
                  standard2: 'Q - 6-8<br>E - poorly<br>T - with delay',
                  standard1: 'Q - 5 or less<br>E - unacceptably<br>T - significant delay'
                }
              ]
            }
          ]
        },
        {
          name: 'Performance Management Division',
          employees: [
            {
              name: 'ROBERT C. GONZALES',
              position: 'Performance Management Officer III - 18',
              rank: 'Supervisory',
              outputs: [
                {
                  name: 'MFO 1<br>Performance Evaluation',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'PMS - 4<br>M&E - 4<br>DA - 4',
                  leadership: 'TSC - 4<br>PSDM - 4',
                  indicator: '250 performance evaluations reviewed and processed within 3 days of receipt',
                  required: 'per performance evaluation reviewed and processed',
                  standard5: 'Q - 300 or more<br>E - with 100% accuracy<br>T - within 1 day',
                  standard4: 'Q - 250-299<br>E - with 95% accuracy<br>T - within 3 days',
                  standard3: 'Q - 200-249<br>E - with 90% accuracy<br>T - within 5 days',
                  standard2: 'Q - 150-199<br>E - with 85% accuracy<br>T - within 7 days',
                  standard1: 'Q - 149 or less<br>E - below 85% accuracy<br>T - more than 7 days'
                }
              ]
            }
          ]
        },
        {
          name: 'Employee Welfare Division',
          employees: [
            {
              name: 'ELENA B. CASTRO',
              position: 'Employee Welfare Officer III - 18',
              rank: 'Supervisory',
              outputs: [
                {
                  name: 'MFO 1<br>Employee Benefits and Assistance',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'EW - 4<br>CS - 4<br>BC - 4',
                  leadership: 'TSC - 4<br>PSDM - 4',
                  indicator: '150 employee assistance requests processed within 2 days of submission',
                  required: 'per employee assistance request processed',
                  standard5: 'Q - 180 or more<br>E - with complete documentation<br>T - within same day',
                  standard4: 'Q - 150-179<br>E - with minor documentation issues<br>T - within 2 days',
                  standard3: 'Q - 120-149<br>E - with significant documentation issues<br>T - within 3 days',
                  standard2: 'Q - 90-119<br>E - with major documentation issues<br>T - within 5 days',
                  standard1: 'Q - 89 or less<br>E - with incomplete documentation<br>T - more than 5 days'
                }
              ]
            }
          ]
        },
        {
          name: 'Administrative Division',
          employees: [
            {
              name: 'PAULO R. REYES',
              position: 'Administrative Officer V - 18',
              rank: 'Supervisory',
              outputs: [
                {
                  name: 'MFO 1<br>Administrative Services',
                  core: 'DSE - 4<br>EI - 4<br>IS - 4',
                  technical: 'RC - 4<br>OM - 4<br>FS - 4',
                  leadership: 'TSC - 4<br>PSDM - 4',
                  indicator: '300 administrative documents processed within 24 hours of receipt',
                  required: 'per administrative document processed',
                  standard5: 'Q - 350 or more<br>E - with 100% accuracy<br>T - within 8 hours',
                  standard4: 'Q - 300-349<br>E - with 95% accuracy<br>T - within 24 hours',
                  standard3: 'Q - 250-299<br>E - with 90% accuracy<br>T - within 36 hours',
                  standard2: 'Q - 200-249<br>E - with 85% accuracy<br>T - within 48 hours',
                  standard1: 'Q - 199 or less<br>E - below 85% accuracy<br>T - more than 48 hours'
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    // Direct print to system printer
    directPrint() {
      this.isPrinting = true;

      // Create a hidden iframe with proper styling for printing
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';

      document.body.appendChild(printFrame);

      printFrame.onload = () => {
        const printDocument = printFrame.contentWindow.document;
        const printSection = document.getElementById('print-section');

        // Copy the CSS
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => {
          printDocument.head.appendChild(style.cloneNode(true));
        });

        // Add print-specific stylesheet
        const printStyle = document.createElement('style');
        printStyle.textContent = `
          @page {
            size: legal landscape;
            margin: 10mm;
          }
          body { 
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .logo {
            width: 120px;
            height: auto;
          }
          .main-table {
            table-layout: fixed;
            width: 100%;
          }
          .main-table tr {
            page-break-inside: avoid; /* Prevent rows from breaking across pages */
          }
          /* Force headers to NOT repeat */
          .no-repeat-header {
            display: table-header-group !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          /* Explicit override for print browsers that repeat headers */
          thead.no-repeat-header {
            display: table-header-group !important;
          }
          @media print {
            thead.no-repeat-header { display: table-row-group !important; }
          }
          .main-table tbody {
            display: table-row-group; /* Keep body rows together */
          }
          table {
            page-break-inside: auto; /* Allow page breaks between rows if needed */
          }
          .header-container {
            display: flex;
            align-items: center;
          }
          .header-text {
            margin-left: 20px;
          }
          .green-banner {
            background-color: #00703C;
            color: white;
            font-weight: bold;
            padding: 8px 0;
            text-align: center;
            width: 100%;
          }
          .mfo-column { width: 10%; }
          .competency-column { width: 10%; }
          .indicator-column { width: 10%; }
          .output-column { width: 10%; }
          .standard-column { width: 8%; }
        `;
        printDocument.head.appendChild(printStyle);

        // Copy the content
        printDocument.body.innerHTML = printSection.innerHTML;

        // Print and cleanup
        setTimeout(() => {
          printFrame.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(printFrame);
            this.isPrinting = false;
          }, 500);
        }, 500);
      };

      // Set iframe source to trigger onload
      printFrame.src = 'about:blank';
    },

    // Generate and download PDF
    async downloadPdf() {
      try {
        this.isGeneratingPdf = true;

        const printSection = document.getElementById('print-section');
        const canvas = await html2canvas(printSection, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true
        });

        // Create PDF in landscape orientation
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'legal'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10; // Small margin from top

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

        // Save PDF with division name
        const divisionName = this.divisions[this.selectedDivision].name.replace(/\s+/g, '_');
        pdf.save(`Unit_Work_Plan_${divisionName}.pdf`);

      } catch (error) {
        console.error('PDF generation error:', error);
        if (this.$q && this.$q.notify) {
          this.$q.notify({
            color: 'negative',
            message: 'Failed to generate PDF. Please try again.',
            icon: 'error'
          });
        } else {
          alert('Failed to generate PDF. Please try again.');
        }
      } finally {
        this.isGeneratingPdf = false;
      }
    }
  }
}
</script>

<style scoped>
/* Main Application Layout */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* App Header */
.app-header {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #00703C;
  color: white;
}

.header-content {
  width: 100%;
}

/* Main Content Area */
.main-content {
  display: flex;
  height: calc(100vh - 60px);
  width: 100%;
  overflow: hidden;
}

/* Division Navigation */
.division-nav {
  width: 280px;
  min-width: 280px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.division-nav-header {
  background-color: #fff;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.division-list {
  flex: 1;
  overflow-y: auto;
}

/* Active Division Styling */
.active-division {
  background-color: rgba(0, 112, 60, 0.1);
  color: #00703C;
  font-weight: bold;
  border-left: 4px solid #00703C;
}

/* Report Container */
.report-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Report Header */
.report-header {
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Report Content - Single Scrollable Area */
.report-content-scroll {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #f9f9f9;
}

/* For the print section content */
.report-content {
  background-color: white;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
}

/* Table container with horizontal scrolling for small screens only */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Header Container */
.header-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.city-logo {
  flex-shrink: 0;
}

.logo {
  width: 120px;
  height: auto;
  object-fit: contain;
}

.green-line {
  width: 100px;
  height: 130px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.line {
  width: 100px;
  height: 45px;
  background-color: #036431;
}

.header-text {
  margin-left: 20px;
  width: 100%;
}

.padded-text {
  padding-left: 10px;
}

.green-banner {
  background-color: #036431;
  color: white;
  font-weight: bold;
  font-size: 18px;
  padding: 8px 0;
  text-align: left;
  margin-top: 10px;
  width: 100%;
}

/* Tables */
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
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 8px;
  font-size: 12px;
  vertical-align: top;
  overflow-wrap: break-word;
  word-break: break-word;
}

.main-table th {
  background-color: #f2f2f2;
}

/* Column width specifications */
.mfo-column {
  width: 10%;
}

.competency-column {
  width: 9%;
}

.competency-header {
  width: 27%;
}

.indicator-column {
  width: 13%;
}

.output-column {
  width: 10%;
}

.standards-header {
  width: 40%;
}

.standard-column {
  width: 8%;
}

.mfo-cell {
  font-weight: bold;
  background-color: #f5f5f5;
}

.full-width {
  width: 100%;
}

/* Print Styles */
@media print {
  @page {
    size: landscape;
  }

  /* Avoid row breaks across pages */
  tr {
    page-break-inside: avoid !important;
  }

  /* Prevent header repetition */
  thead.no-repeat-header {
    display: table-row-group !important;
    break-inside: avoid;
    page-break-after: avoid;
  }

  tbody {
    display: table-row-group;
  }

  /* Fix for logo and header */
  .header-container {
    display: flex;
    align-items: center;
  }

  .city-logo img {
    width: 120px;
    height: auto;
  }

  .green-banner {
    margin-top: 10px;
    background-color: #00703C !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* Responsive design for smaller screens */
@media screen and (max-width: 1200px) {
  .main-table {
    font-size: 11px;
  }

  .main-table th,
  .main-table td {
    padding: 6px;
    font-size: 11px;
  }
}

@media screen and (max-width: 992px) {
  .division-nav {
    width: 220px;
    min-width: 220px;
  }

  .main-table th,
  .main-table td {
    padding: 4px;
    font-size: 10px;
  }

  .header-container {
    flex-direction: column;
    align-items: center;
  }

  .green-line {
    display: none;
  }

  .header-text {
    margin-left: 0;
    margin-top: 10px;
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .division-nav {
    width: 180px;
    min-width: 180px;
  }

  .report-content {
    padding: 10px;
  }
}
</style>
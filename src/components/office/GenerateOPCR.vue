<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="my-card" style="width: 90vw; max-width: 1200px; border-radius: 12px;">
      <!-- Header section -->
      <q-card-section class="header-section row items-center justify-between"
        style="background-color: #00703C; height: 50px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
        <div class="text-h6 text-white">Office of the City Mayor</div>
        <q-btn flat round dense icon="close" v-close-popup color="white" />
      </q-card-section>

      <q-separator />

      <div class="row justify-between items-center q-px-md q-py-sm bg-grey-3">
        <div class="text-h6">OPCR</div>
        <div>
          <q-btn label="Input" icon="edit" color="green" unelevated rounded class="action-btn q-mr-sm"
            @click="showInputModal = true" />
          <q-btn label="Print" icon="print" color="green" unelevated rounded class="action-btn q-mr-sm"
            @click="printOPCR" />
          <q-btn label="Save as PDF" icon="picture_as_pdf" color="green" unelevated rounded class="action-btn"
            @click="exportToPDF" />
        </div>
      </div>

      <q-separator />

      <div style="overflow-y: auto; max-height: 70vh; padding: 8px;">
        <div class="preview-container" id="opcr-preview">
          <!-- Header Section with Logos -->
          <div class="header-with-logos">
            <div class="header-row row items-center justify-between">
              <div class="header-logo">
                <img src="../../assets/rotp.png" alt="Republic of the Philippines" style="height: 80px;">
              </div>
              <div class="header-text-content text-center">
                <div class="text-bold" style="margin-bottom: 5px;">Republic of the Philippines</div>
                <div class="text-bold" style="margin-bottom: 5px;">Province of Davao del Norte</div>
                <div class="text-bold" style="font-size: 1rem; margin-bottom: 10px;">CITY OF TAGUM</div>
                <div class="text-bold" style="font-size: 1.1rem; margin-top: 15px;">OFFICE PERFORMANCE COMMITMENT AND
                  REVIEW (OPCR)</div>
              </div>
              <div class="header-logo">
                <img src="../../assets/tagumlogo.png" alt="City of Tagum" style="height: 80px;">
              </div>
            </div>
          </div>

          <div class="commitment-container q-mt-md">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
              <!-- Commitment Statement -->
              <tr>
                <td style="width: 100%; padding: 8px; border: 1px solid #000; vertical-align: top;">
                  I, <b>JANYLENE A. PALERMO, MM</b>, CHRM Officer of the CITY HUMAN RESOURCE MANAGEMENT OFFICE, commit
                  to deliver and agree to be rated on the attainment of the following targets in accordance with the
                  indicated measures for the period of <b>JANUARY–JUNE, 2024</b>.

                  <!-- Signatory Info Bottom Right -->
                  <div style="margin-top: 20px; text-align: right;">
                    <div><b>JANYLENE A. PALERMO, MM</b></div>
                    <div>City Human Resource Mgt. Officer</div>
                    <div>Date: January 8, 2024</div>
                  </div>
                </td>
              </tr>

              <!-- Approval Section -->
              <tr>
                <td style="width: 100%; padding: 0; border: 1px solid #000;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <th
                        style="padding: 8px; width: 50%; border-right: 1px solid #000; text-align: left; border-bottom: 1px solid #000;">
                        Approved by:
                      </th>
                      <th style="padding: 8px; width: 50%; text-align: center; border-bottom: 1px solid #000;">
                        Date
                      </th>
                    </tr>
                    <!-- Combined REY T. UY and City Mayor in one cell with line break -->
                    <tr>
                      <td
                        style="padding: 8px; border-right: 1px solid #000; text-align: center; height: 120px; vertical-align: bottom;">
                        <!-- Increased height and aligned to the bottom -->
                        <div style="font-weight: bold; font-size: 1.1em;">REY T. UY</div>
                        <hr style="margin: 5px 0; border-top: 1px solid #000;" />
                        <div>City Mayor</div>
                      </td>
                      <td style="text-align: center;"></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <!-- Rating Scale Table -->
          <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <table class="rating-scale-table" style="border: 1px solid #000; border-collapse: collapse; width: auto;">
              <tr>
                <td style="border: 1px solid #000; padding: 6px 14px; min-width: 180px;">Outstanding</td>
                <td style="border: 1px solid #000; padding: 6px 14px; text-align: center; min-width: 50px;">5</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 14px;">Very Satisfactory</td>
                <td style="border: 1px solid #000; padding: 6px 14px; text-align: center;">4</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 14px;">Satisfactory</td>
                <td style="border: 1px solid #000; padding: 6px 14px; text-align: center;">3</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 14px;">Unsatisfactory</td>
                <td style="border: 1px solid #000; padding: 6px 14px; text-align: center;">2</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 6px 14px;">Poor</td>
                <td style="border: 1px solid #000; padding: 6px 14px; text-align: center;">1</td>
              </tr>
            </table>
          </div>

          <!-- Main OPCR Table -->
          <table class="opcr-table q-mt-md"
            style="border-collapse: collapse; border: 1px solid black; font-size: 11px;">
            <!-- Table headers -->
            <thead>
              <tr>
                <th rowspan="2" style="border: 1px solid black; width: 8%;">MFO</th>
                <th rowspan="2" style="border: 1px solid black; width: 20%;">REQUIRED COMPETENCY & PROFIENCY LEVEL</th>
                <th rowspan="2" style="border: 1px solid black; width: 12%;">SUCCESS INDICATOR</th>
                <th rowspan="2" style="border: 1px solid black; width: 10%;">ALLOTED BUDGET</th>
                <th rowspan="2" style="border: 1px solid black; width: 10%;">DIVISION/ INDIVIDUAL ACCOUNTABLE</th>
                <th rowspan="2" style="border: 1px solid black; width: 12%;">ACTUAL ACCOMPLISHMENT</th>
                <th colspan="4" style="border: 1px solid black; width: 12%;">RATING</th>
                <th rowspan="2" style="border: 1px solid black; width: 10%;">PROFIENCY RESULT</th>
                <th rowspan="2" style="border: 1px solid black; width: 6%;">REMARKS</th>
              </tr>
              <tr>
                <th style="border: 1px solid black; width: 3%;">Q</th>
                <th style="border: 1px solid black; width: 3%;">E</th>
                <th style="border: 1px solid black; width: 3%;">T</th>
                <th style="border: 1px solid black; width: 3%;">A</th>
              </tr>
            </thead>

            <tbody>
              <!-- STRATEGIC FUNCTIONS -->
              <tr>
                <td colspan="12" class="section-header" style="border: 1px solid black;">STRATEGIC FUNCTIONS:</td>
              </tr>
              <tr>
                <td style="border: 1px solid black;">Enhanced Competency of Workforce</td>
                <td style="border: 1px solid black;">
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Monitoring & Evaluation (Superior)<br>
                  8. Process Management (Superior)<br>
                  9. Build Collaborative and Inclusive Working Relationships (Superior)
                </td>
                <td>18 provision of total workforce were given intervention without lapses as per schedule</td>
                <td>P 19,101,441.00 (Personal Services)</td>
                <td>ARPMID</td>
                <td>36 provision of total workforce were given intervention without lapses as per schedule</td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior<br>
                  9. Superior
                </td>
                <td>Retained Competency</td>
              </tr>

              <!-- CORE FUNCTIONS -->
              <tr>
                <td colspan="12" class="section-header" style="border: 1px solid black;">CORE FUNCTIONS:</td>
              </tr>
              <!-- MFO 1 -->
              <tr>
                <td style="border: 1px solid black;">MFO 1<br>Recruitment, Selection and Placement</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Process Management (Superior)<br>
                  8. Records Management (Superior)
                </td>
                <td>7,474 Recruitment, Selection and Placement related documents/activities approved and signed
                  without
                  lapses before the schedule</td>
                <td>P 19,101,441.00 (Personal Services)</td>
                <td>ARPMID</td>
                <td>9,712 Recruitment, Selection and Selection related documents/activities approved and signed with
                  lapses
                  within the schedule</td>
                <td>4</td>
                <td>2</td>
                <td>3</td>
                <td>3</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior
                </td>
                <td>Retained Competency</td>
              </tr>
              <!-- MFO 2 -->
              <tr>
                <td>MFO 2<br>Performance Management</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Monitoring & Evaluation (Superior)<br>
                  8. Managing Performance & Coaching for Results (Superior)
                </td>
                <td>1,100 Performance Management related documents/activities monitored without lapses within the
                  schedule
                </td>
                <td>P 19,101,441.00 (Personal Services)</td>
                <td>ARPMID</td>
                <td>1,482 Performance Management related documents/activities monitored without lapses before the
                  schedule
                </td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior
                </td>
                <td>Retained Competency</td>
              </tr>
              <!-- MFO 3 -->
              <tr>
                <td>MFO 3<br>Employees Compensation and Benefits</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Process Management (Superior)<br>
                  8. Records Management (Superior)
                </td>
                <td>1,194 employees Compensation and Benefits related documents/activities approved and signed
                  without
                  lapses before the schedule</td>
                <td>P 19,101,441.00 (Personal Services)</td>
                <td>BHRD, ARPMID</td>
                <td>1,239 Employees Compensation and Benefits related documents/activities signed and approved with
                  lapses
                  within the schedule</td>
                <td>3</td>
                <td>2</td>
                <td>3</td>
                <td>2.67</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior
                </td>
                <td>Retained Competency</td>
              </tr>
              <!-- MFO 4 -->
              <tr>
                <td>MFO 4<br>Administrative Support Services</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Process Management (Superior)<br>
                  8. Problem Solving and Decision Making (Superior)<br>
                  9. Monitoring and Evaluation (Superior)
                </td>
                <td>1,691 Administrative Support Services related documents/activities monitored without lapses
                  within the
                  schedule</td>
                <td>P 19,101,441.00 (Personal Services)</td>
                <td>ARPMID, ASD, BHRD</td>
                <td>3,430 Administrative Support Services related documents/activities signed and approved with
                  lapses
                  within the schedule</td>
                <td>5</td>
                <td>2</td>
                <td>3</td>
                <td>3.33</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior<br>
                  9. Superior
                </td>
                <td>Retained Competency</td>
              </tr>
              <!-- MFO 5 -->
              <tr>
                <td>MFO 5<br>Learning and Development</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Monitoring and Evaluation (Superior)<br>
                  8. Thinking Strategically and Creatively (Superior)<br>
                  9. Managing Performance & Coaching for Results (Superior)
                </td>
                <td>924 Learning and Development related documents/activities monitored without lapses before the
                  schedule
                </td>
                <td>
                  P 19,101,441.00 (Personal Services)<br>
                  P 565,000.00 (Personal Enhancement Program)<br>
                  P 1,000,000.00 (Burial and/or Financial Assistance to Employees)<br>
                  P 900,000.00 (Holistic Health and Wellness Program)<br>
                  P 999,500.00 (PCSA Celebration and Sports Activities)
                </td>
                <td>BHRD</td>
                <td>744 Learning and Development related documents activities monitored without lapses before
                  schedule</td>
                <td>2</td>
                <td>5</td>
                <td>5</td>
                <td>4</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior<br>
                  9. Superior
                </td>
                <td>Retained Competency</td>
              </tr>
              <!-- MFO 6 -->
              <tr>
                <td>MFO 6<br>Rewards and Recognition</td>
                <td>
                  1. Delivering Service Excellence (Superior)<br>
                  2. Exemplifying Integrity (Superior)<br>
                  3. Interpersonal Skills (Superior)<br>
                  4. Planning and Organizing(Superior)<br>
                  5. Partnering & Networking (Superior)<br>
                  6. Attention to Detail (Superior)<br>
                  7. Monitoring and Evaluation (Superior)<br>
                  8. Records Management (Superior)
                </td>
                <td>50 Rewards and Recognition related documents/activities monitored without lapses before the
                  schedule
                </td>
                <td>P 270,000.00 (Operationalization of PRAISE Committee)</td>
                <td>BHRD</td>
                <td>46 Rewards and Recognition related documents/activities monitored without lapses before schedule
                </td>
                <td>2</td>
                <td>5</td>
                <td>5</td>
                <td>4</td>
                <td>
                  1. Superior<br>
                  2. Superior<br>
                  3. Superior<br>
                  4. Superior<br>
                  5. Superior<br>
                  6. Superior<br>
                  7. Superior<br>
                  8. Superior
                </td>
                <td>Retained Competency</td>
              </tr>

              <!-- SUPPORT FUNCTIONS -->
              <tr>
                <td colspan="12" class="section-header" style="border: 1px solid black;">SUPPORT FUNCTIONS:</td>
              </tr>
              <!-- Health and Wellness -->
              <tr>
                <td>Health and Wellness</td>
                <td>Not Applicable</td>
                <td>80% of the total 24 hours required Health & Wellness activities attended without lapses on time
                </td>
                <td>P 19,750,511.00 (Personal Services)</td>
                <td>ASD, ARPMID, BHRDD</td>
                <td>24 hours required Health & Wellness activities attended without lapses before scheduled time
                </td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>5</td>
                <td>Not Applicable</td>
                <td></td>
              </tr>
              <!-- Daily Time Record -->
              <tr>
                <td>Daily Time Record (DTR)</td>
                <td>Not Applicable</td>
                <td>156 DTRs reviewed without lapses within 2nd working days of the succeeding month</td>
                <td>P 19,750,511.00 (Personal Services)</td>
                <td>ASD, ARPMID, BHRDD</td>
                <td>240 DTRs reviewed without lapses within the 2nd working day of the succeeding month</td>
                <td>5</td>
                <td>5</td>
                <td>3</td>
                <td>4.33</td>
                <td>Not Applicable</td>
                <td></td>
              </tr>
              <!-- Monitoring and Coaching -->
              <tr>
                <td>Monitoring and Coaching</td>
                <td>Not Applicable</td>
                <td>10 Monitoring/ Coaching evaluated and approved without lapses within schedule</td>
                <td>P 19,750,511.00 (Personal Services)</td>
                <td>ASD, ARPMID, BHRDD</td>
                <td>12 Monitoring/ Coaching Journal evaluated and approved without lapses within schedule</td>
                <td>4</td>
                <td>5</td>
                <td>3</td>
                <td>4</td>
                <td>Not Applicable</td>
                <td></td>
              </tr>
              <!-- OPCR -->
              <tr>
                <td>Office Performance Commitment & Review (OPCR)</td>
                <td>Not Applicable</td>
                <td>1 OPCR Accomplishment and 1 OPCR Target reviewed and submitted without lapses within deadline
                </td>
                <td>P 19,750,511.00 (Personal Services)</td>
                <td>ASD,ARPMID,BHRDD</td>
                <td>1 OPCR Accomplishment and 1 OPCR Target reviewed and submitted with 1 revision beyond deadline
                </td>
                <td>5</td>
                <td>3</td>
                <td>1</td>
                <td>3</td>
                <td>Not Applicable</td>
                <td></td>
              </tr>
              <!-- Personnel Mechanism Meetings -->
              <tr>
                <td>Personnel Mechanism Meetings</td>
                <td>Not Applicable</td>
                <td>10 Personnel Mechanism meetings administered without lapses as scheduled</td>
                <td>P50,000.00 (Program for Personnel Mechanisms)</td>
                <td>CHRMO</td>
                <td>10 Personnel Mechanism meetings administered without lapses as scheduled</td>
                <td>3</td>
                <td>5</td>
                <td>5</td>
                <td>4.33</td>
                <td>Not Applicable</td>
                <td></td>
              </tr>

              <tr>
                <td colspan="12" style="border: 1px solid black; padding: 0;">
                  <div class="text-bold text-left q-mb-sm" style="padding: 8px;">AVERAGE RATING</div>
                  <table style="width: 100%; border-collapse: collapse; border-top: 1px solid black;">
                    <tr>
                      <th colspan="2" style="border: 1px solid black; padding: 8px; width: 40%;">Category</th>
                      <th
                        style="border: 1px solid black; padding: 8px; width: 60%; text-align: center; font-style: italic;">
                        COMPETENCY ASSESSMENT (Subjective)
                      </th>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 8px;">Strategic Functions:</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: center;">5.00</td>
                      <td rowspan="5" style="border: 1px solid black;"></td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 8px;">Core Functions:</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: center;">3.72</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 8px;">Support Functions:</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: center;">4.13</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 8px;">Final Rating:</td>
                      <td style="border: 1px solid black; padding: 8px; text-align: center;">4.19</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid black; padding: 8px;">Adjectival Rating:</td>
                      <td style="border: 1px solid black; padding: 8px;"></td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SIGNATORY SECTION -->
              <tr>
                <td colspan="12" style="border: 1px solid black; padding: 0;">
                  <table style="width: 100%; border-collapse: collapse; border-top: 1px solid black;">
                    <tr>
                      <td style="border: 1px solid black; padding: 6px; border-right: none; width: 15%;">Assessed by:
                      </td>
                      <td colspan="4" style="border: 1px solid black; border-left: none; width: 60%;"></td>
                      <td style="border: 1px solid black; padding: 6px; width: 15%;">Final Rating by:</td>
                      <td style="border: 1px solid black; padding: 6px; width: 10%;">Date</td>
                    </tr>
                    <tr>
                      <td rowspan="2" style="border: 1px solid black; height: 80px; border-right: none; width: 15%;">
                      </td>
                      <td rowspan="6" style="border: 1px solid black; width: 15%;"></td>
                      <td rowspan="6" style="border: 1px solid black; width: 5%;"></td>
                      <td rowspan="2" style="border: 1px solid black; height: 80px; width: 40%;"></td>
                      <td rowspan="6" style="border: 1px solid black; width: 5%;"></td>
                      <td rowspan="6"
                        style="border: 1px solid black; text-align: center; vertical-align: bottom; padding-top: 10px; width: 15%;">
                        <div class="text-weight-bold">REY T. UY</div>
                        <div style="border-top: 3px solid black; margin-bottom: 3px;"></div>
                        <div class="text-caption">City Mayor</div>
                      </td>
                      <td rowspan="6" style="border: 1px solid black; width: 10%;"></td>
                    </tr>
                    <tr></tr>
                    <tr>
                      <td style="border: 1px solid black; height: 20px; text-align: center; border-right: none;">
                        Planning Office</td>
                      <td style="border: 1px solid black; height: 20px; text-align: center;">Performance Management Team
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Input Modal -->
      <q-dialog v-model="showInputModal">
        <InputPage @save="handleSave" @close="showInputModal = false" />
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import InputPage from './InputPage.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  components: {
    InputPage
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showModal = ref(props.show);
    const showInputModal = ref(false);

    const printOPCR = () => {
      const printContent = document.getElementById('opcr-preview').cloneNode(true);

      const printStyles = `
        <style>
          @page {
            size: legal landscape;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
          }
          .header-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            margin-bottom: 15px !important;
          }
          .header-text-content {
            flex-grow: 1 !important;
            text-align: center !important;
            padding: 0 20px !important;
          }
          .header-text-content div {
            margin: 5px 0 !important;
          }
          .header-text-content div:last-child {
            margin-top: 15px !important;
          }
          .header-logo {
            flex-shrink: 0 !important;
            width: 80px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .header-logo img {
            max-height: 70px !important;
            width: auto !important;
            height: auto !important;
            display: block !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
          }
          .section-header {
            background-color: #d9d9d9 !important;
            font-weight: bold;
          }
          .rating-scale-table {
            float: right;
            margin-left: 20px;
            margin-bottom: 10px;
            width: auto;
            max-width: 180px;
          }
        </style>
      `;

      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>OPCR Report</title>
            ${printStyles}
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      iframe.onload = function () {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          document.body.removeChild(iframe);
        }, 500);
      };
    };

    const exportToPDF = async () => {
      // Create a temporary iframe to match print styling
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '1000px'; // Set a reasonable width for rendering
      iframe.style.height = '1000px';
      document.body.appendChild(iframe);

      const content = document.getElementById('opcr-preview');

      // Apply the same styling as the print function
      const printStyles = `
        <style>
          @page {
            size: legal landscape;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
          }
          .header-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            margin-bottom: 15px !important;
          }
          .header-text-content {
            flex-grow: 1 !important;
            text-align: center !important;
            padding: 0 20px !important;
          }
          .header-text-content div {
            margin: 5px 0 !important;
          }
          .header-text-content div:last-child {
            margin-top: 15px !important;
          }
          .header-logo {
            flex-shrink: 0 !important;
            width: 80px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .header-logo img {
            max-height: 70px !important;
            width: auto !important;
            height: auto !important;
            display: block !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
          }
          .section-header {
            background-color: #d9d9d9 !important;
            font-weight: bold;
          }
          .rating-scale-table {
            float: right;
            margin-left: 20px;
            margin-bottom: 10px;
            width: auto;
            max-width: 180px;
          }
        </style>
      `;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>OPCR Report</title>
            ${printStyles}
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for iframe content to load
      await new Promise(resolve => {
        iframe.onload = resolve;
        // If already loaded, resolve immediately
        if (iframeDoc.readyState === 'complete') {
          resolve();
        }
      });

      try {
        // Create PDF with the same dimensions as legal landscape
        // Legal size is 8.5" x 14" (612 x 1008 points)
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'legal',
          compress: true
        });

        // Get the content from iframe
        const element = iframeDoc.body;

        // Match the print margins (10mm)
        const margins = { top: 10, right: 10, bottom: 10, left: 10 };

        // Calculate available space for content
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Set up html2canvas options
        const options = {
          scale: 1.5, // Higher scale for better quality while maintaining size
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        };

        // Generate canvas from the element
        const canvas = await html2canvas(element, options);

        // Calculate dimensions
        const imgWidth = pageWidth - margins.left - margins.right;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Calculate pages needed
        const pageCount = Math.ceil(imgHeight / (pageHeight - margins.top - margins.bottom));

        // Add content page by page
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage('legal', 'landscape');
          }

          // Calculate which portion of the image to use for this page
          const sourceY = i * canvas.height / pageCount;
          const sourceHeight = canvas.height / pageCount;

          // Create a new canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const ctx = pageCanvas.getContext('2d');

          // Draw the portion of the source canvas
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, pageCanvas.width, pageCanvas.height
          );

          // Add to PDF
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(
            pageImgData,
            'JPEG',
            margins.left,
            margins.top,
            imgWidth,
            (pageHeight - margins.top - margins.bottom)
          );
        }

        pdf.save('OPCR-JAN-JUNE-2024.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        // Clean up
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }
    };

    const handleSave = (opcrData) => {
      emit('save', opcrData);
      showInputModal.value = false;
    };

    return {
      showModal,
      showInputModal,
      printOPCR,
      exportToPDF,
      handleSave
    };
  },
  watch: {
    show(newVal) {
      this.showModal = newVal;
    },
    showModal(newVal) {
      if (!newVal) {
        this.$emit('update:show', false);
      }
    }
  }
}
</script>

<style scoped>
/* Header Styles */
.header-with-logos {
  margin-bottom: 20px;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-text-content {
  flex-grow: 1;
  text-align: center;
  padding: 0 20px;
}

.header-text-content div {
  margin: 5px 0;
}

.header-text-content div:last-child {
  margin-top: 15px;
}

.header-logo {
  flex-shrink: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo img {
  max-height: 80px;
  width: auto;
  object-fit: contain;
}

/* Print-specific styles */
@media print {
  .header-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 15px !important;
  }

  .header-text-content div {
    margin: 5px 0 !important;
  }

  .header-text-content div:last-child {
    margin-top: 15px !important;
  }

  .header-logo img {
    max-height: 70px !important;
  }
}

.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding: 0 20px;
  color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.content-section {
  padding: 16px;
  background-color: #ffffff;
}

.q-separator {
  background-color: rgba(0, 0, 0, 0.08);
  height: 1px;
}

.action-btn {
  min-width: 100px;
  padding: 6px 12px;
  background-color: #00703C;
  color: white;
}

.action-btn:hover {
  background-color: #005a30;
}

.preview-container {
  padding: 12px;
  background-color: white;
}

.city-logo {
  flex-shrink: 0;
}

.logo {
  width: 100px;
  height: auto;
  object-fit: contain;
}

.green-line {
  width: 80px;
  height: 110px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.line {
  width: 80px;
  height: 40px;
  background-color: #036431;
}

.header-text {
  margin-left: 16px;
  width: 100%;
}

.padded-text {
  padding-left: 8px;
}

.green-banner {
  background-color: #036431;
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 6px 0;
  text-align: left;
  margin-top: 8px;
  width: 100%;
}

/* Tables */
.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  border: 1px solid #000;
  padding: 6px;
}

.main-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 8px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 6px;
  font-size: 11px;
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

/* Table container with horizontal scrolling for small screens only */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Commitment and Approval Section */
.commitment-container table {
  border: 1px solid #000;
}

.commitment-container td {
  padding: 6px;
  vertical-align: top;
}

.commitment-container .approval-table {
  width: 100%;
  border-collapse: collapse;
}

/* Final Rating Section */
.final-rating-container {
  margin-top: 16px;
}

.final-rating-container table {
  width: 100%;
  border-collapse: collapse;
}

.final-rating-container table td {
  border: 1px solid #000;
  padding: 4px;
}

/* Rating columns in main table */
.opcr-table th[rowspan="2"] {
  width: 3%;
}

/* Responsive design for smaller screens */
@media screen and (max-width: 1200px) {
  .main-table {
    font-size: 10px;
  }

  .main-table th,
  .main-table td {
    padding: 4px;
    font-size: 10px;
  }
}

@media screen and (max-width: 992px) {

  .main-table th,
  .main-table td {
    padding: 3px;
    font-size: 9px;
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
    margin-top: 8px;
    text-align: center;
  }
}

#opcr-preview {
  padding: 12px;
  font-family: Arial, sans-serif;
  font-size: 11px;
  color: #000;
}

#opcr-preview .opcr-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 10px;
  border: 1px solid #000 !important;
}

#opcr-preview .opcr-table th,
#opcr-preview .opcr-table td {
  border: 1px solid #000 !important;
  padding: 4px;
  vertical-align: top;
}

#opcr-preview .opcr-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
}

#opcr-preview .section-header {
  background-color: #d9d9d9;
  font-weight: bold;
  padding: 4px;
}

/* Rating Scale Table */
.rating-scale-table {
  border: 1px solid #000;
  border-collapse: collapse;
  float: right;
  margin-left: 16px;
  margin-bottom: 10px;
  width: auto;
  max-width: 180px;
  font-size: 10px;
}

.rating-scale-table td {
  padding: 6px 14px;
  min-width: auto;
}

/* Signatory section specific styles */
#opcr-preview table[style*="border-top: 1px solid black"] td {
  padding: 6px 4px !important;
}

@media print {
  body {
    font-family: Arial, sans-serif !important;
    font-size: 11px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @page {
    size: legal landscape !important;
    margin: 10mm !important;
  }

  .text-center,
  .text-center * {
    text-align: center !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
    page-break-inside: auto !important;
    border: 1px solid #000 !important;
  }

  tr {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }

  th,
  td {
    border: 1px solid #000 !important;
    padding: 4px !important;
    vertical-align: top !important;
  }

  .section-header {
    background-color: #d9d9d9 !important;
    font-weight: bold !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .rating-scale-table {
    float: right !important;
    margin-left: 20px !important;
    margin-bottom: 10px !important;
    width: auto !important;
    max-width: 180px !important;
    font-size: 10px !important;
  }

  .rating-scale-table td {
    padding: 4px 8px !important;
    min-width: auto !important;
  }

  #opcr-preview table[style*="border-top: 1px solid black"] td:last-child {
    width: 10% !important;
  }

  #opcr-preview {
    width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
  }
}
</style>

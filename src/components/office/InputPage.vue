<template>
  <q-card style="width: 90vw; max-width: 1200px; border-radius: 12px;">
    <q-card-section class="header-section row items-center justify-between"
      style="background-color: #00703C; height: 50px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div class="text-h6 text-white q-pl-md">Office of the City Mayor</div>
      <!-- Exit button removed -->
    </q-card-section>

    <q-card-section style="overflow-y: auto; max-height: 70vh; padding: 16px;">
      <!-- 1. STRATEGIC FUNCTION Table -->
      <div class="section-container q-mb-lg">
        <div class="section-title q-mb-sm">A. STRATEGIC FUNCTION</div>
        <div class="competency-table">
          <table class="full-width">
            <thead>
              <tr>
                <th class="text-center" rowspan="2" width="20%">Function</th>
                <th class="text-center" colspan="3" width="30%">Required Competency & Proficiency Level</th>
                <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
              </tr>
              <tr>
                <th class="text-center">Core</th>
                <th class="text-center">Technical</th>
                <th class="text-center">Leadership</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">
                  Enhanced Competency of Workforce
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  M&E (S)<br>
                  PM (S)
                </td>
                <td class="text-center">
                  BCIWR (S)
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="strategicBudget" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.strategicBudget }"
                    :error="errors.strategicBudget" error-message="Field is required" lazy-rules
                    @blur="validateField('strategicBudget')" ref="strategicBudgetRef">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="strategicAccountable" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.strategicAccountable }"
                    :error="errors.strategicAccountable" error-message="Field is required" lazy-rules
                    @blur="validateField('strategicAccountable')" ref="strategicAccountableRef">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 2. CORE FUNCTION Table -->
      <div class="section-container q-mb-lg">
        <div class="section-title q-mb-sm">B. CORE FUNCTION</div>
        <div class="competency-table">
          <table class="full-width">
            <thead>
              <tr>
                <th class="text-center" rowspan="2" width="20%">Function</th>
                <th class="text-center" colspan="3" width="30%">Required Competency & Proficiency Level</th>
                <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
              </tr>
              <tr>
                <th class="text-center">Core</th>
                <th class="text-center">Technical</th>
                <th class="text-center">Leadership</th>
              </tr>
            </thead>
            <tbody>
              <!-- MFO 1 -->
              <tr>
                <td class="text-center">
                  MFO 1: Recruitment, Selection and Placement
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  PM (S)<br>
                  RM (S)
                </td>
                <td class="text-center">
                  <!-- Empty for this MFO -->
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget1" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget1 }"
                    :error="errors.coreBudget1" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget1')" ref="coreBudget1Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable1" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable1 }"
                    :error="errors.coreAccountable1" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable1')" ref="coreAccountable1Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- MFO 2 -->
              <tr>
                <td class="text-center">
                  MFO 2: Performance Management
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  M&E (S)
                </td>
                <td class="text-center">
                  MPCR (S)
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget2" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget2 }"
                    :error="errors.coreBudget2" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget2')" ref="coreBudget2Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable2" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable2 }"
                    :error="errors.coreAccountable2" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable2')" ref="coreAccountable2Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- MFO 3 -->
              <tr>
                <td class="text-center">
                  MFO 3: Employees Compensation and Benefits
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  PM (S)<br>
                  RM (S)
                </td>
                <td class="text-center">
                  <!-- Empty for this MFO -->
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget3" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget3 }"
                    :error="errors.coreBudget3" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget3')" ref="coreBudget3Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable3" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable3 }"
                    :error="errors.coreAccountable3" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable3')" ref="coreAccountable3Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- MFO 4 -->
              <tr>
                <td class="text-center">
                  MFO 4: Administrative Support Services
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  PM (S)<br>
                  M&E (S)
                </td>
                <td class="text-center">
                  PSDM (S)
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget4" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget4 }"
                    :error="errors.coreBudget4" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget4')" ref="coreBudget4Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable4" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable4 }"
                    :error="errors.coreAccountable4" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable4')" ref="coreAccountable4Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- MFO 5 -->
              <tr>
                <td class="text-center">
                  MFO 5: Learning and Development
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  M&E (S)
                </td>
                <td class="text-center">
                  TSC (S)<br>
                  MPCR (S)
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget5" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget5 }"
                    :error="errors.coreBudget5" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget5')" ref="coreBudget5Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable5" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable5 }"
                    :error="errors.coreAccountable5" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable5')" ref="coreAccountable5Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- MFO 6 -->
              <tr>
                <td class="text-center">
                  MFO 6: Rewards and Recognition
                </td>
                <td class="text-center">
                  DSE (S)<br>
                  EI (S)<br>
                  IS (S)
                </td>
                <td class="text-center">
                  P&O (S)<br>
                  P&N (S)<br>
                  AD (S)<br>
                  M&E (S)<br>
                  RM (S)
                </td>
                <td class="text-center">
                  <!-- Empty for this MFO -->
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreBudget6" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget6 }"
                    :error="errors.coreBudget6" error-message="Field is required" lazy-rules
                    @blur="validateField('coreBudget6')" ref="coreBudget6Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="coreAccountable6" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable6 }"
                    :error="errors.coreAccountable6" error-message="Field is required" lazy-rules
                    @blur="validateField('coreAccountable6')" ref="coreAccountable6Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. SUPPORT FUNCTION Table -->
      <div class="section-container q-mb-lg">
        <div class="section-title q-mb-sm">C. SUPPORT FUNCTION</div>
        <div class="competency-table">
          <table class="full-width">
            <thead>
              <tr>
                <th class="text-center" rowspan="2" width="20%">Function</th>
                <th class="text-center" rowspan="2" width="30%">Required Competency & Proficiency Level</th>
                <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
              </tr>
            </thead>
            <tbody>
              <!-- Health and Wellness -->
              <tr>
                <td class="text-center">
                  Health and Wellness
                </td>
                <td class="text-center">
                  Not Applicable
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportBudget1" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget1 }"
                    :error="errors.supportBudget1" error-message="Field is required" lazy-rules
                    @blur="validateField('supportBudget1')" ref="supportBudget1Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportAccountable1" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable1 }"
                    :error="errors.supportAccountable1" error-message="Field is required" lazy-rules
                    @blur="validateField('supportAccountable1')" ref="supportAccountable1Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- Daily Time Record -->
              <tr>
                <td class="text-center">
                  Daily Time Record (DTR)
                </td>
                <td class="text-center">
                  Not Applicable
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportBudget2" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget2 }"
                    :error="errors.supportBudget2" error-message="Field is required" lazy-rules
                    @blur="validateField('supportBudget2')" ref="supportBudget2Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportAccountable2" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable2 }"
                    :error="errors.supportAccountable2" error-message="Field is required" lazy-rules
                    @blur="validateField('supportAccountable2')" ref="supportAccountable2Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- Monitoring and Coaching -->
              <tr>
                <td class="text-center">
                  Monitoring and Coaching
                </td>
                <td class="text-center">
                  Not Applicable
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportBudget3" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget3 }"
                    :error="errors.supportBudget3" error-message="Field is required" lazy-rules
                    @blur="validateField('supportBudget3')" ref="supportBudget3Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportAccountable3" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable3 }"
                    :error="errors.supportAccountable3" error-message="Field is required" lazy-rules
                    @blur="validateField('supportAccountable3')" ref="supportAccountable3Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- OPCR -->
              <tr>
                <td class="text-center">
                  Office Performance Commitment & Review (OPCR)
                </td>
                <td class="text-center">
                  Not Applicable
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportBudget4" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget4 }"
                    :error="errors.supportBudget4" error-message="Field is required" lazy-rules
                    @blur="validateField('supportBudget4')" ref="supportBudget4Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportAccountable4" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable4 }"
                    :error="errors.supportAccountable4" error-message="Field is required" lazy-rules
                    @blur="validateField('supportAccountable4')" ref="supportAccountable4Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>

              <!-- Personnel Mechanism Meetings -->
              <tr>
                <td class="text-center">
                  Personnel Mechanism Meetings
                </td>
                <td class="text-center">
                  Not Applicable
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportBudget5" placeholder="Enter budget"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget5 }"
                    :error="errors.supportBudget5" error-message="Field is required" lazy-rules
                    @blur="validateField('supportBudget5')" ref="supportBudget5Ref">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </td>
                <td class="text-center">
                  <q-input dense outlined v-model="supportAccountable5" placeholder="Enter division/individual"
                    class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable5 }"
                    :error="errors.supportAccountable5" error-message="Field is required" lazy-rules
                    @blur="validateField('supportAccountable5')" ref="supportAccountable5Ref">
                    <template v-slot:prepend>
                      <q-icon name="people" />
                    </template>
                  </q-input>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn label="Cancel" color="grey" unelevated @click="$emit('close')" rounded class="action-btn q-mr-sm" />
      <q-btn label="Save" icon="save" color="primary" unelevated @click="showConfirmDialog" rounded
        class="action-btn" />
    </q-card-actions>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="confirmDialogOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="help_outline" color="primary" text-color="white" />
          <span class="q-ml-sm text-h6">Confirm Save</span>
        </q-card-section>

        <q-card-section>
          Are you sure you want to save this OPCR form?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="validateAndSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Success Dialog -->
    <q-dialog v-model="successDialogOpen">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm text-h6">Success</span>
        </q-card-section>

        <q-card-section>
          OPCR form has been successfully saved!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
  emits: ['save', 'close', 'error'],
  setup(props, { emit }) {
    const $q = useQuasar();

    // Strategic Function
    const strategicBudget = ref('P 19,101,441.00 (Personal Services)');
    const strategicAccountable = ref('ARPMID');

    // Core Functions
    const coreBudget1 = ref('P 19,101,441.00 (Personal Services)');
    const coreAccountable1 = ref('ARPMID');
    const coreBudget2 = ref('P 19,101,441.00 (Personal Services)');
    const coreAccountable2 = ref('ARPMID');
    const coreBudget3 = ref('P 19,101,441.00 (Personal Services)');
    const coreAccountable3 = ref('BHRD, ARPMID');
    const coreBudget4 = ref('P 19,101,441.00 (Personal Services)');
    const coreAccountable4 = ref('ARPMID, ASD, BHRD');
    const coreBudget5 = ref('P 19,101,441.00 (Personal Services)<br>P 565,000.00 (Personal Enhancement Program)<br>P 1,000,000.00 (Burial and/or Financial Assistance to Employees)<br>P 900,000.00 (Holistic Health and Wellness Program)<br>P 999,500.00 (PCSA Celebration and Sports Activities)');
    const coreAccountable5 = ref('BHRD');
    const coreBudget6 = ref('P 270,000.00 (Operationalization of PRAISE Committee)');
    const coreAccountable6 = ref('BHRD');

    // Support Functions
    const supportBudget1 = ref('P 19,750,511.00 (Personal Services)');
    const supportAccountable1 = ref('ASD, ARPMID, BHRDD');
    const supportBudget2 = ref('P 19,750,511.00 (Personal Services)');
    const supportAccountable2 = ref('ASD, ARPMID, BHRDD');
    const supportBudget3 = ref('P 19,750,511.00 (Personal Services)');
    const supportAccountable3 = ref('ASD, ARPMID, BHRDD');
    const supportBudget4 = ref('P 19,750,511.00 (Personal Services)');
    const supportAccountable4 = ref('ASD,ARPMID,BHRDD');
    const supportBudget5 = ref('P50,000.00 (Program for Personnel Mechanisms)');
    const supportAccountable5 = ref('CHRMO');

    // Dialog controls
    const confirmDialogOpen = ref(false);
    const successDialogOpen = ref(false);

    const errors = ref({
      strategicBudget: false,
      strategicAccountable: false,
      coreBudget1: false,
      coreAccountable1: false,
      coreBudget2: false,
      coreAccountable2: false,
      coreBudget3: false,
      coreAccountable3: false,
      coreBudget4: false,
      coreAccountable4: false,
      coreBudget5: false,
      coreAccountable5: false,
      coreBudget6: false,
      coreAccountable6: false,
      supportBudget1: false,
      supportAccountable1: false,
      supportBudget2: false,
      supportAccountable2: false,
      supportBudget3: false,
      supportAccountable3: false,
      supportBudget4: false,
      supportAccountable4: false,
      supportBudget5: false,
      supportAccountable5: false
    });

    const firstInvalidFieldFocused = ref(false);
    const strategicBudgetRef = ref(null);
    const strategicAccountableRef = ref(null);
    const coreBudget1Ref = ref(null);
    const coreAccountable1Ref = ref(null);
    const coreBudget2Ref = ref(null);
    const coreAccountable2Ref = ref(null);
    const coreBudget3Ref = ref(null);
    const coreAccountable3Ref = ref(null);
    const coreBudget4Ref = ref(null);
    const coreAccountable4Ref = ref(null);
    const coreBudget5Ref = ref(null);
    const coreAccountable5Ref = ref(null);
    const coreBudget6Ref = ref(null);
    const coreAccountable6Ref = ref(null);
    const supportBudget1Ref = ref(null);
    const supportAccountable1Ref = ref(null);
    const supportBudget2Ref = ref(null);
    const supportAccountable2Ref = ref(null);
    const supportBudget3Ref = ref(null);
    const supportAccountable3Ref = ref(null);
    const supportBudget4Ref = ref(null);
    const supportAccountable4Ref = ref(null);
    const supportBudget5Ref = ref(null);
    const supportAccountable5Ref = ref(null);

    const validateField = (fieldName) => {
      const isValid = !!eval(fieldName + '.value');
      errors.value[fieldName] = !isValid;
      return isValid;
    };

    const validateForm = () => {
      const requiredFields = [
        'strategicBudget', 'strategicAccountable',
        'coreBudget1', 'coreAccountable1',
        'coreBudget2', 'coreAccountable2',
        'coreBudget3', 'coreAccountable3',
        'coreBudget4', 'coreAccountable4',
        'coreBudget5', 'coreAccountable5',
        'coreBudget6', 'coreAccountable6',
        'supportBudget1', 'supportAccountable1',
        'supportBudget2', 'supportAccountable2',
        'supportBudget3', 'supportAccountable3',
        'supportBudget4', 'supportAccountable4',
        'supportBudget5', 'supportAccountable5'
      ];

      let isValid = true;

      requiredFields.forEach(field => {
        const fieldValid = validateField(field);
        if (!fieldValid) {
          isValid = false;
          if (eval(field + 'Ref.value') && !firstInvalidFieldFocused.value) {
            eval(field + 'Ref.value').focus();
            firstInvalidFieldFocused.value = true;
          }
        }
      });

      return isValid;
    };

    const shakeAllInvalidFields = () => {
      Object.keys(errors.value).forEach(field => {
        if (errors.value[field]) {
          eval(field + 'Ref.value').$el.classList.remove('shake-animation');
          void eval(field + 'Ref.value').$el.offsetWidth;
          eval(field + 'Ref.value').$el.classList.add('shake-animation');
        }
      });
    };

    const showConfirmDialog = () => {
      firstInvalidFieldFocused.value = false;

      if (!validateForm()) {
        emit('error', 'Please fill all required fields');
        shakeAllInvalidFields();
        return;
      }

      // Show confirmation dialog
      confirmDialogOpen.value = true;
    };

    const validateAndSave = () => {
      // Close confirmation dialog
      confirmDialogOpen.value = false;

      const opcrData = {
        strategic: {
          budget: strategicBudget.value,
          accountable: strategicAccountable.value
        },
        core: {
          mfo1: {
            budget: coreBudget1.value,
            accountable: coreAccountable1.value
          },
          mfo2: {
            budget: coreBudget2.value,
            accountable: coreAccountable2.value
          },
          mfo3: {
            budget: coreBudget3.value,
            accountable: coreAccountable3.value
          },
          mfo4: {
            budget: coreBudget4.value,
            accountable: coreAccountable4.value
          },
          mfo5: {
            budget: coreBudget5.value,
            accountable: coreAccountable5.value
          },
          mfo6: {
            budget: coreBudget6.value,
            accountable: coreAccountable6.value
          }
        },
        support: {
          healthWellness: {
            budget: supportBudget1.value,
            accountable: supportAccountable1.value
          },
          dtr: {
            budget: supportBudget2.value,
            accountable: supportAccountable2.value
          },
          monitoring: {
            budget: supportBudget3.value,
            accountable: supportAccountable3.value
          },
          opcr: {
            budget: supportBudget4.value,
            accountable: supportAccountable4.value
          },
          personnelMeetings: {
            budget: supportBudget5.value,
            accountable: supportAccountable5.value
          }
        }
      };

      // Show success dialog
      successDialogOpen.value = true;

      // Also show success notification
      $q.notify({
        type: 'positive',
        message: 'OPCR saved successfully!',
        position: 'top',
        timeout: 2500,
        actions: [{ icon: 'close', color: 'white' }]
      });

      emit('save', opcrData);
    };

    return {
      strategicBudget,
      strategicAccountable,
      coreBudget1,
      coreAccountable1,
      coreBudget2,
      coreAccountable2,
      coreBudget3,
      coreAccountable3,
      coreBudget4,
      coreAccountable4,
      coreBudget5,
      coreAccountable5,
      coreBudget6,
      coreAccountable6,
      supportBudget1,
      supportAccountable1,
      supportBudget2,
      supportAccountable2,
      supportBudget3,
      supportAccountable3,
      supportBudget4,
      supportAccountable4,
      supportBudget5,
      supportAccountable5,
      errors,
      validateField,
      showConfirmDialog,
      validateAndSave,
      confirmDialogOpen,
      successDialogOpen,
      strategicBudgetRef,
      strategicAccountableRef,
      coreBudget1Ref,
      coreAccountable1Ref,
      coreBudget2Ref,
      coreAccountable2Ref,
      coreBudget3Ref,
      coreAccountable3Ref,
      coreBudget4Ref,
      coreAccountable4Ref,
      coreBudget5Ref,
      coreAccountable5Ref,
      coreBudget6Ref,
      coreAccountable6Ref,
      supportBudget1Ref,
      supportAccountable1Ref,
      supportBudget2Ref,
      supportAccountable2Ref,
      supportBudget3Ref,
      supportAccountable3Ref,
      supportBudget4Ref,
      supportAccountable4Ref,
      supportBudget5Ref,
      supportAccountable5Ref
    };
  }
}
</script>

<style scoped>
.header-section {
  padding-left: 16px;
  padding-right: 8px;
}

.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.section-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2433;
  padding-left: 10px;
  border-left: 4px solid #1976d2;
  margin-bottom: 12px;
}

.mfo-header {
  border-radius: 6px;
  background-color: #f5f7fa;
  font-weight: 500;
  text-align: center;
}

.competency-table {
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e0e0;
  }

  th,
  td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    vertical-align: middle;
    color: #333;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid #e0e0e0;
    padding: 8px;
    vertical-align: middle;
  }

  thead {
    background-color: #263238;
  }

  :deep(thead) {
    background-color: #f5f5f5;
  }

  th {
    font-weight: 500;
    color: #ffffff;
    font-size: 0.9rem;
  }

  :deep(thead th) {
    font-weight: 500;
    color: #424242;
  }

  :deep(tbody) {
    background-color: white;
  }

  :deep(tbody tr:hover) {
    background-color: #fafafa;
  }
}

:deep(.q-field--outlined .q-field__control) {
  height: 40px;
  min-height: 40px;
  border-radius: 6px;
}

:deep(.q-field--error .q-field__bottom) {
  padding-top: 4px;
  color: #f44336;
  font-size: 0.75rem;
}

.action-btn {
  min-width: 100px;
  padding: 6px 12px;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.shake-animation {
  animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .section-container {
    padding: 12px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 1rem;
    padding-left: 8px;
    border-left: 3px solid #1976d2;
    margin-bottom: 8px;
  }

  .competency-table :deep(table) {
    font-size: 0.85rem;
  }

  .competency-table th,
  .competency-table td {
    padding: 6px;
  }

  .competency-table :deep(th),
  .competency-table :deep(td) {
    padding: 6px;
  }

  .competency-table :deep(thead th) {
    font-size: 0.8rem;
  }

  .competency-table :deep(tbody tr:hover) {
    background-color: #f9f9f9;
  }

  .action-btn {
    min-width: 80px;
    padding: 4px 8px;
    font-size: 0.85rem;
  }

  :deep(.q-field--outlined .q-field__control) {
    height: 36px;
    min-height: 36px;
  }

  :deep(.q-field--error .q-field__bottom) {
    font-size: 0.7rem;
  }
}

/* Adjust table for horizontal scrolling on smaller screens */
@media (max-width: 576px) {
  .competency-table :deep(table) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .competency-table th,
  .competency-table td {
    font-size: 0.75rem;
    padding: 4px;
  }

  .competency-table :deep(thead th) {
    font-size: 0.75rem;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 3px 6px;
  }
}
</style>

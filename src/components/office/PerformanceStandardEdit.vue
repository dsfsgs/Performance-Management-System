<template>
  <div class="performance-standard-edit">
    <!-- Main Row - Horizontally aligned sections -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- MFO Section - 3 columns -->
      <div class="col-md-3 col-sm-12">
        <div class="section-block">
          <div class="card-title">MFO Details</div>
          <div class="q-mb-sm">
            <q-select v-model="localMfo1" :options="categoryOptions" label="Category" outlined dense emit-value
              map-options class="q-mb-xs" />
          </div>
          <div class="q-mb-sm">
            <q-select v-model="localMfo2" :options="mfoOptions" label="MFO" outlined dense emit-value map-options
              :disable="!localMfo1" class="q-mb-xs" />
          </div>
          <q-select v-model="localMfo3" :options="outputOptions" label="Output" outlined dense emit-value map-options
            :disable="!localMfo2" />
        </div>
      </div>

      <!-- Competency Section - 5 columns with inner row -->
      <div class="col-md-5 col-sm-12">
        <div class="section-block">
          <div class="card-title">Competencies</div>
          <div class="row q-col-gutter-xs">
            <!-- Core -->
            <div class="col-4">
              <div class="competency-subblock">
                <div class="competency-subtitle">Core</div>
                <q-input v-model="localCoreCompetency" dense outlined hide-bottom-space />
              </div>
            </div>

            <!-- Technical -->
            <div class="col-4">
              <div class="competency-subblock">
                <div class="competency-subtitle">Technical</div>
                <q-input v-model="localTechnicalCompetency" dense outlined hide-bottom-space />
              </div>
            </div>

            <!-- Leadership -->
            <div class="col-4">
              <div class="competency-subblock">
                <div class="competency-subtitle">Leadership</div>
                <q-input v-model="localLeadershipCompetency" dense outlined hide-bottom-space />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Indicator - 2 columns -->
      <div class="col-md-2 col-sm-12">
        <div class="section-block">
          <div class="card-title">Success Indicator</div>
          <q-input v-model="localSuccessIndicator" type="textarea" outlined dense autogrow
            class="full-height-textarea" />
        </div>
      </div>

      <!-- Required Output - 2 columns -->
      <div class="col-md-2 col-sm-12">
        <div class="section-block">
          <div class="card-title">Required Output</div>
          <q-input v-model="localRequiredOutput" type="textarea" outlined dense autogrow class="full-height-textarea" />
        </div>
      </div>
    </div>

    <!-- Standard Outcome Section -->
    <div class="standard-outcome-section">
      <!-- Updated title section to match your design -->
      <div class="text-h7 q-mb-md">Standard Outcome</div>
      <div class="q-pa-md">
        <q-table :rows="localStandardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom
          bordered flat dense class="standard-outcome-table">
          <!-- Header with dropdown only for quantity -->
          <template v-slot:header-cell-quantity="props">
            <q-th :props="props" class="header-dropdown-cell">
              <q-select v-model="quantityIndicatorType" :options="quantityIndicator" dense outlined emit-value
                map-options behavior="menu" class="header-select" />
            </q-th>
          </template>

          <!-- Simple headers for timeliness and effectiveness -->
          <template v-slot:header-cell-timeliness="props">
            <q-th :props="props">Timeliness</q-th>
          </template>
          <template v-slot:header-cell-effectiveness="props">
            <q-th :props="props">Effectiveness</q-th>
          </template>

          <!-- Body cells with inputs -->
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props" class="input-cell">
              <q-input v-if="quantityIndicatorType === 'numeric'" v-model="props.row.quantity" dense outlined
                placeholder="Enter custom target" :rules="[validateStrictNumeric]" @keydown="blockInvalidChars"
                @update:model-value="sanitizeNumericInput(props.row, 'quantity')" />
              <div v-else class="numeric-display">
                {{ props.row.quantity || '-' }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-effectiveness="props">
            <q-td :props="props" class="input-cell">
              <q-input v-model="props.row.effectiveness" type="textarea" dense autogrow outlined
                placeholder="Enter effectiveness criteria" />
            </q-td>
          </template>

          <template v-slot:body-cell-timeliness="props">
            <q-td :props="props" class="input-cell">
              <q-input v-model="props.row.timeliness" type="textarea" dense autogrow outlined
                placeholder="Enter timeliness criteria" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Target Input Modal -->
    <q-dialog v-model="showTargetModal" persistent>
      <q-card style="min-width: 400px; border-radius: 8px;">
        <q-card-section class="modal-header">
          <div class="text-h6">Enter Target Output</div>
        </q-card-section>

        <q-card-section class="modal-body">
          <q-input v-model.number="targetValue" label="Target Output" type="number" outlined dense
            :rules="[val => val > 0 || 'Must be greater than 0']" @keypress="blockInvalidChars" />
        </q-card-section>

        <q-card-actions align="right" class="modal-actions">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup @click="cancelTargetInput" />
          <q-btn label="Calculate" color="primary" unelevated @click="computeQuantities" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    coreCompetency: {
      type: String,
      default: 'DSE-4'
    },
    leadershipCompetency: {
      type: String,
      default: 'TSC-4'
    },
    technicalCompetency: {
      type: String,
      default: 'RM-3'
    },
    successIndicator: {
      type: String,
      default: ''
    },
    requiredOutput: {
      type: String,
      default: ''
    },
    mfo1: {
      type: String,
      default: ''
    },
    mfo2: {
      type: String,
      default: ''
    },
    mfo3: {
      type: String,
      default: ''
    },
    standardOutcomeRows: {
      type: Array,
      default: () => [
        { rating: '5', quantity: '', timeliness: '', effectiveness: '' },
        { rating: '4', quantity: '', timeliness: '', effectiveness: '' },
        { rating: '3', quantity: '', timeliness: '', effectiveness: '' },
        { rating: '2', quantity: '', timeliness: '', effectiveness: '' },
        { rating: '1', quantity: '', timeliness: '', effectiveness: '' }
      ]
    }
  },
  emits: [
    'update:coreCompetency',
    'update:leadershipCompetency',
    'update:technicalCompetency',
    'update:successIndicator',
    'update:requiredOutput',
    'update:mfo1',
    'update:mfo2',
    'update:mfo3',
    'update:standardOutcomeRows'
  ],
  data() {
    return {
      localCoreCompetency: this.coreCompetency,
      localLeadershipCompetency: this.leadershipCompetency,
      localTechnicalCompetency: this.technicalCompetency,
      localSuccessIndicator: this.successIndicator,
      localRequiredOutput: this.requiredOutput,
      localMfo1: this.mfo1,
      localMfo2: this.mfo2,
      localMfo3: this.mfo3,
      localStandardOutcomeRows: JSON.parse(JSON.stringify(this.standardOutcomeRows)),

      showTargetModal: false,
      targetValue: null,
      quantityIndicatorType: 'numeric',
      timelinessType: 'conditional',
      effectivenessType: 'conditional',

      categoryOptions: [
        { label: 'A. Strategic Function', value: 'A' },
        { label: 'B. Core Function', value: 'B' },
        { label: 'C. Support Function', value: 'C' }
      ],
      mfoOptions: [
        { label: 'MFO 1', value: 'M1' },
        { label: 'MFO 2', value: 'M2' },
        { label: 'MFO 3', value: 'M3' }
      ],
      outputOptions: [
        { label: 'Output 1', value: 'O1' },
        { label: 'Output 2', value: 'O2' },
        { label: 'Output 3', value: 'O3' }
      ],
      quantityIndicator: [
        { label: 'Quantity (A. Custom target)', value: 'numeric' },
        { label: 'Quantity (B. Can exceed 100%)', value: 'B' },
        { label: 'Quantity (C. Cannot exceed 100%)', value: 'C' }
      ]
    };
  },
  computed: {
    standardOutcomeColumns() {
      return [
        { name: 'rating', label: 'Ratings', field: 'rating', align: 'center' },
        { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
        { name: 'timeliness', label: 'Timeliness', field: 'timeliness', align: 'center' },
        { name: 'effectiveness', label: 'Effectiveness', field: 'effectiveness', align: 'center' }
      ];
    }
  },
  watch: {
    // Props watchers to keep local state in sync
    coreCompetency(val) {
      this.localCoreCompetency = val;
    },
    leadershipCompetency(val) {
      this.localLeadershipCompetency = val;
    },
    technicalCompetency(val) {
      this.localTechnicalCompetency = val;
    },
    successIndicator(val) {
      this.localSuccessIndicator = val;
    },
    requiredOutput(val) {
      this.localRequiredOutput = val;
    },
    mfo1(val) {
      this.localMfo1 = val;
    },
    mfo2(val) {
      this.localMfo2 = val;
    },
    mfo3(val) {
      this.localMfo3 = val;
    },
    standardOutcomeRows: {
      handler(val) {
        this.localStandardOutcomeRows = JSON.parse(JSON.stringify(val));
      },
      deep: true
    },

    // Local state watchers to emit updates
    localCoreCompetency(val) {
      this.$emit('update:coreCompetency', val);
    },
    localLeadershipCompetency(val) {
      this.$emit('update:leadershipCompetency', val);
    },
    localTechnicalCompetency(val) {
      this.$emit('update:technicalCompetency', val);
    },
    localSuccessIndicator(val) {
      this.$emit('update:successIndicator', val);
    },
    localRequiredOutput(val) {
      this.$emit('update:requiredOutput', val);
    },
    localMfo1(val) {
      this.$emit('update:mfo1', val);
    },
    localMfo2(val) {
      this.$emit('update:mfo2', val);
    },
    localMfo3(val) {
      this.$emit('update:mfo3', val);
    },
    localStandardOutcomeRows: {
      handler(val) {
        this.$emit('update:standardOutcomeRows', val);
      },
      deep: true
    },

    // Functionality watchers
    quantityIndicatorType(val) {
      if (val === 'B') {
        this.targetValue = null;
        this.showTargetModal = true;
      } else if (val === 'C') {
        this.computeQuantities();
      }
    }
  },
  methods: {
    validateStrictNumeric(val) {
      return !val || /^\d+$/.test(val) || 'Numbers only';
    },

    blockInvalidChars(event) {
      // Allow only numeric inputs
      if (!/^\d$/.test(event.key) &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
        event.preventDefault();
      }
    },

    sanitizeNumericInput(row, field) {
      // Ensure the value is numeric
      if (row[field] && !/^\d+$/.test(row[field])) {
        row[field] = row[field].replace(/[^\d]/g, '');
      }
    },

    computeQuantities() {
      if ((this.quantityIndicatorType === 'B') && (!this.targetValue || isNaN(this.targetValue))) {
        this.$q.notify({
          message: 'Please enter a valid number',
          color: 'negative',
          position: 'top'
        });
        return;
      }

      // Reset rows
      this.localStandardOutcomeRows.forEach(row => {
        row.quantity = '';
      });

      if (this.quantityIndicatorType === 'B') {
        // Type B: Can exceed 100% (requires target input)
        const base = Number(this.targetValue);
        this.localStandardOutcomeRows[0].quantity = `${Math.ceil(base * 1.3)} and above`;       // 130%
        this.localStandardOutcomeRows[1].quantity = `${Math.ceil(base * 1.15)}-${Math.floor(base * 1.3) - 1}`; // 115%
        this.localStandardOutcomeRows[2].quantity = `${base}-${Math.floor(base * 1.15) - 1}`;  // 100%
        this.localStandardOutcomeRows[3].quantity = `${Math.ceil(base * 0.51)}-${Math.floor(base * 0.99)}`;    // 51%
        this.localStandardOutcomeRows[4].quantity = `${Math.floor(base * 0.5)} and below`;      // 50%

        this.$q.notify({
          message: 'Quantities calculated successfully',
          color: 'positive',
          position: 'top'
        });
      }
      else if (this.quantityIndicatorType === 'C') {
        // Type C: Cannot exceed 100% (auto percentages)
        this.localStandardOutcomeRows[0].quantity = '100% and above';
        this.localStandardOutcomeRows[1].quantity = '88%-99%';
        this.localStandardOutcomeRows[2].quantity = '77%-87%';
        this.localStandardOutcomeRows[3].quantity = '38%-76%';
        this.localStandardOutcomeRows[4].quantity = '37% and below';
      }
      this.showTargetModal = false;
    },
    cancelTargetInput() {
      this.quantityIndicatorType = 'numeric';
      this.showTargetModal = false;
    }
  }
};
</script>

<style scoped>
.section-block {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  height: 100%;
}

.card-title {
  font-weight: 500;
  color: #205540;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
}

.competency-subblock {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  height: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.competency-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #205540;
  text-align: center;
  margin-bottom: 6px;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #205540;
}

.standard-outcome-section {
  margin-top: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.full-height-textarea :deep(.q-field__native) {
  min-height: 80px;
}

.input-cell {
  padding: 4px;
}

.standard-outcome-table {
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

/* Header dropdown styles */
.header-dropdown-cell {
  padding: 0 !important;
}

.header-select {
  width: 100%;
  min-width: 150px;
}

.header-select :deep(.q-field__bottom) {
  display: none;
}

.modal-header {
  background-color: #205540;
  color: white;
}

.modal-body {
  padding-top: 16px;
}

.modal-actions {
  padding: 8px 16px;
}

.numeric-display {
  padding: 8px;
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-h7 {
  font-size: 16px;
  font-weight: 500;
  color: #205540;
}
</style>

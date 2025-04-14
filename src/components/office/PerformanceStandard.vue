<!-- eslint-disable no-undef -->
<template>
  <div class="performance-standard-container">
    <!-- Performance Indicator Section -->
    <div class="q-mb-lg">
      <div class="text-h7 q-mb-md">Performance Indicator</div>
      <div class="row no-wrap performance-indicator-grid">

        <!-- MFO Column -->
        <div class="col-auto mfo-column">
          <q-table :rows="rows" :columns="[columns[0]]" row-key="id" hide-bottom bordered flat class="sticky-column">
            <template v-slot:body-cell-mfo="props">
              <q-td :props="props" class="dropdown-cell">
                <!-- Category dropdown (row 1) -->
                <q-select v-if="props.row.id === 1" v-model="props.row.mfo" label="Select Category"
                  :options="categoryOptions" dense outlined emit-value map-options behavior="menu"
                  class="dropdown-select" @update:model-value="onCategoryChange(props.row.mfo)" />

                <!-- MFO dropdown (row 2) - show for all except Support Function -->
                <q-select v-else-if="props.row.id === 2 && !isSupportCategory" v-model="props.row.mfo"
                  label="Select MFO" :options="mfoOptions" dense outlined emit-value map-options behavior="menu"
                  class="dropdown-select" @update:model-value="onMfoChange(props.row.mfo)" />

                <!-- Output dropdown (row 3) -->
                <q-select v-else-if="props.row.id === 3" v-model="props.row.mfo"
                  :label="isSupportCategory ? 'Select Support Output' : 'Select Output'" :options="outputOptions" dense
                  outlined emit-value map-options behavior="menu" class="dropdown-select" />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Competency Column -->
        <div class="col competency-column">
          <q-table :rows="[mergedRow]" :columns="competencyColumns" row-key="id" hide-bottom bordered flat
            class="full-width">
            <template v-slot:body-cell-core="props">
              <q-td :props="props" class="text-area-cell">
                <q-input v-model="mergedCoreCompetency" type="textarea" dense outlined autogrow
                  class="full-height-input" />
              </q-td>
            </template>
            <template v-slot:body-cell-leadership="props">
              <q-td :props="props" class="text-area-cell">
                <q-input v-model="mergedLeadershipCompetency" type="textarea" dense outlined autogrow
                  class="full-height-input" />
              </q-td>
            </template>
            <template v-slot:body-cell-technical="props">
              <q-td :props="props" class="text-area-cell">
                <q-input v-model="mergedTechnicalCompetency" type="textarea" dense outlined autogrow
                  class="full-height-input" />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Success Indicator Column -->
        <div class="col-auto success-indicator-column">
          <q-table :rows="[mergedRow]" :columns="[columns[2]]" row-key="id" hide-bottom bordered flat
            class="sticky-column">
            <template v-slot:body-cell-successIndicator="props">
              <q-td :props="props" class="text-area-cell">
                <q-input v-model="mergedSuccessIndicator" type="textarea" dense outlined autogrow
                  class="full-height-input" />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Required Output Column -->
        <div class="col-auto required-output-column">
          <q-table :rows="[mergedRow]" :columns="[columns[3]]" row-key="id" hide-bottom bordered flat
            class="sticky-column">
            <template v-slot:body-cell-requiredOutput="props">
              <q-td :props="props" class="text-area-cell">
                <q-input v-model="mergedRequiredOutput" type="textarea" dense outlined autogrow
                  class="full-height-input" />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <!-- Standard Outcome Section -->
    <div class="standard-outcome-section">
      <div class="text-h7 q-mb-md">Standard Outcome</div>
      <q-table :rows="standardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom bordered flat
        dense class="standard-outcome-table">
        <!-- Header with dropdown selects -->
        <template v-slot:header-cell-quantity="props">
          <q-th :props="props" class="header-dropdown-cell">
            <q-select v-model="quantityIndicatorType" :options="quantityIndicator" dense outlined emit-value map-options
              behavior="menu" class="header-select" />
          </q-th>
        </template>
        <template v-slot:header-cell-effectiveness="props">
          <q-th :props="props" class="header-dropdown-cell">
            <q-select v-model="effectivenessType" :options="[
                            { label: 'Effectiveness (Conditional)', value: 'conditional' },
                            { label: 'Effectiveness (Numeric)', value: 'numeric' }
                        ]" dense outlined emit-value map-options behavior="menu" class="header-select" />
          </q-th>
        </template>
        <template v-slot:header-cell-timeliness="props">
          <q-th :props="props" class="header-dropdown-cell">
            <q-select v-model="timelinessType" :options="[
                            { label: 'Timeliness (Conditional)', value: 'conditional' },
                            { label: 'Timeliness (Numeric)', value: 'numeric' }
                        ]" dense outlined emit-value map-options behavior="menu" class="header-select" />
          </q-th>
        </template>

        <!-- Body cells with conditional inputs -->
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
            <q-input v-if="effectivenessType === 'conditional'" v-model="props.row.effectiveness" dense outlined
              placeholder="Enter condition" />
            <q-input v-else v-model="props.row.effectiveness" dense outlined placeholder="Enter number or range"
              :rules="[validateStrictNumeric]" @keydown="blockInvalidChars"
              @update:model-value="sanitizeNumericInput(props.row, 'effectiveness')" />
          </q-td>
        </template>

        <template v-slot:body-cell-timeliness="props">
          <q-td :props="props" class="input-cell">
            <q-input v-if="timelinessType === 'conditional'" v-model="props.row.timeliness" dense outlined
              placeholder="Enter condition" />
            <q-input v-else v-model="props.row.timeliness" dense outlined placeholder="Enter number or range"
              :rules="[validateStrictNumeric]" @keydown="blockInvalidChars"
              @update:model-value="sanitizeNumericInput(props.row, 'timeliness')" />
          </q-td>
        </template>
      </q-table>
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
import { useMfoStore } from 'src/stores/office/mfoStore'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'


export default {
  props: {
    initialMergedCoreCompetency: {
      type: String,
      default: 'DSE-4'
    },
    initialMergedLeadershipCompetency: {
      type: String,
      default: 'TSC-4'
    },
    initialMergedTechnicalCompetency: {
      type: String,
      default: 'RM-3'
    }
  },
  setup() {
    const mfoStore = useMfoStore()

    const { categories, mfos, outputs, supportOutputs, skipMfo } = storeToRefs(mfoStore)

    // Add debug logging
    watch(categories, (newVal) => {
      console.log('Categories updated:', newVal)
    }, { immediate: true })

    watch(mfos, (newVal) => {
      console.log('MFOs updated:', newVal)
    }, { immediate: true })


    watch(outputs, (newVal) => {
      console.log('Outputs updated:', newVal)
    }, { immediate: true })

    return {
      mfoStore,
      categories,
      mfos,
      outputs,
      supportOutputs,
       skipMfo,
      loading: computed(() => mfoStore.loading)
    }
  },

  data() {
    return {
      // Initialize columns properly
      columns: [
        { name: 'mfo', label: 'MFO', field: 'mfo', align: 'left' },
        { name: 'core', label: 'Core', field: 'core', align: 'left' },
        { name: 'leadership', label: 'Leadership', field: 'leadership', align: 'left' },
        { name: 'technical', label: 'Technical', field: 'technical', align: 'left' },
        { name: 'successIndicator', label: 'Success Indicator', field: 'successIndicator', align: 'left' },
        { name: 'requiredOutput', label: 'Required Output', field: 'requiredOutput', align: 'left' }
      ],

      competencyColumns: [
        { name: 'core', label: 'Core Competency', field: 'core', align: 'left' },
        { name: 'leadership', label: 'Leadership Competency', field: 'leadership', align: 'left' },
        { name: 'technical', label: 'Technical Competency', field: 'technical', align: 'left' }
      ],

      standardOutcomeColumns: [
        { name: 'rating', label: 'Rating', field: 'rating', align: 'center' },
        { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
        { name: 'effectiveness', label: 'Effectiveness', field: 'effectiveness', align: 'center' },
        { name: 'timeliness', label: 'Timeliness', field: 'timeliness', align: 'center' }
      ],

      // Initialize rows with proper structure
      rows: [
        { id: 1, mfo: null, core: '', leadership: '', technical: '', successIndicator: '', requiredOutput: '' },
        { id: 2, mfo: null, core: '', leadership: '', technical: '', successIndicator: '', requiredOutput: '' },
        { id: 3, mfo: null, core: '', leadership: '', technical: '', successIndicator: '', requiredOutput: '' }
      ],

      mergedRow: { id: 'merged', core: '', leadership: '', technical: '', successIndicator: '', requiredOutput: '' },

      standardOutcomeRows: [
        { rating: '5 (Outstanding)', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '4 (Very Satisfactory)', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '3 (Satisfactory)', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '2 (Unsatisfactory)', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '1 (Poor)', quantity: '', effectiveness: '', timeliness: '' }
      ],

      quantityIndicator: [
        { label: 'Numeric Input', value: 'numeric' },
        { label: 'Type B (Can exceed 100%)', value: 'B' },
        { label: 'Type C (Cannot exceed 100%)', value: 'C' }
      ],

      quantityIndicatorType: 'numeric',
      effectivenessType: 'conditional',
      timelinessType: 'conditional',
      showTargetModal: false,
      targetValue: null,

      // Initialize merged values
      mergedCoreCompetency: this.initialMergedCoreCompetency,
      mergedLeadershipCompetency: this.initialMergedLeadershipCompetency,
      mergedTechnicalCompetency: this.initialMergedTechnicalCompetency,
      mergedSuccessIndicator: '',
      mergedRequiredOutput: '',

      selectedCategory: null,
      selectedMfo: null,
      selectedOutput: null
    }
  },

  computed: {
    isSupportCategory() {
      const selectedCategory = this.categories?.find(c => c.id === this.rows[0]?.mfo)
      return selectedCategory?.name.includes("C. SUPPORT FUNCTION")
    },

    categoryOptions() {
      return this.categories?.map(cat => ({
        label: cat.name,
        value: cat.id
      })) || []
    },

    mfoOptions() {
      return this.mfos?.map(mfo => ({
        label: mfo.name,
        value: mfo.id
      })) || []
    },

    outputOptions() {
      if (this.isSupportCategory) {
        // For support functions, show support outputs directly
        return this.mfoStore.supportOutputs?.map(output => ({
          label: output.name,
          value: output.id
        })) || []
      } else {
        // For other categories, show outputs for selected MFO
        const selectedMfo = this.mfos?.find(m => m.id === this.rows[1]?.mfo)
        return selectedMfo?.outputs?.map(output => ({
          label: output.name,
          value: output.id
        })) || []
      }
    }
  },
  methods: {
   async onCategoryChange(categoryId) {
      this.mfoStore.fetchMfosByCategory(categoryId)
      this.rows[1].mfo = null // Reset MFO selection
      this.rows[2].mfo = null // Reset Output selection
      if (this.isSupportCategory) {
        await this.mfoStore.fetchSupportOutputs(categoryId)
      }
    },

    onMfoChange(mfoId) {
      if (mfoId) {
        this.mfoStore.fetchOutputsByMfo(mfoId)
      }
      this.rows[2].mfo = null // Reset Output selection
    },
    getDropdownLabel(rowId) {
      const labels = {
        1: 'Select Category',
        2: 'Select MFO',
        3: 'Select Output'
      }
      return labels[rowId] || ''
    },

    getMfoOptions(rowId) {
      if (rowId === 1) {
        return this.categories?.map(cat => ({
          label: cat.name,
          value: cat.id
        })) || []
      }
      if (rowId === 2) {
        // For category type C, don't show MFO dropdown
        if (this.mfoStore.skipMfo) {
          return [];
        }
        return this.mfos?.map(mfo => ({
          label: mfo.name,
          value: mfo.id,
          outputs: mfo.outputs
        })) || []
      }
      if (rowId === 3) {
        // For category type C, show outputs directly
        if (this.mfoStore.skipMfo) {
          return this.mfoStore.mfos.flatMap(mfo =>
            mfo.outputs.map(output => ({
              label: output.name,
              value: output.id
            }))
          ) || [];
        }

        // Normal case - show outputs for selected MFO
        const selectedMfo = this.mfos?.find(mfo => mfo.id === this.rows[1]?.mfo);
        return selectedMfo?.outputs?.map(output => ({
          label: output.name,
          value: output.id
        })) || []
      }
      return []
    },

    blockInvalidChars(e) {
      const allowedKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '-', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'
      ];

      if (!allowedKeys.includes(e.key) && !e.ctrlKey) {
        e.preventDefault();
      }
    },

    sanitizeNumericInput(row, field) {
      if (!row[field]) return;
      // Remove all non-numeric chars except hyphen
      row[field] = row[field].replace(/[^0-9-]/g, '');

      // Allow only one hyphen
      const hyphens = row[field].split('-').length - 1;
      if (hyphens > 1) {
        row[field] = row[field].substring(0, row[field].lastIndexOf('-'));
      }
    },

    validateStrictNumeric(val) {
      if (!val) return "Value required";

      // Case 1: Single number
      if (!val.includes('-')) {
        return !isNaN(val) || 'Must be a number';
      }

      // Case 2: Range
      const parts = val.split('-');
      if (parts.length !== 2 || parts.some(p => !p)) return 'Use format: min-max';

      const min = Number(parts[0]);
      const max = Number(parts[1]);

      if (isNaN(min) || isNaN(max)) return 'Both must be numbers';
      if (min >= max) return 'Min must be less than max';

      return true;
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
      this.standardOutcomeRows.forEach(row => {
        row.quantity = '';
      });

      if (this.quantityIndicatorType === 'B') {
        const base = Number(this.targetValue);
        this.standardOutcomeRows[0].quantity = `${Math.ceil(base * 1.3)} and above`;
        this.standardOutcomeRows[1].quantity = `${Math.ceil(base * 1.15)}-${Math.floor(base * 1.3) - 1}`;
        this.standardOutcomeRows[2].quantity = `${base}-${Math.floor(base * 1.15) - 1}`;
        this.standardOutcomeRows[3].quantity = `${Math.ceil(base * 0.51)}-${Math.floor(base * 0.99)}`;
        this.standardOutcomeRows[4].quantity = `${Math.floor(base * 0.5)} and below`;

        this.$q.notify({
          message: 'Quantities calculated successfully',
          color: 'positive',
          position: 'top'
        });
      }
      else if (this.quantityIndicatorType === 'C') {
        this.standardOutcomeRows[0].quantity = '100% and above';
        this.standardOutcomeRows[1].quantity = '88%-99%';
        this.standardOutcomeRows[2].quantity = '77%-87%';
        this.standardOutcomeRows[3].quantity = '38%-76%';
        this.standardOutcomeRows[4].quantity = '37% and below';
      }
      this.showTargetModal = false;
    },

    cancelTargetInput() {
      this.quantityIndicatorType = 'numeric';
      this.showTargetModal = false;
    },

    getFormData() {
      return {
        mergedCoreCompetency: this.mergedCoreCompetency,
        mergedLeadershipCompetency: this.mergedLeadershipCompetency,
        mergedTechnicalCompetency: this.mergedTechnicalCompetency,
        mergedSuccessIndicator: this.mergedSuccessIndicator,
        mergedRequiredOutput: this.mergedRequiredOutput,
        rows: this.rows,
        standardOutcomeRows: this.standardOutcomeRows
      };
    },

    resetComponentData() {
      this.mergedCoreCompetency = this.initialMergedCoreCompetency;
      this.mergedLeadershipCompetency = this.initialMergedLeadershipCompetency;
      this.mergedTechnicalCompetency = this.initialMergedTechnicalCompetency;
      this.mergedSuccessIndicator = '';
      this.mergedRequiredOutput = '';

      this.standardOutcomeRows.forEach(row => {
        row.quantity = '';
        row.timeliness = '';
        row.effectiveness = '';
      });

      this.rows.forEach(row => {
        row.mfo = '';
        row.core = '';
        row.leadership = '';
        row.technical = '';
        row.successIndicator = '';
        row.requiredOutput = '';
      });

      this.$q.notify({
        message: 'Form has been reset',
        color: 'info',
        position: 'top'
      });
    }
  },

    watch: {
      selectedCategory(newVal) {
        if (newVal) {
          this.mfoStore.fetchMfosByCategory(newVal).then(() => {
            this.rows[1].mfo = null // Reset MFO selection
            this.rows[2].mfo = null // Reset Output selection
          })
        }
      },

      'rows.0.mfo': { // Watch category selection (row 0)
        handler(newVal) {
          if (newVal) {
            this.selectedCategory = newVal;
            this.rows[1].mfo = null; // Reset MFO selection
            this.rows[2].mfo = null; // Reset Output selection
          }
        },
        immediate: true
      },
      'rows.1.mfo': { // Watch MFO selection (row 1)
        handler(newVal) {
          if (newVal) {
            this.selectedMfo = newVal;
            this.rows[2].mfo = null; // Reset Output selection
          }
        },
        immediate: true
      },
    quantityIndicatorType(val) {
      if (val === 'B') {
        this.targetValue = null;
        this.showTargetModal = true;
      } else if (val === 'C') {
        this.computeQuantities();
      } else if (val === 'numeric') {
        this.standardOutcomeRows.forEach(row => {
          row.quantity = '';
        });
      }
    }
  },

  async created() {
    await this.mfoStore.fetchCategories();
  }
}
</script>

<style scoped>
/* Your existing styles remain the same */
.performance-standard-container {
    padding: 16px;
}

/* Performance Indicator Grid */
.performance-indicator-grid {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.sticky-column {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: white;
}

/* Table Cells */
.dropdown-cell {
    padding: 8px;
    border-right: 1px solid #e0e0e0;
}

.text-area-cell {
    padding: 8px;
    border-right: 1px solid #e0e0e0;
}

.input-cell {
    padding: 8px;
    border-right: 1px solid #e0e0e0;
}

/* Input Styles */
.full-height-input {
    height: 100%;
}

.full-height-input .q-field__control {
    height: 100%;
}

.full-height-input .q-field__control-container {
    height: 100%;
}

.full-height-input .q-field__native {
    height: 100%;
}

/* Dropdown Selects */
.dropdown-select {
    min-width: 180px;
}

.header-select {
    min-width: 200px;
}

/* Standard Outcome Table */
.standard-outcome-table {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.standard-outcome-table th,
.standard-outcome-table td {
    border-right: 1px solid #e0e0e0 !important;
}

.standard-outcome-table th:last-child,
.standard-outcome-table td:last-child {
    border-right: none !important;
}

/* Modal Styles */
.modal-header {
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.modal-body {
    padding: 20px;
}

.modal-actions {
    padding: 16px;
    border-top: 1px solid #e0e0e0;
}

/* Numeric Display */
.numeric-display {
    padding: 8px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Column Widths */
.mfo-column {
    min-width: 220px;
    max-width: 220px;
}

.competency-column {
    min-width: 300px;
}

.success-indicator-column {
    min-width: 220px;
    max-width: 220px;
}

.required-output-column {
    min-width: 220px;
    width: 220px;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
    .performance-indicator-grid {
        display: block;
        overflow-x: auto;
    }

    .mfo-column,
    .competency-column,
    .success-indicator-column,
    .required-output-column {
        min-width: 100%;
        max-width: 100%;
    }
}
</style>

<!-- eslint-disable no-dupe-keys -->
<!-- performance standard -->
<template>
  <div class="performance-standard-container">
    <!-- Performance Indicator Section -->
    <div class="q-mb-lg">
      <div class="text-h7 q-mb-md">Performance Indicator</div>

      <q-card flat bordered class="main-card">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- First Column: MFO Details -->
            <div class="col-md-3 col-sm-12">
              <div class="text-subtitle2 q-mb-sm text-center">MFO Details</div>

              <q-select filled v-model="rows[0].category" label="Select Category" :options="categoryOptions" dense
                outlined map-options @update:model-value="clearDependentFields(1)" class="q-mb-sm" />

              <q-select v-if="!skipMfo" filled v-model="rows[1].mfo" label="Select MFO" :options="filteredMfoOptions"
                dense outlined map-options :disable="!rows[0].category" @update:model-value="clearDependentFields(2)"
                class="q-mb-sm" />

              <q-select filled v-model="rows[2].output" label="Select Output" :options="filteredOutputOptions" dense
                outlined map-options :disable="(!rows[1].mfo && !skipMfo) || !rows[0].category" />
            </div>
            <!-- -->
            <!-- Competencies Section -->
            <div class="row q-col-gutter-xs q-mb-md">
              <!-- Core -->
              <div class="col-md-4 col-sm-12">
                <q-card flat bordered class="competency-card">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2 text-center">Core</div>
                    <div class="competency-list">
                      <template v-if="mergedCoreCompetency && Object.keys(mergedCoreCompetency).length > 0">
                        <div v-for="(comp, name) in mergedCoreCompetency" :key="'core-' + name">
                          {{ comp.code }}-{{ comp.value }} ({{ comp.legend }})
                        </div>
                      </template>
                      <div v-else class="text-grey-6">No core competencies</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Technical -->
              <div class="col-md-4 col-sm-12">
                <q-card flat bordered class="competency-card">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2 text-center">Technical</div>
                    <div class="competency-list">
                      <template v-if="mergedTechnicalCompetency && Object.keys(mergedTechnicalCompetency).length > 0">
                        <div v-for="(comp, name) in mergedTechnicalCompetency" :key="'tech-' + name">
                          {{ comp.code }}-{{ comp.value }} ({{ comp.legend }})
                        </div>
                      </template>
                      <div v-else class="text-grey-6">No technical competencies</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Leadership -->
              <div class="col-md-4 col-sm-12">
                <q-card flat bordered class="competency-card">
                  <q-card-section class="q-pa-sm">
                    <div class="text-subtitle2 text-center">Leadership</div>
                    <div class="competency-list">
                      <template v-if="mergedLeadershipCompetency && Object.keys(mergedLeadershipCompetency).length > 0">
                        <div v-for="(comp, name) in mergedLeadershipCompetency" :key="'leader-' + name">
                          {{ comp.code }}-{{ comp.value }} ({{ comp.legend }})
                        </div>
                      </template>
                      <div v-else class="text-grey-6">No leadership competencies</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Third Column: Success Indicator -->
            <div class="col-md-4 col-sm-12">
              <div class="text-subtitle2 q-mb-sm text-center">Success Indicator</div>

              <q-input filled v-model="mergedSuccessIndicator" type="textarea" dense autogrow
                class="auto-expand-textarea" />
            </div>

            <!-- Fourth Column: Required Output -->
            <div class="col-md-4 col-sm-12">
              <div class="text-subtitle2 q-mb-sm text-center">Required Output</div>
              <q-input filled v-model="mergedRequiredOutput" type="textarea" dense autogrow
                class="auto-expand-textarea" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Rest of your template remains the same -->
      <q-separator class="q-my-md" />

      <!-- Standard Outcome Section -->
      <div class="standard-outcome-section">
        <div class="text-h7 q-mb-md">Standard Outcome</div>
        <div class="q-pa-md" style="max-width: 100%;">
          <q-table :rows="standardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom bordered
            flat dense class="standard-outcome-table">
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
import { computed } from 'vue'


export default {


  props: {

    employeeCompetencies: {
      type: Object,
      default: () => ({
        core: {},
        technical: {},
        leadership: {}
      })
    },

    initialSuccessIndicator: {
      type: String,
      default: ''
    },

    initialRequiredOutput: {
      type: String,
      default: ''
    },

    initialRows: {
      type: Array,
      default: () => [
        { id: 1, category: null, mfo: null, output: null },
        { id: 2, category: null, mfo: null, output: null },
        { id: 3, category: null, mfo: null, output: null }
      ]
    },

    initialStandardOutcomeRows: {
      type: Array,
      default: () => [
        { rating: '5', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '4', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '3', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '2', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '1', quantity: '', effectiveness: '', timeliness: '' }
      ]
    },
    initialQuantityIndicatorType: {
      type: String,
      default: 'numeric'
    }
  },



  setup(props) {

    const mfoStore = useMfoStore()
    const { categories, mfos, outputs, supportOutputs, skipMfo } = storeToRefs(mfoStore)
    const codeMappings = {
      core: {
        'Delivering Service Excellence': 'DSE',
        'Exemplifying Integrity': 'EI',
        'Interpersonal Skills': 'IS'
      },
      technical: {
        'Planning and Organizing': 'P&O',
        'Monitoring and Evaluation': 'M&E',
        'Records Management': 'RM',
        'Partnering and Networking': 'P&N',
        'Process Management': 'PM',
        'Attention to Detail': 'AD'
      },
      leadership: {
        'Thinking Strategically and Creatively': 'TSC',
        'Problem Solving and Decision Making': 'PSDM',
        'Building Collaborative & Inclusive Working Relationships': 'BCIWR',
        'Managing Performance & Coaching for Results': 'MPCR'
      }
    }
    // Process competencies for display
    const mergedCoreCompetency = computed(() => {
      if (!props.employeeCompetencies.core) return {}
      return Object.entries(props.employeeCompetencies.core).reduce((acc, [name, data]) => {
        acc[name] = {
          ...data,
          code: codeMappings.core[name] || name.substring(0, 3).toUpperCase()
        }
        return acc
      }, {})
    })

    const mergedTechnicalCompetency = computed(() => {
      if (!props.employeeCompetencies.technical) return {}
      return Object.entries(props.employeeCompetencies.technical).reduce((acc, [name, data]) => {
        acc[name] = {
          ...data,
          code: codeMappings.technical[name] || name.substring(0, 3).toUpperCase()
        }
        return acc
      }, {})
    })

    const mergedLeadershipCompetency = computed(() => {
      if (!props.employeeCompetencies.leadership) return {}
      return Object.entries(props.employeeCompetencies.leadership).reduce((acc, [name, data]) => {
        acc[name] = {
          ...data,
          code: codeMappings.leadership[name] || name.substring(0, 3).toUpperCase()
        }
        return acc
      }, {})
    })

    // Legend mapping
    // eslint-disable-next-line no-unused-vars
    const legend = {
      0: 'Not Applicable',
      1: 'Basic',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Superior'
    }

    return {
      mergedCoreCompetency,
      mergedTechnicalCompetency,
      mergedLeadershipCompetency,
      mfoStore,
      categories,
      mfos,
      outputs,
      supportOutputs,
      skipMfo,
      loading: computed(() => mfoStore.loading)
    }

  },
  // emits: ['update:successIndicator', 'update:requiredOutput'],
  // Add these emits
  emits: [
    'update:successIndicator',
    'update:requiredOutput',
    'update:rows',
    'update:standardOutcomeRows',
    'update:quantityIndicatorType'
  ],

  data() {
    return {

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

      rows: [
        { id: 1, category: null, mfo: null, output: null },
        { id: 2, category: null, mfo: null, output: null },
        { id: 3, category: null, mfo: null, output: null }
      ],

      mergedRow: { id: 'merged', core: '', leadership: '', technical: '', successIndicator: '', requiredOutput: '' },

      standardOutcomeRows: [
        { rating: '5', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '4', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '3', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '2', quantity: '', effectiveness: '', timeliness: '' },
        { rating: '1', quantity: '', effectiveness: '', timeliness: '' }
      ],

      quantityIndicator: [
        { label: 'Quantity (A. Custom Target)', value: 'numeric' },
        { label: 'Quantity (B. Can exceed 100%)', value: 'B' },
        { label: 'Quantity (C. Cannot exceed 100%)', value: 'C' }
      ],

      // quantityIndicatorType: 'numeric',
      showTargetModal: false,
      targetValue: null,

      // mergedSuccessIndicator: '',
      // mergedRequiredOutput: ''
      mergedSuccessIndicator: this.initialSuccessIndicator,
      mergedRequiredOutput: this.initialRequiredOutput,

      // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
      rows: JSON.parse(JSON.stringify(this.initialRows)),
      // eslint-disable-next-line no-dupe-keys, vue/no-dupe-keys
      standardOutcomeRows: JSON.parse(JSON.stringify(this.initialStandardOutcomeRows)),
      quantityIndicatorType: this.initialQuantityIndicatorType


    }
  },

  computed: {


    categoryOptions() {
      return this.categories?.map(cat => ({
        label: cat.name,
        value: Number(cat.id) // Ensure this is a number
      })) || []
    },
    // filteredMfoOptions() {
    //   if (!this.rows[0].category) return []
    //   return this.mfos?.map(mfo => ({
    //     label: mfo.name,
    //     value: mfo.id
    //   })) || []
    // },
    filteredMfoOptions() {
      if (!this.rows[0].category) return []
      return this.mfos?.map((mfo, index) => ({
        label: `MFO ${index + 1}. ${mfo.name}`, // Add numbering here
        value: mfo.id
      })) || []
    },

    // filteredOutputOptions() {
    //   if (!this.rows[0].category) return []

    //   // For support functions - use the support outputs directly
    //   if (this.skipMfo) {
    //     return this.supportOutputs?.map(output => ({
    //       label: output.name,
    //       value: output.id
    //     })) || []
    //   }

    //   // For other categories (like Strategic Functions)
    //   // Use outputs from the selected MFO
    //   if (!this.rows[1].mfo) return []

    //   // Get the outputs that were already fetched for this MFO
    //   const selectedMfo = this.mfos?.find(m =>
    //     m.id === (this.rows[1].mfo?.value || this.rows[1].mfo)
    //   )

    //   return selectedMfo?.outputs?.map(output => ({
    //     label: output.name,
    //     value: output.id
    //   })) || []
    // }

    filteredOutputOptions() {
      if (!this.rows[0].category) return []

      // For support functions - use the support outputs directly
      if (this.skipMfo) {
        return this.supportOutputs?.map((output, index) => ({
          label: `OUTPUT ${index + 1}. ${output.name}`, // Add numbering here
          value: output.id
        })) || []
      }

      // For other categories (like Strategic Functions)
      if (!this.rows[1].mfo) return []

      const selectedMfo = this.mfos?.find(m =>
        m.id === (this.rows[1].mfo?.value || this.rows[1].mfo)
      )

      return selectedMfo?.outputs?.map((output, index) => ({
        label: `OUTPUT ${index + 1}. ${output.name}`, // Add numbering here
        value: output.id
      })) || []
    }
  },
  methods: {

    getFormData() {
      const formatCompetency = (compObj) => {
        if (!compObj) return null;
        return Object.entries(compObj).reduce((acc, [key, value]) => {
          acc[key] = value.value;
          return acc;
        }, {});
      };

      // Extract string values from the rows array
      const getStringValue = (field) => {
        if (!field) return null;
        return typeof field === 'object' ? field.label || field.value || field.name || null : field;
      };

      return {
        rows: this.rows.map(row => ({
          category: getStringValue(row.category),
          mfo: getStringValue(row.mfo),
          output: getStringValue(row.output)
        })),
        standardOutcomeRows: this.standardOutcomeRows.map(row => ({
          rating: row.rating,
          quantity: row.quantity,
          effectiveness: row.effectiveness,
          timeliness: row.timeliness
        })),
        successIndicator: this.mergedSuccessIndicator,
        requiredOutput: this.mergedRequiredOutput,
        quantityIndicatorType: this.quantityIndicatorType,
        coreCompetency: formatCompetency(this.mergedCoreCompetency),
        technicalCompetency: formatCompetency(this.mergedTechnicalCompetency),
        leadershipCompetency: formatCompetency(this.mergedLeadershipCompetency)
      };
    },
    clearDependentFields(level) {
      // Clear dependent fields when parent selection changes
      if (level <= 1) {
        this.rows[1].mfo = null
        this.rows[2].output = null

        // If category changed, fetch related MFOs
        if (this.rows[0].category) {
          const categoryId = this.rows[0].category.value || this.rows[0].category
          this.mfoStore.fetchMfosByCategory(Number(categoryId))
        }
      }

      if (level <= 2) {
        this.rows[2].output = null

        // Only fetch outputs if we're not skipping MFO (i.e., not a support function)
        if (!this.skipMfo && this.rows[1].mfo) {
          const mfoId = this.rows[1].mfo.value || this.rows[1].mfo
          this.mfoStore.fetchOutputsByMfo(Number(mfoId))
        }
      }
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



    resetComponentData() {


      this.mergedSuccessIndicator = '';
      this.mergedRequiredOutput = '';

      this.standardOutcomeRows.forEach(row => {
        row.quantity = '';
        row.timeliness = '';
        row.effectiveness = '';
      });

      this.rows.forEach(row => {
        row.category = null;
        row.mfo = null;
        row.output = null;
      });

      this.$q.notify({
        message: 'Form has been reset',
        color: 'info',
        position: 'top'
      });
    }
  },

  watch: {
    mergedSuccessIndicator(newVal) {
      if (newVal !== this.initialSuccessIndicator) {
        this.$emit('update:successIndicator', newVal);
      }
    },
    mergedRequiredOutput(newVal) {
      if (newVal !== this.initialRequiredOutput) {
        this.$emit('update:requiredOutput', newVal);
      }
    },
    standardOutcomeRows: {
      deep: true,
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.initialStandardOutcomeRows)) {
          this.$emit('update:standardOutcomeRows', newVal);
        }
      }
    },
    quantityIndicatorType(newVal) {
      if (newVal !== this.initialQuantityIndicatorType) {
        this.$emit('update:quantityIndicatorType', newVal);
      }
    },
    // Watchers for initial props
    initialSuccessIndicator(newVal) {
      this.mergedSuccessIndicator = newVal;
    },
    initialRequiredOutput(newVal) {
      this.mergedRequiredOutput = newVal;
    },
    initialRows: {
      deep: true,
      handler(newVal) {
        this.rows = JSON.parse(JSON.stringify(newVal));
      }
    },
    initialStandardOutcomeRows: {
      deep: true,
      handler(newVal) {
        this.standardOutcomeRows = JSON.parse(JSON.stringify(newVal));
      }
    },
    initialQuantityIndicatorType(newVal) {
      this.quantityIndicatorType = newVal;
    },


    rows: {
      deep: true,
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.initialRows)) {
          this.$emit('update:rows', newVal);
        }
      }
    },


    // eslint-disable-next-line no-dupe-keys
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
    },

  },

  async created() {
    // Initialize competency arrays from props
    await this.mfoStore.fetchCategories();
  }
}
</script>

<style scoped>
.main-card {
  overflow: visible;
}

.competency-card {
  height: 100%;
}

.auto-expand-textarea textarea {
  min-height: 120px;
  resize: none;
}

.full-height {
  height: 100%;
}

.competency-list>div {
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.performance-standard-container {
  padding-bottom: 0;
  margin-bottom: 0;
}

.q-mb-lg {
  margin-bottom: 0 !important;
}

@media (max-width: 768px) {

  .col-md-2,
  .col-md-3,
  .col-md-4 {
    width: 100%;
    margin-bottom: 16px;
  }

  .competency-list>div {
    white-space: normal;
  }
}
</style>

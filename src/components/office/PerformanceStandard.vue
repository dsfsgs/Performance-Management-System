<template>
    <div class="performance-standard-container">
        <!-- Performance Indicator Section -->
        <div class="q-mb-lg">
            <div class="text-h7 q-mb-md">Performance Indicator</div>
            <div class="row no-wrap performance-indicator-grid">
                <!-- MFO Column -->
                <div class="col-auto mfo-column">
                    <q-table :rows="rows" :columns="[columns[0]]" row-key="id" hide-bottom bordered flat
                        class="sticky-column">
                        <template v-slot:body-cell-mfo="props">
                            <q-td :props="props" class="dropdown-cell">
                                <!-- Category Select -->
                                <q-select v-if="props.row.id === 1" v-model="props.row.category" label="Select Category"
                                    :options="categoryOptions" dense outlined emit-value map-options behavior="menu"
                                    class="dropdown-select" @update:model-value="clearDependentFields(props.row.id)" />

                                <!-- MFO Select -->
                                <q-select v-else-if="props.row.id === 2" v-model="props.row.mfo" label="Select MFO"
                                    :options="filteredMfoOptions" dense outlined emit-value map-options behavior="menu"
                                    class="dropdown-select" :disable="!rows[0].category"
                                    @update:model-value="clearDependentFields(props.row.id)" />

                                <!-- Output Select -->
                                <q-select v-else-if="props.row.id === 3" v-model="props.row.output"
                                    label="Select Output" :options="filteredOutputOptions" dense outlined emit-value
                                    map-options behavior="menu" class="dropdown-select" :disable="!rows[1].mfo" />
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

        <!-- Rest of your template remains the same -->
        <q-separator class="q-my-md" />

        <!-- Standard Outcome Section -->
        <div class="standard-outcome-section">
            <div class="text-h7 q-mb-md">Standard Outcome</div>
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
                            placeholder="Enter custom target" :rules="[validateStrictNumeric]"
                            @keydown="blockInvalidChars"
                            @update:model-value="sanitizeNumericInput(props.row, 'quantity')" />
                        <div v-else class="numeric-display">
                            {{ props.row.quantity || '-' }}
                        </div>
                    </q-td>
                </template>

                <template v-slot:body-cell-effectiveness="props">
                    <q-td :props="props" class="input-cell">
                        <q-input v-model="props.row.effectiveness" dense outlined
                            placeholder="Enter effectiveness criteria" />
                    </q-td>
                </template>

                <template v-slot:body-cell-timeliness="props">
                    <q-td :props="props" class="input-cell">
                        <q-input v-model="props.row.timeliness" dense outlined
                            placeholder="Enter timeliness criteria" />
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
    data() {
        return {
            mergedCoreCompetency: this.initialMergedCoreCompetency,
            mergedLeadershipCompetency: this.initialMergedLeadershipCompetency,
            mergedTechnicalCompetency: this.initialMergedTechnicalCompetency,
            mergedSuccessIndicator: '',
            mergedRequiredOutput: '',
            showTargetModal: false,
            targetValue: null,
            mergedRow: { id: 0 },

            // MFO Data Structure
            categoryOptions: [
                { label: 'A. Strategic Function', value: 'A' },
                { label: 'B. Core Function', value: 'B' },
                { label: 'C. Support Function', value: 'C' }
            ],

            // Sample MFO data structure (in a real app, this might come from an API)
            mfoData: {
                // Strategic Function MFOS
                'A': [
                    {
                        value: 'MFO1',
                        label: 'MFO 1 - Strategic Planning',
                        outputs: [
                            { value: 'O1', label: 'Strategic Plan Document' },
                            { value: 'O2', label: 'Annual Implementation Plan' }
                        ]
                    },
                    {
                        value: 'MFO2',
                        label: 'MFO 2 - Policy Development',
                        outputs: [
                            { value: 'O1', label: 'Policy Documents' },
                            { value: 'O2', label: 'Policy Guidelines' }
                        ]
                    }
                ],
                // Core Function MFOS
                'B': [
                    {
                        value: 'MFO1',
                        label: 'MFO 1 - Service Delivery',
                        outputs: [
                            { value: 'O1', label: 'Completed Services' },
                            { value: 'O2', label: 'Service Reports' }
                        ]
                    }
                ],
                // Support Function MFOS
                'C': [
                    {
                        value: 'MFO1',
                        label: 'MFO 1 - Administrative Support',
                        outputs: [
                            { value: 'O1', label: 'Processed Documents' },
                            { value: 'O2', label: 'Administrative Reports' }
                        ]
                    }
                ]
            },

            quantityIndicatorType: 'numeric',
            quantityIndicator: [
                { label: 'Quantity (A. Custom target)', value: 'numeric' },
                { label: 'Quantity (B. Can exceed 100%)', value: 'B' },
                { label: 'Quantity (C. Cannot exceed 100%)', value: 'C' }
            ],
            standardOutcomeColumns: [
                { name: 'rating', label: 'Ratings', field: 'rating', align: 'center', classes: 'rating-column' },
                { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
                { name: 'timeliness', label: 'Timeliness', field: 'timeliness', align: 'center' },
                { name: 'effectiveness', label: 'Effectiveness', field: 'effectiveness', align: 'center' }
            ],
            standardOutcomeRows: [
                { rating: '5', quantity: '', timeliness: '', effectiveness: '' },
                { rating: '4', quantity: '', timeliness: '', effectiveness: '' },
                { rating: '3', quantity: '', timeliness: '', effectiveness: '' },
                { rating: '2', quantity: '', timeliness: '', effectiveness: '' },
                { rating: '1', quantity: '', timeliness: '', effectiveness: '' }
            ],
            competencyColumns: [
                {
                    name: 'core',
                    label: 'Core',
                    align: 'left',
                    field: 'core',
                    classes: 'core-column'
                },
                {
                    name: 'leadership',
                    label: 'Leadership',
                    align: 'left',
                    field: 'leadership',
                    classes: 'leadership-column'
                },
                {
                    name: 'technical',
                    label: 'Technical',
                    align: 'left',
                    field: 'technical',
                    classes: 'technical-column'
                }
            ],
            columns: [
                {
                    name: 'mfo',
                    required: true,
                    label: 'MFO',
                    align: 'left',
                    field: 'mfo',
                    sortable: true,
                    classes: 'mfo-column-header'
                },
                {
                    name: 'competency',
                    label: 'Required Competency & Proficiency Level',
                    align: 'left',
                    field: 'competency',
                    classes: 'competency-column-header'
                },
                {
                    name: 'successIndicator',
                    label: 'Success Indicator',
                    align: 'left',
                    field: 'successIndicator',
                    classes: 'success-indicator-column-header'
                },
                {
                    name: 'requiredOutput',
                    label: 'Required Output',
                    align: 'left',
                    field: 'requiredOutput',
                    classes: 'required-output-column-header'
                }
            ],
            rows: [
                {
                    id: 1,
                    category: '',
                    mfo: '',
                    output: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 2,
                    category: '',
                    mfo: '',
                    output: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 3,
                    category: '',
                    mfo: '',
                    output: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                }
            ]
        }
    },
    computed: {
        filteredMfoOptions() {
            const category = this.rows[0].category;
            if (!category) return [];

            return this.mfoData[category]?.map(mfo => ({
                value: mfo.value,
                label: mfo.label
            })) || [];
        },
        filteredOutputOptions() {
            const category = this.rows[0].category;
            const mfo = this.rows[1].mfo;
            if (!category || !mfo) return [];

            const selectedMfo = this.mfoData[category]?.find(m => m.value === mfo);
            return selectedMfo?.outputs || [];
        }
    },
    methods: {
        clearDependentFields(rowId) {
            // When category changes, clear MFO and Output
            if (rowId === 1) {
                this.rows[1].mfo = '';
                this.rows[2].output = '';
            }
            // When MFO changes, clear Output
            else if (rowId === 2) {
                this.rows[2].output = '';
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
                // Type B: Can exceed 100% (requires target input)
                const base = Number(this.targetValue);
                this.standardOutcomeRows[0].quantity = `${Math.ceil(base * 1.3)} and above`;       // 130%
                this.standardOutcomeRows[1].quantity = `${Math.ceil(base * 1.15)}-${Math.floor(base * 1.3) - 1}`; // 115%
                this.standardOutcomeRows[2].quantity = `${base}-${Math.floor(base * 1.15) - 1}`;  // 100%
                this.standardOutcomeRows[3].quantity = `${Math.ceil(base * 0.51)}-${Math.floor(base * 0.99)}`;    // 51%
                this.standardOutcomeRows[4].quantity = `${Math.floor(base * 0.5)} and below`;      // 50%

                this.$q.notify({
                    message: 'Quantities calculated successfully',
                    color: 'positive',
                    position: 'top'
                });
            }
            else if (this.quantityIndicatorType === 'C') {
                // Type C: Cannot exceed 100% (auto percentages)
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
                mfoData: {
                    category: this.rows[0].category,
                    mfo: this.rows[1].mfo,
                    output: this.rows[2].output
                },
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
                row.category = '';
                row.mfo = '';
                row.output = '';
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
<template>
    <div>
        <!-- Performance Indicator Section -->
        <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-md">Performance Indicator</div>
            <div class="row no-wrap">
                <div class="col-auto">
                    <q-table :rows="rows" :columns="[columns[0]]" row-key="id" hide-bottom bordered flat
                        style="min-width: 200px;">
                        <template v-slot:body-cell-mfo="props">
                            <q-td :props="props">
                                <q-select v-model="props.row.mfo" :label="getDropdownLabel(props.row.id)"
                                    :options="getMfoOptions(props.row.id)" dense borderless emit-value map-options
                                    behavior="menu" />
                            </q-td>
                        </template>
                    </q-table>
                </div>

                <div class="col" style="flex-grow: 2; min-width: 400px;">
                    <q-table :rows="[mergedRow]" :columns="competencyColumns" row-key="id" hide-bottom bordered flat
                        class="full-width" style="width: 100%;">
                        <template v-slot:body-cell-core="props">
                            <q-td :props="props" class="bordered-cell" style="height: 162px;">
                                <q-input v-model="mergedCoreCompetency" type="text" dense borderless
                                    class="full-width full-height" input-style="height: 100%; width: 100%;" />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-leadership="props">
                            <q-td :props="props" class="bordered-cell" style="height: 162px;">
                                <q-input v-model="mergedLeadershipCompetency" type="text" dense borderless
                                    class="full-width full-height" input-style="height: 100%; width: 100%;" />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-technical="props">
                            <q-td :props="props" class="bordered-cell" style="height: 162px;">
                                <q-input v-model="mergedTechnicalCompetency" type="text" dense borderless
                                    class="full-width full-height" input-style="height: 100%; width: 100%;" />
                            </q-td>
                        </template>
                    </q-table>
                </div>

                <div class="col-auto">
                    <q-table :rows="[mergedRow]" :columns="[columns[2]]" row-key="id" hide-bottom bordered flat
                        style="min-width: 200px;">
                        <template v-slot:body-cell-successIndicator="props">
                            <q-td :props="props" style="height: 162px;">
                                <q-input v-model="mergedSuccessIndicator" type="text" dense borderless
                                    class="full-height" input-style="height: 100%;" />
                            </q-td>
                        </template>
                    </q-table>
                </div>

                <div class="col-auto">
                    <q-table :rows="[mergedRow]" :columns="[columns[3]]" row-key="id" hide-bottom bordered flat
                        style="min-width: 200px;">
                        <template v-slot:body-cell-requiredOutput="props">
                            <q-td :props="props" style="height: 162px;">
                                <q-input v-model="mergedRequiredOutput" type="text" dense borderless class="full-height"
                                    input-style="height: 100%;" />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>

        <q-separator />
        <br>

        <!-- Standard Outcome Section -->
        <div>
            <div class="text-subtitle2 q-mb-md">Standard Outcome</div>
            <q-table :rows="standardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom bordered
                flat dense class="standard-outcome-table">
                <!-- Modified header templates to match style of Performance Indicator dropdowns -->
                <template v-slot:header-cell-quantity="props">
                    <q-th :props="props" class="bordered-cell header-cell">
                        <q-select v-model="quantityIndicatorType" :options="quantityIndicator" dense borderless
                            emit-value map-options behavior="menu" class="header-select left-aligned" />
                    </q-th>
                </template>
                <template v-slot:header-cell-effectiveness="props">
                    <q-th :props="props" class="bordered-cell header-cell">
                        <q-select v-model="effectivenessType" :options="[
                            { label: 'Effectiveness (Conditional)', value: 'conditional' },
                            { label: 'Effectiveness (Numeric)', value: 'numeric' }
                        ]" dense borderless emit-value map-options behavior="menu"
                            class="header-select left-aligned" />
                    </q-th>
                </template>
                <template v-slot:header-cell-timeliness="props">
                    <q-th :props="props" class="bordered-cell header-cell">
                        <q-select v-model="timelinessType" :options="[
                            { label: 'Timeliness (Conditional)', value: 'conditional' },
                            { label: 'Timeliness (Numeric)', value: 'numeric' }
                        ]" dense borderless emit-value map-options behavior="menu"
                            class="header-select left-aligned" />
                    </q-th>
                </template>

                <template v-slot:body-cell-quantity="props">
                    <q-td :props="props" class="bordered-cell">
                        <q-input v-if="quantityIndicatorType === 'numeric'" v-model="props.row.quantity" dense
                            borderless class="full-width" placeholder="Enter custom target"
                            :rules="[validateStrictNumeric]" @keydown="blockInvalidChars"
                            @update:model-value="sanitizeNumericInput(props.row, 'quantity')" />

                        <div v-else class="text-caption full-width q-pa-xs">
                            {{ props.row.quantity || '-' }}
                        </div>
                    </q-td>
                </template>

                <template v-slot:body-cell-effectiveness="props">
                    <q-td :props="props" class="bordered-cell">
                        <q-input v-if="effectivenessType === 'conditional'" v-model="props.row.effectiveness" dense
                            borderless class="full-width" placeholder="Enter condition" />
                        <q-input v-else v-model="props.row.effectiveness" dense borderless class="full-width"
                            placeholder="Enter number or range" :rules="[validateStrictNumeric]"
                            @keydown="blockInvalidChars"
                            @update:model-value="sanitizeNumericInput(props.row, 'effectiveness')" />
                    </q-td>
                </template>

                <template v-slot:body-cell-timeliness="props">
                    <q-td :props="props" class="bordered-cell">
                        <q-input v-if="timelinessType === 'conditional'" v-model="props.row.timeliness" dense borderless
                            class="full-width" placeholder="Enter condition" />
                        <q-input v-else v-model="props.row.timeliness" dense borderless class="full-width"
                            placeholder="Enter number or range" :rules="[validateStrictNumeric]"
                            @keydown="blockInvalidChars"
                            @update:model-value="sanitizeNumericInput(props.row, 'timeliness')" />
                    </q-td>
                </template>
            </q-table>

            <q-dialog v-model="showTargetModal" persistent>
                <q-card style="min-width: 300px;">
                    <q-card-section>
                        <div class="text-h6">Enter Target Output</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input v-model.number="targetValue" label="Target Output" type="number"
                            @keypress="blockInvalidChars" min="1" />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" v-close-popup @click="cancelTargetInput" />
                        <q-btn flat label="OK" color="primary" @click="computeQuantities" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // Props to receive data from parent component
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
            categoryOptions: [
                { label: 'A. Strategic Function', value: 'A' },
                { label: 'B. Core Function', value: 'B' },
                { label: 'C. Support Function', value: 'C' }
            ],
            dropdownLabels: {
                1: 'Select Category',
                2: 'Select MFO',
                3: 'Select Output'
            },
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
            quantityIndicatorType: 'numeric',
            quantityIndicator: [
                { label: 'Quantity (A. Custom target)', value: 'numeric' },
                { label: 'Quantity (B. Can exceed 100%)', value: 'B' },
                { label: 'Quantity (C. Cannot exceed 100%)', value: 'C' }
            ],
            timelinessType: 'conditional',
            effectivenessType: 'conditional',
            standardOutcomeColumns: [
                { name: 'rating', label: 'Ratings', field: 'rating', align: 'center' },
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
                    style: "width: 33%"
                },
                {
                    name: 'leadership',
                    label: 'Leadership',
                    align: 'left',
                    field: 'leadership',
                    style: "width: 33%"
                },
                {
                    name: 'technical',
                    label: 'Technical',
                    align: 'left',
                    field: 'technical',
                    style: "width: 34%"
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
                    style: "width: 20%"
                },
                {
                    name: 'competency',
                    label: 'Required Competency & Proficiency Level',
                    align: 'left',
                    field: 'competency',
                    style: "width: 40%"
                },
                {
                    name: 'successIndicator',
                    label: 'Success Indicator',
                    align: 'left',
                    field: 'successIndicator',
                    style: "width: 20%"
                },
                {
                    name: 'requiredOutput',
                    label: 'Required Output',
                    align: 'left',
                    field: 'requiredOutput',
                    style: "width: 20%"
                }
            ],
            rows: [
                {
                    id: 1,
                    mfo: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 2,
                    mfo: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 3,
                    mfo: '',
                    core: '',
                    leadership: '',
                    technical: '',
                    successIndicator: '',
                    requiredOutput: ''
                }
            ]
        }
    },
    methods: {
        getDropdownLabel(rowId) {
            return this.dropdownLabels[rowId] || ''
        },
        getMfoOptions(rowId) {
            if (rowId === 1) return this.categoryOptions
            if (rowId === 2) return this.mfoOptions
            if (rowId === 3) return this.outputOptions
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
                this.$q.notify({ message: 'Please enter a valid number', color: 'negative' });
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
        // Method to get current data to pass back to parent
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
        // Method to reset the component's data
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
        }
    },
    watch: {
        quantityIndicatorType(val) {
            if (val === 'B') {
                this.targetValue = null;
                this.showTargetModal = true; // Show modal only for type B
            } else if (val === 'C') {
                this.computeQuantities(); // Auto-compute for type C
            } else if (val === 'numeric') {
                // Clear for custom target
                this.standardOutcomeRows.forEach(row => {
                    row.quantity = '';
                });
            }
        }
    }
}
</script>

<style scoped>
.standard-outcome-table {
    border-collapse: collapse;
}

.standard-outcome-table th,
.standard-outcome-table td {
    border: 1px solid #ddd !important;
}

.bordered-cell {
    padding: 4px 8px !important;
    border: 1px solid #ddd !important;
}

.bordered-cell .q-field__control {
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
}

.bordered-cell .q-field__control:before {
    border: none !important;
}

/* New styles to fix dropdown alignment */
.header-cell {
    padding: 8px !important;
    text-align: left !important;
}

.header-select {
    width: 100% !important;
}

.left-aligned {
    text-align: left !important;
    justify-content: flex-start !important;
}

.left-aligned .q-field__native {
    text-align: left !important;
}

/* Fix for the dropdown flexing */
.q-table th {
    white-space: normal !important;
    display: table-cell !important;
}

.q-select .q-field__control {
    min-height: auto !important;
}
</style>
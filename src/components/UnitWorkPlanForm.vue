<template>
    <q-page class="q-pa-md">
        <q-card class="my-card">
            <q-card-section>
                <div class="text-subtitle2">Create Unit Work Plan</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div class="col-md-6 col-sm-12">
                        <q-input filled v-model="division" label="Division" />
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <q-input filled v-model="targetPeriod" label="Target Period" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="employeeName" label="Employee Name" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="rank" label="Rank" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="position" label="Position" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-subtitle2 q-mb-md">Performance Indicator</div>
                <div class="row no-wrap">
                    <div class="col-auto">
                        <q-table :rows="rows" :columns="[columns[0]]" row-key="id" hide-bottom bordered flat
                            style="min-width: 200px;">
                            <template v-slot:body-cell-mfo="props">
                                <q-td :props="props">
                                    <!-- <div class="dropdown-container"> -->
                                    <!-- <span v-if="!props.row.mfo">{{ getDropdownLabel(props.row.id) }}</span> -->
                                    <q-select v-model="props.row.mfo" :label="getDropdownLabel(props.row.id)"
                                        :options="getMfoOptions(props.row.id)" dense borderless emit-value map-options
                                        behavior="menu" />
                                    <!-- </div> -->
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
                                    <q-input v-model="mergedRequiredOutput" type="text" dense borderless
                                        class="full-height" input-style="height: 100%;" />
                                </q-td>
                            </template>
                        </q-table>
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-subtitle2 q-mb-md">Standard Outcome</div>
                <q-table :rows="standardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom
                    bordered flat dense class="standard-outcome-table">
                    <template v-slot:header-cell-quantity="props">
                        <q-th :props="props" class="bordered-cell">
                            <q-select v-model="quantityType" :options="[
                                { label: 'Quantity (Conditional)', value: 'conditional' },
                                { label: 'Quantity (Numeric)', value: 'numeric' }
                            ]" dense borderless emit-value map-options class="header-select" />
                        </q-th>
                    </template>
                    <template v-slot:header-cell-effectiveness="props">
                        <q-th :props="props" class="bordered-cell">
                            <q-select v-model="effectivenessType" :options="[
                                { label: 'Effectiveness (Conditional)', value: 'conditional' },
                                { label: 'Effectiveness (Numeric)', value: 'numeric' }
                            ]" dense borderless emit-value map-options class="header-select" />
                        </q-th>
                    </template>
                    <template v-slot:header-cell-timeliness="props">
                        <q-th :props="props" class="bordered-cell">
                            <q-select v-model="timelinessType" :options="[
                                { label: 'Timeliness (Conditional)', value: 'conditional' },
                                { label: 'Timeliness (Numeric)', value: 'numeric' }
                            ]" dense borderless emit-value map-options class="header-select" />
                        </q-th>
                    </template>

                    <!-- Body cell templates remain the same -->
                    <template v-slot:body-cell-quantity="props">
                        <q-td :props="props" class="bordered-cell">
                            <q-input v-if="quantityType === 'conditional'" v-model="props.row.quantity" dense borderless
                                class="full-width" placeholder="Enter condition" />
                            <q-input v-else v-model="props.row.quantity" dense borderless class="full-width"
                                placeholder="Enter number or range" :rules="[validateStrictNumeric]"
                                @keydown="blockInvalidChars"
                                @update:model-value="sanitizeNumericInput(props.row, 'quantity')" />
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
                            <q-input v-if="timelinessType === 'conditional'" v-model="props.row.timeliness" dense
                                borderless class="full-width" placeholder="Enter condition" />
                            <q-input v-else v-model="props.row.timeliness" dense borderless class="full-width"
                                placeholder="Enter number or range" :rules="[validateStrictNumeric]"
                                @keydown="blockInvalidChars"
                                @update:model-value="sanitizeNumericInput(props.row, 'timeliness')" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn icon="save" label="Save" :style="{ backgroundColor: '#077A37' }" text-color="white"
                    @click="saveForm" />
                <q-btn label="Reset" color="negative" flat @click="resetForm" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            division: '',
            targetPeriod: '',
            employeeName: '',
            rank: '',
            position: '',
            mergedCoreCompetency: '',
            mergedLeadershipCompetency: '',
            mergedTechnicalCompetency: '',
            mergedSuccessIndicator: '',
            mergedRequiredOutput: '',
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
            quantityType: 'conditional',
            timelinessType: 'conditional',
            effectivenessType: 'conditional',
            inputTypeOptions: [
                { label: 'Quantity (Conditional)', value: 'conditional' },
                { label: 'Quantity (Numeric)', value: 'numeric' }
            ],
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
        saveForm() {
            const savedData = {
                division: this.division,
                targetPeriod: this.targetPeriod,
                employeeName: this.employeeName,
                rank: this.rank,
                position: this.position,
                rows: this.rows.map(row => ({
                    mfo: row.mfo,
                    core: row.core,
                    leadership: row.leadership,
                    technical: row.technical,
                    successIndicator: row.successIndicator,
                    requiredOutput: row.requiredOutput
                })),
                standardOutcomeRows: this.standardOutcomeRows.map(row => ({
                    rating: row.rating,
                    quantity: row.quantity,
                    timeliness: row.timeliness,
                    effectiveness: row.effectiveness
                }))
            };

            console.log('Saved Data:', savedData); // Replace with actual save logic (e.g., API call)

            this.$q.notify({
                message: 'Work plan saved successfully',
                color: 'positive'
            });
        },
        resetForm() {
            this.division = ''
            this.targetPeriod = ''
            this.employeeName = ''
            this.rank = ''
            this.position = ''
            this.mergedCoreCompetency = ''
            this.mergedLeadershipCompetency = ''
            this.mergedTechnicalCompetency = ''
            this.mergedSuccessIndicator = ''
            this.mergedRequiredOutput = ''
            this.standardOutcomeRows.forEach(row => {
                row.quantity = ''
                row.timeliness = ''
                row.effectiveness = ''
            })
            this.rows.forEach(row => {
                row.mfo = ''
                row.core = ''
                row.leadership = ''
                row.technical = ''
                row.successIndicator = ''
                row.requiredOutput = ''
            })
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
        }
    }
}
</script>

<style scoped>
.dropdown-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

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
</style>
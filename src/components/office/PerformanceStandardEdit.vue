<template>
    <div class="performance-standard-edit">
        <!-- MFO Section -->
        <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
                <div class="text-subtitle2 q-mb-sm">MFO</div>
                <div class="row q-col-gutter-sm">
                    <div class="col-md-4 col-sm-12">
                        <q-select v-model="localMfo1" :options="categoryOptions" label="Category" outlined dense
                            emit-value map-options />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-select v-model="localMfo2" :options="mfoOptions" label="MFO" outlined dense emit-value
                            map-options />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-select v-model="localMfo3" :options="outputOptions" label="Output" outlined dense emit-value
                            map-options />
                    </div>
                </div>
            </div>
        </div>

        <!-- Competency Section -->
        <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
                <div class="text-subtitle2 q-mb-sm">Required Competency & Proficiency Level</div>
                <div class="row q-col-gutter-sm">
                    <div class="col-md-4 col-sm-12">
                        <q-input v-model="localCoreCompetency" label="Core Competency" outlined dense />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input v-model="localLeadershipCompetency" label="Leadership Competency" outlined dense />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input v-model="localTechnicalCompetency" label="Technical Competency" outlined dense />
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Indicator & Required Output -->
        <div class="row q-col-gutter-md q-mb-md">
            <div class="col-md-6 col-sm-12">
                <div class="text-subtitle2 q-mb-sm">Success Indicator</div>
                <q-input v-model="localSuccessIndicator" type="textarea" outlined autogrow />
            </div>
            <div class="col-md-6 col-sm-12">
                <div class="text-subtitle2 q-mb-sm">Required Output</div>
                <q-input v-model="localRequiredOutput" type="textarea" outlined autogrow />
            </div>
        </div>

        <!-- Standard Outcome Section -->
        <div class="q-mt-lg">
            <div class="text-subtitle2">Standard Outcome</div>

            <div class="row q-mb-sm q-gutter-sm">
                <q-select v-model="quantityIndicatorType" :options="quantityIndicator" label="Quantity Type" outlined
                    dense emit-value map-options class="col" />

                <q-select v-model="timelinessType" :options="[
                    { label: 'Timeliness (Conditional)', value: 'conditional' },
                    { label: 'Timeliness (Numeric)', value: 'numeric' }
                ]" label="Timeliness Type" outlined dense emit-value map-options class="col" />

                <q-select v-model="effectivenessType" :options="[
                    { label: 'Effectiveness (Conditional)', value: 'conditional' },
                    { label: 'Effectiveness (Numeric)', value: 'numeric' }
                ]" label="Effectiveness Type" outlined dense emit-value map-options class="col" />
            </div>

            <q-table :rows="localStandardOutcomeRows" :columns="standardOutcomeColumns" row-key="rating" hide-bottom
                bordered flat dense>
                <template v-slot:body-cell-quantity="props">
                    <q-td :props="props" class="input-cell">
                        <q-input v-model="props.row.quantity" dense outlined placeholder="Enter quantity" />
                    </q-td>
                </template>

                <template v-slot:body-cell-timeliness="props">
                    <q-td :props="props" class="input-cell">
                        <q-input v-model="props.row.timeliness" dense outlined placeholder="Enter timeliness" />
                    </q-td>
                </template>

                <template v-slot:body-cell-effectiveness="props">
                    <q-td :props="props" class="input-cell">
                        <q-input v-model="props.row.effectiveness" dense outlined placeholder="Enter effectiveness" />
                    </q-td>
                </template>
            </q-table>

            <!-- Target Input Modal -->
            <q-dialog v-model="showTargetModal" persistent>
                <q-card style="min-width: 400px; border-radius: 8px;">
                    <q-card-section class="bg-grey-3">
                        <div class="text-h6">Enter Target Output</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input v-model.number="targetValue" label="Target Output" type="number" outlined dense
                            :rules="[val => val > 0 || 'Must be greater than 0']" />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancel" color="grey-7" v-close-popup @click="cancelTargetInput" />
                        <q-btn label="Calculate" color="primary" unelevated @click="computeQuantities" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
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
.input-cell {
    padding: 4px;
}
</style>
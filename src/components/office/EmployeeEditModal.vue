<!-- EmployeeEditModal.vue -->
<template>
    <q-dialog v-model="showModal">
        <q-card>
            <q-bar class="bg-primary text-white">
                <div class="text-h6">Edit Employee Performance Standards</div>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup />
            </q-bar>

            <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md">
                    <div class="col-md-4 col-sm-12">
                        <q-input outlined dense v-model="editedEmployee.name" label="Employee Name"
                            :rules="[val => !!val || 'Name is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input outlined dense v-model="editedEmployee.position" label="Position"
                            :rules="[val => !!val || 'Position is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input outlined dense v-model="editedEmployee.rank" label="Rank" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
                <div class="row items-center justify-between q-mb-md">
                    <div class="text-h6">Performance Standards</div>
                    <q-btn color="primary" icon="add" label="Add Standard" @click="addPerformanceStandard" unelevated />
                </div>

                <div v-for="(standard, index) in editedStandards" :key="index" class="q-mb-lg">
                    <q-card bordered>
                        <q-card-section class="bg-grey-2">
                            <div class="row items-center">
                                <div class="text-subtitle1">Performance Standard {{ index + 1 }}</div>
                                <q-space />
                                <q-btn flat round color="negative" icon="delete"
                                    @click="removePerformanceStandard(index)" />
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <!-- Performance Standard Component -->
                            <performance-standard-edit v-model:core-competency="standard.coreCompetency"
                                v-model:leadership-competency="standard.leadershipCompetency"
                                v-model:technical-competency="standard.technicalCompetency"
                                v-model:success-indicator="standard.successIndicator"
                                v-model:required-output="standard.requiredOutput" v-model:mfo1="standard.mfo1"
                                v-model:mfo2="standard.mfo2" v-model:mfo3="standard.mfo3"
                                v-model:standard-outcome-rows="standard.standardOutcomeRows" />
                        </q-card-section>
                    </q-card>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" class="bg-white">
                <q-btn flat label="Cancel" color="grey-7" v-close-popup />
                <q-btn unelevated label="Save" color="primary" @click="saveChanges" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import PerformanceStandardEdit from './PerformanceStandardEdit.vue';

export default {
    components: {
        PerformanceStandardEdit
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        employee: {
            type: Object,
            required: true
        },
        performanceStandards: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue', 'save'],
    data() {
        return {
            editedEmployee: {},
            editedStandards: []
        };
    },
    computed: {
        showModal: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        }
    },
    watch: {
        modelValue(val) {
            if (val) {
                this.initializeForm();
            }
        }
    },
    methods: {
        initializeForm() {
            // Create deep copies to avoid mutation of props
            this.editedEmployee = { ...this.employee };

            // Deep copy of performance standards
            this.editedStandards = this.performanceStandards?.length
                ? JSON.parse(JSON.stringify(this.performanceStandards))
                : [this.createEmptyStandard()];
        },
        createEmptyStandard() {
            return {
                coreCompetency: 'DSE-4',
                leadershipCompetency: 'TSC-4',
                technicalCompetency: 'RM-3',
                successIndicator: '',
                requiredOutput: '',
                mfo1: '',
                mfo2: '',
                mfo3: '',
                standardOutcomeRows: [
                    { rating: '5', quantity: '', timeliness: '', effectiveness: '' },
                    { rating: '4', quantity: '', timeliness: '', effectiveness: '' },
                    { rating: '3', quantity: '', timeliness: '', effectiveness: '' },
                    { rating: '2', quantity: '', timeliness: '', effectiveness: '' },
                    { rating: '1', quantity: '', timeliness: '', effectiveness: '' }
                ]
            };
        },
        addPerformanceStandard() {
            this.editedStandards.push(this.createEmptyStandard());
        },
        removePerformanceStandard(index) {
            this.$q.dialog({
                title: 'Confirm Deletion',
                message: 'Are you sure you want to delete this performance standard?',
                cancel: true,
                persistent: true
            }).onOk(() => {
                this.editedStandards.splice(index, 1);
            });
        },
        saveChanges() {
            // Validate data
            if (!this.editedEmployee.name || !this.editedEmployee.position) {
                this.$q.notify({
                    message: 'Please fill all required fields',
                    color: 'negative',
                    icon: 'warning'
                });
                return;
            }

            // Emit save event with edited data
            this.$emit('save', {
                employee: this.editedEmployee,
                performanceStandards: this.editedStandards
            });

            // Close the dialog
            this.showModal = false;
        }
    }
};
</script>

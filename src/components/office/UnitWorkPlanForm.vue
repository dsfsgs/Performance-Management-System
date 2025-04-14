<template>
    <q-page class="q-pa-md">
        <q-card class="my-card" flat bordered>
            <q-card-section style="background-color: #205540;">
                <div class="text-h7 text-white">Create Unit Work Plan</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md q-mb-md">
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="division" label="Division" stack-label class="q-mb-sm"
                            :rules="[val => !!val || 'Field is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-select filled v-model="targetPeriod" :options="periodOptions" label="Target Period"
                            stack-label class="q-mb-sm" :rules="[val => !!val || 'Field is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-select filled v-model="targetYear" :options="yearOptions" label="Year" stack-label
                            class="q-mb-sm" :rules="[val => !!val || 'Field is required']" use-input input-debounce="0"
                            @filter="filterYears" behavior="menu" />
                    </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row q-col-gutter-md">
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="employeeName" label="Employee Name" stack-label class="q-mb-sm"
                            :rules="[val => !!val || 'Field is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="rank" label="Rank" stack-label class="q-mb-sm"
                            :rules="[val => !!val || 'Field is required']" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="position" label="Position" stack-label class="q-mb-sm"
                            :rules="[val => !!val || 'Field is required']" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <!-- Performance Standards Section -->
            <q-card-section class="q-pa-none">
                <div v-for="(standard, index) in performanceStandards" :key="index">
                    <div class="performance-standard-container q-pa-md" :class="{ 'bg-grey-1': index % 2 === 0 }">
                        <div class="standard-header row items-center justify-between q-mb-md">
                            <div class="text-h7 text-weight-medium">Performance Standard {{ index + 1 }}</div>
                            <q-btn v-if="index > 0" icon="delete" color="negative" flat round dense
                                @click="removePerformanceStandard(index)" class="q-ml-sm" />
                        </div>

                        <performance-standards :ref="'performanceStandards_' + index"
                            :initialMergedCoreCompetency="standard.coreCompetency"
                            :initialMergedLeadershipCompetency="standard.leadershipCompetency"
                            :initialMergedTechnicalCompetency="standard.technicalCompetency" />
                    </div>

                    <q-separator v-if="index < performanceStandards.length - 1" />
                </div>
            </q-card-section>

            <!-- Add button section -->
            <q-card-section class="text-center q-pt-md">
                <q-btn icon="add" label="Add Another Performance Standard" color="primary" outline
                    @click="addPerformanceStandard" />
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" class="q-pa-md">
                <q-btn label="Cancel" color="grey-7" flat @click="$emit('cancel')" class="q-mr-sm" />
                <q-btn icon="save" label="Save Work Plan" color="primary" unelevated @click="saveForm" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
import PerformanceStandards from "../office/PerformanceStandard.vue";

export default {
    components: {
        PerformanceStandards
    },
    emits: ['form-saved', 'cancel'],
    data() {
        // Create an array of years
        const currentYear = new Date().getFullYear();
        const startYear = 1990;
        const endYear = 2050;
        const years = [];

        for (let year = startYear; year <= endYear; year++) {
            years.push(year.toString());
        }

        return {
            division: '',
            targetPeriod: '',
            targetYear: currentYear.toString(),
            periodOptions: [
                'January - June',
                'July - December'
            ],
            yearOptions: years,
            filteredYears: years,
            employeeName: '',
            rank: '',
            position: '',
            performanceStandards: [
                {
                    coreCompetency: 'DSE-4',
                    leadershipCompetency: 'TSC-4',
                    technicalCompetency: 'RM-3'
                }
            ]
        };
    },
    computed: {
        fullTargetPeriod() {
            if (this.targetPeriod && this.targetYear) {
                return `${this.targetPeriod} ${this.targetYear}`;
            }
            return '';
        }
    },
    methods: {
        filterYears(val, update) {
            if (val === '') {
                update(() => {
                    this.filteredYears = this.yearOptions;
                });
                return;
            }

            update(() => {
                const needle = val.toLowerCase();
                this.filteredYears = this.yearOptions.filter(
                    v => v.toLowerCase().indexOf(needle) > -1
                );
            });
        },
        validateForm() {
            let isValid = true
            const requiredFields = [
                this.division,
                this.targetPeriod,
                this.targetYear,
                this.employeeName,
                this.rank,
                this.position
            ]

            if (requiredFields.some(field => !field)) {
                this.$q.notify('Please fill all required fields')
                isValid = false
            }

            // Validate performance standards if needed
            return isValid
        },
        saveForm() {
            if (!this.validateForm()) return
            // Get data from all performance standards components
            const performanceData = [];

            this.performanceStandards.forEach((_, index) => {
                const refName = 'performanceStandards_' + index;
                const compRef = this.$refs[refName];

                if (compRef && compRef[0]) {
                    performanceData.push(compRef[0].getFormData());
                }
            });

            const savedData = {
                division: this.division,
                targetPeriod: this.fullTargetPeriod,
                employeeName: this.employeeName,
                rank: this.rank,
                position: this.position,
                performanceStandards: performanceData
            };

            console.log('Saved Data:', savedData);

            // Emit the saved data to the parent component
            this.$emit('form-saved', savedData);
        },
        resetForm() {
            this.$q.dialog({
                title: 'Confirm Reset',
                message: 'Are you sure you want to reset all fields?',
                cancel: true,
                persistent: true
            }).onOk(() => {
                const currentYear = new Date().getFullYear().toString();

                this.division = '';
                this.targetPeriod = '';
                this.targetYear = currentYear;
                this.employeeName = '';
                this.rank = '';
                this.position = '';

                // Reset to just one performance standards component
                this.performanceStandards = [
                    {
                        coreCompetency: 'DSE-4',
                        leadershipCompetency: 'TSC-4',
                        technicalCompetency: 'RM-3'
                    }
                ];

                // Reset the first performance standards component
                const refName = 'performanceStandards_0';
                if (this.$refs[refName] && this.$refs[refName][0]) {
                    this.$refs[refName][0].resetComponentData();
                }

                this.$q.notify({
                    message: 'Form has been reset',
                    color: 'info',
                    icon: 'info',
                    position: 'top-right'
                });
            });
        },
        addPerformanceStandard() {
            this.performanceStandards.push({
                coreCompetency: 'DSE-4',
                leadershipCompetency: 'TSC-4',
                technicalCompetency: 'RM-3'
            });

            this.$q.notify({
                message: 'New performance standard added',
                color: 'info',
                icon: 'add_circle',
                position: 'top-right'
            });
        },
        removePerformanceStandard(index) {
            this.$q.dialog({
                title: 'Confirm Removal',
                message: 'Are you sure you want to remove this performance standard?',
                cancel: true,
                persistent: true
            }).onOk(() => {
                this.performanceStandards.splice(index, 1);
                this.$q.notify({
                    message: 'Performance standard removed',
                    color: 'warning',
                    icon: 'remove_circle',
                    position: 'top-right'
                });
            });
        }
    }
};
</script>

<style scoped>
.my-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 1200px;
    margin: 0 auto;
}

.performance-standard-container {
    position: relative;
    transition: all 0.3s ease;
}

.performance-standard-container:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.standard-header {
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.q-field--filled .q-field__control {
    border-radius: 6px;
}

.q-separator {
    background-color: rgba(0, 0, 0, 0.08);
}
</style>
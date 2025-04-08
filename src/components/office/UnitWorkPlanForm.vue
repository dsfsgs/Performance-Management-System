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

            <!-- Iterate through performance standards components -->
            <div v-for="(standard, index) in performanceStandards" :key="index">
                <q-card-section class="performance-standard-container">
                    <div class="standard-header row items-center justify-between q-mb-md">
                        <div class="text-subtitle2">Performance Standard #{{ index + 1 }}</div>
                        <!-- Remove button for all except the first one -->
                        <q-btn v-if="index > 0" icon="delete" color="negative" flat round dense
                            @click="removePerformanceStandard(index)" />
                    </div>

                    <!-- Include the PerformanceStandardsComponent -->
                    <performance-standards :ref="'performanceStandards_' + index"
                        :initialMergedCoreCompetency="standard.coreCompetency"
                        :initialMergedLeadershipCompetency="standard.leadershipCompetency"
                        :initialMergedTechnicalCompetency="standard.technicalCompetency" />
                </q-card-section>

                <q-separator v-if="index < performanceStandards.length - 1" />
            </div>

            <!-- Add button section -->
            <q-card-section class="q-pt-none">
                <div class="row justify-center q-mt-md">
                    <q-btn icon="add" label="Add Another Performance Standard" color="primary"
                        @click="addPerformanceStandard" />
                </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn icon="save" label="Save" :style="{ backgroundColor: '#077A37' }" text-color="white"
                    @click="saveForm" />
                <q-btn label="Reset" color="negative" flat @click="resetForm" />
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
    data() {
        return {
            division: '',
            targetPeriod: '',
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
    methods: {
        saveForm() {
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
                targetPeriod: this.targetPeriod,
                employeeName: this.employeeName,
                rank: this.rank,
                position: this.position,
                performanceStandards: performanceData
            };

            console.log('Saved Data:', savedData); // Replace with actual save logic (e.g., API call)

            this.$q.notify({
                message: 'Work plan saved successfully',
                color: 'positive'
            });
        },
        resetForm() {
            this.division = '';
            this.targetPeriod = '';
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
        },
        addPerformanceStandard() {
            // Add a new performance standard form
            this.performanceStandards.push({
                coreCompetency: 'DSE-4',
                leadershipCompetency: 'TSC-4',
                technicalCompetency: 'RM-3'
            });

            this.$q.notify({
                message: 'New performance standard added',
                color: 'info'
            });
        },
        removePerformanceStandard(index) {
            // Confirm before removing
            this.$q.dialog({
                title: 'Confirm',
                message: 'Are you sure you want to remove this performance standard?',
                cancel: true,
                persistent: true
            }).onOk(() => {
                this.performanceStandards.splice(index, 1);

                this.$q.notify({
                    message: 'Performance standard removed',
                    color: 'warning'
                });
            });
        }
    }
};
</script>

<style scoped>
.performance-standard-container {
    position: relative;
    padding-top: 24px;
}

.standard-header {
    margin-bottom: 16px;
}
</style>
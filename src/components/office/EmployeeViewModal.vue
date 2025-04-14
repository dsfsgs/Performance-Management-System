<template>
    <q-dialog v-model="showModal" persistent>
        <q-card style="width: 800px; max-width: 90vw; border-radius: 8px;">
            <q-card-section class="bg-green-1">
                <div class="text-h6">Employee Performance Standards</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row q-col-gutter-md q-mt-md">
                    <div class="col-md-4 col-sm-12">
                        <q-item>
                            <q-item-section>
                                <q-item-label caption>Employee Name</q-item-label>
                                <q-item-label>{{ employee.name }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-item>
                            <q-item-section>
                                <q-item-label caption>Position</q-item-label>
                                <q-item-label>{{ employee.position }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-item>
                            <q-item-section>
                                <q-item-label caption>Rank</q-item-label>
                                <q-item-label>{{ employee.rank || 'N/A' }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="text-subtitle1 q-mb-md">Performance Standards</div>

                <div v-if="!performanceStandards || performanceStandards.length === 0"
                    class="text-center text-grey q-pa-md">
                    No performance standards found for this employee.
                </div>

                <q-list bordered separator class="rounded-borders" v-else>
                    <q-expansion-item v-for="(standard, index) in performanceStandards" :key="index"
                        :label="`Performance Standard ${index + 1}`" header-class="bg-grey-2" expand-separator>
                        <q-card>
                            <q-card-section>
                                <div class="row q-col-gutter-md">
                                    <!-- MFO Section -->
                                    <div class="col-12">
                                        <div class="text-subtitle2">MFO</div>
                                        <q-table
                                            :rows="[{ id: 1, mfo: standard.mfo1 }, { id: 2, mfo: standard.mfo2 }, { id: 3, mfo: standard.mfo3 }]"
                                            :columns="[{ name: 'mfo', label: 'MFO', field: 'mfo' }]" row-key="id"
                                            hide-bottom flat dense bordered />
                                    </div>

                                    <!-- Competency Section -->
                                    <div class="col-12 q-mt-md">
                                        <div class="text-subtitle2">Required Competency & Proficiency Level</div>
                                        <q-list bordered>
                                            <q-item>
                                                <q-item-section>
                                                    <q-item-label caption>Core Competency</q-item-label>
                                                    <q-item-label>{{ standard.coreCompetency || 'N/A' }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-item-label caption>Leadership Competency</q-item-label>
                                                    <q-item-label>{{ standard.leadershipCompetency || 'N/A'
                                                        }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-item-label caption>Technical Competency</q-item-label>
                                                    <q-item-label>{{ standard.technicalCompetency || 'N/A'
                                                        }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </div>

                                    <!-- Success Indicator & Required Output -->
                                    <div class="col-md-6 col-sm-12">
                                        <div class="text-subtitle2">Success Indicator</div>
                                        <q-card flat bordered>
                                            <q-card-section>
                                                {{ standard.successIndicator || 'N/A' }}
                                            </q-card-section>
                                        </q-card>
                                    </div>

                                    <div class="col-md-6 col-sm-12">
                                        <div class="text-subtitle2">Required Output</div>
                                        <q-card flat bordered>
                                            <q-card-section>
                                                {{ standard.requiredOutput || 'N/A' }}
                                            </q-card-section>
                                        </q-card>
                                    </div>

                                    <!-- Standard Outcome -->
                                    <div class="col-12 q-mt-md">
                                        <div class="text-subtitle2">Standard Outcome</div>
                                        <q-table :rows="standard.standardOutcomeRows || []"
                                            :columns="standardOutcomeColumns" row-key="rating" hide-bottom flat dense
                                            bordered />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Close" color="primary" flat v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
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
    emits: ['update:modelValue'],
    computed: {
        showModal: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        },
        standardOutcomeColumns() {
            return [
                { name: 'rating', label: 'Ratings', field: 'rating', align: 'center' },
                { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
                { name: 'timeliness', label: 'Timeliness', field: 'timeliness', align: 'center' },
                { name: 'effectiveness', label: 'Effectiveness', field: 'effectiveness', align: 'center' }
            ];
        }
    }
};
</script>
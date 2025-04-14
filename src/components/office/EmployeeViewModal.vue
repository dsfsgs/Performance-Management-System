<template>
    <q-dialog v-model="showModal" persistent>
        <q-card class="modern-card">
            <q-card-section class="header-section">
                <div class="text-h6">Employee Performance Standards</div>
                <q-btn flat round icon="close" v-close-popup />
            </q-card-section>

            <q-card-section class="employee-info-section">
                <div class="row q-col-gutter-lg">
                    <div class="col-md-4 col-sm-12">
                        <div class="info-card">
                            <div class="info-label">Employee Name</div>
                            <div class="info-value">{{ employee.name }}</div>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <div class="info-card">
                            <div class="info-label">Position</div>
                            <div class="info-value">{{ employee.position }}</div>
                        </div>
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <div class="info-card">
                            <div class="info-label">Rank</div>
                            <div class="info-value">{{ employee.rank || 'N/A' }}</div>
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="section-title">Performance Standards</div>

                <div v-if="!performanceStandards || performanceStandards.length === 0" class="empty-state">
                    <q-icon name="sentiment_dissatisfied" size="48px" color="grey-5" />
                    <div>No performance standards found for this employee.</div>
                </div>

                <div v-else class="standards-container">
                    <q-expansion-item v-for="(standard, index) in performanceStandards" :key="index"
                        :label="`Performance Standard ${index + 1}`" header-class="standard-header"
                        expand-icon-class="expand-icon" expand-separator>
                        <div class="standard-content">
                            <!-- MFO, Success Indicator and Required Output - Horizontally Aligned -->
                            <div class="row q-col-gutter-md q-mb-lg">
                                <div class="col-md-4 col-sm-12">
                                    <div class="content-card">
                                        <div class="card-title">MFOs</div>
                                        <div class="mfo-item" v-if="standard.mfo1">{{ standard.mfo1 }}</div>
                                        <div class="mfo-item" v-if="standard.mfo2">{{ standard.mfo2 }}</div>
                                        <div class="mfo-item" v-if="standard.mfo3">{{ standard.mfo3 }}</div>
                                    </div>
                                </div>

                                <div class="col-md-4 col-sm-12">
                                    <div class="content-card">
                                        <div class="card-title">Success Indicator</div>
                                        <div class="card-content">{{ standard.successIndicator || 'N/A' }}</div>
                                    </div>
                                </div>

                                <div class="col-md-4 col-sm-12">
                                    <div class="content-card">
                                        <div class="card-title">Required Output</div>
                                        <div class="card-content">{{ standard.requiredOutput || 'N/A' }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Competency Section - More Modern Design -->
                            <div class="competency-section">
                                <div class="section-subtitle">Required Competencies</div>
                                <div class="row q-col-gutter-md">
                                    <div class="col-md-4 col-sm-12">
                                        <div class="competency-card">
                                            <div class="competency-type">Core</div>
                                            <div class="competency-value">{{ standard.coreCompetency || 'N/A' }}</div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="competency-card">
                                            <div class="competency-type">Leadership</div>
                                            <div class="competency-value">{{ standard.leadershipCompetency || 'N/A' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-12">
                                        <div class="competency-card">
                                            <div class="competency-type">Technical</div>
                                            <div class="competency-value">{{ standard.technicalCompetency || 'N/A' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Standard Outcome - Modern Table Design -->
                            <div class="standard-outcome-section">
                                <div class="section-subtitle">Standard Outcome</div>
                                <div class="outcome-table">
                                    <div class="table-header row">
                                        <div class="col-3 header-cell">Ratings</div>
                                        <div class="col-3 header-cell">Quantity</div>
                                        <div class="col-3 header-cell">Timeliness</div>
                                        <div class="col-3 header-cell">Effectiveness</div>
                                    </div>
                                    <div v-for="(row, rowIndex) in (standard.standardOutcomeRows || [])" :key="rowIndex"
                                        class="table-row row">
                                        <div class="col-3 table-cell">{{ row.rating }}</div>
                                        <div class="col-3 table-cell">{{ row.quantity }}</div>
                                        <div class="col-3 table-cell">{{ row.timeliness }}</div>
                                        <div class="col-3 table-cell">{{ row.effectiveness }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </q-expansion-item>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="actions-section">
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
        }
    }
};
</script>

<style scoped>
.modern-card {
    width: 900px;
    max-width: 95vw;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: white;
    border-radius: 16px 16px 0 0;
    padding: 16px 24px;
}

.employee-info-section {
    padding: 24px;
    background-color: #f5f5f5;
}

.info-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.info-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.info-value {
    font-size: 16px;
    font-weight: 500;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
}

.section-subtitle {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #444;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    color: #888;
    background: #f9f9f9;
    border-radius: 8px;
}

.standards-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.standard-header {
    background-color: #f0f7f0;
    font-weight: 500;
}

.expand-icon {
    color: #2e7d32;
}

.standard-content {
    padding: 24px;
    background-color: white;
}

.content-card {
    height: 100%;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-title {
    font-weight: 500;
    color: #2e7d32;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
}

.card-content {
    font-size: 14px;
    line-height: 1.5;
}

.mfo-item {
    padding: 8px 0;
    border-bottom: 1px dashed #e0e0e0;
    font-size: 14px;
}

.mfo-item:last-child {
    border-bottom: none;
}

.competency-section {
    margin-top: 24px;
    margin-bottom: 24px;
}

.competency-card {
    background: linear-gradient(to right, #f1f8e9, white);
    border-radius: 8px;
    padding: 16px;
    height: 100%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    border-left: 3px solid #4caf50;
}

.competency-type {
    font-weight: 500;
    color: #2e7d32;
    margin-bottom: 8px;
}

.competency-value {
    font-size: 14px;
}

.standard-outcome-section {
    margin-top: 24px;
}

.outcome-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.table-header {
    background-color: #f0f7f0;
    font-weight: 500;
    margin: 0;
}

.header-cell {
    padding: 12px 16px;
    text-align: center;
    border-right: 1px solid #e0e0e0;
}

.table-row {
    margin: 0;
    border-bottom: 1px solid #eee;
}

.table-cell {
    padding: 12px 16px;
    text-align: center;
    border-right: 1px solid #e0e0e0;
}

.header-cell:last-child,
.table-cell:last-child {
    border-right: none;
}

.actions-section {
    padding: 16px 24px;
    background-color: #f5f5f5;
    border-radius: 0 0 16px 16px;
}
</style>
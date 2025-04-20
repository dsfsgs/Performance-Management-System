<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="minimalist-card">
      <q-card-section class="header-section">
        <div class="text-h6">View Employee Performance Standards</div>
        <q-btn flat round icon="close" text-color="white" v-close-popup />
      </q-card-section>

      <q-card-section class="employee-info-section">
        <div class="row q-col-gutter-md">
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
        <div v-if="!performanceStandards || performanceStandards.length === 0" class="empty-state">
          <q-icon name="sentiment_dissatisfied" size="36px" color="grey-5" />
          <div>No performance standards found for this employee.</div>
        </div>

        <div v-else class="standards-container">
          <q-expansion-item v-for="(standard, index) in performanceStandards" :key="index"
            :label="`Performance Standard ${index + 1}`" header-class="standard-header" expand-icon-class="expand-icon"
            expand-separator class="section-title">
            <div class="standard-content">
              <div class="section-subtitle">Performance Indicator</div>
              <!-- Horizontal Layout -->
              <div class="row q-col-gutter-md">
                <!-- MFO Details -->
                <div class="col-md-3 col-sm-12">
                  <div class="section-block">
                    <div class="card-title">MFO</div>
                    <div class="mfo-item" v-if="standard.mfo1">{{ standard.mfo1 }}</div>
                    <div class="mfo-item" v-if="standard.mfo2">{{ standard.mfo2 }}</div>
                    <div class="mfo-item" v-if="standard.mfo3">{{ standard.mfo3 }}</div>
                  </div>
                </div>

                <!-- Competencies Section -->
                <div class="col-md-5 col-sm-12">
                  <div class="section-block">
                    <div class="card-title">Competencies</div>
                    <div class="row q-col-gutter-xs">
                      <!-- Core -->
                      <div class="col-4">
                        <div class="competency-subblock">
                          <div class="competency-subtitle">Core</div>
                          <div class="competency-value">{{ standard.coreCompetency || 'N/A' }}</div>
                        </div>
                      </div>

                      <!-- Technical -->
                      <div class="col-4">
                        <div class="competency-subblock">
                          <div class="competency-subtitle">Technical</div>
                          <div class="competency-value">{{ standard.technicalCompetency || 'N/A' }}</div>
                        </div>
                      </div>

                      <!-- Leadership -->
                      <div class="col-4">
                        <div class="competency-subblock">
                          <div class="competency-subtitle">Leadership</div>
                          <div class="competency-value">{{ standard.leadershipCompetency || 'N/A' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Success Indicator Section -->
                <div class="col-md-2 col-sm-12">
                  <div class="section-block">
                    <div class="card-title">Success Indicator</div>
                    <div class="card-content">{{ standard.successIndicator || 'N/A' }}</div>
                  </div>
                </div>

                <!-- Required Output Section -->
                <div class="col-md-2 col-sm-12">
                  <div class="section-block">
                    <div class="card-title">Required Output</div>
                    <div class="card-content">{{ standard.requiredOutput || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <!-- Standard Outcome Section -->
              <div class="standard-outcome-section q-mt-md">
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
.minimalist-card {
  width: 960px;
  max-width: 98vw;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #205540;
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 14px 20px;
}

.employee-info-section {
  padding: 16px;
  background-color: #f8f8f8;
}

.info-card {
  background: white;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  height: 100%;
}

.info-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
  color: #205540;
  letter-spacing: 0.3px;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #205540;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #777;
  background: #f9f9f9;
  border-radius: 4px;
}

.standards-container {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.standard-header {
  background-color: #f0f4f2;
  font-weight: 500;
  font-size: 14px;
  color: #205540;
}

.expand-icon {
  color: #205540;
}

.standard-content {
  padding: 16px;
  background-color: white;
}

.section-block {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  height: 100%;
}

.card-title {
  text-align: center;
  font-weight: 500;
  color: #205540;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
}

.card-content {
  font-size: 13px;
  color: #444;
  line-height: 1.4;
  max-height: 150px;
  overflow-y: auto;
}

.mfo-item {
  padding: 6px 0;
  border-bottom: 1px dashed #e8e8e8;
  font-size: 13px;
}

.mfo-item:last-child {
  border-bottom: none;
}

.competency-subblock {
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  height: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.competency-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #205540;
  text-align: center;
  margin-bottom: 6px;
}

.competency-value {
  font-size: 13px;
  text-align: center;
  color: #444;
}

.standard-outcome-section {
  margin-top: 16px;
}

.outcome-table {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #eee;
}

.table-header {
  background-color: #f0f4f2;
  font-weight: 500;
  margin: 0;
}

.header-cell {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #e8e8e8;
  font-size: 13px;
  color: #205540;
}

.table-row {
  margin: 0;
  border-bottom: 1px solid #eee;
}

.table-cell {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #e8e8e8;
  font-size: 13px;
}

.header-cell:last-child,
.table-cell:last-child {
  border-right: none;
}

.actions-section {
  padding: 10px 16px;
  background-color: #f8f8f8;
  border-radius: 0 0 8px 8px;
}

.q-btn {
  color: #205540;
}

@media (max-width: 960px) {
  .minimalist-card {
    width: 98vw;
  }
}
</style>

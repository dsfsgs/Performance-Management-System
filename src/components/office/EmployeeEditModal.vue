<template>
  <q-dialog v-model="showModal">
    <q-card class="minimalist-card">
      <q-card-section class="header-section">
        <div class="text-h6">Edit Employee Performance Standards</div>
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

      <q-separator />

      <q-card-section>

        <div v-for="(standard, index) in editedStandards" :key="index" class="q-mb-lg">
          <q-card bordered class="standard-card">
            <q-card-section class="standard-header">
              <div class="row items-center">
                <div class="section-title">Performance Standard {{ index + 1 }}</div>
                <q-space />
                <q-btn flat round color="negative" icon="delete" @click="removePerformanceStandard(index)" />
              </div>
            </q-card-section>

            <q-card-section class="standard-content">
              <!-- New Horizontal Performance Standard Component -->
              <performance-standard-edit v-model:core-competency="standard.coreCompetency"
                v-model:leadership-competency="standard.leadershipCompetency"
                v-model:technical-competency="standard.technicalCompetency"
                v-model:success-indicator="standard.successIndicator" v-model:required-output="standard.requiredOutput"
                v-model:mfo1="standard.mfo1" v-model:mfo2="standard.mfo2" v-model:mfo3="standard.mfo3"
                v-model:standard-outcome-rows="standard.standardOutcomeRows" />
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center">
          <q-btn icon="add" label="Add Performance Standard" color="primary" outline @click="addPerformanceStandard" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="actions-section">
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
      type: [Object, null],
      default: null
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
  color: #205540;
  letter-spacing: 0.3px;
}

.standard-card {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.standard-header {
  background-color: #f0f4f2;
  padding: 12px 16px;
}

.standard-content {
  padding: 16px;
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

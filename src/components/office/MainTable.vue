<template>
  <div>
    <!-- Filter and Buttons -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12" :class="getFilterColumnClass">
        <div class="row q-col-gutter-md">
          <!-- Target Period Filter -->
          <div v-if="showTargetPeriodFilter" class="col-12" :class="filterColumnWidth">
            <q-select 
              v-model="targetPeriodFilter" 
              :options="targetPeriodOptions" 
              label="Filter by Target Period"
              outlined 
              dense 
              clearable 
              emit-value 
              map-options
              behavior="menu"
              dropdown-icon="arrow_drop_down"
              popup-content-class="dropdown-popup"
              :menu-anchor="'bottom start'" 
              :menu-self="'top start'"
              class="full-width"
            />
          </div>
        </div>
      </div>

      <div class="row q-gutter-md justify-end">
        <q-btn v-if="!hideCreateButton" elevated rounded :style="{ backgroundColor: '#077A37' }"
          label="Create Unit Work Plan" @click="$emit('create')" icon="person_add" text-color="white"
          icon-color="white" />
        <q-btn v-if="!hideOPCRButton" elevated rounded color="primary" label="Generate OPCR" icon="print"
          @click="showGenerateModal = true" :disable="!targetPeriodFilter">
          <q-tooltip v-if="!targetPeriodFilter">
            Please select a target period first
          </q-tooltip>
        </q-btn>
        <q-btn v-if="!hideUnitWorkPlanButton" elevated rounded color="primary" label="Generate Unit Work Plan"
          icon="print" @click="showUnitWorkPlanModal = true" :disable="!targetPeriodFilter">
          <q-tooltip v-if="!targetPeriodFilter">
            Please select a target period first
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Table -->
    <q-table :rows="filteredRows" :columns="visibleColumns" row-key="id" @row-click="onRowClick">
      <template v-slot:header>
        <q-tr>
          <q-th v-for="col in visibleColumns" :key="col.name" style="background-color: #EBEBEB; text-align: left;">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)" :text-color="getStatusTextColor(props.row.status)"
            align="middle" class="q-px-md q-py-xs text-weight-medium" rounded>
            <q-icon :name="getStatusIcon(props.row.status)" class="q-mr-xs" />
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <!-- Generate OPCR Modal -->
    <GenerateOPCR v-model="showGenerateModal" @save="handleGenerateOPCR" ref="generateOPCRRef" />

    <!-- Unit Work Plan Report Modal -->
    <q-dialog v-model="showUnitWorkPlanModal" full-width>
      <UnitWorkPlanReport 
  :targetPeriod="targetPeriodFilter" 
  @close="showUnitWorkPlanModal = false" 
  :showApprovedButton="isUnitWorkPlanPage"
/>
    </q-dialog>
  </div>
</template>

<script>
import GenerateOPCR from './GenerateOPCR.vue';
import UnitWorkPlanReport from './UnitWorkPlanReport.vue';

export default {
  components: {
    GenerateOPCR,
    UnitWorkPlanReport
  },
  props: {
    rows: {
      type: Array,
      required: true
    },
    hideCreateButton: {
      type: Boolean,
      default: false
    },
    hideOPCRButton: {
      type: Boolean,
      default: false
    },
    hideUnitWorkPlanButton: {
      type: Boolean,
      default: false
    },
    showTargetPeriodFilter: {
      type: Boolean,
      default: true
    },
    hideDivisionColumn: {
      type: Boolean,
      default: false
    },
    showOfficeColumn: {
      type: Boolean,
      default: false
    },
    isUnitWorkPlanPage: {
    type: Boolean,
    default: false
  }
  },
  emits: ['create', 'row-click', 'generate-opcr', 'generate-uwp', 'update-status'],
  data() {
    return {
      targetPeriodFilter: null,
      officeFilter: null,
      showGenerateModal: false,
      showUnitWorkPlanModal: false,
      allColumns: [
        { name: "division", label: "Division", field: "division", align: "left", showIf: function() { return !this.hideDivisionColumn; } },
        { name: "office", label: "Office", field: "office", align: "left", showIf: function() { return this.showOfficeColumn; } },
        { name: "targetPeriod", label: "Target Period", field: "targetPeriod", align: "left" },
        { name: "dateCreated", label: "Date Created", field: "dateCreated", align: "left" },
        { name: "status", label: "Status", field: "status", align: "left" }
      ],
      generateOPCRRef: null
    }
  },
  computed: {
    visibleColumns() {
      return this.allColumns.filter(col => {
        if (typeof col.showIf === 'function') {
          return col.showIf.call(this);
        }
        if (typeof col.showIf === 'boolean') {
          return col.showIf;
        }
        return true;
      });
    },
    targetPeriodOptions() {
      const uniquePeriods = [...new Set(this.rows.map(row => row.targetPeriod))];
      return uniquePeriods.map(period => ({
        label: period,
        value: period
      }));
    },
    officeOptions() {
      const uniqueOffices = [...new Set(this.rows.map(row => row.office))];
      return uniqueOffices.map(office => ({
        label: office,
        value: office
      }));
    },
    filteredRows() {
      return this.rows.filter(row => {
        return (!this.targetPeriodFilter || row.targetPeriod === this.targetPeriodFilter) 
          && (!this.officeFilter || row.office === this.officeFilter);
      });
    },
    getFilterColumnClass() {
      if (!this.showTargetPeriodFilter && !this.showOfficeFilter) return '';
      return 'col-md-4';
    },
    filterColumnWidth() {
      return 'col-md-12';
    }
  },
  methods: {
    onRowClick(evt, row) {
      this.$emit('row-click', row);
    },
    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'approved': return 'green';
        case 'pending': return 'orange';
        case 'draft': return 'blue';
        default: return 'grey-2';
      }
    },
    getStatusTextColor(status) {
      switch (status.toLowerCase()) {
        case 'approved': return 'white';
        case 'pending': return 'white';
        case 'draft': return 'white';
        default: return 'grey-10';
      }
    },
    getStatusIcon(status) {
      switch (status.toLowerCase()) {
        case 'approved': return 'check_circle';
        case 'pending': return 'schedule';
        case 'draft': return 'drafts';
        default: return 'info';
      }
    },
    handleGenerateOPCR(formData) {
      this.$emit('update-status', this.targetPeriodFilter, 'Pending');
      this.$emit('generate-opcr', formData);
    },
    getLatestTargetPeriod() {
      if (this.rows.length === 0) return null;

      // Extract all target periods and parse them to Date objects
      const periodsWithDates = this.rows.map(row => {
        const period = row.targetPeriod;
        // Assuming format is "Month Year" (e.g., "January 2023")
        const [month, year] = period.split(' ');
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        return {
          period,
          date: new Date(year, monthIndex)
        };
      });

      // Sort by date descending
      periodsWithDates.sort((a, b) => b.date - a.date);

      return periodsWithDates[0].period;
    }
  },
  watch: {
    rows: {
      immediate: true,
      handler(newRows) {
        if (newRows && newRows.length > 0 && !this.targetPeriodFilter) {
          this.targetPeriodFilter = this.getLatestTargetPeriod();
        }
      }
    }
  }
}
</script>

<style>
.dropdown-popup {
  min-width: fit-content !important;
  width: auto !important;
}
</style>
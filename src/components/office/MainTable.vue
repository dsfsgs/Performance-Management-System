<!-- In MainTable.vue -->
<template>
  <div>
    <!-- Filter and Buttons -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12" :class="getFilterColumnClass">
        <div class="row q-col-gutter-md">
          <!-- Combined Target Period Filter -->
          <div v-if="showTargetPeriodFilter" class="col-12 col-md-6">
            <q-select v-model="targetPeriodFilter" :options="targetPeriodOptions" label="Target Period" outlined dense
              clearable emit-value map-options style="min-width: 250px;" />
          </div>

          <!-- Office Filter -->
          <div v-if="showOfficeFilter" class="col-12" :class="filterColumnWidth">
            <q-select v-model="officeFilter" :options="officeOptions" label="Filter by Office" outlined dense clearable
              emit-value map-options />
          </div>
        </div>
      </div>

      <div class="row q-gutter-md justify-end">
        <q-btn v-if="!hideCreateButton" elevated rounded :style="{ backgroundColor: '#077A37' }"
          label="Create Unit Work Plan" @click="$emit('create')" icon="person_add" text-color="white"
          icon-color="white" />

        <q-btn v-if="!hideOPCRButton"  label="Input" icon="edit" color="green-9" elevated rounded class="action-btn"
          @click="$emit('input-click')" />

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
    <q-table :rows="displayRows" :columns="visibleColumns" row-key="id" @row-click="onRowClick">
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

      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey-6">
          No data available
        </div>
      </template>
    </q-table>

    <!-- Generate OPCR Modal -->
    <GenerateOPCR v-model="showGenerateModal" @save="handleGenerateOPCR" ref="generateOPCRRef" />

    <!-- Unit Work Plan Report Modal -->
    <q-dialog v-model="showUnitWorkPlanModal" full-width>
      <UnitWorkPlanReport :targetPeriod="targetPeriodFilter" :filteredDivisions="filteredRows"
        @close="showUnitWorkPlanModal = false" />
    </q-dialog>

  </div>
</template>

<script>
import GenerateOPCR from './GenerateOPCR.vue';
import UnitWorkPlanReport from '../unitworkplan/UnitWorkPlanReport.vue';

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
        { name: "division", label: "Division", field: "division", align: "left", showIf: function () { return !this.hideDivisionColumn; } },
        { name: "office", label: "Office", field: "office", align: "left", showIf: function () { return this.showOfficeColumn; } },
        { name: "targetPeriod", label: "Target Period", field: "targetPeriod", align: "left" },
        { name: "dateCreated", label: "Date Created", field: "dateCreated", align: "left" },
        { name: "status", label: "Status", field: "status", align: "left", showIf: function () { return this.isUnitWorkPlanPage; } }
      ],
      generateOPCRRef: null,
      periodOptions: ['January - June', 'July - December'],
      yearOptions: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i - 5).toString()) // 5 years before and after current year
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
      // Get unique target periods from rows
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
        const matchesPeriod = !this.targetPeriodFilter || row.targetPeriod === this.targetPeriodFilter;
        const matchesOffice = !this.officeFilter || row.office === this.officeFilter;
        return matchesPeriod && matchesOffice;
      });
    },
    displayRows() {
      // If target period is not selected, return empty array to trigger "no data" message
      return this.targetPeriodFilter ? this.filteredRows : [];
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

      const periodsWithDates = this.rows.map(row => {
        const period = row.targetPeriod;
        const [monthRange, year] = period.split(' ');
        const [startMonth] = monthRange.split(' - ');
        const monthIndex = new Date(`${startMonth} 1, ${year}`).getMonth();
        return {
          period,
          date: new Date(year, monthIndex)
        };
      });

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

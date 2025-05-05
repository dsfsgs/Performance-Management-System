<!--Maintable.vue-->
<template>
  <div>
    <!-- Filter and Buttons -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12" :class="getFilterColumnClass">
        <div class="row q-col-gutter-md">
          <!-- Combined Target Period Filter -->
          <div v-if="showTargetPeriodFilter" class="col-12 col-md-6">
            <q-select v-model="targetPeriodFilter" :options="targetPeriodOptions" label="Target Period1" outlined dense
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

        <q-btn v-if="!hideOPCRButton && !hideInputButton" label="Input" icon="edit" color="green-9" elevated rounded
          class="action-btn" @click="$emit('input-click')" />

        <q-btn v-if="!hideOPCRButton" elevated rounded color="primary" label="Preview OPCR" icon="print"
          @click="showGenerateModal = true" :disable="!targetPeriodFilter">
          <q-tooltip v-if="!targetPeriodFilter">
            Please select a target period first
          </q-tooltip>
        </q-btn>

        <q-btn v-if="!hideUnitWorkPlanButton" elevated rounded color="primary" label="Preview Unit Work Plan1"
          icon="print" @click="showUnitWorkPlanModal = true" :disable="!targetPeriodFilter">
          <q-tooltip v-if="!targetPeriodFilter">
            Please select a target period first
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Table -->
    <q-table :rows="displayRows" :columns="visibleColumns" row-key="id" @row-click="onRowClick" :loading="loading">
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
import { computed, ref, onMounted } from 'vue'
import GenerateOPCR from './GenerateOPCR.vue'
import UnitWorkPlanReport from '../unitworkplan/UnitWorkPlanReport.vue'


export default {
  components: {
    GenerateOPCR,
    UnitWorkPlanReport,

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
    },
    hideInputButton: {
      type: Boolean,
      default: false
    },
    showOfficeFilter: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },

  },
  emits: ['create', 'row-click', 'generate-opcr', 'generate-uwp', 'update-status', 'input-click'],
  setup(props, { emit }) {
    const targetPeriodFilter = ref(null)
    const officeFilter = ref(null)
    const showGenerateModal = ref(false)
    const showUnitWorkPlanModal = ref(false)
    const generateOPCRRef = ref(null)

    const getCurrentPeriod = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // 1-12

      // Determine which half of the year we're in
      const period = currentMonth <= 6
        ? `January - June ${currentYear}`
        : `July - December ${currentYear}`

      return period
    }

    const getLatestTargetPeriod = () => {
      if (props.rows.length === 0) return null

      const currentPeriod = getCurrentPeriod()
      const availablePeriods = props.rows.map(row => row.targetPeriod)

      // First try to find the current period
      if (availablePeriods.includes(currentPeriod)) {
        return currentPeriod
      }

      // If current period not available, find the closest one
      const periodsWithDates = props.rows.map(row => {
        const period = row.targetPeriod
        const [monthRange, year] = period.split(' ')
        const [startMonth] = monthRange.split(' - ')
        const monthIndex = new Date(`${startMonth} 1, ${year}`).getMonth()
        return {
          period,
          date: new Date(year, monthIndex)
        }
      })

      periodsWithDates.sort((a, b) => b.date - a.date)
      return periodsWithDates[0].period
    }

    // Set default target period when component mounts
    onMounted(() => {
      if (props.showTargetPeriodFilter) {
        targetPeriodFilter.value = getCurrentPeriod()
      }
    })

    const allColumns = [
      { name: "division", label: "Division", field: "division", align: "left", showIf: function () { return !this.hideDivisionColumn; } },
      { name: "office", label: "Office", field: "office", align: "left", showIf: function () { return this.showOfficeColumn; } },
      { name: "targetPeriod", label: "Target Period", field: "targetPeriod", align: "left" },
      { name: "dateCreated", label: "Date Created", field: "dateCreated", align: "left" },
      { name: "status", label: "Status", field: "status", align: "left", showIf: function () { return this.isUnitWorkPlanPage; } }
    ]

    const visibleColumns = computed(() => {
      return allColumns.filter(col => {
        if (typeof col.showIf === 'function') {
          return col.showIf.call(props)
        }
        if (typeof col.showIf === 'boolean') {
          return col.showIf
        }
        return true
      })
    })

    const targetPeriodOptions = computed(() => {
      const uniquePeriods = [...new Set(props.rows.map(row => row.targetPeriod))]
      return uniquePeriods.map(period => ({
        label: period,
        value: period
      }))
    })

    const officeOptions = computed(() => {
      const uniqueOffices = [...new Set(props.rows.map(row => row.office))]
      return uniqueOffices.map(office => ({
        label: office,
        value: office
      }))
    })

    const filteredRows = computed(() => {
      return props.rows.filter(row => {
        const matchesPeriod = !targetPeriodFilter.value || row.targetPeriod === targetPeriodFilter.value
        const matchesOffice = !officeFilter.value || row.office === officeFilter.value
        return matchesPeriod && matchesOffice
      })
    })

    const displayRows = computed(() => {
      return targetPeriodFilter.value ? filteredRows.value : []
    })

    const getFilterColumnClass = computed(() => {
      if (!props.showTargetPeriodFilter && !props.showOfficeFilter) return ''
      return 'col-md-4'
    })

    const filterColumnWidth = computed(() => {
      return 'col-md-12'
    })

    const onRowClick = (evt, row) => {
      emit('row-click', row)
    }

    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'approved': return 'green'
        case 'pending': return 'orange'
        case 'draft': return 'blue'
        default: return 'grey-2'
      }
    }

    const getStatusTextColor = (status) => {
      switch (status.toLowerCase()) {
        case 'approved': return 'white'
        case 'pending': return 'white'
        case 'draft': return 'white'
        default: return 'grey-10'
      }
    }

    const getStatusIcon = (status) => {
      switch (status.toLowerCase()) {
        case 'approved': return 'check_circle'
        case 'pending': return 'schedule'
        case 'draft': return 'drafts'
        default: return 'info'
      }
    }

    const handleGenerateOPCR = (formData) => {
      emit('update-status', targetPeriodFilter.value, 'Pending')
      emit('generate-opcr', formData)
    }

    return {
      targetPeriodFilter,
      officeFilter,
      showGenerateModal,
      showUnitWorkPlanModal,
      generateOPCRRef,
      visibleColumns,
      targetPeriodOptions,
      officeOptions,
      filteredRows,
      displayRows,
      getFilterColumnClass,
      filterColumnWidth,
      onRowClick,
      getStatusColor,
      getStatusTextColor,
      getStatusIcon,
      handleGenerateOPCR,
      getLatestTargetPeriod
    }
  }
}
</script>

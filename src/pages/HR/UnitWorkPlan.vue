<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-sm">
      <div>
        <h6 class="text-h6 q-mb-xs">HR Unit Work Plan</h6>
      </div>
      <div class="row q-gutter-md">
        <!-- <q-btn v-if="selectedOffice && selectedTargetPeriod" elevated rounded color="primary"
          label="Preview Unit Work Plan" icon="print" @click="showUnitWorkPlanModal = true">
          <q-tooltip>Preview Unit Work Plan</q-tooltip>
        </q-btn> -->
      </div>
    </div>

    <!-- Office and Target Period Selection -->
    <div class="q-gutter-sm row items-stretch q-mb-md" v-if="!selectedDivision">
      <div class="col-12 col-sm-6 col-md-4">
        <q-select v-model="selectedOffice" :options="filteredOfficeOptions" label="Select Office" outlined dense
          clearable emit-value map-options use-input input-debounce="300" @filter="filterOffices"
          @update:model-value="onOfficeChange" :loading="store.loading">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No offices found</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-6 col-md-4" v-if="selectedOffice">
        <q-select v-model="selectedTargetPeriod" :options="formattedTargetPeriodOptions" label="Select Target Period"
          outlined dense clearable emit-value map-options @update:model-value="onTargetPeriodChange"
          :loading="store.loading">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ formatCreatedDate(scope.opt.created_at) }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <!-- Loading Indicator -->
    <div v-if="store.loading" class="row justify-center q-mt-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- No Office Selected Message -->
    <div v-if="!selectedOffice && !selectedDivision" class="row flex-center q-mt-xl q-mb-xl" style="height: 40vh;">
      <div class="text-h6 text-grey-7 text-center">
        Please select an office to proceed.
      </div>
    </div>

    <!-- Main Table -->
    <div v-if="selectedOffice && !selectedDivision">
      <q-table :rows="filteredRows" :columns="columns" row-key="id" @row-click="onDivisionClick"
        :loading="store.loading" :filter="search">
        <template v-slot:top>
          <div class="col-12 col-md-6 q-pr-sm">
            <q-input v-model="search" outlined dense placeholder="Search divisions" clearable>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6 flex justify-end">
            <q-btn v-if="selectedOffice && selectedTargetPeriod" elevated rounded color="primary"
              label="Preview Unit Work Plan" icon="print" @click="showUnitWorkPlanModal = true">
              <q-tooltip>Preview Unit Work Plan</q-tooltip>
            </q-btn>
          </div>

        </template>

        <template v-slot:header>
          <q-tr>
            <q-th v-for="col in columns" :key="col.name" style="background-color: #EBEBEB; text-align: left;">
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
            No divisions found
          </div>
        </template>
      </q-table>
    </div>

    <!-- Division Detail -->
    <div v-if="selectedDivision && selectedOffice" class="division-employee-container">
      <employee :division="selectedDivision" :target-period="selectedTargetPeriod || ''" :office-id="selectedOffice"
        @back="handleBack" />
    </div>

    <!-- Unit Work Plan Report Modal -->
    <q-dialog v-model="showUnitWorkPlanModal" full-width>
      <generateReport :targetPeriod="selectedTargetPeriod" :officeId="selectedOffice"
        @close="showUnitWorkPlanModal = false" />
    </q-dialog>
  </q-page>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useHRUnitWorkPlanStore } from 'src/stores/hr/hrUnitWorkPlanStore'
import employee from 'src/components/hr/employee.vue'
import generateReport from 'src/components/hr/generateReport.vue'

const store = useHRUnitWorkPlanStore()
const selectedOffice = ref(null)
const selectedDivision = ref(null)
const selectedTargetPeriod = ref(null)
const search = ref('')
const rows = ref([])
const officeSearch = ref('')
const showUnitWorkPlanModal = ref(false)

const columns = [
  { name: 'division', label: 'Division', field: 'division', align: 'left', sortable: true },
  {
    name: 'targetPeriod',
    label: 'Target Period',
    field: row => row.full_period,
    align: 'left',
    sortable: true
  },
  {
    name: 'dateCreated',
    label: 'Date Created',
    field: 'created_at',
    align: 'left',
    sortable: true,
    format: val => formatCreatedDate(val)
  },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true }
]

// Fetch offices on component mount
onMounted(async () => {
  await store.fetchOffices()
})

// Watch for office changes
watch(selectedOffice, async (newVal) => {
  if (newVal && selectedTargetPeriod.value) {
    rows.value = await store.fetchDivisionsWithWorkPlans(newVal, selectedTargetPeriod.value)
  } else {
    rows.value = []
    selectedDivision.value = null
  }
})

// Watch for target period changes
watch(selectedTargetPeriod, async (newVal) => {
  if (selectedOffice.value) {
    rows.value = await store.fetchDivisionsWithWorkPlans(selectedOffice.value, newVal)
  }
})

const formattedTargetPeriodOptions = computed(() => {
  return targetPeriodOptions.value.map(option => ({
    ...option,
    label: formatTargetPeriod(option.value)
  }))
})

const formatTargetPeriod = (period) => {
  if (!period) return '';
  return period;
}

const filteredRows = computed(() => {
  let filtered = [...rows.value];

  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(row =>
      row.division.toLowerCase().includes(searchTerm) ||
      row.full_period.toLowerCase().includes(searchTerm) ||
      row.status.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedTargetPeriod.value) {
    filtered = filtered.filter(row =>
      row.full_period === selectedTargetPeriod.value
    );
  }

  return filtered;
});

const formatCreatedDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const filteredOfficeOptions = computed(() => {
  if (!officeSearch.value) return store.officeOptions
  const searchTerm = officeSearch.value.toLowerCase()
  return store.officeOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm)
  )
})

const filterOffices = async (val, update) => {
  officeSearch.value = val
  await store.fetchOffices(val)
  update()
}

const targetPeriodOptions = computed(() => {
  const uniquePeriods = [...new Set(rows.value.map(row => row.full_period))];
  return uniquePeriods.sort((a, b) => {
    const aYear = parseInt(a.split(' ').pop());
    const bYear = parseInt(b.split(' ').pop());
    if (aYear !== bYear) return bYear - aYear;
    return a.includes('January') ? -1 : 1;
  }).map(period => ({
    label: period,
    value: period
  }));
});

const onOfficeChange = () => {
  selectedDivision.value = null
  selectedTargetPeriod.value = 'January - June 2025'
}




const onTargetPeriodChange = () => {
  // Additional logic if needed when target period changes
}

const onDivisionClick = (evt, row) => {
  selectedDivision.value = row.division
  // Use full_period instead of targetPeriod if that's what contains the complete period string
  selectedTargetPeriod.value = row.full_period || row.targetPeriod
}

const handleBack = () => {
  selectedDivision.value = null
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
</script>

<style scoped>
.division-employee-container {
  position: relative;
}
</style>

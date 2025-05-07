<template>
  <q-page padding>
    <!-- Header with Target Period -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h6 class="text-h6 q-mb-xs text-green text-weight-bold">Performance Dashboard</h6>
        <div class="text-subtitle3 text-grey-8">
          Current Target Period: <strong>{{ currentTargetPeriod }}</strong>
        </div>
      </div>
    </div>

    <!-- filepath: c:\xampp\htdocs\PMS-2025\Performance-Management-System\src\pages\Office\OfficeDashboard.vue -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Employee Card -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height clickable-card" @click="$router.push('/office/employee')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="people" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">Total Employees</div>
                <div class="text-h6 text-weight-bold">435</div>
              </div>
            </div>
            <div class="q-mt-md">
              <div class="row justify-between q-mb-xs">
                <span class="text-caption">Office: <strong>125</strong></span>
                <span class="text-caption">Division: <strong>150</strong></span>
              </div>
              <q-linear-progress size="xs" :value="125 / 435" color="blue" class="q-mb-sm" />
              <div class="row justify-between q-mb-xs">
                <span class="text-caption">Section: <strong>85</strong></span>
                <span class="text-caption">Unit: <strong>75</strong></span>
              </div>
              <q-linear-progress size="xs" :value="85 / 435" color="teal" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- OPCR Card -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height clickable-card" @click="$router.push('/office/opcr')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="assessment" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">OPCR Status</div>
                <div class="text-h6 text-weight-bold q-mb-sm">25</div>
              </div>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="15 / 25" color="positive" />
              <span class="text-caption">Approved: <strong class="text-positive">15</strong></span>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="5 / 25" color="warning" />
              <span class="text-caption">Pending: <strong class="text-warning">5</strong></span>
            </div>
            <div>
              <q-linear-progress size="xs" :value="5 / 25" color="grey" />
              <span class="text-caption">Draft: <strong class="text-grey">5</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- IPCR Card -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height clickable-card" @click="$router.push('/office/ipcr')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="assignment_ind" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">IPCR Status</div>
                <div class="text-h6 text-weight-bold q-mb-sm">25</div>
              </div>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="12 / 25" color="positive" />
              <span class="text-caption">Approved: <strong class="text-positive">12</strong></span>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="8 / 25" color="warning" />
              <span class="text-caption">Pending: <strong class="text-warning">8</strong></span>
            </div>
            <div>
              <q-linear-progress size="xs" :value="5 / 25" color="grey" />
              <span class="text-caption">Draft: <strong class="text-grey">5</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Unit Work Plan Card -->
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height clickable-card" @click="$router.push('/office/unit-work-plan')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="domain" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">Unit Work Plan</div>
                <div class="text-h6 text-weight-bold q-mb-sm">10</div>
              </div>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="6 / 10" color="positive" />
              <span class="text-caption">Approved: <strong class="text-positive">6</strong></span>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="3 / 10" color="warning" />
              <span class="text-caption">Pending: <strong class="text-warning">3</strong></span>
            </div>
            <div>
              <q-linear-progress size="xs" :value="1 / 10" color="grey" />
              <span class="text-caption">Draft: <strong class="text-grey">1</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Employee Distribution Doughnut Chart -->
      <!-- <div class="col-xs-12 col-sm-6">
        <q-card class="bg-white shadow-3 chart-card">
          <q-card-section class="q-pa-md">
            <div class="text-h6 chart-title">Employee Distribution</div>
            <div class="chart-container" style="position: relative; height: 300px;">
              <Doughnut :data="employeeDistributionData" :options="employeeChartOptions" />
            </div>
            <div class="row q-mt-md q-gutter-sm justify-center">
              <q-badge color="blue" class="q-pa-xs">Office: 125</q-badge>
              <q-badge color="teal" class="q-pa-xs">Division: 150</q-badge>
              <q-badge color="orange" class="q-pa-xs">Section: 85</q-badge>
              <q-badge color="purple" class="q-pa-xs">Unit: 75</q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div> -->

      <!-- Performance Status Doughnut Chart with Enhanced Toggle -->
      <!-- <div class="col-xs-12 col-sm-6">
        <q-card class="bg-white shadow-3 chart-card">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between chart-title">
              <div class="text-h6">Performance Status</div>
              <div class="chart-tabs">
                <q-tabs v-model="selectedStatusChart" class="text-primary" active-color="primary"
                  indicator-color="primary" narrow-indicator dense>
                  <q-tab name="opcr" label="OPCR" icon="assessment" />
                  <q-tab name="ipcr" label="IPCR" icon="assignment_ind" />
                  <q-tab name="workplan" label="UWP" icon="domain" />
                </q-tabs>
              </div>
            </div>
            <div class="chart-container" style="position: relative; height: 300px;">
              <Doughnut :data="getSelectedChartData" :options="chartOptionsWithCenterText" />
            </div>

            <q-tab-panels v-model="selectedStatusChart" animated class="bg-transparent q-mt-md">
              <q-tab-panel name="opcr" class="q-pa-none">
                <div class="row q-gutter-sm justify-center">
                  <q-badge color="positive" class="q-pa-xs">Approved: 15</q-badge>
                  <q-badge color="warning" class="q-pa-xs">Pending: 5</q-badge>
                  <q-badge color="grey" class="q-pa-xs">Draft: 5</q-badge>
                </div>
              </q-tab-panel>

              <q-tab-panel name="ipcr" class="q-pa-none">
                <div class="row q-gutter-sm justify-center">
                  <q-badge color="positive" class="q-pa-xs">Approved: 12</q-badge>
                  <q-badge color="warning" class="q-pa-xs">Pending: 8</q-badge>
                  <q-badge color="grey" class="q-pa-xs">Draft: 5</q-badge>
                </div>
              </q-tab-panel>

              <q-tab-panel name="workplan" class="q-pa-none">
                <div class="row q-gutter-sm justify-center">
                  <q-badge color="positive" class="q-pa-xs">Approved: 6</q-badge>
                  <q-badge color="warning" class="q-pa-xs">Pending: 3</q-badge>
                  <q-badge color="grey" class="q-pa-xs">Draft: 1</q-badge>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div> -->
    </div>

    <!-- Activity Logs Section -->
    <q-card class="bg-white shadow-3">
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-md">Activity Logs</div>
        <q-table :rows="activityLogs" :columns="activityColumns" row-key="id" flat bordered
          :pagination="{ rowsPerPage: 5 }" class="dashboard-table">
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// eslint-disable-next-line no-unused-vars
import { Doughnut } from 'vue-chartjs';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Current target period calculation
const currentTargetPeriod = computed(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month >= 0 && month <= 5) {
    return `January - June ${year}`;
  } else {
    return `July - December ${year}`;
  }
});

// Status chart toggle
const selectedStatusChart = ref('opcr');

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      display: false // We'll use custom badges instead
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || '';
          let value = context.raw || 0;
          let total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
          let percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

// For employee distribution chart with center text
// eslint-disable-next-line no-unused-vars
const employeeChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    // Add custom plugin for center text
    centerText: {
      display: true,
      text: 'Employees',
      total: 435
    }
  }
};

// Chart options with centerText plugin
// eslint-disable-next-line no-unused-vars
const chartOptionsWithCenterText = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    // Add custom plugin for center text
    centerText: {
      display: true,
      text: computed(() => {
        switch (selectedStatusChart.value) {
          case 'opcr':
            return 'OPCR';
          case 'ipcr':
            return 'IPCR';
          case 'workplan':
            return 'UWP';
          default:
            return '';
        }
      }),
      getTotal: computed(() => {
        switch (selectedStatusChart.value) {
          case 'opcr':
            return 25;
          case 'ipcr':
            return 25;
          case 'workplan':
            return 10;
          default:
            return 0;
        }
      })
    }
  }
};

// Plugin for center text in doughnut chart
ChartJS.register({
  id: 'centerText',
  beforeDraw: function (chart) {
    if (chart.config.options.plugins.centerText
      && chart.config.options.plugins.centerText.display) {

      const ctx = chart.ctx;
      const centerConfig = chart.config.options.plugins.centerText;

      // Get the text to display
      const txt = centerConfig.text.value || centerConfig.text;

      // Get total from computed property or direct value
      const total = centerConfig.getTotal ?
        (centerConfig.getTotal.value || centerConfig.getTotal) :
        (centerConfig.total || chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0));

      // Set text properties
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Position and render text
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      // Background circle
      ctx.fillStyle = '#f5f5f5';
      const radius = Math.min(chart.chartArea.right - chart.chartArea.left, chart.chartArea.bottom - chart.chartArea.top) / 2.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Text
      ctx.fillStyle = '#1976D2';
      ctx.font = '16px Arial';
      ctx.fillText(txt, centerX, centerY - 10);

      // Add total text below
      ctx.fillStyle = '#555';
      ctx.font = '14px Arial';
      ctx.fillText(`Total: ${total}`, centerX, centerY + 15);
    }
  }
});

// Employee Distribution Data
// eslint-disable-next-line no-unused-vars
const employeeDistributionData = {
  labels: ['Office', 'Division', 'Section', 'Unit'],
  datasets: [
    {
      backgroundColor: ['#1976D2', '#26A69A', '#FF9800', '#9C27B0'],
      data: [125, 150, 85, 75],
      borderWidth: 0
    }
  ]
};

// OPCR Status Data
const opcrStatusData = {
  labels: ['Approved', 'Pending', 'Draft'],
  datasets: [
    {
      backgroundColor: ['#4CAF50', '#FFC107', '#9E9E9E'],
      data: [15, 5, 5],
      borderWidth: 0
    }
  ]
};

// IPCR Status Data - Modified to replace "Incomplete" with "Pending"
const ipcrStatusData = {
  labels: ['Approved', 'Pending', 'Draft'],
  datasets: [
    {
      backgroundColor: ['#4CAF50', '#FFC107', '#9E9E9E'],
      data: [12, 8, 5],
      borderWidth: 0
    }
  ]
};

// Work Plan Status Data
const workPlanStatusData = {
  labels: ['Approved', 'Pending', 'Draft'],
  datasets: [
    {
      backgroundColor: ['#4CAF50', '#FFC107', '#9E9E9E'],
      data: [6, 3, 1], // Updated values
      borderWidth: 0
    }
  ]
};

// Get selected chart data based on toggle
// eslint-disable-next-line no-unused-vars
const getSelectedChartData = computed(() => {
  switch (selectedStatusChart.value) {
    case 'opcr':
      return opcrStatusData;
    case 'ipcr':
      return ipcrStatusData;
    case 'workplan':
      return workPlanStatusData;
    default:
      return opcrStatusData;
  }
});

// Activity Logs Data
const activityLogs = ref([
  {
    id: 1,
    date: '2023-05-15 09:30',
    action: 'OPCR Submission',
    username: 'john.doe',
  },
  {
    id: 2,
    date: '2023-05-14 15:45',
    action: 'IPCR Review',
    username: 'maria.santos',
  },
  {
    id: 3,
    date: '2023-05-14 11:20',
    action: 'Work Plan Update',
    username: 'robert.cruz',
  },
  {
    id: 4,
    date: '2023-05-13 14:10',
    action: 'Performance Rating',
    username: 'susan.reyes',
  },
  {
    id: 5,
    date: '2023-05-12 09:15',
    action: 'OPCR Draft Saved',
    username: 'mark.johnson',
  },
  {
    id: 6,
    date: '2023-05-12 08:30',
    action: 'IPCR Submission',
    username: 'james.wilson',
  }
]);

const activityColumns = [
  { name: 'date', label: 'Date & Time', field: 'date', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'left', sortable: true },
  { name: 'username', label: 'Username', field: 'username', align: 'left', sortable: true }
];
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.q-page {
  min-height: 100vh;
  width: 100%;
}

.q-card {
  border-radius: 8px;
}

.text-h4 {
  letter-spacing: -0.5px;
}

/* Card and table alignment */
.full-height {
  height: 100%;
}

.dashboard-table {
  border-radius: 8px;
  overflow: hidden;
}

/* Consistent spacing */
.q-mb-lg {
  margin-bottom: 24px;
}

.q-mb-sm {
  margin-bottom: 8px;
}

/* Table styling */
:deep(.q-table th) {
  font-weight: 600;
  background-color: #f5f5f5;
}

:deep(.q-table__container) {
  border-radius: 8px;
}

/* Chart cards styling for consistent size */
.chart-card {
  height: 470px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  height: 40px;
  margin-bottom: 16px;
}

/* Chart container */
.chart-container {
  width: 100%;
}

/* Badge styling */
.q-badge {
  font-size: 12px;
}

/* Tabs styling */
.chart-tabs {
  border-radius: 4px;
  overflow: hidden;
}

.chart-tabs :deep(.q-tabs__content) {
  border-radius: 4px;
}

.chart-tabs :deep(.q-tab) {
  padding: 2px 12px;
  min-height: 36px;
}

.chart-tabs :deep(.q-tab__icon) {
  font-size: 18px;
  margin-right: 4px;
}
</style>

<template>
  <q-page class="q-pa-md bg-grey-1 full-width">
    <!-- Header with Target Period -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold text-primary">Performance Dashboard</div>
        <div class="text-subtitle1 text-grey-8">
          Current Target Period: <strong>{{ currentTargetPeriod }}</strong>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <q-icon name="people" color="primary" size="md" class="q-mr-sm" />
              <div>
                <div class="text-subtitle2 text-grey-7">Total Employees</div>
                <div class="text-h6 text-weight-bold">435</div>
              </div>
            </div>
            <q-linear-progress size="xs" :value="1" color="positive" class="q-mt-md" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">OPCR Status</div>
            <div class="text-h6 text-weight-bold q-mb-sm">25</div>
            <q-linear-progress size="xs" :value="15 / 25" color="positive" />
            <div class="row justify-between q-mt-sm">
              <span class="text-caption">Approved: <strong class="text-positive">15</strong></span>
              <span class="text-caption">Pending: <strong class="text-warning">10</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">IPCR Status</div>
            <div class="text-h6 text-weight-bold q-mb-sm">25</div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="12 / 25" color="positive" />
              <span class="text-caption">Approved: <strong class="text-positive">12</strong></span>
            </div>
            <div class="q-mb-sm">
              <q-linear-progress size="xs" :value="5 / 25" color="grey" />
              <span class="text-caption">Not Reviewed: <strong class="text-grey">5</strong></span>
            </div>
            <div>
              <q-linear-progress size="xs" :value="8 / 25" color="negative" />
              <span class="text-caption">Incomplete: <strong class="text-negative">8</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-card class="bg-white shadow-3 full-height">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-grey-7">Unit Work Plan</div>
            <div class="text-h6 text-weight-bold q-mb-sm">10</div>
            <q-linear-progress size="xs" :value="6 / 10" color="positive" />
            <div class="row justify-between q-mt-sm">
              <span class="text-caption">Approved: <strong class="text-positive">6</strong></span>
              <span class="text-caption">Pending: <strong class="text-warning">4</strong></span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Deadline Tracking + Notifications Row -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Deadline Tracking Card -->
      <div class="col-md-6">
        <q-card class="bg-white shadow-3">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-sm">Upcoming Deadlines</div>
            <q-list bordered separator>
              <q-item v-for="deadline in deadlines" :key="deadline.id" class="q-py-sm">
                <q-item-section avatar>
                  <q-icon :name="deadline.icon" :color="getDeadlineColor(deadline.daysLeft)" size="sm" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ deadline.task }}</q-item-label>
                  <q-item-label caption class="text-grey-7">
                    Due: {{ deadline.date }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-badge :color="getDeadlineColor(deadline.daysLeft)" class="q-pa-xs">
                    {{ deadline.daysLeft }} day{{ deadline.daysLeft !== 1 ? 's' : '' }} left
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-mt-md">
              <q-linear-progress :value="deadlineProgress"
                :color="deadlineProgress > 0.7 ? 'green' : deadlineProgress > 0.3 ? 'orange' : 'red'" size="xs" />
              <div class="text-caption text-right q-mt-xs">
                {{ completedDeadlines }} of {{ totalDeadlines }} completed
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Notifications Card -->
      <div class="col-md-6">
        <q-card class="bg-white shadow-3">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="text-h6">Notifications</div>
              <q-badge color="red" floating>{{ unreadNotifications }}</q-badge>
              <q-space />
              <q-btn flat dense round icon="more_vert">
                <q-menu>
                  <q-list dense style="min-width: 150px">
                    <q-item clickable v-close-popup>
                      <q-item-section>Mark all as read</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section>Notification settings</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <q-list bordered separator class="q-mt-sm">
              <q-item v-for="notif in notifications" :key="notif.id" :class="{ 'bg-blue-1': !notif.read }" clickable
                class="q-py-sm">
                <q-item-section avatar>
                  <q-icon :name="notif.icon" :color="notif.type === 'alert' ? 'red' : 'primary'" size="sm" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ notif.title }}</q-item-label>
                  <q-item-label caption lines="1">{{ notif.message }}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{ formatTime(notif.time) }}</q-item-label>
                  <q-icon v-if="!notif.read" name="fiber_manual_record" color="primary" size="xs" class="q-mt-xs" />
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-center q-mt-sm">
              <q-btn flat label="View All" color="primary" size="sm" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Activity Logs Section -->
    <q-card class="bg-white shadow-3">
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-md">Activity Logs</div>
        <q-table :rows="activityLogs" :columns="activityColumns" row-key="id" flat bordered
          :pagination="{ rowsPerPage: 5 }" class="dashboard-table">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.value)" class="q-pa-xs">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

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

// Deadline Tracking Data
const deadlines = ref([
  {
    id: 1,
    task: "OPCR Q2 Submissions",
    date: "June 30, 2025",
    daysLeft: 12,
    icon: "assignment"
  },
  {
    id: 2,
    task: "IPCR Mid-Year Reviews",
    date: "July 15, 2025",
    daysLeft: 27,
    icon: "rate_review"
  },
  {
    id: 3,
    task: "Annual Performance Evaluation",
    date: "December 5, 2025",
    daysLeft: 185,
    icon: "assessment"
  }
]);

const totalDeadlines = computed(() => deadlines.value.length);
const completedDeadlines = ref(1);
const deadlineProgress = computed(() => completedDeadlines.value / totalDeadlines.value);

const getDeadlineColor = (days) => {
  if (days <= 7) return 'red';
  if (days <= 14) return 'orange';
  return 'green';
};

// Notifications Data
const notifications = ref([
  {
    id: 1,
    title: "OPCR Approval Required",
    message: "3 submissions from HR Division need review",
    type: "alert",
    icon: "assignment_turned_in",
    time: new Date("2025-05-20T09:30:00"),
    read: false
  },
  {
    id: 2,
    title: "System Update Available",
    message: "New dashboard features added",
    type: "info",
    icon: "update",
    time: new Date("2025-05-19T14:15:00"),
    read: true
  },
  {
    id: 3,
    title: "New Employee Onboarded",
    message: "John Doe joined IT Department",
    type: "info",
    icon: "person_add",
    time: new Date("2025-05-18T11:20:00"),
    read: false
  }
]);

const unreadNotifications = computed(() =>
  notifications.value.filter(n => !n.read).length
);

const formatTime = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Activity Logs Data
const activityLogs = ref([
  {
    id: 1,
    date: '2023-05-15 09:30',
    action: 'OPCR Submission',
    office: 'HR Division',
    status: 'Approved',
    remarks: 'Approved by Director'
  },
  // ... (rest of your existing activity logs)
]);

const activityColumns = [
  { name: 'date', label: 'Date & Time', field: 'date', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'left', sortable: true },
  { name: 'office', label: 'Office', field: 'office', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'remarks', label: 'Remarks', field: 'remarks', align: 'left' }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'positive';
    case 'Completed': return 'positive';
    case 'Pending': return 'warning';
    case 'Rejected': return 'negative';
    default: return 'grey';
  }
};
</script>

<style scoped>
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

/* Notification unread highlight */
.bg-blue-1 {
  background-color: #e3f2fd;
}
</style>

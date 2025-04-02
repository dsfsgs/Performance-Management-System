<template>
  <q-page>
    <!-- Welcome Section -->
    <div class="office-dashboard">
      <h1>Welcome to {{ userStore.officeName }}</h1>
      <p>Your Office ID: {{ userStore.user?.office_id }}</p>

      <!-- Categories Section with Buttons -->
      <div class="categories-container">
        <q-btn v-for="category in userStore.categories" :key="category.id" class="category-btn" color="green-8"
          text-color="white">
          {{ category.name }}
        </q-btn>
      </div>

      <!-- MFOs Section -->
      <div class="mfo-section" v-if="Object.keys(userStore.groupedMfos).length">
        <q-list bordered>
          <template v-for="(mfos, categoryName) in userStore.groupedMfos" :key="categoryName">
            <!-- Category Header -->
            <q-item class="category-header">
              <q-item-section>
                <q-item-label class="category-title">{{ categoryName }}</q-item-label>
              </q-item-section>
            </q-item>

            <!-- MFOs under this category -->
            <q-item v-for="mfo in mfos" :key="mfo.id" class="mfo-item">
              <q-item-section>
                <q-item-label>MFO: {{ mfo.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>

      <div v-else>
        <p>No MFOs available for your office.</p>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useUserStore } from 'src/stores/userStore';
import { onMounted } from 'vue';

export default {
  name: 'OfficeDashboard',
  setup() {
    const userStore = useUserStore();

    onMounted(() => {
      userStore.loadUserData();
    });

    const openMfoModal = () => {
      console.log('Open MFO Modal');
    };

    const openOutputModal = () => {
      console.log('Open Output Modal');
    };

    return {
      userStore,
      openMfoModal,
      openOutputModal
    };
  }
};
</script>

<style scoped>
.office-dashboard {
  padding: 20px;
}

.categories-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.category-btn {
  padding: 10px 20px;
  font-weight: bold;
}

.mfo-section {
  margin-top: 20px;
}

.mfo-item {
  border-bottom: 1px solid #e0e0e0;
  padding-left: 24px;
  /* Indent MFOs under category */
}

.category-header {
  background-color: #f5f5f5;
}

.category-title {
  font-weight: bold;
  font-size: 1.1em;
}

/* Table Styling */
.mfo-table {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.header-cell {
  background: #4caf50;
  color: white;
  font-weight: bold;
  padding: 12px;
  text-align: center;
  font-size: 1.2em;
}

.header-row {
  border-bottom: 2px solid #ddd;
}

.q-card-section {
  display: flex;
  align-items: center;
}

.col-4 {
  min-height: 50px;
  font-size: 1.1em;
  padding: 15px;
  border-right: 1px solid #ddd;
}

.col-4:last-child {
  border-right: none;
}
</style>

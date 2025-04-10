<template>
  <q-page padding>
    <!-- Welcome Section -->
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">Welcome to {{ userStore.officeName }}</h6>
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

    return {
      userStore,

    };
  }
};
</script>

<style scoped></style>

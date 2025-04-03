<template>
  <q-page>
    <!-- Welcome Section -->
    <div class="office-dashboard">
      <h1>Welcome to {{ userStore.officeName }}</h1>
      <!-- <p>Your Office ID: {{ userStore.user?.office_id }}</p> -->


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

<style scoped>

</style>

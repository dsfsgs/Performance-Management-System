<template>
  <div class="account-container">
    <!-- Employee Details Card -->
    <q-card class="details-card elevated-card">
      <q-card-section>
        <div class="card-header">
          <h2 class="card-title">Employee Details</h2>
          <q-icon name="person" class="card-icon" />
        </div>

        <div class="details-grid q-mt-md">
          <div class="details-column">
            <div class="detail-item">
              <strong class="detail-label">Employee Name</strong>
              <p class="detail-value">{{ userStore.user?.name || "N/A" }}</p>
            </div>
            <div class="detail-item">
              <strong class="detail-label">Position</strong>
              <p class="detail-value">{{ userStore.user?.designation || "N/A" }}</p>
            </div>
          </div>
          <div class="details-column">
            <div class="detail-item">
              <strong class="detail-label">Office</strong>
              <p class="detail-value">{{ userStore.officeName }}</p>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Account Details Card -->
    <q-card class="details-card elevated-card">
      <q-card-section>
        <div class="card-header">
          <h2 class="card-title">Account Details</h2>
          <q-btn class="edit-btn" icon="edit" label="Edit" @click="isModalOpen = true" outline color="primary" />
        </div>

        <div class="details-grid q-mt-md">
          <div class="details-column">
            <div class="detail-item">
              <strong class="detail-label">Username</strong>
              <p class="detail-value">{{ userStore.user?.name }}</p>
            </div>
          </div>
          <div class="details-column">
            <div class="detail-item">
              <strong class="detail-label">Password</strong>
              <p class="detail-value">••••••••</p>
            </div>
          </div>
        </div>

        <div class="last-updated q-mt-md">
          <q-icon name="schedule" size="sm" />
          <span>Last updated: {{ lastUpdated }}</span>
        </div>
      </q-card-section>
    </q-card>

    <!-- Edit Modal -->
    <q-dialog v-model="isModalOpen">
      <q-card class="edit-modal">
        <q-card-section class="modal-header">
          <div class="text-h6">Edit Account</div>
        </q-card-section>

        <q-card-section class="modal-body">
          <q-input v-model="formData.username" label="Username" outlined dense class="q-mb-md" />
          <q-input v-model="formData.password" label="New Password" type="password" outlined dense />
          <p class="password-hint">Leave blank to keep current password</p>
        </q-card-section>

        <q-card-actions align="right" class="modal-footer">
          <q-btn flat label="Cancel" v-close-popup class="q-mr-sm" />
          <q-btn color="primary" label="Save Changes" @click="saveChanges" :loading="isSaving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/userStore";

export default {
  name: "UserAccount",

  setup() {
    const $q = useQuasar();
    const isModalOpen = ref(false);
    const isSaving = ref(false);
    const userStore = useUserStore();

    const formData = ref({
      username: userStore.user?.username || "",
      password: "",
    });

    const lastUpdated = ref(new Date().toLocaleString());

    onMounted(() => {
      userStore.loadUserData();
    });

    const saveChanges = async () => {
      isSaving.value = true;
      try {
        await userStore.updateUserCredentials(formData.value);
        lastUpdated.value = new Date().toLocaleString();
        $q.notify({
          type: "positive",
          message: "Account details updated successfully!",
          position: "top",
          timeout: 2000
        });
        isModalOpen.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error.message || "Failed to update account!",
          position: "top",
          timeout: 2000
        });
      } finally {
        isSaving.value = false;
      }
    };

    return {
      isModalOpen,
      isSaving,
      userStore,
      formData,
      lastUpdated,
      saveChanges,
    };
  },
};
</script>

<style scoped>
.account-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.elevated-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  margin-bottom: 24px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.card-icon {
  font-size: 1.5rem;
  color: #666;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  margin: 0;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.last-updated {
  font-size: 0.75rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-btn {
  font-weight: 500;
}

.edit-modal {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
}

.modal-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.modal-body {
  padding-top: 16px;
  padding-bottom: 16px;
}

.modal-footer {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.password-hint {
  font-size: 0.75rem;
  color: #888;
  margin-top: 8px;
  margin-bottom: 0;
}
</style>

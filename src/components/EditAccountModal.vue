<template>
  <q-dialog :model-value="isOpen" @update:model-value="closeModal">
    <q-card class="edit-account-modal">
      <q-card-section class="modal-header">
        <div class="title">Edit Account Details</div>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="close-btn"
        />
      </q-card-section>

      <q-card-section class="modal-body">
        <q-input
          dense
          outlined
          v-model="tempUsername"
          label="Username"
          class="input-field"
          :rules="[val => !!val || 'Username is required']"
        />
        <q-input
          dense
          outlined
          v-model="password"
          type="password"
          label="New Password"
          class="input-field"
          hint="Leave blank to keep current password"
        />
        <q-input
          dense
          outlined
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          class="input-field"
          :rules="[
            val => !password || val === password || 'Passwords must match'
          ]"
        />
      </q-card-section>

      <q-card-actions align="right" class="modal-footer">
        <q-btn
          label="Cancel"
          color="grey"
          flat
          @click="cancelChanges"
          class="action-btn"
        />
        <q-btn
          label="Save Changes"
          color="primary"
          @click="saveChanges"
          class="action-btn"
          :disable="!tempUsername"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    username: String,
  },
  data() {
    return {
      tempUsername: this.username,
      password: "",
      confirmPassword: "",
    };
  },
  watch: {
    username(newVal) {
      this.tempUsername = newVal;
    },
    isOpen(newVal) {
      if (newVal) {
        this.storeOriginalData();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:isOpen", false);
    },
    saveChanges() {
      if (this.password && this.password !== this.confirmPassword) {
        this.$q.notify({
          type: "negative",
          message: "Passwords do not match!",
          position: "top"
        });
        return;
      }

      this.$emit("save", {
        username: this.tempUsername,
        password: this.password || null,
      });

      this.closeModal();
    },
    cancelChanges() {
      this.resetForm();
      this.closeModal();
    },
    storeOriginalData() {
      this.tempUsername = this.username;
      this.password = "";
      this.confirmPassword = "";
    },
    resetForm() {
      this.tempUsername = this.username;
      this.password = "";
      this.confirmPassword = "";
    },
  },
};
</script>

<style scoped>
.edit-account-modal {
  width: 420px;
  max-width: 95vw;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  color: #95a5a6;
}

.close-btn:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
  max-height: 65vh;
  overflow-y: auto;
}

.input-field {
  margin-bottom: 16px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.action-btn {
  padding: 8px 16px;
  font-weight: 500;
  min-width: 100px;
}

@media (max-width: 600px) {
  .edit-account-modal {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }

  .modal-body {
    padding: 16px;
    max-height: 60vh;
  }

  .modal-header,
  .modal-footer {
    padding: 12px 16px;
  }
}
</style>

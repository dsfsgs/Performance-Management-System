<template>
  <q-dialog :model-value="isOpen" @update:model-value="closeModal">
    <q-card class="edit-account-modal">
      <q-card-section class="modal-header">
        <div class="title">Edit Account Details</div>
      </q-card-section>

      <q-card-section>
        <q-input dense filled v-model="tempUsername" label="Username" class="input-field" />
        <q-input dense filled v-model="password" type="password" label="Password" class="input-field" />
        <q-input dense filled v-model="confirmPassword" type="password" label="Confirm Password" class="input-field" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancel" color="grey" flat @click="cancelChanges" />
        <q-btn label="Save" color="green" @click="saveChanges" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    username: String, // Get username from parent component
  },
  data() {
    return {
      tempUsername: this.username,
      password: "",
      confirmPassword: "",
    };
  },
  watch: {
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
        this.$q.notify({ type: "negative", message: "Passwords do not match!" });
        return;
      }

      this.$emit("save", {
        username: this.tempUsername,
        password: this.password || null,
      });

      this.$q.notify({ type: "positive", message: "Account details saved successfully!" });
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
  width: 400px;
  max-width: 90vw;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.input-field {
  margin-bottom: 10px;
}
</style>

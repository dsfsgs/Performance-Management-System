<template>
  <div class="account-container">
    <div class="details-card">
      <h2>Employee Details</h2>
      <div class="details-grid">
        <div class="details-column">
          <strong>Employee Assign</strong>
          <p>Mahusay, Jograd M.</p>
          <strong>Position</strong>
          <p>IS Analysts III</p>
        </div>
        <div class="details-column">
          <strong>Office</strong>
          <p>CICTMO</p>
        </div>
      </div>
    </div>

    <div class="details-card">
      <div class="account-header">
        <h2>Account Details</h2>
        <button class="edit-btn" @click="openModal">Edit</button>
      </div>
      <div class="details-grid">
        <div class="details-column">
          <strong>Username</strong>
          <p>{{ account.username }}</p>
        </div>
        <div class="details-column">
          <strong>Password</strong>
          <p>********</p> <!-- Masked password for security -->
        </div>
      </div>
    </div>

    <ModalComponent v-model:isOpen="isModalOpen" :username="account.username" @save="handleSave" />
  </div>
</template>

<script>
import ModalComponent from "./EditAccountModal.vue";

export default {
  components: {
    ModalComponent,
  },
  data() {
    return {
      isModalOpen: false,
      account: {
        username: "jmahusay",
      },
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    handleSave(updatedData) {
      this.account.username = updatedData.username;
      this.$q.notify({ type: "positive", message: "Account details updated successfully!" });
      this.isModalOpen = false;
    },
  },
};
</script>


<style scoped>
.account-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  background: #f8f9fa;
  padding: 40px 20px;
  box-sizing: border-box;
}

.details-card {
  width: 80%; /* Increased width */
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
}

.details-grid {
  display: flex;
  justify-content: space-between;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

strong {
  font-size: 16px;
}

p {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.edit-btn {
  background: #f39c12;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}
</style>

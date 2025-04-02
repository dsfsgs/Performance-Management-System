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
          <p>********</p>
        </div>
      </div>
      <div class="last-updated">
        Last updated: {{ lastUpdated }}
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
      lastUpdated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    handleSave(updatedData) {
      this.account.username = updatedData.username;
      this.lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
  justify-content: flex-start;
  gap: 25px;
  background: #f8f9fa;
  padding: 30px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.details-card {
  width: 80%;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #2c3e50;
}

.details-grid {
  display: flex;
  justify-content: space-between;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 48%;
}

strong {
  font-size: 1rem;
  color: #34495e;
  display: block;
  margin-bottom: 5px;
}

p {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
  padding: 6px 0;
  border-bottom: 1px solid #ecf0f1;
}

.edit-btn {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #2980b9;
}

.last-updated {
  margin-top: 20px;
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: right;
  font-style: italic;
}

@media (max-width: 768px) {
  .account-container {
    padding: 20px 15px;
  }

  .details-grid {
    flex-direction: column;
  }

  .details-column {
    width: 100%;
  }

  h2 {
    font-size: 1.4rem;
  }

  .details-card {
    width: 90%;
    padding: 20px;
  }

  .last-updated {
    text-align: left;
    margin-top: 15px;
  }
}
</style>

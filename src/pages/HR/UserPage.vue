<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h6 class="text-h6 q-mb-xs">User Management</h6>
        <div class="text-caption text-grey-7">Create and manage system users</div>
      </div>
      <q-btn unelevated rounded color="primary" label="Create User" @click="showOfficeModal = true" icon="person_add">
        <q-tooltip>Create a new system user</q-tooltip>
      </q-btn>
    </div>

    <q-table :rows="rows" :columns="columns" row-key="name" :loading="loading">
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="text-center"> </q-td>
      </template>

      <template v-slot:loading >
        <q-inner-loading showing color="primary">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
      </template>
    </q-table>

    <!-- Office Selection Modal -->
    <q-dialog v-model="showOfficeModal" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select Office</div>
          <div class="text-caption text-grey-7">Step 1 of 3</div>
        </q-card-section>
        <q-card-section>
          <p class="text-grey-8 q-mb-md">Select the office where the user will be assigned.</p>
          <q-input v-model="officeSearch" label="Search Office" outlined dense clearable
            @update:model-value="filterOffices" :loading="loading">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-table :rows="filteredOffices" :columns="officeColumns" row-key="id" :loading="loading" virtual-scroll>
            <template v-slot:body="props">
              <q-tr :props="props" @click="selectedOffice = props.row">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn unelevated label="Next" color="primary" @click="openEmployeeModal" :disabled="!selectedOffice"
            :loading="loading">
            <q-tooltip v-if="!selectedOffice">Please select an office to continue</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Employee Selection Modal -->
    <q-dialog v-model="showEmployeeModal" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select Employee</div>
          <div class="text-caption text-grey-7">Step 2 of 3</div>
        </q-card-section>
        <q-card-section>
          <p class="text-grey-8 q-mb-md">Search and select an employee to assign user access.</p>
          <q-input v-model="search" label="Search Employee" outlined dense clearable
            @update:model-value="filterEmployees" :loading="loading">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-table :rows="filteredEmployees" :columns="employeeColumns" row-key="id" :loading="loading" virtual-scroll>
            <template v-slot:body="props">
              <q-tr :props="props" :class="{
                  'selected-employee-row': selectedEmployee?.id === props.row.id,
                }" @click="selectedEmployee = props.row" class="cursor-pointer">
                <q-td key="name4" :props="props">
                  {{ props.row.name4 }}
                </q-td>
                <q-td key="Designation" :props="props">
                  {{ props.row.Designation }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Back" color="grey-7" @click="goBackToOfficeModal" />
          <q-btn unelevated label="Next" color="primary" @click="openRoleModal" :disabled="!selectedEmployee"
            :loading="loading">
            <q-tooltip v-if="!selectedEmployee">Please select an employee to continue</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Role Selection Modal -->
    <q-dialog v-model="showRoleModal" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-h6">Assign Role</div>
          <div class="text-caption text-grey-7">Step 3 of 3</div>
        </q-card-section>
        <q-card-section>
          <p class="text-grey-8 q-mb-md">Select the appropriate role for this user.</p>
          <q-select v-model="selectedRole" :options="roles" label="Role *" option-label="label"
            :rules="[(val) => !!val || 'Role is required']" :loading="loading">
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Back" color="grey-7" @click="goBackToEmployeeModal" />
          <q-btn unelevated label="Save" color="primary" @click="saveUser" :disabled="!selectedRole" :loading="saving">
            <q-tooltip v-if="!selectedRole">Please select a role to continue</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showConfirmation" persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm User Creation</div>
        </q-card-section>
        <q-card-section>
          <p class="text-grey-8 q-mb-md">Please review the details before creating the user.</p>
          <div>
            <div class="q-mb-md">
              <div class="text-weight-medium">Office:</div>
              <div>{{ selectedOffice?.name }}</div>
            </div>
            <div class="q-mb-md">
              <div class="text-weight-medium">Employee:</div>
              <div>{{ selectedEmployee?.name4 }}</div>
              <div class="text-caption">{{ selectedEmployee?.Designation }}</div>
            </div>
            <div>
              <div class="text-weight-medium">Role:</div>
              <div>{{ selectedRole?.label }}</div>
              <div class="text-caption">{{ selectedRole?.description }}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Back" color="grey-7" @click="showConfirmation = false" />
          <q-btn unelevated label="Confirm" color="primary" @click="confirmSave" :loading="saving">
            <q-tooltip>Create user with selected details</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import { ref, onMounted } from "vue";
import { api } from "../../boot/axios"; // Ensure correct path

export default {
  name: "UserPage",
  components: {},
  setup() {
    const showOfficeModal = ref(false);
    const showEmployeeModal = ref(false);
    const showRoleModal = ref(false);
    const showConfirmation = ref(false);
    const selectedOffice = ref(null);
    const selectedEmployee = ref(null);
    // const Designation = ref(null);
    const selectedRole = ref(null);
    const search = ref("");
    const officeSearch = ref("");
    const loading = ref(false);
    const saving = ref(false);
    const offices = ref([]);
    const filteredOffices = ref([]);
    // User Account State
    const userAccounts = ref([]);
    const filteredEmployees = ref([]);
    // roles for the user
    const roles = [
      {
        label: "Office-Admin",
        value: 1,
        description: "Can manage office-specific settings and users",
      },
      {
        label: "Planning-Admin",
        value: 2,
        description: "Can manage planning-related functions and users",
      },
      {
        label: "Hr-Admin",
        value: 3,
        description: "Create Account and can manage the system",
      },
    ];
    // to create a user confirmation and save
    const confirmSave = async () => {
      saving.value = true;
      try {
        if (!selectedEmployee.value || !selectedOffice.value || !selectedRole.value) {
          throw new Error("Please complete all required selections.");
        }

        const password = selectedEmployee.value.BirthDate
          ? formatBirthDate(selectedEmployee.value.BirthDate)
          : `emp${selectedEmployee.value.id}`;

        const userData = {
          name: selectedEmployee.value.name4,
          password: password,
          designation: selectedEmployee.value.Designation,
          office_id: selectedOffice.value.id,
          role_id: selectedRole.value.value,
        };

        const response = await api.post("/user_assign", userData);

        // Check if response has data (even if status code isn't 200)
        if (response.data) {
          showConfirmation.value = false;
          showRoleModal.value = false;

          Notify.create({
            message: "User has been created successfully!",
            color: "positive",
            position: "top",
            timeout: 2500,
            actions: [{ icon: "close", color: "white" }],
          });

          await fetchUserAccounts();
          resetForm();
        } else {
          throw new Error(
            response.data?.message || "User created but no response data received"
          );
        }
      } catch (error) {
        console.error("Error in user creation:", error);
        Notify.create({
          message:
            "User was created, but there was an issue with the response. Please refresh to see the new user.",
          color: "warning",
          position: "top",
          timeout: 3500,
          actions: [{ icon: "close", color: "white" }],
        });
      } finally {
        saving.value = false;
      }
    };

    // Helper function to format birthdate to YYYY-MM-DD
    const formatBirthDate = (birthDate) => {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`; // Example: 19610318
    };

    //offices
    const fetchOffices = async () => {
      loading.value = true;
      try {
        const response = await api.get("/fetch_office");
        offices.value = response.data;
        filteredOffices.value = response.data;
      } catch (error) {
        console.error("Error fetching offices:", error);
        Notify.create({
          message: "Failed to fetch offices. Please try again.",
          color: "negative",
        });
      } finally {
        loading.value = false;
      }
    };

    const filterOffices = () => {
      const searchTerm = officeSearch.value?.toLowerCase().trim() || "";
      filteredOffices.value = offices.value.filter((office) =>
        office.name.toLowerCase().includes(searchTerm)
      );
    };

    // employee name and designation
    const fetchEmployees = async () => {
      loading.value = true;
      try {
        const response = await api.get("/employee");
        employees.value = response.data;
        filteredEmployees.value = response.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
        Notify.create({
          message: "Failed to fetch employees. Please try again.",
          color: "negative",
        });
      } finally {
        loading.value = false;
      }
    };

    const employees = ref(
      Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name4: `Employee ${i + 1}`,
        Designation: `Position ${(i % 5) + 1}`,
      }))
    );

    const employeeColumns = [
      {
        name: "name4",
        label: "Name",
        field: "name4",
        align: "left",
        sortable: true,
      },
      {
        name: "Designation",
        label: "Designation",
        field: "Designation",
        align: "left",
        sortable: true,
      },
    ];

    const officeColumns = [
      {
        name: "name",
        label: "Office Name",
        field: "name",
        align: "left",
        sortable: true,
      },
    ];

    const filterEmployees = () => {
      const searchTerm = search.value?.toLowerCase().trim() || "";
      filteredEmployees.value = employees.value.filter(
        (emp) =>
          emp.name4.toLowerCase().includes(searchTerm) ||
          emp.Designation.toLowerCase().includes(searchTerm)
      );
    };

    const openEmployeeModal = () => {
      showOfficeModal.value = false;
      showEmployeeModal.value = true;
      search.value = ""; // Reset search when opening modal
      filteredEmployees.value = employees.value;
    };

    const openRoleModal = () => {
      showEmployeeModal.value = false;
      showRoleModal.value = true;
    };

    const saveUser = () => {
      showConfirmation.value = true;
    };

    const resetForm = () => {
      selectedOffice.value = null;
      selectedEmployee.value = null;
      selectedRole.value = null;
      search.value = "";
      officeSearch.value = "";
      filteredOffices.value = offices.value;
      filteredEmployees.value = employees.value;
    };

    const goBackToOfficeModal = () => {
      showEmployeeModal.value = false;
      showOfficeModal.value = true;
      officeSearch.value = ""; // Reset search when going back
      filteredOffices.value = offices.value;
    };

    const goBackToEmployeeModal = () => {
      showRoleModal.value = false;
      showEmployeeModal.value = true;
    };
    const rows = ref([]);

    const columns = [
      { name: "office_name", label: "OFFICES", align: "left", field: "office_name" },
      { name: "name", label: "NAME", align: "center", field: "name" },
      {
        name: "datecreated",
        label: "DATE CREATED",
        align: "center",
        field: "datecreated",
      },
    ];
    const fetchUserAccounts = async () => {
      loading.value = true;
      try {
        const response = await api.get("/user_account");

        if (Array.isArray(response.data)) {
          rows.value = response.data;
        } else {
          console.error("Unexpected response format:", response.data);
          Notify.create({
            message: "Invalid data format received.",
            color: "negative",
          });
        }
      } catch (error) {
        console.error("Error fetching user accounts:", error);
        Notify.create({
          message: "Failed to fetch user accounts. Please try again.",
          color: "negative",
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchUserAccounts();
      fetchOffices();
      fetchEmployees(); // Call the fetchOffices function on component mount
    });

    return {
      columns,
      rows,
      userAccounts,
      loading,
      showOfficeModal,
      showEmployeeModal,
      showRoleModal,
      showConfirmation,
      selectedOffice,
      selectedEmployee,
      selectedRole,
      search,
      officeSearch,
      saving,
      offices,
      employees,
      filteredEmployees,
      filteredOffices,
      roles,
      employeeColumns,
      officeColumns,
      filterOffices,
      filterEmployees,
      openEmployeeModal,
      openRoleModal,
      saveUser,
      confirmSave,
      resetForm,
      goBackToOfficeModal,
      goBackToEmployeeModal,
    };
  },
};
</script>
<style scoped>
/* Apply green background to selected rows */

.cursor-pointer {
  cursor: pointer;
}

.modal-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 8px;
}

.modal-header {
  padding-bottom: 12px;
}

/* Create separate styles for office and employee rows */
.q-tr.selected-office-row {
  background-color: var(--q-primary) !important;
  color: white !important;
}

.q-tr.selected-employee-row {
  background-color: var(--q-primary) !important;
  color: white !important;
}

/* Default background for non-selected rows */
.q-tr:not(.selected-office-row):not(.selected-employee-row) {
  background-color: white !important;
  color: black !important;
}

.selected-info {
  border-radius: 8px;
}

.selected-info .text-subtitle2 {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.q-table) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

:deep(.q-card-section) {
  padding: 24px;
}

:deep(.q-card-section.q-pt-none) {
  padding-top: 0;
}

:deep(.q-card-actions) {
  padding: 12px 24px;
}

:deep(.q-table__middle) {
  max-height: calc(300px - 50px);
  overflow-y: auto;
}

:deep(.q-table thead tr th) {
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding: 8px 16px;
}

:deep(.q-td) {
  padding: 8px 16px;
}

:deep(.q-virtual-scroll__content) {
  scroll-behavior: smooth;
}

:deep(.q-field) {
  margin-bottom: 24px;
}

:deep(.q-item) {
  min-height: 48px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.q-item:hover) {
  background: rgba(0, 0, 0, 0.03);
}

.confirmation-details {
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 24px;
  border-radius: 8px;
}

.confirmation-details .text-weight-medium {
  font-size: 14px;
}

.confirmation-details .text-caption {
  font-size: 12px;
  margin-top: 4px;
}

.confirmation-details .q-icon {
  opacity: 0.8;
}

:deep(.q-mb-lg) {
  margin-bottom: 24px;
}

:deep(.q-dialog__backdrop) {
  backdrop-filter: blur(4px);
}

:deep(.q-dialog__inner) {
  padding: 16px;
}

:deep(.q-card) {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.q-table__bottom) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  min-height: 48px;
  padding: 8px 16px;
  background-color: #f8f8f8;
}

:deep(.text-body2) {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}

:deep(.q-mb-md) {
  margin-bottom: 24px;
}

:deep(.q-mb-sm) {
  margin-bottom: 12px;
}

:deep(.q-mb-xs) {
  margin-bottom: 8px;
}

:deep(.q-px-md) {
  padding-left: 24px;
  padding-right: 24px;
}

:deep(.q-py-sm) {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>

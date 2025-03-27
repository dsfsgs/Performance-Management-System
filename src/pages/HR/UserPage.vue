<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h6 class="text-h6">User Management</h6>
      <q-btn
        unelevated
        rounded
        color="primary"
        label="Create User"
        @click="showOfficeModal = true"
        icon="person_add"
      />
    </div>

    <UserTable />

    <!-- Office Selection Modal -->
    <q-dialog v-model="showOfficeModal">
      <q-card class="q-pa-md q-dialog-card">
        <q-card-section>
          <div class="text-h6">Select Office</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select
            v-model="selectedOffice"
            use-input
            fill-input
            hide-selected
            :options="filteredOffices"
            @filter="filterOffices"
            label="Office"
            outlined
            dense
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" @click="showOfficeModal = false" />
          <q-btn
            unelevated
            label="Next"
            color="primary"
            @click="openEmployeeModal"
            :disabled="!selectedOffice"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Employee Selection Modal -->
    <q-dialog v-model="showEmployeeModal">
      <q-card class="q-pa-md q-dialog-card">
        <q-card-section>
          <div class="text-h6">Assign Employee</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="search"
            label="Search Employee"
            outlined
            dense
            @input="filterEmployees"
          />
          <q-table
            :rows="filteredEmployees"
            :columns="employeeColumns"
            row-key="id"
            bordered
            dense
            class="q-mt-md"
            style="max-height: 300px; overflow-y: auto"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn dense flat icon="check" @click="selectEmployee(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="grey" @click="goBackToOfficeModal" />
          <q-btn
            unelevated
            label="Next"
            color="primary"
            @click="openRoleModal"
            :disabled="!selectedEmployee"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Role Selection Modal -->
    <q-dialog v-model="showRoleModal">
      <q-card class="q-pa-md q-dialog-card">
        <q-card-section>
          <div class="text-h6">Select Role</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select v-model="selectedRole" :options="roles" label="Role" outlined dense />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Back" color="grey" @click="goBackToEmployeeModal" />
          <q-btn
            unelevated
            label="Save"
            color="primary"
            @click="saveUser"
            :disabled="!selectedRole"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import UserTable from '../../components/UserTable.vue'

export default {
  name: 'UserPage',
  components: {
    UserTable,
  },
  data() {
    return {
      showOfficeModal: false,
      showEmployeeModal: false,
      showRoleModal: false,
      selectedOffice: null,
      selectedEmployee: null,
      selectedRole: null,
      search: '',
      offices: Array.from({ length: 30 }, (_, i) => `Office ${i + 1}`),
      roles: ['Admin', 'Manager', 'Staff'],
      employees: Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        position: `Position ${(i % 5) + 1}`,
      })),
      filteredEmployees: [],
      filteredOffices: [],
      employeeColumns: [
        { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
        { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
        { name: 'actions', label: 'Select', align: 'center' },
      ],
    }
  },
  methods: {
    filterOffices(val, update) {
      update(() => {
        this.filteredOffices = this.offices.filter((o) =>
          o.toLowerCase().includes(val.toLowerCase()),
        )
      })
    },
    filterEmployees() {
      this.filteredEmployees = this.employees.filter((emp) =>
        emp.name.toLowerCase().includes(this.search.toLowerCase()),
      )
    },
    openEmployeeModal() {
      this.showOfficeModal = false
      this.showEmployeeModal = true
      this.filteredEmployees = this.employees
    },
    selectEmployee(employee) {
      this.selectedEmployee = employee
    },
    openRoleModal() {
      this.showEmployeeModal = false
      this.showRoleModal = true
    },
    saveUser() {
      console.log('User saved:', {
        office: this.selectedOffice,
        employee: this.selectedEmployee,
        role: this.selectedRole,
      })
      this.showRoleModal = false
      this.resetForm()
    },
    resetForm() {
      this.selectedOffice = null
      this.selectedEmployee = null
      this.selectedRole = null
      this.search = ''
    },
    goBackToOfficeModal() {
      this.showEmployeeModal = false
      this.showOfficeModal = true
    },
    goBackToEmployeeModal() {
      this.showRoleModal = false
      this.showEmployeeModal = true
    },
  },
  mounted() {
    this.filteredOffices = this.offices
  },
}
</script>

<style scoped>
.q-dialog-card {
  width: 60%;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>

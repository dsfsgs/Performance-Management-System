// employeeStore.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useUserStore } from '../userStore'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    loading: false,
    error: null,
    currentOfficeId: null,
    userOffice: null, // Make sure this exists to store the user's office name
    assignedEmployees: [], // Employees assigned to the current node
    unassignedEmployees: [], // Employees available for assignment
    currentNode: null,
    softDeletedEmployees: [], // Store for soft-deleted employees
  }),

  actions: {

    async fetchEmployeeCounts(officeId) {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/employee/counts', {
          headers: { Authorization: `Bearer ${token}` },
          params: { office_id: officeId }
        });

        if (response.data.success) {
          this.employeeCounts = response.data.data;
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to fetch employee counts');
        }
      } catch (error) {
        console.error('Failed to fetch employee counts:', error);
        this.error = error.message || 'Failed to fetch employee counts';
        throw error;
      } finally {
        this.loading = false;
      }
    },


    async fetchAllEmployees() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/employees-by-office', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
          show_all: true, // This tells the backend to return all employees
          unassigned_only: true // Only get unassigned employees
          }
        })

        if (response.data.success) {
          this.employees = response.data.data.map(emp => ({
            id: emp.id || null,
            name: emp.name,
            position: emp.position,
            office: emp.office,
            selected: false
          }))
          this.userOffice = response.data.user_office // save this for filtering later
        } else {
          throw new Error(response.data.message || 'Failed to fetch all employees')
        }

      } catch (error) {
        console.error('Failed to fetch all employees:', error)
        this.error = error.message || 'Failed to fetch all employees'
      } finally {
        this.loading = false
      }
    },

     async fetchEmployeesByNode(node) {
      this.loading = true;
      this.error = null;
      this.currentNode = node;

      try {
        const token = localStorage.getItem('token');
        const userStore = useUserStore();
        const params = {
          office_id: userStore.user?.office_id
        };

        if (node) {
          if (node.type === 'division') {
            params.division = node.name;
          } else if (node.type === 'section') {
            params.section = node.name;
          } else if (node.type === 'unit') {
            params.unit = node.name;
          }
        }

        const response = await api.get('/fetch_employees', {
          headers: { Authorization: `Bearer ${token}` },
          params: params
        });

        if (response.data.success) {
          this.assignedEmployees = response.data.data.map(emp => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            office_id: emp.office_id,
            office: emp.office,
            division: emp.division,
            section: emp.section,
            unit: emp.unit,
            rank: emp.rank || '',
            selected: false
          }));
        } else {
          throw new Error(response.data.message || 'Failed to fetch employees');
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        this.error = error.message || 'Failed to fetch employees';
      } finally {
        this.loading = false;
      }
    },


    async fetchEmployeesByOffice() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/employees-by-office', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            show_all: false, // This tells the backend to return only current office employees

                  unassigned_only: true // Only get unassigned employees
          }
        })

        if (response.data.success) {
          this.employees = response.data.data.map(emp => ({
            id: emp.id || null,
            name: emp.name,
            position: emp.position,
            office: emp.office,
            selected: false
          }))
          this.userOffice = response.data.user_office
        } else {
          throw new Error(response.data.message || 'Failed to fetch employees')
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        this.error = error.message || 'Failed to fetch employees'
      } finally {
        this.loading = false
      }
    },
      // async fetchUnassignedEmployees() {
      //   // This can now just call fetchEmployeesByOffice with unassigned_only=true
      //   return this.fetchEmployeesByOffice();
      // },

    async fetchUnassignedEmployees() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/employees-by-office', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            show_all: false,
            unassigned_only: true
          }
        });

        if (response.data.success) {
          this.unassignedEmployees = response.data.data.map(emp => ({
            id: emp.id || null,
            name: emp.name,
            position: emp.position,
            office: emp.office,
            selected: false
          }));
          this.userOffice = response.data.user_office;
        } else {
          throw new Error(response.data.message || 'Failed to fetch unassigned employees');
        }
      } catch (error) {
        console.error('Failed to fetch unassigned employees:', error);
        this.error = error.message || 'Failed to fetch unassigned employees';
      } finally {
        this.loading = false;
      }
    },


    async addEmployees(payload) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const response = await api.post(
          '/add/employee',
          { employees: payload.employees },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.data.success) {
          // Don't add to local state - these are now assigned employees
          // Instead, refresh the current view
          if (this.currentNode) {
            await this.fetchEmployeesByNode(this.currentNode)
          } else {
            await this.fetchEmployeesByOffice()
          }

          // Fetch updated counts after adding employees
          await this.fetchEmployeeCounts(this.currentOfficeId || useUserStore().user?.office_id)

          return response.data
        } else {
          throw new Error(response.data.message || 'Failed to add employees')
        }
      } catch (error) {
        console.error('Failed to add employees:', error)
        this.error = error.message || 'Failed to add employees'
        throw error
      } finally {
        this.loading = false
      }
    },
async softDeleteEmployee(employeeId) {
  this.loading = true;
  this.error = null;

  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Find the employee in all possible lists
    const deletedEmployee = this.employees.find(e => e.id === employeeId) ||
                          this.assignedEmployees.find(e => e.id === employeeId) ||
                          this.unassignedEmployees.find(e => e.id === employeeId);

    if (deletedEmployee) {
      // Add to softDeletedEmployees
      this.softDeletedEmployees.push({...deletedEmployee});

      // Remove from all active employee lists
      this.employees = this.employees.filter(e => e.id !== employeeId);
      this.assignedEmployees = this.assignedEmployees.filter(e => e.id !== employeeId);
      this.unassignedEmployees = this.unassignedEmployees.filter(e => e.id !== employeeId);

      // Return the deleted employee data for count updates
      return {
        success: true,
        message: 'Employee soft deleted successfully',
        deletedEmployee: deletedEmployee,
        counts: response.data.counts // Assuming your backend returns updated counts
      };
    }

    throw new Error('Employee not found');

  } catch (error) {
    console.error('Failed to soft delete employee:', error);
    this.error = error.message || 'Failed to soft delete employee';
    throw error;
  } finally {
    this.loading = false;
  }
},
     // Restore a soft-deleted employee
    async restoreEmployee(employeeId) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        const response = await api.patch(`/employee/restore/${employeeId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          // Remove from softDeletedEmployees and add back to appropriate list
          const restoredEmployee = this.softDeletedEmployees.find(e => e.id === employeeId);

          if (restoredEmployee) {
            this.softDeletedEmployees = this.softDeletedEmployees.filter(e => e.id !== employeeId);

            // Determine where to add the employee back
            if (restoredEmployee.division || restoredEmployee.section || restoredEmployee.unit) {
              // It's an assigned employee
              this.assignedEmployees.push(restoredEmployee);
            } else {
              // It's an unassigned employee
              this.unassignedEmployees.push(restoredEmployee);
            }
          }

          // Refresh counts
          if (this.currentNode) {
            await this.fetchEmployeesByNode(this.currentNode);
          }
          if (this.currentOfficeId) {
            await this.fetchEmployeeCounts(this.currentOfficeId);
          }

          return response.data;
        } else {
          throw new Error(response.data.message || 'Failed to restore employee');
        }
      } catch (error) {
        console.error('Failed to restore employee:', error);
        this.error = error.message || 'Failed to restore employee';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch soft-deleted employees
    async fetchSoftDeletedEmployees() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/employee/soft-deleted', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          this.softDeletedEmployees = response.data.data;
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to fetch soft-deleted employees');
        }
      } catch (error) {
        console.error('Failed to fetch soft-deleted employees:', error);
        this.error = error.message || 'Failed to fetch soft-deleted employees';
        throw error;
      } finally {
        this.loading = false;
      }
    },
     // Update your existing deleteEmployee method to use softDeleteEmployee
   async deleteEmployee(employeeId) {
  this.$q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this employee?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const result = await this.employeeStore.softDeleteEmployee(employeeId);

      if (result?.success) {
        this.$q.notify({
          type: 'positive',
          message: result.message || 'Employee moved to trash'
        });

        // Manually update the local counts in the component
        if (this.employeeStore.currentOfficeId) {
          const counts = await this.employeeStore.fetchEmployeeCounts(this.employeeStore.currentOfficeId);
          this.updateLocalCounts(counts);
        }
      } else {
        throw new Error(result?.message || 'Failed to delete employee');
      }
    } catch (error) {
      this.$q.notify({
        type: 'negative',
        message: error.message || 'Failed to delete employee'
      });
    }
  });
},
  }

});

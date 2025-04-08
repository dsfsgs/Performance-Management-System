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
    userOffice: null // Make sure this exists to store the user's office name
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
          this.employees = response.data.data.map(emp => ({
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
async fetchUnassignedEmployees() {
  // This can now just call fetchEmployeesByOffice with unassigned_only=true
  return this.fetchEmployeesByOffice();
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
}
  }
});

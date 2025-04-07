//employee.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useUserStore } from '../userStore'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
  employees: [],
    loading: false,
    error: null,
    currentOfficeId: null
  }),

  actions: {

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
       async initialize() {
      const userStore = useUserStore()
      this.currentOfficeId = userStore.user?.office_id
      await this.fetchEmployeesByOffice()
    },

    async fetchEmployeesByOffice() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/employees-by-office', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            office_id: this.currentOfficeId
          }
        })

        if (response.data.success) {
          this.employees = response.data.data.map(emp => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            office_id: emp.office_id,
            division: emp.division,
            section: emp.section,
            unit: emp.unit,
            rank: emp.rank,
            selected: false
          }))
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



    async addEmployees(payload) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const response = await api.post(
          '/employee',
          { employees: payload.employees },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.data.success) {
          const newEmployees = response.data.employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            position: emp.position,
            office_id: emp.office_id,
            division: emp.division,
            section: emp.section,
            unit: emp.unit,
            rank: emp.rank,
            selected: false
          }))

          this.employees = [...this.employees, ...newEmployees]
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

    async updateEmployeeRank(employeeId, newRank) {
      try {
        const token = localStorage.getItem('token')
        const response = await api.put(
          `/employee/${employeeId}/rank`,
          { rank: newRank },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (response.data.success) {
          const index = this.employees.findIndex(e => e.id === employeeId)
          if (index !== -1) {
            this.employees[index].rank = newRank
          }
          return response.data
        } else {
          throw new Error(response.data.message || 'Failed to update employee rank')
        }
      } catch (error) {
        console.error('Failed to update employee rank:', error)
        throw error
      }
    }
  },
});

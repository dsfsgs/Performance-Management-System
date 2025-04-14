import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

export const useUnitWorkPlanStore = defineStore('unitWorkPlan', {
  state: () => ({
    selectedDivision: null,
    divisionOptions: [],
    selectedEmployee: null,
    employeeOptions: [],
    rank: '',
    position: '',
    targetPeriod: '',
    targetYear: new Date().getFullYear().toString(),
    periodOptions: ['January - June', 'July - December'],
    yearOptions: Array.from({ length: 61 }, (_, i) => (1990 + i).toString()), // 1990-2050
    filteredYears: [],
    performanceStandards: [
      {
        coreCompetency: 'DSE-4',
        leadershipCompetency: 'TSC-4',
        technicalCompetency: 'RM-3'
      }
    ]
  }),

  actions: {
    async fetchDivisions() {
      const userStore = useUserStore()
      if (!userStore.officeId) return

      try {
        const response = await api.get(`/employees/divisions?office_id=${userStore.officeId}`)
        this.divisionOptions = response.data
        this.resetEmployeeSelection()
      } catch (error) {
        console.error('Error fetching divisions:', error)
        throw error
      }
    },

    async fetchEmployees() {
      const userStore = useUserStore()
      if (!userStore.officeId || !this.selectedDivision) return

      try {
        const response = await api.get('/employees', {
          params: {
            office_id: userStore.officeId,
            division: this.selectedDivision
          }
        })

        this.employeeOptions = response.data.map(emp => ({
          id: emp.id,
          name: emp.name,
          position: emp.position,
          rank: emp.rank
        }))

        this.resetEmployeeSelection()
      } catch (error) {
        console.error('Error fetching employees:', error)
        throw error
      }
    },

    fillEmployeeDetails() {
      if (!this.selectedEmployee) return

      const employee = this.employeeOptions.find(e => e.id === this.selectedEmployee)
      if (employee) {
        this.rank = employee.rank
        this.position = employee.position
      }
    },

    filterYears(val, update) {
      if (val === '') {
        update(() => {
          this.filteredYears = this.yearOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredYears = this.yearOptions.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        )
      })
    },

    async saveWorkPlan(performanceStandardsData) {
      const userStore = useUserStore()
      if (!userStore.officeId) {
        throw new Error('User office not found')
      }

      const formData = {
        office_id: userStore.officeId,
        division: this.selectedDivision,
        employee_id: this.selectedEmployee,
        rank: this.rank,
        position: this.position,
        target_period: `${this.targetPeriod} ${this.targetYear}`,
        year: this.targetYear,
        performance_standards: performanceStandardsData
      }

      const response = await api.post('/unit_work_plant/store', formData)
      return response.data
    },

    resetForm() {
      const currentYear = new Date().getFullYear().toString()

      this.selectedDivision = null
      this.selectedEmployee = null
      this.rank = ''
      this.position = ''
      this.targetPeriod = ''
      this.targetYear = currentYear

      this.performanceStandards = [
        {
          coreCompetency: 'DSE-4',
          leadershipCompetency: 'TSC-4',
          technicalCompetency: 'RM-3'
        }
      ]
    },

    addPerformanceStandard() {
      this.performanceStandards.push({
        coreCompetency: 'DSE-4',
        leadershipCompetency: 'TSC-4',
        technicalCompetency: 'RM-3'
      })
    },

    removePerformanceStandard(index) {
      this.performanceStandards.splice(index, 1)
    },

    resetEmployeeSelection() {
      this.selectedEmployee = null
      this.rank = ''
      this.position = ''
    }
  }
})

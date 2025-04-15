import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'
// import { useCompetencyStore } from 'src/stores/office/competencyStore'

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
    ],
        employeePositionMap: {} // To store position IDs for employees
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
          positionId: emp.position_id, // Make sure your API returns position_id
          rank: emp.rank
        }))

        this.resetEmployeeSelection()
      } catch (error) {
        console.error('Error fetching employees:', error)
        throw error
      }
    },
    async fetchEmployeeCompetencies(employeeId) {
  try {
    const response = await api.get(`/employee/${employeeId}/competencies`);
    return response.data.data; // Returns the formatted competencies
  } catch (error) {
    console.error('Error fetching competencies:', error);
    throw error;
  }
},

async fillEmployeeDetails(employeeId, empIndex) {
  const employee = this.employeeOptions.find(e => e.id === employeeId);
  if (employee) {
    this.employeeWorkPlans[empIndex].rank = employee.rank || '';
    this.employeeWorkPlans[empIndex].position = employee.position || '';
    this.employeeWorkPlans[empIndex].employeeName = employee.name || '';

    try {
      // Fetch competencies for this employee
      const competencies = await this.fetchEmployeeCompetencies(employeeId);

      // Store competencies for later use
      this.employeeWorkPlans[empIndex].competencies = competencies;

      // Update the first performance standard with the first of each competency
      if (this.employeeWorkPlans[empIndex].performanceStandards.length > 0) {
        const firstStandard = this.employeeWorkPlans[empIndex].performanceStandards[0];

        // Get first core competency if exists
        if (competencies.core && Object.keys(competencies.core).length > 0) {
          const firstCore = Object.entries(competencies.core)[0];
          firstStandard.coreCompetency = `${firstCore[0]}-${firstCore[1].value}`;
        }

        // Get first technical competency if exists
        if (competencies.technical && Object.keys(competencies.technical).length > 0) {
          const firstTech = Object.entries(competencies.technical)[0];
          firstStandard.technicalCompetency = `${firstTech[0]}-${firstTech[1].value}`;
        }

        // Get first leadership competency if exists
        if (competencies.leadership && Object.keys(competencies.leadership).length > 0) {
          const firstLeader = Object.entries(competencies.leadership)[0];
          firstStandard.leadershipCompetency = `${firstLeader[0]}-${firstLeader[1].value}`;
        }
      }
    } catch (error) {
      console.error('Error loading competencies:', error);
    }
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

        }


      ]
    },

    addPerformanceStandard() {
      this.performanceStandards.push({

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

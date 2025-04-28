//unit_work_plantStore.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useUserStore } from 'src/stores/userStore'

export const useUnitWorkPlanStore = defineStore('unitWorkPlan', {
  state: () => ({
    selectedDivision: null,
    divisionOptions: [],
    selectedEmployee: null,
    targetPeriods: [],
    employeesWithWorkPlans: [],
    selectedTargetPeriod: null,
    employeeOptions: [],
    rank: '',
    position: '',
    targetPeriod: '',
    targetYear: new Date().getFullYear().toString(),
    periodOptions: ['January - June', 'July - December'],
    yearOptions: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i - 5).toString()),
    filteredYears: [],
    loading: false,
    error: null,
    divisions: [],
    performanceStandards: [
      {
        coreCompetency: 'DSE-4',
        leadershipCompetency: 'TSC-4',
        technicalCompetency: 'RM-3'
      }
    ],
    employeePositionMap: {},
    codeMappings: {
      core: {
        'Delivering Service Excellence': 'DSE',
        'Exemplifying Integrity': 'EI',
        'Interpersonal Skills': 'IS'
      },
      technical: {
        'Planning and Organizing': 'P&O',
        'Monitoring and Evaluation': 'M&E',
        'Records Management': 'RM',
        'Partnering and Networking': 'P&N',
        'Process Management': 'PM',
        'Attention to Detail': 'AD'
      },
      leadership: {
        'Thinking Strategically and Creatively': 'TSC',
        'Problem Solving and Decision Making': 'PSDM',
        'Building Collaborative & Inclusive Working Relationships': 'BCIWR',
        'Managing Performance & Coaching for Results': 'MPCR'
      }
    },
  }),

  actions: {
    formatCompetencies(competencies, type) {
      if (!competencies) return '';
      const entries = Object.entries(competencies);
      if (entries.length === 0) return '';

      return entries.map(([key, val]) => {
        const code = this.codeMappings[type]?.[key] || key;
        const value = typeof val === 'object' ? val.value : val;
        return `${code}-${value}`;
      }).join('<br>');
    },

    async fetchDivisionsWithWorkPlans(targetPeriod = null) {
      this.loading = true;
      try {
        const response = await api.get('/division/status');
        let divisions = response.data.filter(division => division.status);

        if (targetPeriod) {
          const [periodPart, yearPart] = targetPeriod.split(/(?=\d{4}$)/);
          const period = periodPart.trim();
          const year = yearPart.trim();

          divisions = divisions.filter(division => {
            const divPeriod = division.target_period;
            return divPeriod.includes(period) && divPeriod.includes(year);
          });
        }

        this.divisions = divisions;
        this.error = null;
        return divisions; // Return divisions for immediate use
      } catch (err) {
        this.error = 'Failed to fetch divisions';
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchDivisionDetails(division, targetPeriod) {
      this.loading = true;
      try {
        const [period, year] = targetPeriod.split(/(?=\d{4}$)/);
        const response = await api.get('/division/employee/performance', {
          params: {
            division,
            target_period: period.trim(),
            year: year.trim()
          }
        });

        const formattedData = {
          name: division,
          employees: response.data.map(emp => ({
            name: emp.employee_name,
            position: emp.position,
            rank: emp.rank,
            outputs: [{
              name: emp.mfo ? ` ${emp.mfo}<br>${emp.output}` : emp.output,
              core: this.formatCompetencies(emp.performance_standards?.core_competency, 'core'),
              technical: this.formatCompetencies(emp.performance_standards?.technical_competency, 'technical'),
              leadership: this.formatCompetencies(emp.performance_standards?.leadership_competency, 'leadership'),
              indicator: emp.performance_standards?.success_indicator || '',
              required: emp.performance_standards?.required_output || '',
              standard5: this.formatStandard(emp.performance_standards?.standard_outcomes, 5),
              standard4: this.formatStandard(emp.performance_standards?.standard_outcomes, 4),
              standard3: this.formatStandard(emp.performance_standards?.standard_outcomes, 3),
              standard2: this.formatStandard(emp.performance_standards?.standard_outcomes, 2),
              standard1: this.formatStandard(emp.performance_standards?.standard_outcomes, 1)
            }]
          }))
        };

        return formattedData;
      } catch (err) {
        console.error('Error fetching division details:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    formatStandard(standards, rating) {
      if (!standards || !Array.isArray(standards)) return '';
      const standard = standards.find(s => s.rating === rating.toString());
      if (!standard) return '';
      return `Q - ${standard.quantity || ''}<br>E - ${standard.effectiveness || ''}<br>T - ${standard.timeliness || ''}`;
    },

    setSelectedDivision(division) {
      this.selectedDivision = division;
    },

    setTargetPeriod(period) {
      this.targetPeriod = period;
    },

    async fetchDivisionsWithStatus() {
      this.loading = true;
      try {
        const response = await api.get('/division/status');
        this.divisions = response.data;
        this.error = null;
      } catch (err) {
        this.error = 'Failed to fetch divisions';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchEmployeesByDivision(division, targetPeriod) {
      this.loading = true;
      try {
        this.selectedDivision = division;
        this.selectedTargetPeriod = targetPeriod;
        const [period, year] = targetPeriod.split(/(?=\d{4}$)/);

        const response = await api.get('/division/employee/performance', {
          params: {
            division,
            target_period: period.trim(),
            year: year.trim()
          }
        });

        this.employeesWithWorkPlans = response.data;
        this.error = null;
      } catch (err) {
        this.error = 'Failed to fetch employees';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    clearSelection() {
      this.selectedDivision = null;
      this.selectedTargetPeriod = null;
      this.employeesWithWorkPlans = [];
    },

    async saveWorkPlan(workPlans) {
      const userStore = useUserStore();
      if (!userStore.officeId) {
        throw new Error('User office not found');
      }

      try {
        const payload = {
          office_id: userStore.officeId,
          division: this.selectedDivision,
          target_period: this.targetPeriod,
          year: parseInt(this.targetYear),
          employee_work_plans: workPlans.map(plan => {
            if (!plan.performanceData || plan.performanceData.length === 0) {
              console.warn(`No performance data for employee ID: ${plan.employeeId}`);
              return null;
            }

            return {
              employee_id: plan.employeeId,
              rank: plan.rank,
              position: plan.position,
              performance_standards: plan.performanceData.map(standard => {
                return {
                  category: standard.rows[0]?.category || null,
                  mfo: standard.rows[1]?.mfo || null,
                  output: standard.rows[2]?.output || null,
                  success_indicator: standard.successIndicator || '',
                  required_output: standard.requiredOutput || '',
                  standard_outcomes: standard.standardOutcomeRows.map(outcome => ({
                    rating: outcome.rating,
                    quantity: outcome.quantity || '',
                    effectiveness: outcome.effectiveness || '',
                    timeliness: outcome.timeliness || ''
                  })),
                  core_competency: standard.coreCompetency || null,
                  technical_competency: standard.technicalCompetency || null,
                  leadership_competency: standard.leadershipCompetency || null
                };
              })
            };
          }).filter(Boolean)
        };

        const response = await api.post('/unit_work_plan/store', payload);
        return response.data;
      } catch (error) {
        console.error('Error saving work plan:', error);
        throw error;
      }
    },

    async fetchDivisions() {
      const userStore = useUserStore();
      if (!userStore.officeId) return;

      try {
        const response = await api.get(`/employees/divisions?office_id=${userStore.officeId}`);
        this.divisionOptions = response.data;
        this.resetEmployeeSelection();
      } catch (error) {
        console.error('Error fetching divisions:', error);
        throw error;
      }
    },

    async fetchEmployees() {
      const userStore = useUserStore();
      if (!userStore.officeId || !this.selectedDivision) return;

      try {
        const response = await api.get('/employees', {
          params: {
            office_id: userStore.officeId,
            division: this.selectedDivision
          }
        });

        this.employeeOptions = response.data.map(emp => ({
          id: emp.id,
          name: emp.name,
          position: emp.position,
          positionId: emp.position_id,
          rank: emp.rank
        }));

        this.resetEmployeeSelection();
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    },

    async fetchEmployeeCompetencies(employeeId) {
      try {
        const response = await api.get(`/employee/${employeeId}/competencies`);
        return response.data.data;
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
          const competencies = await this.fetchEmployeeCompetencies(employeeId);
          this.employeeWorkPlans[empIndex].competencies = competencies;

          if (this.employeeWorkPlans[empIndex].performanceStandards.length > 0) {
            const firstStandard = this.employeeWorkPlans[empIndex].performanceStandards[0];

            if (competencies.core && Object.keys(competencies.core).length > 0) {
              const firstCore = Object.entries(competencies.core)[0];
              firstStandard.coreCompetency = `${firstCore[0]}-${firstCore[1].value}`;
            }

            if (competencies.technical && Object.keys(competencies.technical).length > 0) {
              const firstTech = Object.entries(competencies.technical)[0];
              firstStandard.technicalCompetency = `${firstTech[0]}-${firstTech[1].value}`;
            }

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
          this.filteredYears = this.yearOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredYears = this.yearOptions.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    resetForm() {
      const currentYear = new Date().getFullYear().toString();
      this.selectedDivision = null;
      this.selectedEmployee = null;
      this.rank = '';
      this.position = '';
      this.targetPeriod = '';
      this.targetYear = currentYear;
      this.performanceStandards = [{}];
    },

    addPerformanceStandard(employeeIndex) {
      const employee = this.employeeWorkPlans[employeeIndex];
      this.employeeWorkPlans[employeeIndex].performanceStandards.push({
        coreCompetency: employee.competencies?.core || {},
        technicalCompetency: employee.competencies?.technical || {},
        leadershipCompetency: employee.competencies?.leadership || {}
      });
    },

    removePerformanceStandard(index) {
      this.performanceStandards.splice(index, 1);
    },

    resetEmployeeSelection() {
      this.selectedEmployee = null;
      this.rank = '';
      this.position = '';
    }
  }
});

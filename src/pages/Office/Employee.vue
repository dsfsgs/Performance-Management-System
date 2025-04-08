<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="employee-container">
    <div class="organization-panel">
      <div class="tree-view">
        <div v-if="loading" class="loading-container">
          <q-spinner color="primary" size="2em" />
          <span>Loading organization structure...</span>
        </div>

        <div v-else>
          <!-- Office Level -->
          <div class="tree-item">
            <div class="tree-node office"
                 @click="selectOffice"
                 :class="{ active: selectedNode?.type === 'office' }">
              <span class="toggle-icon" @click.stop="toggleOffice">
                <q-icon :name="officeExpanded ? 'expand_more' : 'chevron_right'" />
              </span>
              <span class="node-content">
                {{ officeName }}
                <span class="employee-count">{{ getOfficeEmployees().length }}</span>
              </span>
            </div>

            <!-- Divisions under Office -->
            <div v-if="officeExpanded" class="sub-items office-items">
              <div v-for="division in divisions" :key="division.id" class="tree-item">
                <div class="tree-node division" @click="selectDivision(division)"
                  :class="{ active: selectedNode?.type === 'division' && selectedNode?.id === division.id }">
                  <span class="toggle-icon" @click.stop="toggleDivision(division)">
                    <q-icon :name="division.expanded ? 'expand_more' : 'chevron_right'" />
                  </span>
                  <span class="node-content">
                    {{ division.name }}
                    <span class="employee-count">{{ getDivisionEmployees(division).length }}</span>
                  </span>
                </div>

                <div v-if="division.expanded" class="sub-items division-items">
                  <!-- Render sections if they exist -->
                  <div v-for="(section) in division.sections" :key="section.id" class="tree-item">
                    <div class="tree-node section" @click="selectSection(section)"
                      :class="{ active: selectedNode?.type === 'section' && selectedNode?.id === section.id }">
                      <span class="toggle-icon" @click.stop="toggleSection(section)">
                        <q-icon :name="section.expanded ? 'expand_more' : 'chevron_right'" />
                      </span>
                      <span class="node-content">
                        {{ section.name }}
                        <span class="employee-count">{{ getSectionEmployees(section).length }}</span>
                      </span>
                    </div>

                    <div v-if="section.expanded" class="sub-items section-items">
                      <div v-for="(unit) in section.units" :key="unit.id" class="tree-item">
                        <div class="tree-node unit" @click="selectUnit(unit)"
                          :class="{ active: selectedNode?.type === 'unit' && selectedNode?.id === unit.id }">
                          <span class="unit-icon">•</span>
                          <span class="node-content">
                            {{ unit.name }}
                            <span class="employee-count">{{ getUnitEmployees(unit).length }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="division.units && division.units.length > 0" class="tree-item">
                    <div v-for="(unit) in division.units" :key="unit.id" class="tree-item">
                      <div class="tree-node unit" @click="selectUnit(unit)"
                        :class="{ active: selectedNode?.type === 'unit' && selectedNode?.id === unit.id }">
                        <span class="unit-icon">•</span>
                        <span class="node-content">
                          {{ unit.name }}
                          <span class="employee-count">{{ getUnitEmployees(unit).length }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="employee-list-panel">
      <div class="employee-list-container">
        <div class="table-title-container">
          <h3>{{ selectedNodeTitle || 'Select an office, division, section, or unit' }}</h3>
          <button v-if="selectedNode" class="add-employee-btn" @click="showAddModal = true">
            <q-icon name="add" />
            Select Employees
          </button>
        </div>
        <div class="employee-table">
          <div v-if="loading || employeeStore.loading" class="loading-container">
            <q-spinner color="primary" size="2em" />
            <span>Loading employees...</span>
          </div>

          <template v-else>
            <div class="table-header">
              <div class="header-cell">Name</div>
              <div class="header-cell">Position</div>
              <div class="header-cell">Rank</div>
              <div class="header-cell action-cell">Actions</div>
            </div>

            <div v-if="filteredEmployees.length === 0" class="empty-row">
              <div class="table-cell" colspan="4">No employees found</div>
            </div>

            <div v-else v-for="employee in filteredEmployees" :key="employee.id" class="table-row">
              <div class="table-cell">{{ employee.name }}</div>
              <div class="table-cell">{{ employee.position }}</div>
              <div class="table-cell">
                <select v-model="employee.rank" @change="updateEmployeeRank(employee)" class="rank-select">
                  <option value="">None</option>
                  <option value="Head" :disabled="isHeadOptionDisabled(employee)">
                    Head
                  </option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div class="table-cell action-cell">
                <!-- Action buttons here -->
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <AddEmployeeModal v-model:showModal="showAddModal" @add="handleAddEmployees" />
  </div>
</template>

<script>
import AddEmployeeModal from '../../components/AddEmployeeModal.vue';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/userStore';
import { useEmployeeStore } from 'stores/office/employee'

export default {
  components: {
    AddEmployeeModal
  },
  setup() {
    const employeeStore = useEmployeeStore();
    return { employeeStore };
  },
  data() {
    return {
      showAddModal: false,
      selectedNode: null,
      divisions: [],
      userStore: useUserStore(),
      loading: false,
      officeExpanded: false // Added for office expansion state
    }
  },

  computed: {
    filteredEmployees() {
      if (!this.selectedNode) return [];

      const employees = this.employeeStore.employees;

      switch (this.selectedNode.type) {
        case 'office':
          return employees.filter(emp => emp.office_id === this.userStore.user?.office_id);
        case 'division':
          return employees.filter(emp => emp.division === this.selectedNode.name);
        case 'section':
          return employees.filter(emp => emp.section === this.selectedNode.name);
        case 'unit':
          return employees.filter(emp => emp.unit === this.selectedNode.name);
        default:
          return employees;
      }
    },
    selectedNodeTitle() {
      if (!this.selectedNode) return ''
      return `${this.selectedNode.name}`
    },
    officeName() {
      return this.userStore.officeName
    }
  },
  async created() {
    await this.fetchOrganizationStructure();
  },
  methods: {
    toggleOffice() {
      this.officeExpanded = !this.officeExpanded;
      if (this.officeExpanded && !this.selectedNode) {
        this.selectOffice();
      }
    },
    selectOffice() {
      this.selectedNode = {
        type: 'office',
        id: this.userStore.user?.office_id,
        name: this.officeName
      };
      this.employeeStore.fetchEmployeesByNode(this.selectedNode)
        .catch(error => {
          console.error("Error fetching employees:", error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to load employees'
          });
        });
    },
    getOfficeEmployees() {
      return this.employeeStore.employees.filter(emp =>
        emp.office_id === this.userStore.user?.office_id
      );
    },
    async fetchOrganizationStructure() {
      this.loading = true;
      try {
        const response = await api.get('/plantilla');
        const officeData = response.data.find(office =>
          office.office === this.userStore.officeName
        );

        if (officeData) {
          this.divisions = officeData.divisions.map((div, divIndex) => {
            const hasDirectUnits = div.units && div.units.length > 0;

            const divisionObj = {
              id: divIndex + 1,
              name: div.division,
              expanded: false,
              sections: [],
              units: []
            };

            if (div.sections && div.sections.length > 0) {
              divisionObj.sections = div.sections.map((sec, secIndex) => ({
                id: (divIndex + 1) * 100 + secIndex + 1,
                name: sec.section,
                expanded: false,
                units: sec.units ? sec.units.map((unit, unitIndex) => ({
                  id: ((divIndex + 1) * 100 + secIndex + 1) * 100 + unitIndex + 1,
                  name: unit
                })) : []
              }));
            }

            if (hasDirectUnits) {
              divisionObj.units = div.units.map((unit, unitIndex) => ({
                id: (divIndex + 1) * 1000 + unitIndex + 1,
                name: unit
              }));
            }

            return divisionObj;
          });

          if (officeData.sections_without_division) {
            this.divisions.push({
              id: this.divisions.length + 1,
              name: 'Other Sections',
              expanded: false,
              sections: officeData.sections_without_division.map((sec, secIndex) => ({
                id: (this.divisions.length + 1) * 100 + secIndex + 1,
                name: sec,
                expanded: false,
                units: []
              })),
              units: []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching organization structure:', error);
      } finally {
        this.loading = false;
      }
    },
    calculateDivisionCount(division) {
      return this.employeeStore.employees.filter(emp =>
        emp.division === division.division &&
        emp.office_id === this.userStore.user.office_id
      ).length;
    },
    toggleDivision(division) {
      division.expanded = !division.expanded;
    },
    toggleSection(section) {
      section.expanded = !section.expanded;
    },
    selectDivision(division) {
      this.selectedNode = {
        type: 'division',
        id: division.id,
        name: division.name
      };
      this.employeeStore.fetchEmployeesByNode(this.selectedNode)
        .catch(error => {
          console.error("Error fetching employees:", error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to load employees'
          });
        });
    },
    selectSection(section) {
      this.selectedNode = {
        type: 'section',
        id: section.id,
        name: section.name
      };
      this.employeeStore.fetchEmployeesByNode(this.selectedNode);
    },
    selectUnit(unit) {
      this.selectedNode = {
        type: 'unit',
        id: unit.id,
        name: unit.name
      };
      this.employeeStore.fetchEmployeesByNode(this.selectedNode);
    },
    getDivisionEmployees(division) {
      return this.employeeStore.employees.filter(emp =>
        emp.division === division.name &&
        emp.office_id === this.userStore.user?.office_id
      );
    },
    getSectionEmployees(section) {
      return this.employeeStore.employees.filter(emp =>
        emp.section === section.name &&
        emp.office_id === this.userStore.user?.office_id
      );
    },
    getUnitEmployees(unit) {
      return this.employeeStore.employees.filter(emp =>
        emp.unit === unit.name &&
        emp.office_id === this.userStore.user?.office_id
      );
    },
    async handleAddEmployees(selectedEmployees) {
      try {
        const userStore = useUserStore();
        const officeId = userStore.user?.office_id;

        if (!officeId) {
          throw new Error('Unable to determine office. Please make sure you are properly authenticated.');
        }

        if (!this.selectedNode) {
          throw new Error('Please select an office, division, section, or unit before adding employees.');
        }

        const employeesToAdd = selectedEmployees.map(emp => ({
          name: emp.name,
          position: emp.position,
          office_id: officeId,
          division: this.selectedNode?.type === 'division' ? this.selectedNode.name :
                   this.selectedNode?.type === 'section' || this.selectedNode?.type === 'unit' ?
                   this.getDivisionForNode(this.selectedNode)?.name : null,
          section: this.selectedNode?.type === 'section' ? this.selectedNode.name :
                  this.selectedNode?.type === 'unit' ? this.getSectionForUnit(this.selectedNode)?.name : null,
          unit: this.selectedNode?.type === 'unit' ? this.selectedNode.name : null
        }));

        await this.employeeStore.addEmployees({ employees: employeesToAdd });

        this.$q.notify({
          type: 'positive',
          message: 'Employees added successfully'
        });
      } catch (error) {
        console.error('Error adding employees:', error);
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to add employees'
        });
      }
    },
    getDivisionForNode(node) {
      if (node.type === 'division') return { name: node.name };
      if (node.type === 'section' || node.type === 'unit') {
        for (const division of this.divisions) {
          if (node.type === 'section') {
            const section = division.sections.find(s => s.id === node.id);
            if (section) return division;
          } else {
            for (const section of division.sections) {
              const unit = section.units.find(u => u.id === node.id);
              if (unit) return division;
            }
            const unit = division.units.find(u => u.id === node.id);
            if (unit) return division;
          }
        }
      }
      return null;
    },
    getSectionForUnit(unitNode) {
      for (const division of this.divisions) {
        for (const section of division.sections) {
          const unit = section.units.find(u => u.id === unitNode.id);
          if (unit) return section;
        }
      }
      return null;
    },
    updateEmployeeRank(updatedEmployee) {
      if (updatedEmployee.rank === 'Head') {
        this.employeeStore.employees.forEach(emp => {
          if (
            emp.id !== updatedEmployee.id &&
            this.isSameOrganizationalUnit(emp, updatedEmployee) &&
            emp.rank === 'Head'
          ) {
            emp.rank = ''
          }
        })
      }
    },
    isHeadOptionDisabled(employee) {
      return this.employeeStore.employees.some(emp =>
        emp.id !== employee.id &&
        this.isSameOrganizationalUnit(emp, employee) &&
        emp.rank === 'Head'
      )
    },
    isSameOrganizationalUnit(emp1, emp2) {
      if (this.selectedNode?.type === 'office') {
        return emp1.office_id === emp2.office_id;
      } else if (this.selectedNode?.type === 'division') {
        return emp1.division === emp2.division;
      } else if (this.selectedNode?.type === 'section') {
        return emp1.section === emp2.section;
      } else if (this.selectedNode?.type === 'unit') {
        return emp1.unit === emp2.unit;
      }
      return false;
    },
    deleteEmployee(employeeId) {
      this.employeeStore.deleteEmployee(employeeId).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Employee deleted successfully'
        })
      }).catch(error => {
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to delete employee'
        })
      })
    }
  }
}
</script>

<style scoped>
/* Add office-specific styles */
.tree-node.office {
  padding-left: 10px;
  font-weight: 700;
  color: #1a237e;
  font-size: 1.1em;
}

.sub-items.office-items {
  padding-left: 20px;
}

/* Update existing styles to accommodate new hierarchy */
.tree-node.division {
  padding-left: 40px;
}

.tree-node.section {
  padding-left: 70px;
}

.tree-node.unit {
  padding-left: 100px;
}

/* Adjust the connecting lines for the new hierarchy */
.sub-items.office-items::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -10px;
  bottom: 10px;
  width: 1px;
  background-color: #ccc;
}

.tree-node.division::before {
  left: 30px;
}

.tree-node.section::before {
  left: 60px;
}

.tree-node.unit::before {
  left: 90px;
}
</style>

<style src="../../assets/office/employee.css" scoped></style>

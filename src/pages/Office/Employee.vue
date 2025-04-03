<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="employee-container">
    <div class="organization-panel">
      <div class="tree-view">
        <div v-if="loading" class="loading-container">
          <q-spinner color="primary" size="2em" />
          <span>Loading organization structure...</span>
        </div>

        <div v-else v-for="division in divisions" :key="division.id" class="tree-item">
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

            <!-- Render units directly under division if no sections exist -->
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

    <div class="employee-list-panel">
      <div class="employee-list-container">
        <div class="table-title-container">
          <h3>{{ selectedNodeTitle || 'Select a division, section, or unit' }}</h3>
          <button v-if="selectedNode" class="add-employee-btn" @click="showAddModal = true">
            <q-icon name="add" />
            Add Employee
          </button>
        </div>
        <div class="employee-table">
          <div class="table-header">
            <div class="header-cell">Name</div>
            <div class="header-cell">Position</div>
            <div class="header-cell">Rank</div>
            <div class="header-cell action-cell">Actions</div>
          </div>
          <div v-for="employee in filteredEmployees" :key="employee.id" class="table-row">
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
              <q-btn flat round dense color="negative" icon="delete" @click="deleteEmployee(employee.id)"
                class="action-btn" />
            </div>
          </div>
          <div v-if="filteredEmployees.length === 0" class="empty-row">
            <div class="table-cell" colspan="4">No employees found</div>
          </div>
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

export default {
  components: {
    AddEmployeeModal
  },
  data() {
    return {
      showAddModal: false,
      selectedNode: null,
      divisions: [],
      employees: [],
      userStore: useUserStore(),
      loading: false // Add loading state
    }
  },
  computed: {
    filteredEmployees() {
      if (!this.selectedNode) return []

      switch (this.selectedNode.type) {
        case 'division':
          return this.getDivisionEmployees(this.selectedNode)
        case 'section':
          return this.getSectionEmployees(this.selectedNode)
        case 'unit':
          return this.getUnitEmployees(this.selectedNode)
        default:
          return []
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
    async fetchOrganizationStructure() {
      this.loading = true; // Set loading to true when starting fetch
      try {
        const response = await api.get('/plantilla');
        const officeData = response.data.find(office =>
          office.office === this.userStore.officeName
        );

        if (officeData) {
          this.divisions = officeData.divisions.map((div, divIndex) => {
            // Check if division has units directly (without sections)
            const hasDirectUnits = div.units && div.units.length > 0;

            const divisionObj = {
              id: divIndex + 1,
              name: div.division,
              expanded: false,
              sections: [],
              units: [] // Add units property at division level
            };

            // If division has sections, process them
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

            // If division has direct units, add them to division object
            if (hasDirectUnits) {
              divisionObj.units = div.units.map((unit, unitIndex) => ({
                id: (divIndex + 1) * 1000 + unitIndex + 1, // Use different multiplier to avoid ID conflicts
                name: unit
              }));
            }

            return divisionObj;
          });

          // Add sections without division if they exist
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

          console.log('Processed divisions:', JSON.stringify(this.divisions, null, 2));
        }
      } catch (error) {
        console.error('Error fetching organization structure:', error);
      } finally {
        this.loading = false; // This was missing - ensures loading is always set to false when done
      }
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
    },
    selectSection(section) {
      this.selectedNode = {
        type: 'section',
        id: section.id,
        name: section.name
      };
    },
    selectUnit(unit) {
      this.selectedNode = {
        type: 'unit',
        id: unit.id,
        name: unit.name
      };
    },
    getDivisionEmployees(division) {
      return this.employees.filter(emp => emp.divisionId === division.id);
    },
    getSectionEmployees(section) {
      return this.employees.filter(emp => emp.sectionId === section.id);
    },
    getUnitEmployees(unit) {
      return this.employees.filter(emp => emp.unitId === unit.id);
    },
    handleAddEmployees(selectedEmployees) {
      const newEmployees = selectedEmployees.map(emp => ({
        ...emp,
        id: `NEW-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        [`${this.selectedNode.type}Id`]: this.selectedNode.id,
        rank: ''
      }));

      this.employees = [...this.employees, ...newEmployees];
      this.showAddModal = false;
    },
    deleteEmployee(employeeId) {
      this.employees = this.employees.filter(emp => emp.id !== employeeId);
    },
    updateEmployeeRank(updatedEmployee) {
      if (updatedEmployee.rank === 'Head') {
        this.employees.forEach(emp => {
          if (
            emp.id !== updatedEmployee.id &&
            this.isSameOrganizationalUnit(emp, updatedEmployee) &&
            emp.rank === 'Head'
          ) {
            emp.rank = '';
          }
        });
      }
    },
    isHeadOptionDisabled(employee) {
      return this.employees.some(emp =>
        emp.id !== employee.id &&
        this.isSameOrganizationalUnit(emp, employee) &&
        emp.rank === 'Head'
      );
    },
    isSameOrganizationalUnit(emp1, emp2) {
      if (this.selectedNode?.type === 'division') {
        return emp1.divisionId === emp2.divisionId;
      } else if (this.selectedNode?.type === 'section') {
        return emp1.sectionId === emp2.sectionId;
      } else if (this.selectedNode?.type === 'unit') {
        return emp1.unitId === emp2.unitId;
      }
      return false;
    }
  }
}
</script>
<style scoped lang="scss">
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #555;
}
/* All the previous styles remain exactly the same */
.employee-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.organization-panel {
  width: 350px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  position: relative;
}

.tree-view {
  margin-top: 10px;
}

.tree-item {
  position: relative;
  margin-bottom: 5px;
}

.tree-node {
  position: relative;
  padding: 10px 15px 10px 40px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &.division {
    padding-left: 20px;
    font-weight: 600;
    color: #2c3e50;
  }

  &.section {
    padding-left: 50px;
    font-weight: 500;
    color: #34495e;
  }

  &.unit {
    padding-left: 80px;
    color: #4a5568;
  }

  &:hover {
    background-color: #e9ecef;
  }

  &.active {
    background-color: #e3f2fd;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #e3f2fd;
      z-index: 0;
      border-radius: 4px;
    }
  }
}

.node-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.sub-items {
  position: relative;

  &.division-items {
    &::before {
      content: '';
      position: absolute;
      left: 30px;
      top: -10px;
      bottom: 10px;
      width: 1px;
      background-color: #ccc;
    }
  }

  &.section-items {
    &::before {
      content: '';
      position: absolute;
      left: 60px;
      top: -10px;
      bottom: 10px;
      width: 1px;
      background-color: #ccc;
    }
  }
}

.tree-node.section::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 50%;
  height: 1px;
  width: 20px;
  background-color: #ccc;
}

.tree-node.unit::before {
  content: '';
  position: absolute;
  left: 60px;
  top: 50%;
  height: 1px;
  width: 20px;
  background-color: #ccc;
}

.toggle-icon {
  margin-right: 8px;
  width: 24px;
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.unit-icon {
  margin-right: 8px;
  color: #666;
  z-index: 1;
}

.employee-count {
  margin-left: auto;
  background: #e0e0e0;
  color: #333;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  z-index: 1;
}

.employee-list-panel {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

h3 {
  color: #34495e;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.table-title-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
}

.add-employee-btn {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }
}

.employee-table {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 1px solid #dee2e6;
}

.header-cell {
  padding: 12px 15px;
  flex: 1;

  &.action-cell {
    flex: 0.5;
    text-align: center;
  }
}

.table-row {
  display: flex;
  border-bottom: 1px solid #dee2e6;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}

.table-cell {
  padding: 12px 15px;
  flex: 1;

  &.action-cell {
    flex: 0.5;
    display: flex;
    justify-content: center;
  }
}

.action-btn {
  padding: 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.empty-row {
  display: flex;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 15px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.empty-row .table-cell {
  flex: 1;
}

.rank-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  width: 100%;
  max-width: 150px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
}

select option:disabled {
  color: #ccc;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .employee-container {
    flex-direction: column;
    height: auto;
  }

  .organization-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .rank-select {
    max-width: 100%;
  }
}
</style>

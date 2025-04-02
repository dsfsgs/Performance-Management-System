<template>
  <div class="employee-container">
    <div class="organization-panel">
      <h2>Organization Structure</h2>
      <div class="tree-view">
        <div
          v-for="division in divisions"
          :key="division.id"
          class="tree-item"
        >
          <div
            class="tree-node division"
            @click="selectDivision(division)"
            :class="{ active: selectedNode?.type === 'division' && selectedNode?.id === division.id }"
          >
            <span class="toggle-icon" @click.stop="toggleDivision(division)">
              {{ division.expanded ? '▼' : '►' }}
            </span>
            {{ division.name }}
            <span class="employee-count">{{ getDivisionEmployees(division).length }}</span>
          </div>

          <div v-if="division.expanded" class="sub-items">
            <div
              v-for="section in division.sections"
              :key="section.id"
              class="tree-item"
            >
              <div
                class="tree-node section"
                @click="selectSection(section)"
                :class="{ active: selectedNode?.type === 'section' && selectedNode?.id === section.id }"
              >
                <span class="toggle-icon" @click.stop="toggleSection(section)">
                  {{ section.expanded ? '▼' : '►' }}
                </span>
                {{ section.name }}
                <span class="employee-count">{{ getSectionEmployees(section).length }}</span>
              </div>

              <div v-if="section.expanded" class="sub-items">
                <div
                  v-for="unit in section.units"
                  :key="unit.id"
                  class="tree-item"
                >
                  <div
                    class="tree-node unit"
                    @click="selectUnit(unit)"
                    :class="{ active: selectedNode?.type === 'unit' && selectedNode?.id === unit.id }"
                  >
                    {{ unit.name }}
                    <span class="employee-count">{{ getUnitEmployees(unit).length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="employee-list-panel">
      <h2>Employee List</h2>
      <div class="employee-list-container">
        <div v-if="filteredEmployees.length > 0">
          <h3>{{ selectedNodeTitle }}</h3>
          <div class="employee-table">
            <div class="table-header">
              <div class="header-cell">ID</div>
              <div class="header-cell">Name</div>
              <div class="header-cell">Position</div>
              <div class="header-cell">Status</div>
            </div>
            <div
              v-for="employee in filteredEmployees"
              :key="employee.id"
              class="table-row"
            >
              <div class="table-cell">{{ employee.id }}</div>
              <div class="table-cell">{{ employee.name }}</div>
              <div class="table-cell">{{ employee.position }}</div>
              <div class="table-cell">
                <span class="status-badge" :class="employee.status">
                  {{ employee.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          {{ selectionPrompt }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedNode: null,
      divisions: [
        {
          id: 1,
          name: 'Administration Division',
          expanded: false,
          sections: [
            {
              id: 101,
              name: 'Human Resources Section',
              expanded: false,
              units: [
                { id: 1001, name: 'Recruitment Unit' },
                { id: 1002, name: 'Training Unit' }
              ]
            },
            {
              id: 102,
              name: 'Finance Section',
              expanded: false,
              units: [
                { id: 1003, name: 'Accounting Unit' },
                { id: 1004, name: 'Budget Unit' }
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'Operations Division',
          expanded: false,
          sections: [
            {
              id: 201,
              name: 'Production Section',
              expanded: false,
              units: [
                { id: 2001, name: 'Manufacturing Unit' },
                { id: 2002, name: 'Quality Control Unit' }
              ]
            }
          ]
        }
      ],
      employees: [
        // Division-level employees
        { id: 'D1', name: 'Division Head', position: 'Division Manager', status: 'active', divisionId: 1 },

        // Section-level employees
        { id: 'S101', name: 'HR Director', position: 'Section Head', status: 'active', sectionId: 101 },
        { id: 'S102', name: 'Finance Director', position: 'Section Head', status: 'active', sectionId: 102 },

        // Unit-level employees
        { id: 'U1001', name: 'John Doe', position: 'Recruiter', status: 'active', unitId: 1001 },
        { id: 'U1002', name: 'Jane Smith', position: 'Trainer', status: 'active', unitId: 1002 },
        { id: 'U1003', name: 'Mike Johnson', position: 'Accountant', status: 'active', unitId: 1003 },
        { id: 'U2001', name: 'Sarah Williams', position: 'Production Lead', status: 'on leave', unitId: 2001 },
        { id: 'U2002', name: 'David Brown', position: 'Quality Inspector', status: 'active', unitId: 2002 }
      ]
    }
  },
  computed: {
    filteredEmployees() {
      if (!this.selectedNode) return []

      switch(this.selectedNode.type) {
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
      return `${this.selectedNode.name} Employees`
    },
    selectionPrompt() {
      if (!this.selectedNode) return 'Please select a division, section, or unit to view employees'
      return `No employees found for ${this.selectedNode.name}`
    }
  },
  methods: {
    toggleDivision(division) {
      division.expanded = !division.expanded
    },
    toggleSection(section) {
      section.expanded = !section.expanded
    },
    selectDivision(division) {
      this.selectedNode = {
        type: 'division',
        id: division.id,
        name: division.name
      }
    },
    selectSection(section) {
      this.selectedNode = {
        type: 'section',
        id: section.id,
        name: section.name
      }
    },
    selectUnit(unit) {
      this.selectedNode = {
        type: 'unit',
        id: unit.id,
        name: unit.name
      }
    },
    getDivisionEmployees(division) {
      return this.employees.filter(emp => emp.divisionId === division.id)
    },
    getSectionEmployees(section) {
      return this.employees.filter(emp => emp.sectionId === section.id)
    },
    getUnitEmployees(unit) {
      return this.employees.filter(emp => emp.unitId === unit.id)
    }
  }
}
</script>

<style scoped>
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

.tree-view {
  margin-top: 10px;
}

.tree-item {
  margin-bottom: 5px;
}

.tree-node {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  position: relative;
}

.tree-node:hover {
  background-color: #e9ecef;
}

.tree-node.active {
  background-color: #e3f2fd;
  font-weight: 500;
}

.tree-node.division {
  font-weight: 600;
  color: #2c3e50;
}

.tree-node.section {
  font-weight: 500;
  color: #34495e;
  padding-left: 30px;
}

.tree-node.unit {
  color: #4a5568;
  padding-left: 50px;
}

.toggle-icon {
  margin-right: 8px;
  font-size: 0.8rem;
  width: 12px;
  display: inline-block;
  cursor: pointer;
}

.sub-items {
  margin-left: 15px;
  border-left: 1px dashed #dee2e6;
  padding-left: 10px;
}

.employee-count {
  margin-left: auto;
  background: #e0e0e0;
  color: #333;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
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
}

.table-row {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 15px;
  flex: 1;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.status-badge.on-leave {
  background-color: #fff8e1;
  color: #ff8f00;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
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
}
</style>

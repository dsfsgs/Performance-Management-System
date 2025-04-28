<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="employee-container">
    <!-- Organization Panel -->
    <div class="organization-panel">
      <div class="tree-view">
        <div v-if="loading" class="loading-container">
          <q-spinner-gears color="cyan" />
          <span>Loading organization structure...</span>
        </div>

        <div v-else>
          <div class="tree-item">
            <div class="tree-node office" @click="selectOffice" :class="{ active: selectedNode?.type === 'office' }">
              <div class="toggle-icon" @click.stop="toggleOffice">
                <q-icon :name="officeExpanded ? 'expand_more' : 'chevron_right'" />
              </div>
              <div class="node-content">
                {{ officeName }}
                <span class="employee-count">{{ employeeStore.employeeCounts?.office || 0 }}</span>
              </div>
            </div>

            <div v-if="officeExpanded" class="sub-items office-items">
              <div v-for="division in divisions" :key="division.id" class="tree-item">
                <div class="tree-node division" @click="selectDivision(division)"
                  :class="{ active: selectedNode?.type === 'division' && selectedNode?.id === division.id }">
                  <div class="toggle-icon" @click.stop="toggleDivision(division)">
                    <q-icon :name="division.expanded ? 'expand_more' : 'chevron_right'" />
                  </div>
                  <div class="node-content">
                    {{ division.name }}
                    <span class="employee-count">{{ division.count || 0 }}</span>
                  </div>
                </div>

                <div v-if="division.expanded" class="sub-items division-items">
                  <div v-for="section in division.sections" :key="section.id" class="tree-item">
                    <div class="tree-node section" @click="selectSection(section)"
                      :class="{ active: selectedNode?.type === 'section' && selectedNode?.id === section.id }">
                      <div class="toggle-icon" @click.stop="toggleSection(section)">
                        <q-icon :name="section.expanded ? 'expand_more' : 'chevron_right'" />
                      </div>
                      <div class="node-content">
                        {{ section.name }}
                        <span class="employee-count">{{ section.count || 0 }}</span>
                      </div>
                    </div>

                    <div v-if="section.expanded" class="sub-items section-items">
                      <div v-for="unit in section.units" :key="unit.id" class="tree-item">
                        <div class="tree-node unit" @click="selectUnit(unit)"
                          :class="{ active: selectedNode?.type === 'unit' && selectedNode?.id === unit.id }">
                          <div class="unit-icon">•</div>
                          <div class="node-content">
                            {{ unit.name }}
                            <span class="employee-count">{{ unit.count || 0 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="division.units?.length" class="sub-items">
                    <div v-for="unit in division.units" :key="unit.id" class="tree-item">
                      <div class="tree-node unit" @click="selectUnit(unit)"
                        :class="{ active: selectedNode?.type === 'unit' && selectedNode?.id === unit.id }">
                        <div class="unit-icon">•</div>
                        <div class="node-content">
                          {{ unit.name }}
                          <span class="employee-count">{{ unit.count || 0 }}</span>
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
    </div>

    <!-- Employee List Panel -->
    <div class="employee-list-panel">
      <div class="employee-list-container">
        <div class="table-title-container">
          <h3>{{ selectedNodeTitle || 'Select an office, division, section, or unit' }}</h3>
          <button v-if="selectedNode" class="add-employee-btn" @click="openAddModal">
            <q-icon name="add" />
            Select Employees
          </button>
        </div>

        <div class="employee-table">
          <q-table v-if="!loading && !employeeStore.loading" :rows="filteredEmployees" :columns="columns" row-key="id"
            flat bordered :loading="employeeStore.loading" :pagination="{ rowsPerPage: 10 }"
            :rows-per-page-options="[10, 20, 50]">

            <template v-slot:loading>
              <div class="loading-container">
                <q-spinner-gears color="cyan" />
                <span>Loading employees...</span>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="empty-row">No employees found</div>
            </template>

            <template v-slot:body-cell-rank="props">
              <q-td :props="props">
                <q-select v-model="props.row.rank" :options="rankOptions" option-value="value" option-label="label"
                  emit-value map-options dense outlined
                  @update:model-value="(val) => updateEmployeeRank(props.row, val)"
                  :option-disable="opt => opt.disable ? opt.disable(props.row) : false" />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn icon="delete" color="negative" flat dense @click="deleteEmployee(props.row.id)" />
              </q-td>
            </template>
          </q-table>

          <div v-if="loading || employeeStore.loading" class="loading-container">
            <q-spinner-gears color="cyan" />
            <span>Loading employees...</span>
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
import { useEmployeeStore } from 'stores/office/employeeStore';

export default {
  components: { AddEmployeeModal },
  setup() {
    const employeeStore = useEmployeeStore();
    return { employeeStore };
  },
  data() {
    return {
      showAddModal: false,
      selectedNode: null,
      loading: false,
      officeExpanded: false,
      divisions: [],
      columns: [
        { name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true },
        { name: 'position', label: 'Position', align: 'left', field: row => row.position, sortable: true },
        { name: 'rank', label: 'Rank', align: 'left', field: row => row.rank, sortable: true },
        { name: 'actions', label: 'Actions', align: 'center', sortable: false }
      ],

    };
  },
  computed: {
    rankOptions() {
      return [
        { value: 'Employee', label: 'Employee' },
        { value: 'Supervisor', label: 'Supervisor' },
        { value: 'Rank-in-File', label: 'Rank-in-File' },
        { value: 'Managerial', label: 'Managerial' },
        {
          value: 'Head',
          label: 'Head',
          disable: (employee) => this.isHeadOptionDisabled(employee)
        }
      ];
    },
    filteredEmployees() {
      if (!this.selectedNode) return [];

      return this.employeeStore.assignedEmployees.filter(emp => {
        if (emp.unit) {
          return this.selectedNode.type === 'unit' && emp.unit === this.selectedNode.name;
        }
        if (emp.section) {
          return this.selectedNode.type === 'section' && emp.section === this.selectedNode.name && !emp.unit;
        }
        if (emp.division) {
          return this.selectedNode.type === 'division' && emp.division === this.selectedNode.name && !emp.section && !emp.unit;
        }
        return this.selectedNode.type === 'office' && !emp.division && !emp.section && !emp.unit;
      });
    },
    selectedNodeTitle() {
      return this.selectedNode?.name || '';
    },
    officeName() {
      return useUserStore().officeName;
    }
  },
  async created() {
    await this.fetchOrganizationStructure();
  },
  methods: {
    openAddModal() {
      this.showAddModal = true;
      this.employeeStore.fetchUnassignedEmployees();
    },
    toggleOffice(event) {
      if (event) event.stopPropagation();
      this.officeExpanded = !this.officeExpanded;
      if (this.officeExpanded && !this.selectedNode) {
        this.selectOffice();
      }
    },
    selectOffice() {
      this.selectedNode = {
        type: 'office',
        id: useUserStore().user?.office_id,
        name: this.officeName
      };
      this.employeeStore.currentNode = this.selectedNode;
      this.employeeStore.fetchEmployeesByNode(this.selectedNode)
        .catch(error => {
          console.error("Error fetching employees:", error);
          this.$q.notify({ type: 'negative', message: 'Failed to load employees' });
        });
    },

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
            this.$q.notify({ type: 'positive', message: result.message || 'Employee moved to trash' });
            if (result.deletedEmployee) this.updateLocalCountsAfterDelete(result.deletedEmployee);
            if (this.selectedNode) await this.employeeStore.fetchEmployeesByNode(this.selectedNode);
            this.$forceUpdate();
          } else {
            throw new Error(result?.message || 'Failed to delete employee');
          }
        } catch (error) {
          this.$q.notify({ type: 'negative', message: error.message || 'Failed to delete employee' });
        }
      });
    },

    // eslint-disable-next-line no-unused-vars
    updateLocalCountsAfterDelete(deletedEmployee) {
      if (this.employeeStore.employeeCounts?.office > 0) {
        this.employeeStore.employeeCounts.office--;
      }
      // Similar updates for division, section, unit counts...
    },
    async fetchOrganizationStructure() {
      this.loading = true;
      try {
        const [structureResponse, counts] = await Promise.all([
          api.get('/office/structure'),
          this.employeeStore.fetchEmployeeCounts(useUserStore().user?.office_id)
        ]);

        const officeData = structureResponse.data.find(office =>
          office.office === this.officeName
        );

        if (officeData) {
          this.divisions = this.processOrganizationData(officeData, counts);
        }
      } catch (error) {
        console.error('Error fetching organization structure:', error);
      } finally {
        this.loading = false;
      }
    },

    processOrganizationData(officeData, counts) {
      // Process divisions with their sections and units
      const divisions = officeData.divisions.map((div, divIndex) => {
        const divisionCount = counts.divisions[div.division]?.count || 0;
        const divisionObj = {
          id: divIndex + 1,
          name: div.division,
          expanded: false,
          count: divisionCount,
          sections: [],
          units: []
        };

        // Process sections within division
        if (div.sections?.length) {
          divisionObj.sections = div.sections.map((sec, secIndex) => {
            const sectionCount = counts.sections[sec.section]?.count || 0;
            return {
              id: (divIndex + 1) * 100 + secIndex + 1,
              name: sec.section,
              expanded: false,
              count: sectionCount,
              units: sec.units?.map((unit, unitIndex) => ({
                id: ((divIndex + 1) * 100 + secIndex + 1) * 100 + unitIndex + 1,
                name: unit,
                count: counts.units[unit]?.count || 0
              })) || []
            };
          });
        }

        // Process units directly under division
        if (div.units_without_section?.length) {
          divisionObj.units = div.units_without_section.map((unit, unitIndex) => ({
            id: (divIndex + 1) * 1000 + unitIndex + 1,
            name: unit,
            count: counts.units[unit]?.count || 0
          }));
        }

        return divisionObj;
      });

      // Process sections without division
      if (officeData.sections_without_division?.length) {
        const noDivisionSection = {
          id: 9999, // Special ID for no-division sections
          name: 'Sections Without Division',
          expanded: false,
          count: 0,
          sections: officeData.sections_without_division.map((sec, secIndex) => {
            const sectionCount = counts.sections[sec.section]?.count || 0;
            return {
              id: 9999 * 100 + secIndex + 1,
              name: sec.section,
              expanded: false,
              count: sectionCount,
              units: sec.units?.map((unit, unitIndex) => ({
                id: (9999 * 100 + secIndex + 1) * 100 + unitIndex + 1,
                name: unit,
                count: counts.units[unit]?.count || 0
              })) || []
            };
          })
        };
        divisions.push(noDivisionSection);
      }

      // Process units without division or section
      if (officeData.units_without_division?.length) {
        const noDivisionUnit = {
          id: 9998, // Special ID for no-division units
          name: 'Units Without Division',
          expanded: false,
          count: 0,
          units: officeData.units_without_division.map((unit, unitIndex) => ({
            id: 9998 * 100 + unitIndex + 1,
            name: unit,
            count: counts.units[unit]?.count || 0
          }))
        };
        divisions.push(noDivisionUnit);
      }

      return divisions;
    },
    toggleDivision(division, event) {
      if (event) event.stopPropagation();
      division.expanded = !division.expanded;
    },
    toggleSection(section, event) {
      if (event) event.stopPropagation();
      section.expanded = !section.expanded;
    },

    async selectDivision(division) {
      this.selectedNode = { type: 'division', id: division.id, name: division.name };
      await this.loadNodeEmployees();
    },

    async selectSection(section) {
      this.selectedNode = { type: 'section', id: section.id, name: section.name };
      await this.loadNodeEmployees();
    },

    async selectUnit(unit) {
      this.selectedNode = { type: 'unit', id: unit.id, name: unit.name };
      await this.loadNodeEmployees();
    },

    async loadNodeEmployees() {
      await this.employeeStore.fetchEmployeesByNode(this.selectedNode);
      const counts = await this.employeeStore.fetchEmployeeCounts(useUserStore().user?.office_id);
      this.updateLocalCounts(counts);
    },

    updateLocalCounts(counts) {
      this.divisions.forEach(division => {
        division.count = counts.divisions[division.name]?.count || 0;
        division.sections.forEach(section => {
          section.count = counts.sections[section.name]?.count || 0;
          section.units.forEach(unit => {
            unit.count = counts.units[unit.name]?.count || 0;
          });
        });
        division.units?.forEach(unit => {
          unit.count = counts.units[unit.name]?.count || 0;
        });
      });
    },

    async handleAddEmployees(selectedEmployees) {
      try {
        const userStore = useUserStore();
        const officeId = userStore.user?.office_id;
        const officeName = userStore.officeName;

        if (!officeId || !this.selectedNode) {
          throw new Error(!officeId
            ? 'Unable to determine office. Please make sure you are properly authenticated.'
            : 'Please select an office, division, section, or unit before adding employees.');
        }

        const employeesToAdd = selectedEmployees.map(emp => ({
          name: emp.name,
          position: emp.position,
          office_id: officeId,
          office: officeName,
          division: this.getDivisionForSelectedNode(),
          section: this.getSectionForSelectedNode(),
          unit: this.selectedNode.type === 'unit' ? this.selectedNode.name : null
        }));

        await this.employeeStore.addEmployees({ employees: employeesToAdd });

        if (this.selectedNode) {
          await this.employeeStore.fetchEmployeesByNode(this.selectedNode);
          const counts = await this.employeeStore.fetchEmployeeCounts(officeId);
          this.updateLocalCounts(counts);
        }

        this.$q.notify({ type: 'positive', message: 'Employees added successfully' });
      } catch (error) {
        console.error('Error adding employees:', error);
        this.$q.notify({ type: 'negative', message: error.message || 'Failed to add employees' });
      } finally {
        this.showAddModal = false;
      }
    },

    getDivisionForSelectedNode() {
      if (this.selectedNode.type === 'division') return this.selectedNode.name;

      if (this.selectedNode.type === 'section' || this.selectedNode.type === 'unit') {
        for (const division of this.divisions) {
          if (this.selectedNode.type === 'section') {
            if (division.sections.some(s => s.id === this.selectedNode.id)) {
              return division.name;
            }
          } else {
            if (division.sections.some(s => s.units.some(u => u.id === this.selectedNode.id))) {
              return division.name;
            }
            if (division.units?.some(u => u.id === this.selectedNode.id)) {
              return division.name;
            }
          }
        }
      }
      return null;
    },
    getSectionForSelectedNode() {
      if (this.selectedNode.type === 'section') return this.selectedNode.name;
      if (this.selectedNode.type === 'unit') {
        for (const division of this.divisions) {
          for (const section of division.sections) {
            if (section.units.some(u => u.id === this.selectedNode.id)) return section.name;
          }
        }
      }
      return null;
    },
    async updateEmployeeRank(employee, newRank) {
      // Store the original rank in case user cancels
      const originalRank = employee.rank;

      // Show confirmation dialog
      this.$q.dialog({
        title: 'Confirm Rank Change',
        message: `Are you sure you want to change ${employee.name}'s rank to ${newRank}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          // If changing to Head, ensure no other Heads in same unit
          if (newRank === 'Head') {
            const currentHead = this.filteredEmployees.find(emp =>
              emp.id !== employee.id &&
              this.isSameOrganizationalUnit(emp, employee) &&
              emp.rank === 'Head'
            );

            if (currentHead) {
              // Ask if they want to demote the current head
              this.$q.dialog({
                title: 'Current Head Exists',
                message: `There is already a Head (${currentHead.name}) in this unit. Do you want to demote them to Employee?`,
                cancel: true,
                persistent: true
              }).onOk(async () => {
                try {
                  await this.employeeStore.updateEmployeeRank(currentHead.id, 'Employee');
                  currentHead.rank = 'Employee';
                  await this.saveRankChange(employee, newRank);
                } catch (error) {
                  console.error('Failed to demote current head:', error);
                  employee.rank = originalRank;
                  this.$q.notify({
                    type: 'negative',
                    message: 'Failed to demote current head'
                  });
                }
              }).onCancel(() => {
                employee.rank = originalRank;
              });
            } else {
              await this.saveRankChange(employee, newRank);
            }
          } else {
            await this.saveRankChange(employee, newRank);
          }
        } catch (error) {
          console.error('Failed to update rank:', error);
          employee.rank = originalRank;
          this.$q.notify({
            type: 'negative',
            message: `Failed to update rank: ${error.message}`
          });
        }
      }).onCancel(() => {
        // Revert the change if user cancels
        employee.rank = originalRank;
      });
    },



    async saveRankChange(employee, newRank) {
      await this.employeeStore.updateEmployeeRank(employee.id, newRank);
      employee.rank = newRank;
      this.$q.notify({
        type: 'positive',
        message: `${employee.name}'s rank updated to ${newRank}`
      });
    },

    isHeadOptionDisabled(employee) {
      // If no node is selected, allow Head selection
      if (!this.selectedNode) return false;

      // Check if there's already a Head in the same organizational unit
      return this.filteredEmployees.some(emp =>
        emp.id !== employee.id &&
        emp.rank === 'Head' &&
        this.isSameOrganizationalUnit(emp, employee)
      );
    },
    isSameOrganizationalUnit(emp1, emp2) {
      // For office-level comparison
      if (this.selectedNode?.type === 'office') {
        return emp1.office_id === emp2.office_id &&
          !emp1.division && !emp1.section && !emp1.unit &&
          !emp2.division && !emp2.section && !emp2.unit;
      }

      // For division-level comparison
      if (this.selectedNode?.type === 'division') {
        return emp1.division === emp2.division &&
          emp1.division === this.selectedNode.name &&
          !emp1.section && !emp2.section &&
          !emp1.unit && !emp2.unit;
      }

      // For section-level comparison
      if (this.selectedNode?.type === 'section') {
        return emp1.section === emp2.section &&
          emp1.section === this.selectedNode.name &&
          (!emp1.unit || emp1.unit === emp2.unit);
      }

      // For unit-level comparison
      if (this.selectedNode?.type === 'unit') {
        return emp1.unit === emp2.unit &&
          emp1.unit === this.selectedNode.name;
      }

      return false;
    },
  }
};
</script>

<style scoped>
.employee-table {
  height: calc(100% - 60px);
  /* Adjust based on your layout */
}

.q-table {
  height: 100%;
}

.empty-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(0, 0, 0, 0.54);
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: rgba(0, 0, 0, 0.54);
}

.q-table__top {
  padding: 8px 16px;
}

.q-table__bottom {
  padding: 8px 16px;
}

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

/* Add new styles for better clicking */
.toggle-icon {
  display: inline-block;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
}

.node-content {
  display: inline-block;
  cursor: pointer;
  flex-grow: 1;
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.unit-icon {
  display: inline-block;
  margin-right: 5px;
}

/* Add hover effect for better UX */
.tree-node:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Active node styling */
.tree-node.active {
  background-color: rgba(25, 118, 210, 0.1);
  font-weight: bold;
}
</style>

<style src="../../assets/office/employee.css" scoped></style>

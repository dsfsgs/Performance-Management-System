<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="employee-container">
    <!-- Organization Panel -->
    <div class="organization-panel">
      <div v-if="loading" class="loading-container">
        <q-spinner-gears color="cyan" />
        <span>Loading organization structure...</span>
      </div>
      <q-tree v-else :nodes="treeNodes" node-key="id" v-model:expanded="expandedNodes" v-model:selected="selectedNodeId"
        @update:expanded="updateExpanded" @update:selected="selectNode" default-expand-all>
        <template v-slot:default-header="{ node }">
          <div class="node-label">
            <q-icon :name="node.icon" class="node-icon" />
            {{ node.label }}
            <span class="employee-count">{{ node.count || 0 }}</span>
          </div>
        </template>
      </q-tree>
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
          <q-table v-if="selectedNode && !loading && !employeeStore.loading" :rows="filteredEmployees"
            :columns="columns" row-key="id" flat bordered :loading="employeeStore.loading"
            :pagination="{ rowsPerPage: 10 }" :rows-per-page-options="[10, 20, 50]">
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
      selectedNodeId: null,
      selectedNode: null,
      loading: false,
      treeNodes: [],
      expandedNodes: [],
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
      const baseOptions = [
        { value: 'Employee', label: 'Employee' },
        { value: 'Supervisor', label: 'Supervisor' },
        { value: 'Rank-in-File', label: 'Rank-in-File' },
        { value: 'Managerial', label: 'Managerial' }
      ];

      if (this.selectedNode) {
        switch (this.selectedNode.type) {
          case 'office':
            baseOptions.push({
              value: 'Office-Head',
              label: 'Office-Head',
              disable: (employee) => this.isHeadOptionDisabled(employee, 'Office-Head')
            });
            break;
          case 'division':
            baseOptions.push({
              value: 'Division-Head',
              label: 'Division-Head',
              disable: (employee) => this.isHeadOptionDisabled(employee, 'Division-Head')
            });
            break;
          case 'section':
            baseOptions.push({
              value: 'Section-Head',
              label: 'Section-Head',
              disable: (employee) => this.isHeadOptionDisabled(employee, 'Section-Head')
            });
            break;
        }
      }

      return baseOptions;
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
      return this.selectedNode?.label || this.selectedNode?.name || '';
    },
    officeName() {
      return useUserStore().officeName;
    }
  },
  async created() {
    await this.fetchOrganizationStructure();
  },
  methods: {
    findNodeById(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = this.findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    isHeadOptionDisabled(employee, headType) {
      if (!this.selectedNode) return false;

      return this.filteredEmployees.some(emp => {
        if (emp.id === employee.id) return false;
        if (emp.rank !== headType) return false;
        return this.isSameOrganizationalUnit(emp, employee);
      });
    },
    openAddModal() {
      this.showAddModal = true;
      this.employeeStore.fetchUnassignedEmployees();
    },
    updateExpanded(expanded) {
      this.expandedNodes = expanded;
    },
    async selectNode(nodeId) {
      this.selectedNode = this.findNodeById(this.treeNodes, nodeId);
      this.employeeStore.currentNode = this.selectedNode;
      try {
        await this.employeeStore.fetchEmployeesByNode(this.selectedNode);
      } catch (error) {
        console.error('Error fetching employees for node:', error);
        this.$q.notify({ type: 'negative', message: 'Failed to load employees' });
      }
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
      this.updateTreeCounts();
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
          this.treeNodes = [this.processOrganizationData(officeData, counts)];
          this.expandedNodes = [this.treeNodes[0].id];
          // Set initial selectedNode to office
          this.selectedNodeId = this.treeNodes[0].id;
          this.selectedNode = this.treeNodes[0];
          this.employeeStore.currentNode = this.selectedNode;
          await this.employeeStore.fetchEmployeesByNode(this.selectedNode);
        }
      } catch (error) {
        console.error('Error fetching organization structure:', error);
        this.$q.notify({ type: 'negative', message: 'Failed to load organization structure' });
      } finally {
        this.loading = false;
      }
    },
    processOrganizationData(officeData, counts) {
      const officeNode = {
        id: useUserStore().user?.office_id,
        label: this.officeName,
        name: this.officeName,
        type: 'office',
        icon: 'business',
        count: counts.office || 0,
        children: []
      };

      const divisions = officeData.divisions.map((div, divIndex) => {
        const divisionCount = counts.divisions[div.division]?.count || 0;
        return {
          id: divIndex + 1,
          label: div.division,
          name: div.division,
          type: 'division',
          icon: 'apartment',
          count: divisionCount,
          children: [
            ...(div.sections?.map((sec, secIndex) => ({
              id: (divIndex + 1) * 100 + secIndex + 1,
              label: sec.section,
              name: sec.section,
              type: 'section',
              icon: 'group',
              count: counts.sections[sec.section]?.count || 0,
              children: sec.units?.map((unit, unitIndex) => ({
                id: ((divIndex + 1) * 100 + secIndex + 1) * 100 + unitIndex + 1,
                label: unit,
                name: unit,
                type: 'unit',
                icon: 'person',
                count: counts.units[unit]?.count || 0
              })) || []
            })) || []),
            ...(div.units_without_section?.map((unit, unitIndex) => ({
              id: (divIndex + 1) * 1000 + unitIndex + 1,
              label: unit,
              name: unit,
              type: 'unit',
              icon: 'person',
              count: counts.units[unit]?.count || 0
            })) || [])
          ]
        };
      });

      if (officeData.sections_without_division?.length) {
        divisions.push({
          id: 9999,
          label: 'SECTIONS WITHOUT DIVISION',
          name: 'Sections Without Division',
          type: 'division',
          icon: 'apartment',
          count: 0,
          children: officeData.sections_without_division.map((sec, secIndex) => ({
            id: 9999 * 100 + secIndex + 1,
            label: sec.section,
            name: sec.section,
            type: 'section',
            icon: 'group',
            count: counts.sections[sec.section]?.count || 0,
            children: sec.units?.map((unit, unitIndex) => ({
              id: (9999 * 100 + secIndex + 1) * 100 + unitIndex + 1,
              label: unit,
              name: unit,
              type: 'unit',
              icon: 'person',
              count: counts.units[unit]?.count || 0
            })) || []
          }))
        });
      }

      if (officeData.units_without_division?.length) {
        divisions.push({
          id: 9998,
          label: 'Units Without Division',
          name: 'Units Without Division',
          type: 'division',
          icon: 'apartment',
          count: 0,
          children: officeData.units_without_division.map((unit, unitIndex) => ({
            id: 9998 * 100 + unitIndex + 1,
            label: unit,
            name: unit,
            type: 'unit',
            icon: 'person',
            count: counts.units[unit]?.count || 0
          }))
        });
      }

      officeNode.children = divisions;
      return officeNode;
    },
    updateTreeCounts() {
      this.employeeStore.fetchEmployeeCounts(useUserStore().user?.office_id).then(counts => {
        const updateNodeCounts = (node) => {
          if (node.type === 'office') {
            node.count = counts.office || 0;
          } else if (node.type === 'division') {
            node.count = counts.divisions[node.name]?.count || 0;
          } else if (node.type === 'section') {
            node.count = counts.sections[node.name]?.count || 0;
          } else if (node.type === 'unit') {
            node.count = counts.units[node.name]?.count || 0;
          }
          if (node.children) {
            node.children.forEach(child => updateNodeCounts(child));
          }
        };
        this.treeNodes.forEach(node => updateNodeCounts(node));
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
          this.updateTreeCounts();
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
        const findDivision = (nodes) => {
          for (const node of nodes) {
            if (node.type === 'division') {
              if (node.children.some(child => child.id === this.selectedNode.id)) {
                return node.name;
              }
              const found = findDivision(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        return findDivision(this.treeNodes);
      }
      return null;
    },
    getSectionForSelectedNode() {
      if (this.selectedNode.type === 'section') return this.selectedNode.name;
      if (this.selectedNode.type === 'unit') {
        const findSection = (nodes) => {
          for (const node of nodes) {
            if (node.type === 'section' && node.children.some(child => child.id === this.selectedNode.id)) {
              return node.name;
            }
            const found = findSection(node.children);
            if (found) return found;
          }
          return null;
        };
        return findSection(this.treeNodes);
      }
      return null;
    },
    async updateEmployeeRank(employee, newRank) {
      const originalRank = employee.rank;

      this.$q.dialog({
        title: 'Confirm Rank Change',
        message: `Are you sure you want to change ${employee.name}'s rank to ${newRank}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          if (['Office-Head', 'Division-Head', 'Section-Head'].includes(newRank)) {
            const currentHead = this.filteredEmployees.find(emp =>
              emp.id !== employee.id &&
              this.isSameOrganizationalUnit(emp, employee) &&
              emp.rank === newRank
            );

            if (currentHead) {
              this.$q.dialog({
                title: 'Current Head Exists',
                message: `There is already a ${newRank} (${currentHead.name}) in this unit. Do you want to demote them to Employee?`,
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
    isSameOrganizationalUnit(emp1, emp2) {
      if (this.selectedNode?.type === 'office') {
        return emp1.office_id === emp2.office_id &&
          !emp1.division && !emp1.section && !emp1.unit &&
          !emp2.division && !emp2.section && !emp2.unit;
      }

      if (this.selectedNode?.type === 'division') {
        return emp1.division === emp2.division &&
          emp1.division === this.selectedNode.name &&
          !emp1.section && !emp2.section &&
          !emp1.unit && !emp2.unit;
      }

      if (this.selectedNode?.type === 'section') {
        return emp1.section === emp2.section &&
          emp1.section === this.selectedNode.name &&
          (!emp1.unit || emp1.unit === emp2.unit);
      }

      if (this.selectedNode?.type === 'unit') {
        return emp1.unit === emp2.unit &&
          emp1.unit === this.selectedNode.name;
      }

      return false;
    },
  }
};
</script>

<style src="../../assets/office/employee.css" scoped></style>


.employee-container {
display: flex;
min-height: 100vh;
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

.q-tree {
font-size: 0.9rem;
}

.q-tree__node--selected {
background-color: rgba(25, 118, 210, 0.1);
font-weight: bold;
}

.node-label {
display: flex;
align-items: center;
flex-grow: 1;
}

.node-icon {
font-size: 1rem;
margin-right: 8px;
color: #666;
}

.employee-count {
margin-left: auto;
background: #e0e0e0;
color: #222;
border-radius: 10px;
padding: 2px 8px;
font-size: 0.7rem;
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
}

.add-employee-btn:hover {
background: #2980b9;
}

.employee-table {
flex-grow: 1;
display: flex;
flex-direction: column;
border: 1px solid #dee2e6;
border-radius: 8px;
overflow: hidden;
}

.q-table {
flex-grow: 1;
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

.rank-select {
padding: 6px 10px;
border: 1px solid #ddd;
border-radius: 4px;
background-color: white;
width: 100%;
max-width: 150px;
cursor: pointer;
}

.rank-select:focus {
outline: none;
border-color: #3498db;
box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

@media (max-width: 768px) {
.employee-container {
flex-direction: column;
min-height: auto;
}

.organization-panel {
width: 100%;
max-height: 50vh;
overflow-y: auto;
border-right: none;
border-bottom: 1px solid #dee2e6;
}

.employee-table {
overflow-x: auto;
}

.rank-select {
max-width: 100%;
}
}

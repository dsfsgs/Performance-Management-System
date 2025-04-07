
// import AddEmployeeModal from '../../../components/AddEmployeeModal.vue';
// import { api } from 'src/boot/axios';
// import { useUserStore } from 'src/stores/userStore';
// import { useEmployeeStore } from 'stores/office/employee'
// import

// export default {
//   components: {
//     AddEmployeeModal
//   }, setup() {
//     const employeeStore = useEmployeeStore()
//     return { employeeStore }
//   },
//   data() {
//     return {
//       showAddModal: false,
//       selectedNode: null,
//       divisions: [],
//       employees: [],
//       // filteredEmployees: [], // This will store currently displayed employees
//       userStore: useUserStore(),
//       loading: false // Add loading state
//     }
//   },

//   computed: {
//     filteredEmployees() {
//       if (!this.selectedNode) return []

//       switch (this.selectedNode.type) {
//         case 'division':
//           return this.getDivisionEmployees(this.selectedNode)
//         case 'section':
//           return this.getSectionEmployees(this.selectedNode)
//         case 'unit':
//           return this.getUnitEmployees(this.selectedNode)
//         default:
//           return []
//       }
//     },
//     selectedNodeTitle() {
//       if (!this.selectedNode) return ''
//       return `${this.selectedNode.name}`
//     },
//     officeName() {
//       return this.userStore.officeName
//     }
//   },
//   async created() {
//     await this.fetchOrganizationStructure();
//   },
//   methods: {

//     async fetchOrganizationStructure() {
//       this.loading = true; // Set loading to true when starting fetch
//       try {
//         const response = await api.get('/plantilla');
//         const officeData = response.data.find(office =>
//           office.office === this.userStore.officeName
//         );
//         // Now fetch all employees for this office

//         if (officeData) {
//           this.divisions = officeData.divisions.map((div, divIndex) => {
//             // Check if division has units directly (without sections)
//             const hasDirectUnits = div.units && div.units.length > 0;

//             const divisionObj = {
//               id: divIndex + 1,
//               name: div.division,
//               expanded: false,
//               sections: [],
//               units: [] // Add units property at division level
//             };

//             // If division has sections, process them
//             if (div.sections && div.sections.length > 0) {
//               divisionObj.sections = div.sections.map((sec, secIndex) => ({
//                 id: (divIndex + 1) * 100 + secIndex + 1,
//                 name: sec.section,
//                 expanded: false,
//                 units: sec.units ? sec.units.map((unit, unitIndex) => ({
//                   id: ((divIndex + 1) * 100 + secIndex + 1) * 100 + unitIndex + 1,
//                   name: unit
//                 })) : []
//               }));
//             }

//             // If division has direct units, add them to division object
//             if (hasDirectUnits) {
//               divisionObj.units = div.units.map((unit, unitIndex) => ({
//                 id: (divIndex + 1) * 1000 + unitIndex + 1, // Use different multiplier to avoid ID conflicts
//                 name: unit
//               }));
//             }

//             return divisionObj;
//           });

//           // Add sections without division if they exist
//           if (officeData.sections_without_division) {
//             this.divisions.push({
//               id: this.divisions.length + 1,
//               name: 'Other Sections',
//               expanded: false,
//               sections: officeData.sections_without_division.map((sec, secIndex) => ({
//                 id: (this.divisions.length + 1) * 100 + secIndex + 1,
//                 name: sec,
//                 expanded: false,
//                 units: []
//               })),
//               units: []
//             });
//           }

//           console.log('Processed divisions:', JSON.stringify(this.divisions, null, 2));
//         }
//       } catch (error) {
//         console.error('Error fetching organization structure:', error);
//       } finally {
//         this.loading = false; // This was missing - ensures loading is always set to false when done
//       }
//     },
//     toggleDivision(division) {
//       division.expanded = !division.expanded;
//     },
//     toggleSection(section) {
//       section.expanded = !section.expanded;
//     },
//     selectDivision(division) {
//       this.selectedNode = {
//         type: 'division',
//         id: division.id,
//         name: division.name
//       };
//     },
//     selectSection(section) {
//       this.selectedNode = {
//         type: 'section',
//         id: section.id,
//         name: section.name
//       };
//     },
//     selectUnit(unit) {
//       this.selectedNode = {
//         type: 'unit',
//         id: unit.id,
//         name: unit.name
//       };
//     },
//     getDivisionEmployees(division) {
//       return this.employees.filter(emp => emp.divisionId === division.id);
//     },
//     getSectionEmployees(section) {
//       return this.employees.filter(emp => emp.sectionId === section.id);
//     },
//     getUnitEmployees(unit) {
//       return this.employees.filter(emp => emp.unitId === unit.id);
//     },
//     async handleAddEmployees(selectedEmployees) {
//       try {
//         const userStore = useUserStore()
//         const officeId = userStore.user?.office_id

//         if (!officeId) {
//           throw new Error('Unable to determine office. Please make sure you are properly authenticated.')
//         }

//         const employeesToAdd = selectedEmployees.map(emp => ({
//           name: emp.name,
//           position: emp.position,
//           office_id: officeId,  // This is now properly set
//           division: this.selectedNode?.type === 'division' ? this.selectedNode.name : null,
//           section: this.selectedNode?.type === 'section' ? this.selectedNode.name : null,
//           unit: this.selectedNode?.type === 'unit' ? this.selectedNode.name : null
//         }));

//         await this.employeeStore.addEmployees({ employees: employeesToAdd })

//         this.$q.notify({
//           type: 'positive',
//           message: 'Employees added successfully'
//         })
//       } catch (error) {
//         console.error('Error adding employees:', error)
//         this.$q.notify({
//           type: 'negative',
//           message: error.message || 'Failed to add employees'
//         })
//       }
//     },
//     updateEmployeeRank(updatedEmployee) {
//       if (updatedEmployee.rank === 'Head') {
//         this.employees.forEach(emp => {
//           if (
//             emp.id !== updatedEmployee.id &&
//             this.isSameOrganizationalUnit(emp, updatedEmployee) &&
//             emp.rank === 'Head'
//           ) {
//             emp.rank = '';
//           }
//         });
//       }
//     },
//     isHeadOptionDisabled(employee) {
//       return this.employees.some(emp =>
//         emp.id !== employee.id &&
//         this.isSameOrganizationalUnit(emp, employee) &&
//         emp.rank === 'Head'
//       );
//     },
//     isSameOrganizationalUnit(emp1, emp2) {
//       if (this.selectedNode?.type === 'division') {
//         return emp1.divisionId === emp2.divisionId;
//       } else if (this.selectedNode?.type === 'section') {
//         return emp1.sectionId === emp2.sectionId;
//       } else if (this.selectedNode?.type === 'unit') {
//         return emp1.unitId === emp2.unitId;
//       }
//       return false;
//     }
//   }
// }



import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useUserStore } from 'src/stores/userStore';

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    structure: ref([]),
    loading: ref(false),
    error: ref(null),
    officeName: ''
  }),

  actions: {
    async fetchStructure() {
      this.loading = true;
      try {
        const userStore = useUserStore();
        const officeId = userStore.officeId;

        // First get the organizational structure
        const structureResponse = await api.get('Spms/office/structure', {
          params: { office_id: officeId }
        });

        if (structureResponse.data && structureResponse.data.length > 0) {
          this.officeName = structureResponse.data[0].office;

          // Then get all employees for this office
          const employeesResponse = await api.get('Spms/fetch_employees', {
            params: { office_id: officeId }
          });

          // Transform structure with employees
          this.structure = this.transformStructure(
            structureResponse.data[0],
            employeesResponse.data.data || []
          );
        } else {
          // Ensure structure is an array even if no data
          this.structure = [];
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching structure:', err);
        // Ensure structure is an array on error
        this.structure = [];
      } finally {
        this.loading = false;
      }
    },

    transformStructure(officeData, employees) {
      if (!officeData) return [];

      const officeNode = {
        id: 'office_' + this.slugify(officeData.office),
        label: officeData.office,
        position: 'Head of Office',
        isHead: true,
        type: 'office',
        children: [],
      };

      // Helper function to find employees for a specific unit
      const findEmployees = (division = null, section = null, unit = null) => {
        return employees.filter(emp => {
          return (!division || emp.division === division) &&
                 (!section || emp.section === section) &&
                 (!unit || emp.unit === unit);
        }).map(emp => ({
          id: 'emp_' + emp.id,
          label: emp.name,
          position: emp.position,
          rank: emp.rank,
          ipcrStatus: emp.ipcr_status || 'pending',
          type: 'employee',
          isHead: false,
          employeeData: emp // Store full employee data
        }));
      };

      // Check if divisions exists and is an array before proceeding
      if (officeData.divisions && Array.isArray(officeData.divisions)) {
        // Add divisions
        officeData.divisions.forEach(division => {
          const divisionNode = {
            id: 'division_' + this.slugify(division.division),
            label: division.division,
            position: 'Division Head',
            isHead: true,
            type: 'division',
            children: [],
          };

          // Add employees directly under division (no section/unit)
          const divisionEmployees = findEmployees(division.division, null, null);
          divisionNode.children.push(...divisionEmployees);

          // Check if sections exists and is an array
          if (division.sections && Array.isArray(division.sections)) {
            // Add sections within division
            division.sections.forEach(section => {
              const sectionNode = {
                id: 'section_' + this.slugify(section.section),
                label: section.section,
                position: 'Section Head',
                isHead: true,
                type: 'section',
                children: [],
              };

              // Add employees directly under section (no unit)
              const sectionEmployees = findEmployees(division.division, section.section, null);
              sectionNode.children.push(...sectionEmployees);

              // Check if units exists and is an array
              if (section.units && Array.isArray(section.units)) {
                // Add units within section
                section.units.forEach(unit => {
                  const unitNode = {
                    id: 'unit_' + this.slugify(unit),
                    label: unit,
                    position: 'Unit Head',
                    isHead: true,
                    type: 'unit',
                    children: [],
                  };

                  // Add employees for this unit
                  const unitEmployees = findEmployees(division.division, section.section, unit);
                  unitNode.children.push(...unitEmployees);

                  sectionNode.children.push(unitNode);
                });
              }

              divisionNode.children.push(sectionNode);
            });
          }

          // Check if units_without_section exists and is an array
          if (division.units_without_section && Array.isArray(division.units_without_section)) {
            // Add units directly under division (no section)
            division.units_without_section.forEach(unit => {
              const unitNode = {
                id: 'unit_' + this.slugify(unit),
                label: unit,
                position: 'Unit Head',
                isHead: true,
                type: 'unit',
                children: [],
              };

              // Add employees for this unit
              const unitEmployees = findEmployees(division.division, null, unit);
              unitNode.children.push(...unitEmployees);

              divisionNode.children.push(unitNode);
            });
          }

          officeNode.children.push(divisionNode);
        });
      }

      // Check if sections_without_division exists and is an array
      if (officeData.sections_without_division && Array.isArray(officeData.sections_without_division)) {
        // Add sections without division
        officeData.sections_without_division.forEach(section => {
          const sectionNode = {
            id: 'section_' + this.slugify(section.section),
            label: section.section,
            position: 'Section Head',
            isHead: true,
            type: 'section',
            children: [],
          };

          // Add employees directly under section (no unit)
          const sectionEmployees = findEmployees(null, section.section, null);
          sectionNode.children.push(...sectionEmployees);

          // Check if units exists and is an array
          if (section.units && Array.isArray(section.units)) {
            // Add units within section
            section.units.forEach(unit => {
              const unitNode = {
                id: 'unit_' + this.slugify(unit),
                label: unit,
                position: 'Unit Head',
                isHead: true,
                type: 'unit',
                children: [],
              };

              // Add employees for this unit
              const unitEmployees = findEmployees(null, section.section, unit);
              unitNode.children.push(...unitEmployees);

              sectionNode.children.push(unitNode);
            });
          }

          officeNode.children.push(sectionNode);
        });
      }

      // Check if units_without_division exists and is an array
      if (officeData.units_without_division && Array.isArray(officeData.units_without_division)) {
        // Add units without division or section
        officeData.units_without_division.forEach(unit => {
          const unitNode = {
            id: 'unit_' + this.slugify(unit),
            label: unit,
            position: 'Unit Head',
            isHead: true,
            type: 'unit',
            children: [],
          };

          // Add employees for this unit
          const unitEmployees = findEmployees(null, null, unit);
          unitNode.children.push(...unitEmployees);

          officeNode.children.push(unitNode);
        });
      }

      // Add employees directly under office (no division/section/unit)
      const officeEmployees = findEmployees(null, null, null);
      officeNode.children.push(...officeEmployees);

      return [officeNode];
    },

    slugify(text) {
      if (!text) return ''; // Ensure text is defined

      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        // eslint-disable-next-line no-useless-escape
        .replace(/[^\w\-]+/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
    }
  },
});

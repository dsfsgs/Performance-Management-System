// src/stores/PlanningUnitWorkPlanStore.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { ref, computed } from 'vue'

export const useplanning_unit_work_planStore = defineStore('planning_unit_work_plan', () => {
  const offices = ref([])
  const divisions = ref([])
  const employees = ref([])
  const unitWorkPlans = ref([])
  const loading = ref(false)
  const error = ref(null)

  const selectedDivision = ref(null)

  const selectedTargetPeriod = ref(null)

  const fetchOffices = async () => {
    try {
      loading.value = true
      const response = await api.get('/fetch_office')
      offices.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
const fetchDivisionsWithWorkPlans = async (officeId, targetPeriod = null) => {
  try {
    loading.value = true;
    error.value = null;

    // Validate officeId
    if (!officeId || isNaN(Number(officeId))) {
      throw new Error('Invalid Office ID');
    }

    // Build URL with parameters
    const params = { office_id: officeId };
    if (targetPeriod) {
      // Validate target period format (e.g., "January - June 2025")
      if (!targetPeriod.match(/^[A-Za-z]+\s-\s[A-Za-z]+\s\d{4}$/)) {
        throw new Error('Invalid target period format. Expected "Month - Month Year"');
      }
      params.target_period = targetPeriod;
    }

    const response = await api.get('/planning/unit_work_plan/divisions', { params });
    divisions.value = response.data.data;
    return response.data.data;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};

const fetchEmployeesByDivision = async (division, officeId, targetPeriod) => {
  try {
    loading.value = true;
    error.value = null;

    // Validate all required parameters
    if (!division || !officeId || !targetPeriod) {
      throw new Error('Missing required parameters');
    }

    // Validate target period format
    if (!targetPeriod.match(/^[A-Za-z]+\s-\s[A-Za-z]+\s\d{4}$/)) {
      throw new Error('Invalid target period format. Expected "Month - Month Year"');
    }

    const response = await api.get('/planning/unit_work_plan/employees', {
      params: {
        division,
        office_id: officeId,
        target_period: targetPeriod
      }
    });

    employees.value = response.data;
    return response.data;
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};
  const fetchUnitWorkPlans = async (division, targetPeriod) => {
    try {
      loading.value = true
      const response = await api.get('/planning/unit_work_plan', {
        params: { division, target_period: targetPeriod }
      })
      unitWorkPlans.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSelectedDivision = (division) => {
    selectedDivision.value = division
  }

  const setSelectedTargetPeriod = (period) => {
    selectedTargetPeriod.value = period
  }

  const fetchDivisionDetails = async (division, officeId, targetPeriod) => {
  try {
    loading.value = true;

    // Validate Office ID
    if (isNaN(Number(officeId))) {
      throw new Error('Office ID must be a valid number.');
    }

    // Parse and validate Target Period
    let period = '';
    let year = '';

    if (targetPeriod) {
      // Try to extract year from the end (last 4 digits)
      const yearMatch = targetPeriod.match(/\b(\d{4})\b/);
      year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();

      // Get the period part (everything before the year)
      period = targetPeriod.replace(year, '').trim();

      // If no dash found, assume it's just the year
      if (!period.includes('-')) {
        period = 'January - December'; // Default to full year
      }
    } else {
      // Default to current year if no period provided
      const currentYear = new Date().getFullYear();
      period = 'January - December';
      year = currentYear.toString();
    }

    // Fetch data with properly formatted parameters
    const response = await api.get('/planning/unit_work_plan/employees', {
      params: {
        division: division,
        office_id: officeId,
        target_period: `${period} ${year}` // Combine period and year
      }
    });

    return {
      name: division,
      employees: response.data
    };
  } catch (err) {
    error.value = err.message;
    throw err;
  } finally {
    loading.value = false;
  }
};

  const officeOptions = computed(() => {
    return offices.value.map(office => ({
      label: office.name,
      value: office.id
    }))
  })

  return {
    offices,
    divisions,
    employees,
    unitWorkPlans,
    loading,
    error,
    selectedDivision,

    selectedTargetPeriod,
    fetchOffices,
    fetchDivisionsWithWorkPlans,
    fetchEmployeesByDivision,
    fetchUnitWorkPlans,
    setSelectedDivision,

    setSelectedTargetPeriod,
    fetchDivisionDetails,
    officeOptions,


  }
})

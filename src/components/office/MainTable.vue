<template>
    <div>
        <!-- Filter and Buttons -->
        <div class="row items-center justify-between q-mb-md">
            <div class="col-12" :class="getFilterColumnClass">
                <div class="row q-col-gutter-md">
                    <!-- Target Period Filter -->
                    <div v-if="showTargetPeriodFilter" class="col-12" :class="filterColumnWidth">
                        <q-select v-model="targetPeriodFilter" :options="targetPeriodOptions"
                            label="Filter by Target Period" outlined dense clearable emit-value map-options />
                    </div>

                    <!-- Office Filter -->
                    <div v-if="showOfficeFilter" class="col-12" :class="filterColumnWidth">
                        <q-select v-model="officeFilter" :options="officeOptions" label="Filter by Office" outlined
                            dense clearable emit-value map-options />
                    </div>
                </div>
            </div>

            <div class="row q-gutter-md justify-end">
                <q-btn v-if="!hideCreateButton" elevated rounded :style="{ backgroundColor: '#077A37' }"
                    label="Create Unit Work Plan" @click="$emit('create')" icon="person_add" text-color="white"
                    icon-color="white" />
                <q-btn v-if="!hideOPCRButton" elevated rounded color="primary" label="Generate OPCR" icon="print"
                    @click="$emit('generate-opcr')" />
                <q-btn v-if="!hideUnitWorkPlanButton" elevated rounded color="primary" label="Generate Unit Work Plan"
                    icon="print" @click="$emit('generate-uwp')" />
            </div>
        </div>

        <!-- Main Table -->
        <q-table :rows="filteredRows" :columns="visibleColumns" row-key="id" @row-click="onRowClick">
            <template v-slot:header>
                <q-tr>
                    <q-th v-for="col in visibleColumns" :key="col.name"
                        style="background-color: #EBEBEB; text-align: left;">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <q-badge :color="getStatusColor(props.row.status)"
                        :text-color="getStatusTextColor(props.row.status)" align="middle"
                        class="q-px-md q-py-xs text-weight-medium" rounded>
                        <q-icon :name="getStatusIcon(props.row.status)" class="q-mr-xs" />
                        {{ props.row.status }}
                    </q-badge>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script>
export default {
    props: {
        rows: {
            type: Array,
            required: true
        },
        hideCreateButton: {
            type: Boolean,
            default: false
        },
        hideOPCRButton: {
            type: Boolean,
            default: false
        },
        hideUnitWorkPlanButton: {
            type: Boolean,
            default: false
        },
        showOfficeFilter: {
            type: Boolean,
            default: false
        },
        showOfficeColumn: {
            type: Boolean,
            default: false
        },
        showTargetPeriodFilter: {
            type: Boolean,
            default: true
        }
    },
    emits: ['create', 'row-click', 'generate-opcr', 'generate-uwp'],
    data() {
        return {
            targetPeriodFilter: null,
            officeFilter: null,
            allColumns: [
                { name: "division", label: "Division", field: "division", align: "left" },
                { name: "office", label: "Office", field: "office", align: "left", showIf: 'showOfficeColumn' },
                { name: "targetPeriod", label: "Target Period", field: "targetPeriod", align: "left" },
                { name: "dateCreated", label: "Date Created", field: "dateCreated", align: "left" },
                { name: "status", label: "Status", field: "status", align: "left" }
            ]
        }
    },
    computed: {
        visibleColumns() {
            return this.allColumns.filter(col => {
                if (col.showIf) {
                    return this[col.showIf];
                }
                return true;
            });
        },
        targetPeriodOptions() {
            const uniquePeriods = [...new Set(this.rows.map(row => row.targetPeriod))];
            return uniquePeriods.map(period => ({
                label: period,
                value: period
            }));
        },
        officeOptions() {
            const uniqueOffices = [...new Set(this.rows.map(row => row.office))];
            return uniqueOffices.map(office => ({
                label: office,
                value: office
            }));
        },
        filteredRows() {
            return this.rows.filter(row => {
                const matchesTargetPeriod = !this.targetPeriodFilter || row.targetPeriod === this.targetPeriodFilter;
                const matchesOffice = !this.officeFilter || row.office === this.officeFilter;
                return matchesTargetPeriod && matchesOffice;
            });
        },
        getFilterColumnClass() {
            // Calculate how much space the filters should take
            const activeFilters = (this.showTargetPeriodFilter ? 1 : 0) + (this.showOfficeFilter ? 1 : 0);
            if (activeFilters === 0) return '';
            return activeFilters === 1 ? 'col-md-4' : 'col-md-8';
        },
        filterColumnWidth() {
            // Determine width of each filter based on how many are showing
            const activeFilters = (this.showTargetPeriodFilter ? 1 : 0) + (this.showOfficeFilter ? 1 : 0);
            return activeFilters > 1 ? 'col-md-6' : 'col-md-12';
        }
    },
    methods: {
        onRowClick(evt, row) {
            this.$emit('row-click', row);
        },
        getStatusColor(status) {
            switch (status.toLowerCase()) {
                case 'approved': return 'green';
                case 'pending': return 'orange';
                default: return 'grey-2';
            }
        },
        getStatusTextColor(status) {
            switch (status.toLowerCase()) {
                case 'approved': return 'white';
                case 'pending': return 'white';
                default: return 'grey-10';
            }
        },
        getStatusIcon(status) {
            switch (status.toLowerCase()) {
                case 'approved': return 'check_circle';
                case 'pending': return 'schedule';
                default: return 'info';
            }
        }
    }
}
</script>
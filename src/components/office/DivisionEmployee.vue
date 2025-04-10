<template>
    <div>
        <!-- This section shows when NOT in UWP form mode -->
        <div v-if="!showUWP">
            <div class="row items-center justify-between q-mb-sm">
                <div class="text-h7">{{ division }}</div>
                <q-btn flat icon="arrow_back" label="Back" color="grey-8" class="q-ml-auto" />
            </div>
            <q-separator class="q-mb-md" />

            <div class="row items-center justify-between q-mb-md">
                <div class="col-12 col-md-4 q-pr-sm">
                    <q-input v-model="search" outlined dense placeholder="Search employees" clearable>
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>

                <div class="row q-gutter-sm">
                    <q-btn :style="{ backgroundColor: '#077A37' }" icon="add" label="Add Other Employee"
                        @click="showUWP = true" text-color="white" icon-color="white" unelevated no-caps />
                </div>
            </div>

            <!-- Employee Table -->
            <q-card flat bordered>
                <q-table :rows="filteredEmployees" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }"
                    :loading="loading" :filter="search" binary-state-sort>
                    <!-- Table content remains the same -->
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th v-for="col in props.cols" :key="col.name" :props="props"
                                style="background-color: #EBEBEB;">
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>

                    <template v-slot:no-data>
                        <div class="full-width row flex-center q-pa-md text-grey-7">
                            <q-icon name="sentiment_dissatisfied" size="24px" class="q-mr-sm" />
                            No employees found for this division
                        </div>
                    </template>

                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <div class="row items-center justify-center q-gutter-x-sm">
                                <q-btn flat round size="sm" color="primary" icon="edit" />
                                <q-btn flat round size="sm" color="negative" icon="delete" />
                            </div>
                        </q-td>
                    </template>
                </q-table>
            </q-card>
        </div>

        <!-- This section shows ONLY in UWP form mode -->
        <div v-if="showUWP">
            <div class="row items-center justify-between q-mb-sm">
                <div class="text-h7">{{ division }}</div>
                <q-btn flat icon="arrow_back" label="Back to Employees" color="grey-8" class="q-ml-auto"
                    @click="showUWP = false" />
            </div>
            <q-separator class="q-mb-md" />

            <UnitWorkPlanForm />
        </div>
    </div>
</template>

<script>
import UnitWorkPlanForm from 'src/components/office/UnitWorkPlanForm.vue';

export default {
    components: {
        UnitWorkPlanForm,
    },
    props: {
        division: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showUWP: false,
            search: "",
            loading: false,
            columns: [
                { name: 'name', label: 'Employee Name', field: 'name', align: 'left', sortable: true },
                { name: 'position', label: 'Position', field: 'position', align: 'left', sortable: true },
                { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
            ],
            employees: []
        };
    },
    computed: {
        filteredEmployees() {
            if (!this.search) return this.employees;
            const searchLower = this.search.toLowerCase();
            return this.employees.filter(employee => {
                return Object.values(employee).some(
                    value => String(value).toLowerCase().includes(searchLower)
                );
            });
        }
    },
    methods: {
        fetchEmployees() {
            this.loading = true;
            setTimeout(() => {
                const data = {
                    "Recruitment, Selection and Records Management Division": [
                        { id: 1, name: "Alice Santos", position: "HR Officer" },
                        { id: 2, name: "Miguel Cruz", position: "Records Specialist" },
                        { id: 3, name: "Sofia Reyes", position: "Recruitment Specialist" }
                    ],
                    // ... rest of your employee data
                };
                this.employees = data[this.division] || [];
                this.loading = false;
            }, 500);
        }
    },
    mounted() {
        this.fetchEmployees();
    }
};
</script>
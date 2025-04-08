<template>
    <div>
        <!-- <h6 class="text-h6">Employees in {{ division }}</h6> -->
        <div class="row items-center justify-between q-mb-md">
            <q-btn flat label="Back" icon="arrow_back" @click="$emit('back')" />
        </div>
        <div>{{ division }}</div>
        <br>

        <q-table :rows="employees" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 0 }">
            <!-- Custom styling for headers if needed -->
            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props"
                        style="background-color: #EBEBEB; text-align: left;">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>
        </q-table>
    </div>
</template>

<script>
export default {
    props: {
        division: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            columns: [
                { name: 'name', label: 'Employee Name', field: 'name', align: 'left' },
                { name: 'position', label: 'Position', field: 'position', align: 'left' }
            ],
            employees: []
        };
    },
    mounted() {
        // Fake data; replace with actual API if needed
        const data = {
            "Recruitment, Selection and Records Management Division": [
                { id: 1, name: "Alice Santos", position: "HR Officer" }
            ],
            "Performance, Management, Incentives, Rewards and Recognition Division": [
                { id: 2, name: "John Reyes", position: "Rewards Officer" }
            ]
        };
        this.employees = data[this.division] || [];
    }
};
</script>
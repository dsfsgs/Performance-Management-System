<template>
    <q-page class="q-pa-md">
        <q-card class="my-card">
            <q-card-section>
                <div class="text-subtitle2">Create Unit Work Plan</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div class="col-md-6 col-sm-12">
                        <q-input filled v-model="division" label="Division" />
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <q-input filled v-model="targetPeriod" label="Target Period" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="employeeName" label="Employee Name" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="rank" label="Rank" />
                    </div>
                    <div class="col-md-4 col-sm-12">
                        <q-input filled v-model="position" label="Position" />
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-table :rows="rows" :columns="columns" row-key="id" hide-bottom flat :column-widths="columnWidths">
                    <template v-slot:body-cell-mfo="props">
                        <q-td :props="props">
                            <div class="dropdown-container">
                                <span v-if="!props.row.mfo">{{ getDropdownLabel(props.row.id) }}</span>
                                <q-select v-model="props.row.mfo" :options="getMfoOptions(props.row.id)" dense
                                    borderless emit-value map-options behavior="menu" />
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-competency="props">
                        <q-td :props="props">
                            <q-select v-model="props.row.competency" :options="competencyOptions" dense borderless />
                        </q-td>
                    </template>

                    <template v-slot:body-cell-successIndicator="props">
                        <q-td :props="props">
                            <q-input v-model="props.row.successIndicator" dense borderless />
                        </q-td>
                    </template>

                    <template v-slot:body-cell-requiredOutput="props">
                        <q-td :props="props">
                            <q-input v-model="props.row.requiredOutput" dense borderless />
                        </q-td>
                    </template>

                    <template v-slot:bottom>
                        <q-tr>
                            <q-td colspan="4" class="text-center">
                                Core, Technical, Leadership
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn icon="save" label="Save" :style="{ backgroundColor: '#077A37' }" text-color="white"
                    @click="saveForm" />
                <q-btn label="Reset" color="negative" flat @click="resetForm" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            division: '',
            targetPeriod: '',
            employeeName: '',
            rank: '',
            position: '',
            competencyOptions: ['Core', 'Technical', 'Leadership'],
            categoryOptions: [
                { label: 'A. Strategic Function', value: 'A' },
                { label: 'B. Core Function', value: 'B' },
                { label: 'C. Support Function', value: 'C' }
            ],
            dropdownLabels: {
                1: 'Select Category',
                2: 'Select MFO',
                3: 'Select Output'
            },
            mfoOptions: [
                { label: 'MFO 1', value: 'M1' },
                { label: 'MFO 2', value: 'M2' },
                { label: 'MFO 3', value: 'M3' }
            ],
            outputOptions: [
                { label: 'Output 1', value: 'O1' },
                { label: 'Output 2', value: 'O2' },
                { label: 'Output 3', value: 'O3' }
            ],
            columns: [
                {
                    name: 'mfo',
                    required: true,
                    label: 'MFO',
                    align: 'left',
                    field: 'mfo',
                    sortable: true,
                    style: "width: 20%"
                },
                {
                    name: 'competency',
                    label: 'Required Competency & Proficiency Level',
                    align: 'left',
                    field: 'competency',
                    style: "width: 40%"
                },
                {
                    name: 'successIndicator',
                    label: 'Success Indicator',
                    align: 'left',
                    field: 'successIndicator',
                    style: "width: 20%"
                },
                {
                    name: 'requiredOutput',
                    label: 'Required Output',
                    align: 'left',
                    field: 'requiredOutput',
                    style: "width: 20%"
                }
            ],
            rows: [
                {
                    id: 1,
                    mfo: '',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 2,
                    mfo: '',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: ''
                },
                {
                    id: 3,
                    mfo: '',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: ''
                }
            ]
        }
    },
    methods: {
        getDropdownLabel(rowId) {
            return this.dropdownLabels[rowId] || ''
        },
        getMfoOptions(rowId) {
            if (rowId === 1) return this.categoryOptions
            if (rowId === 2) return this.mfoOptions
            if (rowId === 3) return this.outputOptions
            return []
        },
        saveForm() {
            // Handle form submission
            this.$q.notify({
                message: 'Work plan saved successfully',
                color: 'positive'
            })
        },
        resetForm() {
            this.division = ''
            this.targetPeriod = ''
            this.employeeName = ''
            this.rank = ''
            this.position = ''
            this.rows.forEach(row => {
                row.mfo = ''
                row.competency = ''
                row.successIndicator = ''
                row.requiredOutput = ''
            })
        }
    }
}
</script>

<style scoped>
.dropdown-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.q-input :deep(.q-field--focused .q-field__label) {
    color: #00903e !important;
}

.q-input :deep(.q-field--focused .q-field__control) {
    color: #00903e !important;
}
</style>
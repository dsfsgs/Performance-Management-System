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

                <div class="row q-col-gutter-md q-mt-sm">
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
                <q-table title="Performance Indicators" :rows="rows" :columns="columns" row-key="id" hide-bottom flat
                    bordered>
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

                    <template v-slot:body-cell-ratings="props">
                        <q-td :props="props">
                            <q-radio v-model="props.row.rating" val="5" label="5" dense />
                            <q-radio v-model="props.row.rating" val="4" label="4" dense />
                            <q-radio v-model="props.row.rating" val="3" label="3" dense />
                            <q-radio v-model="props.row.rating" val="2" label="2" dense />
                            <q-radio v-model="props.row.rating" val="1" label="1" dense />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Save" color="primary" @click="saveForm" />
                <q-btn label="Reset" color="negative" flat @click="resetForm" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            division: 'Recruitment, Selection and Records Management Division',
            targetPeriod: '',
            employeeName: '',
            rank: '',
            competencyOptions: ['Core', 'Technical', 'Leadership'],
            columns: [
                {
                    name: 'mfo',
                    required: true,
                    label: 'MFO',
                    align: 'left',
                    field: 'mfo',
                    sortable: true
                },
                {
                    name: 'competency',
                    label: 'Required Competency & Proficiency Level',
                    align: 'left',
                    field: 'competency'
                },
                {
                    name: 'successIndicator',
                    label: 'Success Indicator',
                    align: 'left',
                    field: 'successIndicator'
                },
                {
                    name: 'requiredOutput',
                    label: 'Required Output',
                    align: 'left',
                    field: 'requiredOutput'
                }
            ],
            rows: [
                {
                    id: 1,
                    mfo: 'Select Category',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: '',
                },
                {
                    id: 2,
                    mfo: 'Select MFO',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: '',
                },
                {
                    id: 3,
                    mfo: 'Select Output',
                    competency: '',
                    successIndicator: '',
                    requiredOutput: '',
                }
            ]
        }
    },
    methods: {
        saveForm() {
            this.$q.notify({
                message: 'Work plan saved successfully',
                color: 'positive'
            })
        },
        resetForm() {
            this.employeeName = ''
            this.rank = ''
            this.targetPeriod = ''
            this.rows.forEach(row => {
                row.competency = ''
                row.successIndicator = ''
                row.requiredOutput = ''
                row.rating = ''
            })
        }
    }
}
</script>

<style scoped>
.my-card {
    min-height: calc(100vh - 100px);
}

.q-card-section {
    padding: 15px;
}
</style>

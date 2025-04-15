<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="my-card" style="min-width: 1100px; max-width: 1200px;">
      <q-card-section class="header-section">
        <div class="text-h6">Generate OPCR</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md">
        <!-- 1. STRATEGIC FUNCTION Table -->
        <div class="section-container q-mb-md">
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">A. STRATEGIC FUNCTION</th>
                  <th class="text-center" colspan="3" width="30%">Required Competency & Proficiency Level</th>
                  <th class="text-center" rowspan="2" width="20%">Success Indicator</th>
                  <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                  <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
                </tr>
                <tr>
                  <th class="text-center">Core</th>
                  <th class="text-center">Technical</th>
                  <th class="text-center">Leadership</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-grey-9">
                    <div class="mfo-content">
                      <div class="mfo-header q-pa-sm q-mb-sm">
                        MFO 1: Strategic Planning and Management
                      </div>
                      <q-separator class="q-mb-sm" />
                      <div class="q-py-sm q-px-md text-center text-grey-8">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center text-grey-9">
                    SP - 4<br>
                    DM - 4<br>
                    PM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    SPP - 4<br>
                    M&E - 4<br>
                    RM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    LDP - 4<br>
                    CDP - 4<br>
                    TPM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    Annual strategic plans developed and implemented with 95% compliance rate
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="strategicBudget" placeholder="Enter budget" class="full-width" />
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="strategicAccountable" placeholder="Enter division/individual"
                      class="full-width" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. CORE FUNCTION Table -->
        <div class="section-container q-mb-md">
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">B. CORE FUNCTION</th>
                  <th class="text-center" colspan="3" width="30%">Required Competency & Proficiency Level</th>
                  <th class="text-center" rowspan="2" width="20%">Success Indicator</th>
                  <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                  <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
                </tr>
                <tr>
                  <th class="text-center">Core</th>
                  <th class="text-center">Technical</th>
                  <th class="text-center">Leadership</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-grey-9">
                    <div class="mfo-content">
                      <div class="mfo-header q-pa-sm q-mb-sm">
                        MFO 1: Recruitment, Selection and Placement
                      </div>
                      <q-separator class="q-mb-sm" />
                      <div class="q-py-sm q-px-md text-center text-grey-8">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center text-grey-9">
                    DSE - 4<br>
                    EI - 4<br>
                    IS - 4
                  </td>
                  <td class="text-center text-grey-9">
                    P&O - 4<br>
                    M&E - 4<br>
                    RM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    TSC - 4<br>
                    PSDM - 4<br>
                    MPCR - 4
                  </td>
                  <td class="text-center text-grey-9">
                    1030 Recruitment, Selection and Placement related documents approved and signed without lapses as
                    per schedule
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="coreBudget" placeholder="Enter budget" class="full-width" />
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="coreAccountable" placeholder="Enter division/individual"
                      class="full-width" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. SUPPORT FUNCTION Table -->
        <div class="section-container q-mb-md">
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">C. SUPPORT FUNCTION</th>
                  <th class="text-center" colspan="3" width="30%">Required Competency & Proficiency Level</th>
                  <th class="text-center" rowspan="2" width="20%">Success Indicator</th>
                  <th class="text-center" rowspan="2" width="15%">Alloted Budget</th>
                  <th class="text-center" rowspan="2" width="15%">Division/Individual Accountable</th>
                </tr>
                <tr>
                  <th class="text-center">Core</th>
                  <th class="text-center">Technical</th>
                  <th class="text-center">Leadership</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-grey-9">
                    <div class="mfo-content">
                      <div class="q-py-sm q-px-md text-center text-grey-8">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center text-grey-9">
                    CS - 4<br>
                    ORG - 4<br>
                    CM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    AS - 4<br>
                    FM - 4<br>
                    LM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    TL - 4<br>
                    PM - 4<br>
                    DM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    Monthly financial reports prepared and submitted on time with 100% accuracy
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportBudget1" placeholder="Enter budget" class="full-width" />
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportAccountable1" placeholder="Enter division/individual"
                      class="full-width" />
                  </td>
                </tr>
                <tr>
                  <td class="text-grey-9">
                    <div class="mfo-content">
                      <div class="q-py-sm q-px-md text-center text-grey-8">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center text-grey-9">
                    CS - 4<br>
                    ORG - 4<br>
                    CM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    LS - 4<br>
                    FM - 4<br>
                    LM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    TL - 4<br>
                    PM - 4<br>
                    DM - 4
                  </td>
                  <td class="text-center text-grey-9">
                    Office supplies and equipment maintained and replenished with 98% availability rate
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportBudget2" placeholder="Enter budget" class="full-width" />
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportAccountable2" placeholder="Enter division/individual"
                      class="full-width" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Exit" color="grey-7" flat v-close-popup class="q-mr-sm" />
          <q-btn label="Print" color="secondary" unelevated @click="showPdfModal = true" class="q-mr-sm" />
          <q-btn label="Save" color="primary" unelevated @click="validateAndSave" />
        </q-card-actions>
      </q-card-section>

      <!-- PDF Preview Modal -->
      <q-dialog v-model="showPdfModal">
        <q-card style="min-width: 80vw">
          <q-card-section>
            <div class="text-h6">OPCR Preview</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-body1">
              Here's a preview of your OPCR data (PDF generation would appear here):
              <pre>{{ formDataPreview }}</pre>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: this.show,
      showPdfModal: false,
      strategicBudget: '',
      strategicAccountable: '',
      coreBudget: '',
      coreAccountable: '',
      supportBudget1: '',
      supportAccountable1: '',
      supportBudget2: '',
      supportAccountable2: ''
    }
  },
  computed: {
    formDataPreview() {
      return {
        strategic: {
          budget: this.strategicBudget,
          accountable: this.strategicAccountable
        },
        core: {
          budget: this.coreBudget,
          accountable: this.coreAccountable
        },
        support: {
          budget1: this.supportBudget1,
          accountable1: this.supportAccountable1,
          budget2: this.supportBudget2,
          accountable2: this.supportAccountable2
        }
      }
    }
  },
  watch: {
    show(newVal) {
      this.showModal = newVal
    },
    showModal(newVal) {
      if (!newVal) {
        this.$emit('update:show', false)
      }
    }
  },
  methods: {
    validateAndSave() {
      if (!this.strategicBudget || !this.strategicAccountable ||
        !this.coreBudget || !this.coreAccountable ||
        !this.supportBudget1 || !this.supportAccountable1 ||
        !this.supportBudget2 || !this.supportAccountable2) {
        this.$q.notify({
          type: 'negative',
          message: 'Please fill all required fields'
        })
        return
      }

      this.$q.notify({
        type: 'positive',
        message: 'OPCR saved successfully!'
      })
      this.$emit('save', this.formDataPreview)
    }
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.header-section {
  background-color: #f5f5f5;
  padding: 16px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.mfo-header {
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.mfo-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.competency-table {
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  ::v-deep th,
  ::v-deep td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    vertical-align: middle;
  }

  ::v-deep thead {
    background-color: #f5f5f5;
  }

  ::v-deep thead th {
    font-weight: 500;
    color: #424242;
  }

  ::v-deep tbody {
    background-color: white;
  }

  ::v-deep tbody tr:hover {
    background-color: #fafafa;
  }
}

:deep(.q-field--outlined .q-field__control) {
  height: 40px;
  min-height: 40px;
  border-radius: 4px;
}

.q-btn {
  border-radius: 4px;
  min-width: 110px;
}

.q-separator {
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
}
</style>

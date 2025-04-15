<template>
  <q-dialog v-model="showModal" persistent>
    <q-card class="my-card" style="min-width: 1100px; max-width: 1200px;">
      <q-card-section class="header-section row items-center justify-between">
        <div class="text-h6">Generate OPCR</div>
        <q-btn flat round dense icon="close" v-close-popup color="negative" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md content-section">
        <!-- 1. STRATEGIC FUNCTION Table -->
        <div class="section-container q-mb-lg">
          <div class="section-title q-mb-sm">A. STRATEGIC FUNCTION</div>
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">Function</th>
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
                  <td>
                    <div class="mfo-content">
                      <div class="mfo-header q-pa-sm q-mb-sm">
                        MFO 1: Strategic Planning and Management
                      </div>
                      <q-separator class="q-mb-sm" />
                      <div class="q-py-sm q-px-md text-center output-label">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    SP - 4<br>
                    DM - 4<br>
                    PM - 4
                  </td>
                  <td class="text-center">
                    SPP - 4<br>
                    M&E - 4<br>
                    RM - 4
                  </td>
                  <td class="text-center">
                    LDP - 4<br>
                    CDP - 4<br>
                    TPM - 4
                  </td>
                  <td class="text-center">
                    Annual strategic plans developed and implemented with 95% compliance rate
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="strategicBudget" placeholder="Enter budget"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.strategicBudget }"
                      :error="errors.strategicBudget" error-message="Field is required" lazy-rules
                      @blur="validateField('strategicBudget')" ref="strategicBudgetRef">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="strategicAccountable" placeholder="Enter division/individual"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.strategicAccountable }"
                      :error="errors.strategicAccountable" error-message="Field is required" lazy-rules
                      @blur="validateField('strategicAccountable')" ref="strategicAccountableRef">
                      <template v-slot:prepend>
                        <q-icon name="people" />
                      </template>
                    </q-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. CORE FUNCTION Table -->
        <div class="section-container q-mb-lg">
          <div class="section-title q-mb-sm">B. CORE FUNCTION</div>
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">Function</th>
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
                  <td>
                    <div class="mfo-content">
                      <div class="mfo-header q-pa-sm q-mb-sm">
                        MFO 1: Recruitment, Selection and Placement
                      </div>
                      <q-separator class="q-mb-sm" />
                      <div class="q-py-sm q-px-md text-center output-label">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    DSE - 4<br>
                    EI - 4<br>
                    IS - 4
                  </td>
                  <td class="text-center">
                    P&O - 4<br>
                    M&E - 4<br>
                    RM - 4
                  </td>
                  <td class="text-center">
                    TSC - 4<br>
                    PSDM - 4<br>
                    MPCR - 4
                  </td>
                  <td class="text-center">
                    1030 Recruitment, Selection and Placement related documents approved and signed without lapses as
                    per schedule
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="coreBudget" placeholder="Enter budget"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.coreBudget }"
                      :error="errors.coreBudget" error-message="Field is required" lazy-rules
                      @blur="validateField('coreBudget')" ref="coreBudgetRef">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="coreAccountable" placeholder="Enter division/individual"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.coreAccountable }"
                      :error="errors.coreAccountable" error-message="Field is required" lazy-rules
                      @blur="validateField('coreAccountable')" ref="coreAccountableRef">
                      <template v-slot:prepend>
                        <q-icon name="people" />
                      </template>
                    </q-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. SUPPORT FUNCTION Table -->
        <div class="section-container q-mb-lg">
          <div class="section-title q-mb-sm">C. SUPPORT FUNCTION</div>
          <div class="competency-table">
            <table class="full-width">
              <thead>
                <tr>
                  <th class="text-center" rowspan="2" width="20%">Function</th>
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
                  <td>
                    <div class="mfo-content">
                      <div class="q-py-sm q-px-md text-center output-label">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    CS - 4<br>
                    ORG - 4<br>
                    CM - 4
                  </td>
                  <td class="text-center">
                    AS - 4<br>
                    FM - 4<br>
                    LM - 4
                  </td>
                  <td class="text-center">
                    TL - 4<br>
                    PM - 4<br>
                    DM - 4
                  </td>
                  <td class="text-center">
                    Monthly financial reports prepared and submitted on time with 100% accuracy
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportBudget1" placeholder="Enter budget"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget1 }"
                      :error="errors.supportBudget1" error-message="Field is required" lazy-rules
                      @blur="validateField('supportBudget1')" ref="supportBudget1Ref">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportAccountable1" placeholder="Enter division/individual"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable1 }"
                      :error="errors.supportAccountable1" error-message="Field is required" lazy-rules
                      @blur="validateField('supportAccountable1')" ref="supportAccountable1Ref">
                      <template v-slot:prepend>
                        <q-icon name="people" />
                      </template>
                    </q-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="mfo-content">
                      <div class="q-py-sm q-px-md text-center output-label">
                        Output
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    CS - 4<br>
                    ORG - 4<br>
                    CM - 4
                  </td>
                  <td class="text-center">
                    LS - 4<br>
                    FM - 4<br>
                    LM - 4
                  </td>
                  <td class="text-center">
                    TL - 4<br>
                    PM - 4<br>
                    DM - 4
                  </td>
                  <td class="text-center">
                    Office supplies and equipment maintained and replenished with 98% availability rate
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportBudget2" placeholder="Enter budget"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.supportBudget2 }"
                      :error="errors.supportBudget2" error-message="Field is required" lazy-rules
                      @blur="validateField('supportBudget2')" ref="supportBudget2Ref">
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                    </q-input>
                  </td>
                  <td class="text-center">
                    <q-input dense outlined v-model="supportAccountable2" placeholder="Enter division/individual"
                      class="full-width modern-input" :class="{ 'shake-animation': errors.supportAccountable2 }"
                      :error="errors.supportAccountable2" error-message="Field is required" lazy-rules
                      @blur="validateField('supportAccountable2')" ref="supportAccountable2Ref">
                      <template v-slot:prepend>
                        <q-icon name="people" />
                      </template>
                    </q-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Print" icon="print" color="secondary" unelevated @click="printOPCR" rounded
            class="action-btn q-mr-md" />
          <q-btn label="Save" icon="save" color="primary" unelevated @click="validateAndSave" rounded
            class="action-btn" />
        </q-card-actions>
      </q-card-section>
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
      strategicBudget: '',
      strategicAccountable: '',
      coreBudget: '',
      coreAccountable: '',
      supportBudget1: '',
      supportAccountable1: '',
      supportBudget2: '',
      supportAccountable2: '',
      errors: {
        strategicBudget: false,
        strategicAccountable: false,
        coreBudget: false,
        coreAccountable: false,
        supportBudget1: false,
        supportAccountable1: false,
        supportBudget2: false,
        supportAccountable2: false
      },
      firstInvalidFieldFocused: false
    }
  },
  methods: {
    validateField(fieldName) {
      const isValid = !!this[fieldName];
      this.errors[fieldName] = !isValid;
      return isValid;
    },
    validateForm() {
      const requiredFields = [
        'strategicBudget', 'strategicAccountable',
        'coreBudget', 'coreAccountable',
        'supportBudget1', 'supportAccountable1',
        'supportBudget2', 'supportAccountable2'
      ];

      let isValid = true;

      requiredFields.forEach(field => {
        const fieldValid = this.validateField(field);
        if (!fieldValid) {
          isValid = false;
          if (this.$refs[field + 'Ref'] && !this.firstInvalidFieldFocused) {
            this.$refs[field + 'Ref'].focus();
            this.firstInvalidFieldFocused = true;
          }
        }
      });

      return isValid;
    },
    shakeAllInvalidFields() {
      Object.keys(this.errors).forEach(field => {
        if (this.errors[field]) {
          this.$refs[field + 'Ref'].$el.classList.remove('shake-animation');
          void this.$refs[field + 'Ref'].$el.offsetWidth;
          this.$refs[field + 'Ref'].$el.classList.add('shake-animation');
        }
      });
    },
    validateAndSave() {
      this.firstInvalidFieldFocused = false;

      if (!this.validateForm()) {
        this.$q.notify({
          type: 'negative',
          message: 'Please fill all required fields',
          position: 'top',
          icon: 'warning',
          timeout: 3000,
          actions: [
            { icon: 'close', color: 'white' }
          ]
        });
        this.shakeAllInvalidFields();
        return;
      }

      this.$q.notify({
        type: 'positive',
        message: 'OPCR saved successfully!',
        icon: 'check_circle',
        timeout: 2000,
        actions: [
          { icon: 'close', color: 'white' }
        ]
      });
      this.$emit('save', {
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
      });
    },
    printOPCR() {
      // Create a print-friendly version of the content
      const printContent = document.createElement('div');
      printContent.innerHTML = document.querySelector('.content-section').innerHTML;

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>OPCR Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f2f2f2; }
              .section-title { font-size: 16px; font-weight: bold; margin: 15px 0; }
              .mfo-header { font-weight: bold; background-color: #f9f9f9; padding: 5px; }
              .output-label { font-weight: bold; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1 style="text-align: center;">OPCR Report</h1>
            ${printContent.innerHTML.replace(/\\<q-input.*?\\<\/q-input\\>/g, function (match) {
        const valueMatch = match.match(/v-model="([^"]+)"/);
        if (valueMatch && valueMatch[1]) {
          return this[valueMatch[1]] || '_______________';
        }
        return '_______________';
      })}
          </body>
        </html>
      `);

      // Remove buttons and inputs from the print version
      const elementsToRemove = printWindow.document.querySelectorAll('.q-btn, .q-field');
      elementsToRemove.forEach(el => {
        el.parentNode.removeChild(el);
      });

      // Trigger print
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  },
  watch: {
    show(newVal) {
      this.showModal = newVal;
    },
    showModal(newVal) {
      if (!newVal) {
        this.$emit('update:show', false);
      }
    }
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.header-section {
  background-color: #6b7280;
  /* Changed to a medium gray color */
  padding: 18px 20px;
  color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.content-section {
  padding: 24px;
  background-color: #ffffff;
}

.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.section-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2433;
  padding-left: 10px;
  border-left: 4px solid #1976d2;
  margin-bottom: 16px;
}

.mfo-header {
  border-radius: 6px;
  background-color: #f5f7fa;
  font-weight: 500;
  text-align: center;
}

.mfo-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.output-label {
  font-weight: 500;
  color: #455a64;
}

.competency-table {
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e0e0;
  }

    th,
    td {
      border: 1px solid #e0e0e0;
      padding: 12px;
      vertical-align: middle;
      color: #333;
    }
  ::v-deep th,
  ::v-deep td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    vertical-align: middle;
  }

    thead {
      background-color: #263238;
  ::v-deep thead {
    background-color: #f5f5f5;
  }

      th {
        font-weight: 500;
        color: #ffffff;
        font-size: 0.9rem;
      }
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
  border-radius: 6px;
}

:deep(.q-field--error .q-field__bottom) {
  padding-top: 4px;
  color: #f44336;
  font-size: 0.75rem;
}

.q-separator {
  background-color: rgba(0, 0, 0, 0.08);
  height: 1px;
}
</style>

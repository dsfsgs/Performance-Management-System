<template>
  <q-card style="width: 90vw; max-width: 1200px; border-radius: 12px;">
    <q-card-section class="header-section row items-center justify-between"
      style="background-color: #00703C; height: 50px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div class="text-h6 text-white">Office of the City Mayor</div>
      <q-btn flat round dense icon="close" @click="$emit('close')" color="white" />
    </q-card-section>

    <q-card-section style="overflow-y: auto; max-height: 70vh; padding: 16px;">
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
                  1030 Recruitment, Selection and Placement related documents approved and signed without lapses
                  as
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
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn label="Cancel" color="grey" unelevated @click="$emit('close')" rounded class="action-btn q-mr-sm" />
      <q-btn label="Save" icon="save" color="primary" unelevated @click="validateAndSave" rounded class="action-btn" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const strategicBudget = ref('');
    const strategicAccountable = ref('');
    const coreBudget = ref('');
    const coreAccountable = ref('');
    const supportBudget1 = ref('');
    const supportAccountable1 = ref('');
    const supportBudget2 = ref('');
    const supportAccountable2 = ref('');

    const errors = ref({
      strategicBudget: false,
      strategicAccountable: false,
      coreBudget: false,
      coreAccountable: false,
      supportBudget1: false,
      supportAccountable1: false,
      supportBudget2: false,
      supportAccountable2: false
    });

    const firstInvalidFieldFocused = ref(false);
    const strategicBudgetRef = ref(null);
    const strategicAccountableRef = ref(null);
    const coreBudgetRef = ref(null);
    const coreAccountableRef = ref(null);
    const supportBudget1Ref = ref(null);
    const supportAccountable1Ref = ref(null);
    const supportBudget2Ref = ref(null);
    const supportAccountable2Ref = ref(null);

    const validateField = (fieldName) => {
      const isValid = !!eval(fieldName + '.value');
      errors.value[fieldName] = !isValid;
      return isValid;
    };

    const validateForm = () => {
      const requiredFields = [
        'strategicBudget', 'strategicAccountable',
        'coreBudget', 'coreAccountable',
        'supportBudget1', 'supportAccountable1',
        'supportBudget2', 'supportAccountable2'
      ];

      let isValid = true;

      requiredFields.forEach(field => {
        const fieldValid = validateField(field);
        if (!fieldValid) {
          isValid = false;
          if (eval(field + 'Ref.value') && !firstInvalidFieldFocused.value) {
            eval(field + 'Ref.value').focus();
            firstInvalidFieldFocused.value = true;
          }
        }
      });

      return isValid;
    };

    const shakeAllInvalidFields = () => {
      Object.keys(errors.value).forEach(field => {
        if (errors.value[field]) {
          eval(field + 'Ref.value').$el.classList.remove('shake-animation');
          void eval(field + 'Ref.value').$el.offsetWidth;
          eval(field + 'Ref.value').$el.classList.add('shake-animation');
        }
      });
    };

    const validateAndSave = () => {
      firstInvalidFieldFocused.value = false;

      if (!validateForm()) {
        emit('error', 'Please fill all required fields');
        shakeAllInvalidFields();
        return;
      }

      const opcrData = {
        strategic: {
          budget: strategicBudget.value,
          accountable: strategicAccountable.value
        },
        core: {
          budget: coreBudget.value,
          accountable: coreAccountable.value
        },
        support: {
          budget1: supportBudget1.value,
          accountable1: supportAccountable1.value,
          budget2: supportBudget2.value,
          accountable2: supportAccountable2.value
        }
      };

      emit('save', opcrData);
    };

    return {
      strategicBudget,
      strategicAccountable,
      coreBudget,
      coreAccountable,
      supportBudget1,
      supportAccountable1,
      supportBudget2,
      supportAccountable2,
      errors,
      validateField,
      validateAndSave,
      strategicBudgetRef,
      strategicAccountableRef,
      coreBudgetRef,
      coreAccountableRef,
      supportBudget1Ref,
      supportAccountable1Ref,
      supportBudget2Ref,
      supportAccountable2Ref
    };
  }
}
</script>

<style scoped>
.section-container {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  margin-bottom: 16px;
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
  margin-bottom: 12px;
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
    padding: 10px;
    vertical-align: middle;
    color: #333;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid #e0e0e0;
    padding: 8px;
    vertical-align: middle;
  }

  thead {
    background-color: #263238;
  }

  :deep(thead) {
    background-color: #f5f5f5;
  }

  th {
    font-weight: 500;
    color: #ffffff;
    font-size: 0.9rem;
  }

  :deep(thead th) {
    font-weight: 500;
    color: #424242;
  }

  :deep(tbody) {
    background-color: white;
  }

  :deep(tbody tr:hover) {
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

.action-btn {
  min-width: 100px;
  padding: 6px 12px;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.shake-animation {
  animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
}
</style>

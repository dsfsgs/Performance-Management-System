<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h6 class="text-h6 text-weight-medium text-grey-8">Major Final Outputs (MFO)</h6>
      <q-separator class="q-mt-sm" />
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center q-pa-lg">
      <q-spinner-hourglass color="green" size="3em" />
    </div>

    <!-- Table inside a responsive card -->
    <q-card flat bordered class="full-width shadow-1">
      <table class="mfo-table full-width">
        <thead>
          <tr>
            <th class="category-column">
              <div class="header-content">
                <span class="text-subtitle1 text-weight-bold">A. STRATEGIC FUNCTION</span>
                <q-btn icon="add" size="sm" flat round dense color="primary" @click="openAddModal('strategic')"
                  class="q-ml-sm" />
              </div>
            </th>
            <th class="category-column">
              <div class="header-content">
                <span class="text-subtitle1 text-weight-bold">B. CORE FUNCTION</span>
                <q-btn icon="add" size="sm" flat round dense color="primary" @click="openAddModal('core')"
                  class="q-ml-sm" />
              </div>
            </th>
            <th class="category-column">
              <div class="header-content">
                <span class="text-subtitle1 text-weight-bold">C. SUPPORT FUNCTION</span>
                <q-btn icon="add" size="sm" flat round dense color="primary" @click="openAddModal('support')"
                  class="q-ml-sm" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="category-cell">
              <ul class="mfo-list">
                <li v-for="(mfo, index) in strategicMfos" :key="mfo.id" class="mfo-item">
                  <div class="mfo-content">
                    <div class="mfo-title">
                      <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    </div>
                    <div class="mfo-actions">
                      <q-btn icon="edit" size="xs" flat round dense color="grey-7" @click="editMfo(mfo, 'strategic')" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo)" />
                    </div>
                  </div>
                  <ul class="output-list">
                    <li v-for="(output, outputIndex) in getOutputsForMfo(mfo.id)" :key="output.id" class="output-item">
                      <div class="output-content">
                        <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        <div class="output-actions">
                          <q-btn icon="edit" size="xs" flat round dense color="grey-7"
                            @click="editOutput(output, mfo, 'strategic')" />
                          <q-btn icon="delete" size="xs" flat round dense color="negative"
                            @click="confirmDeleteOutput(output)" />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn icon="add" label="Add Output" size="xs" flat dense color="primary"
                    @click="openAddOutputModal(mfo, 'strategic')" class="q-mt-xs full-width" />
                </li>
              </ul>
              <div v-if="strategicMfos.length === 0" class="empty-state">
                <q-icon name="info" size="sm" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-6">No strategic functions available</span>
              </div>
            </td>

            <td class="category-cell">
              <ul class="mfo-list">
                <li v-for="(mfo, index) in coreMfos" :key="mfo.id" class="mfo-item">
                  <div class="mfo-content">
                    <div class="mfo-title">
                      <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    </div>
                    <div class="mfo-actions">
                      <q-btn icon="edit" size="xs" flat round dense color="grey-7" @click="editMfo(mfo, 'core')" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo)" />
                    </div>
                  </div>
                  <ul class="output-list">
                    <li v-for="(output, outputIndex) in getOutputsForMfo(mfo.id)" :key="output.id" class="output-item">
                      <div class="output-content">
                        <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        <div class="output-actions">
                          <q-btn icon="edit" size="xs" flat round dense color="grey-7"
                            @click="editOutput(output, mfo, 'core')" />
                          <q-btn icon="delete" size="xs" flat round dense color="negative"
                            @click="confirmDeleteOutput(output)" />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn icon="add" label="Add Output" size="xs" flat dense color="primary"
                    @click="openAddOutputModal(mfo, 'core')" class="q-mt-xs full-width" />
                </li>
              </ul>
              <div v-if="coreMfos.length === 0" class="empty-state">
                <q-icon name="info" size="sm" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-6">No core functions available</span>
              </div>
            </td>

            <td class="category-cell">
              <ul class="mfo-list">
                <li v-for="(output, index) in supportOutputs" :key="output.id" class="mfo-item">
                  <div class="mfo-content">
                    <div class="mfo-title">
                      <span class="output-text">{{ `OUTPUT ${index + 1}. ${output.name}` }}</span>
                    </div>
                    <div class="mfo-actions">
                      <q-btn icon="edit" size="xs" flat round dense color="grey-7" @click="editSupport(output)" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative"
                        @click="confirmDeleteOutput(output)" />
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="supportOutputs.length === 0" class="empty-state">
                <q-icon name="info" size="sm" color="grey-5" class="q-mr-xs" />
                <span class="text-grey-6">No support outputs available</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </q-card>

    <!-- Add/Edit Modal -->
    <q-dialog v-model="modal.show" persistent>
      <q-card class="modal-card" style="min-width: 500px; max-width: 600px">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-subtitle1">{{ modal.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="closeModal" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <!-- Category Display -->
          <div v-if="form.category" class="q-mb-md">
            <div class="text-caption text-grey-6">Category</div>
            <div class="text-body1 text-weight-medium">{{ form.category.name }}</div>
          </div>

          <!-- Single input for edit mode -->
          <template v-if="modal.mode === 'edit'">
            <q-input v-model="form.items[0].name"
              :label="form.isOutput ? 'Output Name' : (isSupportCategory ? 'Support Output Name' : 'MFO Name')"
              class="q-mt-sm modern-input" :class="{ 'shake-animation': errors.name }" outlined dense
              :rules="[val => !!val || (form.isOutput ? 'Output name is required' : (isSupportCategory ? 'Support output name is required' : 'MFO name is required'))]"
              :error="errors.name" error-message="This field is required" ref="nameInput"
              @blur="validateField('name')" />
          </template>

          <!-- Dynamic inputs for add mode -->
          <template v-else>
            <div v-for="(item, index) in form.items" :key="index" class="q-mb-md">
              <div class="row items-center">
                <q-input v-model="item.name" :label="getInputLabel(index)" class="col-grow q-mr-sm modern-input"
                  :class="{ 'shake-animation': errors[`item_${index}`] }" outlined dense
                  :rules="[val => !!val || getRequiredMessage(index)]" :error="errors[`item_${index}`]"
                  error-message="This field is required" :ref="`itemInput_${index}`"
                  @blur="validateField(`item_${index}`)" />
                <q-btn v-if="index > 0 || form.items.length > 1" icon="remove" flat round dense color="negative"
                  @click="removeItem(index)" class="q-ml-sm" />
              </div>
            </div>

            <!-- Add Another Button -->
            <div class="flex justify-end">
              <q-btn icon="add" label="Add Another" flat dense color="primary" @click="addNewItem" class="q-mt-sm" />
            </div>
          </template>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Cancel" color="grey-7" flat @click="closeModal" class="q-mr-sm" />
          <q-btn label="Save" color="primary" @click="saveEntry" :loading="modal.loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/userStore';
import { mapState } from 'pinia';

export default {
  name: "MFOComponent",
  data() {
    return {
      loading: true,
      mfos: [],
      outputs: [],
      categories: [],
      errors: {
        name: false,
        // Dynamic item errors will be added as needed
      },
      firstInvalidFieldFocused: false,
      modal: {
        show: false,
        title: "Add MFO / Output",
        mode: "add", // 'add' or 'edit'
        loading: false,
        context: null // stores additional context for edits
      },
      form: {
        category: null,
        items: [{ name: "" }],
        isOutput: false,
        parentMfo: null
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),

    categoryOptions() {
      // Make sure we have the three standard categories, even if API doesn't return all
      const standardCategories = [
        { id: 1, name: "A. STRATEGIC FUNCTION", type: "strategic" },
        { id: 2, name: "B. CORE FUNCTION", type: "core" },
        { id: 3, name: "C. SUPPORT FUNCTION", type: "support" }
      ];

      // Use API categories if available, or fallback to standard categories
      if (this.categories && this.categories.length > 0) {
        // Ensure all standard categories are included
        const existingCategoryNames = this.categories.map(c => c.name);
        const missingCategories = standardCategories.filter(
          sc => !existingCategoryNames.some(name => name.includes(sc.name.split(' ')[0]))
        );

        return [...this.categories, ...missingCategories];
      }

      // If no categories from API, use standard ones
      return standardCategories;
    },
    isSupportCategory() {
      return this.form.category &&
        (this.form.category.name.includes("SUPPORT") ||
          this.form.category.name.includes("C."));
    },
    supportCategory() {
      return this.categoryOptions.find(cat =>
        cat.name.includes("SUPPORT") ||
        cat.name.includes("C.")
      );
    },
    strategicMfos() {
      return this.mfos.filter(mfo =>
        mfo.category && (
          mfo.category.name?.includes("STRATEGIC") ||
          mfo.category.name?.includes("A.")
        )
      );
    },

    coreMfos() {
      return this.mfos.filter(mfo =>
        mfo.category && (
          mfo.category.name?.includes("CORE") ||
          mfo.category.name?.includes("B.")
        )
      );
    },

    supportOutputs() {
      if (!this.supportCategory) return [];

      return this.outputs.filter(output =>
        output.f_category_id === this.supportCategory.id &&
        (!output.mfo_id || output.mfo_id === null)
      );
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    validateField(fieldName) {
      let isValid = false;

      if (fieldName === 'name') {
        isValid = !!this.form.items[0]?.name?.trim();
      } else if (fieldName.startsWith('item_')) {
        const index = parseInt(fieldName.split('_')[1]);
        isValid = !!this.form.items[index]?.name?.trim();
      }

      this.errors[fieldName] = !isValid;
      return isValid;
    },

    validateForm() {
      let isValid = true;
      this.firstInvalidFieldFocused = false;

      // Validate all items
      this.form.items.forEach((item, index) => {
        const fieldName = this.modal.mode === 'edit' && index === 0 ? 'name' : `item_${index}`;
        if (!this.validateField(fieldName)) {
          isValid = false;

          // Focus the first invalid field
          if (!this.firstInvalidFieldFocused) {
            const refName = this.modal.mode === 'edit' && index === 0 ? 'nameInput' : `itemInput_${index}`;
            if (this.$refs[refName]) {
              this.$nextTick(() => {
                this.$refs[refName].focus();
              });
              this.firstInvalidFieldFocused = true;
            }
          }
        }
      });

      return isValid;
    },

    shakeAllInvalidFields() {
      this.$nextTick(() => {
        Object.keys(this.errors).forEach(field => {
          if (this.errors[field]) {
            let refName;
            if (field === 'name') {
              refName = 'nameInput';
            } else if (field.startsWith('item_')) {
              const index = parseInt(field.split('_')[1]);
              refName = `itemInput_${index}`;
            }

            if (this.$refs[refName]) {
              const element = this.$refs[refName].$el;
              element.classList.remove('shake-animation');
              void element.offsetWidth; // Trigger reflow
              element.classList.add('shake-animation');
            }
          }
        });
      });
    },

    async fetchData() {
      this.loading = true;
      try {
        const userStore = useUserStore();
        await userStore.loadUserData();
        this.mfos = userStore.mfos;

        // Fetch categories
        const categoriesResponse = await api.get('/fetch_f_category');
        this.categories = categoriesResponse.data;

        // Fetch ALL outputs (not just support outputs)
        const outputsResponse = await api.get('/allOutputs', {
          params: {
            office_id: this.user.office_id
          }
        });

        this.outputs = outputsResponse.data.map(output => {
          // For all outputs, attach category and mfo if available
          return {
            ...output,
            category: this.categories.find(c => c.id === output.f_category_id),
            mfo: this.mfos.find(m => m.id === output.mfo_id)
          };
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load data. Please try again.',
          position: 'top'
        });
      } finally {
        this.loading = false;
      }
    },

    getOutputsForMfo(mfoId) {
      return this.outputs.filter(output => output.mfo_id === mfoId);
    },

    getInputLabel(index) {
      if (this.form.isOutput) {
        return this.isSupportCategory ? `Support Output ${index + 1}` : `Output ${index + 1}`;
      }
      return `MFO ${index + 1}`;
    },

    getRequiredMessage(index) {
      if (this.form.isOutput) {
        return `Output ${index + 1} is required`;
      }
      return this.isSupportCategory ? `Support output ${index + 1} is required` : `MFO ${index + 1} is required`;
    },

    addNewItem() {
      this.form.items.push({ name: "" });
    },

    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1);
      }
    },

    resetForm() {
      this.form = {
        category: null,
        items: [{ name: "" }],
        isOutput: false,
        parentMfo: null
      };
      this.errors = {
        name: false
      };
      this.firstInvalidFieldFocused = false;
    },

    openAddModal(categoryType) {
      this.resetForm();

      // Determine if this is for support function
      const isSupport = categoryType === 'support';

      this.modal = {
        show: true,
        title: isSupport ? 'Add Support Output' : `Add ${this.getCategoryName(categoryType)}`,
        mode: "add",
        loading: false,
        context: { categoryType }
      };

      const categoryForType = this.findCategoryByType(categoryType);
      if (!categoryForType) {
        console.error('Could not find appropriate category for type:', categoryType);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to set category. Please try again.',
          position: 'top'
        });
        this.closeModal();
        return;
      }

      this.form.category = categoryForType;
      this.form.isOutput = isSupport; // Set to true for support functions
      this.form.parentMfo = null; // Support outputs don't have parent MFO
    },

    openAddOutputModal(mfo, categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Add Outputs",
        mode: "add",
        loading: false,
        context: { mfo, categoryType }
      };

      this.form.category = this.findCategoryByType(categoryType);
      this.form.parentMfo = mfo;
      this.form.isOutput = true;
    },



    editMfo(mfo, categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit MFO",
        mode: "edit",
        loading: false,
        context: {
          mfo: { ...mfo }, // Make sure we have the mfo object
          categoryType
        }
      };

      this.form.category = mfo.category || this.findCategoryByType(categoryType);
      this.form.items = [{ name: mfo.name }];
      this.form.isOutput = false;
    },

    editOutput(output, mfo, categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit Output",
        mode: "edit",
        loading: false,
        context: { output, mfo, categoryType }
      };

      this.form.category = mfo.category || this.findCategoryByType(categoryType);
      this.form.parentMfo = mfo;
      this.form.items = [{ name: output.name }];
      this.form.isOutput = true;
    },

    editSupport(mfo) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit Support Output",
        mode: "edit",
        loading: false,
        context: { mfo }
      };

      this.form.category = this.findCategoryByType('support');
      this.form.items = [{ name: mfo.name }];
      this.form.isOutput = true;
    },

    findCategoryByType(categoryType) {
      return this.categoryOptions.find(cat => {
        if (categoryType === 'strategic') {
          return cat.name.includes("STRATEGIC") || cat.name.includes("A.");
        } else if (categoryType === 'core') {
          return cat.name.includes("CORE") || cat.name.includes("B.");
        } else {
          return cat.name.includes("SUPPORT") || cat.name.includes("C.");
        }
      });
    },

    getCategoryName(categoryType) {
      switch (categoryType) {
        case 'strategic': return 'Strategic MFO';
        case 'core': return 'Core MFO';
        case 'support': return 'Support Output';
        default: return 'MFO/Output';
      }
    },

    async saveEntry() {
      try {
        this.modal.loading = true;
        this.firstInvalidFieldFocused = false;

        if (!this.validateForm()) {
          this.$q.notify({
            type: 'negative',
            message: 'Please fill all required fields',
            position: 'top',
            icon: 'warning'
          });
          this.shakeAllInvalidFields();
          return;
        }

        if (this.form.isOutput) {
          await this.saveOutputs();
        } else {
          if (!this.isSupportCategory) {
            await this.saveMfos();
          } else {
            await this.saveOutputs();
            return;
          }
        }

        this.$q.notify({
          type: 'positive',
          message: this.modal.mode === 'add'
            ? (this.form.isOutput
              ? `${this.isSupportCategory ? 'Support outputs' : 'Outputs'} added successfully`
              : `Added successfully`)
            : (this.form.isOutput
              ? 'Output updated successfully'
              : 'MFO updated successfully'),
          position: 'top'
        });

        await this.fetchData();
        this.closeModal();
      } catch (error) {
        console.error('Save error:', error);
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || error.message || 'Failed to save entries',
          position: 'top'
        });
      } finally {
        this.modal.loading = false;
      }
    },

    async saveMfos() {
      try {
        if (this.modal.mode === 'add') {
          const promises = this.form.items.map(item => {
            return api.post('/add_mfo', {
              office_id: this.user.office_id,
              name: item.name,
              f_category_id: this.form.category.id
            });
          });
          await Promise.all(promises);
        } else {
          // Ensure we have the MFO ID from context
          const mfoId = this.modal.context?.mfo?.id;
          if (!mfoId) {
            throw new Error("MFO ID is missing");
          }

          await api.post(`/mfos/${mfoId}`, {
            office_id: this.user.office_id,
            name: this.form.items[0].name,
            f_category_id: this.form.category.id
          });
        }
      } catch (error) {
        console.error('Error saving MFO:', error);
        throw error; // Re-throw to be caught in saveEntry
      }
    },

    async saveOutputs() {
      try {
        if (this.modal.mode === 'add') {
          const promises = this.form.items.map(item => {
            const payload = {
              name: item.name,
              f_category_id: this.form.category.id,
              office_id: this.user.office_id
            };

            if (!this.isSupportCategory && this.form.parentMfo) {
              payload.mfo_id = this.form.parentMfo.id;
            }

            return api.post('/add_output', payload);
          });

          await Promise.all(promises);
        } else {
          // Handle both regular outputs and support outputs
          const outputId = this.modal.context?.output?.id || this.modal.context?.mfo?.id;
          if (!outputId) {
            throw new Error("Output ID is missing");
          }

          const payload = {
            name: this.form.items[0].name,
            f_category_id: this.form.category.id,
            office_id: this.user.office_id
          };

          if (!this.isSupportCategory && this.form.parentMfo) {
            payload.mfo_id = this.form.parentMfo.id;
          }

          await api.post(`/outputs/${outputId}`, payload);
        }

        await this.fetchData();
        this.closeModal();
      } catch (error) {
        console.error('Error saving outputs:', error);
        throw error;
      }
    },



    confirmDelete(mfo) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this MFO?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await this.deleteMfo(mfo);
      });
    },

    confirmDeleteOutput(output) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this output?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await this.deleteOutput(output);
      });
    },

    async deleteMfo(mfo) {
      try {
        await api.delete(`/mfos/${mfo.id}`);
        this.$q.notify({
          type: 'positive',
          message: 'MFO deleted successfully',
          position: 'top'
        });
        await this.fetchData();
      } catch (error) {
        console.error('Delete error:', error);
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to delete MFO',
          position: 'top'
        });
      }
    },

    async deleteOutput(output) {
      try {
        await api.delete(`/outputs/${output.id}`);
        this.$q.notify({
          type: 'positive',
          message: 'Output deleted successfully',
          position: 'top'
        });
        await this.fetchData();
      } catch (error) {
        console.error('Delete output error:', error);
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to delete output',
          position: 'top'
        });
      }
    },

    closeModal() {
      this.modal.show = false;
      this.resetForm();
    }
  }
};
</script>

<style scoped>
/* Main table styling */
.mfo-table {
  border-collapse: collapse;
  width: 100%;
}

.category-column {
  padding: 16px;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  vertical-align: top;
}

.category-column:last-child {
  border-right: none;
}

.category-cell {
  padding: 16px;
  vertical-align: top;
  border-right: 1px solid #e0e0e0;
  width: 33.33%;
}

.category-cell:last-child {
  border-right: none;
}

/* List styling */
.mfo-list,
.output-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mfo-item {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 12px;
  margin-bottom: 12px;
  transition: box-shadow 0.2s ease;
}

.mfo-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.output-item {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 8px 12px;
  margin: 6px 0;
}

/* Content styling - Updated for uniform alignment */
.mfo-content,
.output-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mfo-title {
  flex-grow: 1;
  padding-right: 12px;
  min-width: 0;
  /* Allows text truncation */
}

.mfo-text,
.output-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mfo-text {
  font-size: 0.85rem;
  font-weight: bold;
}

.output-text {
  font-size: 0.8rem;
}

/* Action buttons - Updated for uniform alignment */
.mfo-actions,
.output-actions {
  display: flex;
  gap: 4px;
  min-width: 56px;
  /* Fixed width for action buttons */
  flex-shrink: 0;
  /* Prevents shrinking */
}

/* Empty state styling */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #6c757d;
}

/* Header content */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Modal styling */
.modal-card {
  border-radius: 8px;
  overflow: hidden;
}

/* Input styling with validation */
.modern-input {
  :deep(.q-field__control) {
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  :deep(.q-field__control:hover) {
    border-color: #a0c0e8;
  }

  :deep(.q-field--focused .q-field__control) {
    border-color: #1976d2;
    box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.2);
  }

  :deep(.q-field--error .q-field__control) {
    border-color: #f44336;
    box-shadow: 0 0 0 1px rgba(244, 67, 54, 0.2);
  }

  :deep(.q-field__native) {
    font-size: 0.95rem;
  }
}

.shake-animation {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .category-cell {
    padding: 12px;
  }

  .mfo-item {
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .mfo-table {
    display: block;
    overflow-x: auto;
  }

  .category-column,
  .category-cell {
    min-width: 280px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content .q-btn {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>

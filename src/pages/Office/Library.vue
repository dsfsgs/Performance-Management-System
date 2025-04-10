<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">MFO</h6>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center q-pa-sm">
      <q-spinner color="primary" size="2em" />
      <span class="q-ml-sm">Loading MFO data...</span>
    </div>

    <!-- Table inside a responsive card -->
    <q-card class="table-container full-width">
      <table class="mfo-table full-width-table">
        <thead>
          <tr>
            <th class="category-column">
              <div class="header-content">
                A. STRATEGIC FUNCTION
                <q-btn icon="add" size="sm" flat dense @click="openAddModal('strategic')" class="q-ml-sm" />
              </div>
            </th>
            <th class="category-column">
              <div class="header-content">
                B. CORE FUNCTION
                <q-btn icon="add" size="sm" flat dense @click="openAddModal('core')" class="q-ml-sm" />
              </div>
            </th>
            <th class="category-column">
              <div class="header-content">
                C. SUPPORT FUNCTION
                <q-btn icon="add" size="sm" flat dense @click="openAddModal('support')" class="q-ml-sm" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="category-cell">
              <ul>
                <li v-for="(mfo, index) in strategicMfos" :key="mfo.id" class="mfo-item">
                  <div class="item-container">
                    <div class="text-content">
                      <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    </div>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editMfo(mfo, 'strategic')" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo)" />
                    </div>
                  </div>
                  <ul>
                    <li v-for="(output, outputIndex) in getOutputsForMfo(mfo.id)" :key="output.id" class="output-item">
                      <div class="item-container">
                        <div class="text-content">
                          <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        </div>
                        <div class="item-actions">
                          <q-btn icon="edit" size="xs" flat round dense @click="editOutput(output, mfo, 'strategic')" />
                          <q-btn icon="delete" size="xs" flat round dense color="negative"
                            @click="confirmDeleteOutput(output)" />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn icon="add" size="xs" flat dense label="Add Output"
                    @click="openAddOutputModal(mfo, 'strategic')" class="q-mt-xs" />
                </li>
              </ul>
              <div v-if="strategicMfos.length === 0" class="flex justify-center q-pa-md text-grey">
                No A strategic function available for your office.
              </div>
            </td>
            <td class="category-cell">
              <ul>
                <li v-for="(mfo, index) in coreMfos" :key="mfo.id" class="mfo-item">
                  <div class="item-container">
                    <div class="text-content">
                      <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    </div>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editMfo(mfo, 'core')" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo)" />
                    </div>
                  </div>
                  <ul>
                    <li v-for="(output, outputIndex) in getOutputsForMfo(mfo.id)" :key="output.id" class="output-item">
                      <div class="item-container">
                        <div class="text-content">
                          <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        </div>
                        <div class="item-actions">
                          <q-btn icon="edit" size="xs" flat round dense @click="editOutput(output, mfo, 'core')" />
                          <q-btn icon="delete" size="xs" flat round dense color="negative"
                            @click="confirmDeleteOutput(output)" />
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn icon="add" size="xs" flat dense label="Add Output" @click="openAddOutputModal(mfo, 'core')"
                    class="q-mt-xs" />
                </li>
              </ul>
              <div v-if="coreMfos.length === 0" class="flex justify-center q-pa-md text-grey">
                No B core function available for your office.
              </div>
            </td>
            <td class="category-cell">
              <ul>
                <li v-for="(mfo, index) in supportMfos" :key="mfo.id" class="mfo-item">
                  <div class="item-container">
                    <div class="text-content">
                      <span class="output-text">{{ `OUTPUT ${index + 1}. ${mfo.name}` }}</span>
                    </div>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editSupport(mfo)" />
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo)" />
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="supportMfos.length === 0" class="flex justify-center q-pa-md text-grey">
                No C support function available for your office.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </q-card>

    <!-- Add/Edit Modal -->
    <q-dialog v-model="modal.show" persistent>
      <q-card class="modal-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1">{{ modal.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup
            @click="form.showOutputField ? resetOutputField() : closeModal()" />
        </q-card-section>
        <q-card-section>
          <!-- Category Display (not editable) -->
          <div v-if="form.category" class="q-mb-sm">
            <div class="text-caption">Category</div>
            <div class="text-body1">{{ form.category.name }}</div>
          </div>

          <!-- MFO/Support Input -->
          <q-input v-model="form.mfo.name" :label="isSupportCategory ? 'Support Output Name' : 'MFO Name'"
            class="q-mt-sm" :disable="modal.context?.mfo && form.showOutputField"
            :rules="[val => !!val || (isSupportCategory ? 'Support output name is required' : 'MFO name is required')]"
            dense ref="mfoInput" />

          <!-- Output Input (only shown when adding outputs to existing MFOs) -->
          <q-input v-if="modal.context?.mfo && form.showOutputField && !isSupportCategory" v-model="form.output.name"
            label="Output Name" class="q-mt-sm" :rules="[val => !!val || 'Output name is required']" dense
            ref="outputInput" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Save" color="green" size="sm" @click="saveEntry" :loading="modal.loading" />
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
      modal: {
        show: false,
        title: "Add MFO / Output",
        mode: "add", // 'add' or 'edit'
        loading: false,
        context: null // stores additional context for edits
      },
      form: {
        category: null,
        mfo: { id: null, name: "" },
        output: { id: null, name: "" },
        showOutputField: false
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),

    categoryOptions() {
      // Make sure we have the three standard categories, even if API doesn't return all
      const standardCategories = [
        { id: 1, name: "A. STRATEGIC FUNCTION" },
        { id: 2, name: "B. CORE FUNCTION" },
        { id: 3, name: "C. SUPPORT FUNCTION" }
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
      return this.form.category && (
        this.form.category.name?.includes("SUPPORT") ||
        this.form.category.name?.includes("C.")
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

    supportMfos() {
      return this.mfos.filter(mfo =>
        mfo.category && (
          mfo.category.name?.includes("SUPPORT") ||
          mfo.category.name?.includes("C.")
        )
      );
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        // Load user data and MFOs
        const userStore = useUserStore();
        await userStore.loadUserData();
        this.mfos = userStore.mfos;

        // Fetch categories explicitly
        try {
          const categoriesResponse = await api.get('/fetch_f_category');
          this.categories = categoriesResponse.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
          // Use userStore categories as fallback
          this.categories = userStore.categories;
        }

        // Fetch outputs
        const outputsResponse = await api.get('/outputs');
        this.outputs = outputsResponse.data;
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

    openAddModal(categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: `Add ${this.getCategoryName(categoryType)}`,
        mode: "add",
        loading: false,
        context: { categoryType }
      };

      // Set the category based on the type - this will now be fixed and not editable
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
      this.form.showOutputField = false;
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

    openAddOutputModal(mfo, categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Add Output",
        mode: "add",
        loading: false,
        context: { mfo, categoryType }
      };

      // Find the category based on categoryType
      this.form.category = this.findCategoryByType(categoryType);
      this.form.mfo = { ...mfo };
      this.form.showOutputField = true;
    },

    editMfo(mfo, categoryType) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit MFO",
        mode: "edit",
        loading: false,
        context: { categoryType }
      };

      // Use mfo's category or find it based on categoryType
      this.form.category = mfo.category || this.findCategoryByType(categoryType);
      this.form.mfo = { ...mfo };
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

      // Use mfo's category or find it based on categoryType
      this.form.category = mfo.category || this.findCategoryByType(categoryType);
      this.form.mfo = { ...mfo };
      this.form.output = { ...output };
      this.form.showOutputField = true;
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

      // Set category to Support
      this.form.category = this.findCategoryByType('support');
      this.form.mfo = { ...mfo };
    },

    async saveEntry() {
      try {
        this.modal.loading = true;

        if (!this.form.category || !this.form.category.id) {
          throw new Error("Category is required");
        }

        if (!this.form.mfo.name) {
          this.$refs.mfoInput.validate();
          throw new Error(this.isSupportCategory ? "Support output name is required" : "MFO name is required");
        }

        if (this.form.showOutputField && !this.form.output.name) {
          this.$refs.outputInput.validate();
          throw new Error("Output name is required");
        }

        let successMessage = '';

        if (this.modal.mode === 'add') {
          await this.addEntry();
          successMessage = this.form.showOutputField
            ? 'Output added successfully'
            : (this.isSupportCategory ? 'Support output added successfully' : 'MFO added successfully');
        } else {
          await this.updateEntry();
          successMessage = this.form.showOutputField
            ? 'Output updated successfully'
            : (this.isSupportCategory ? 'Support output updated successfully' : 'MFO updated successfully');
        }

        // Show success notification
        this.$q.notify({
          type: 'positive',
          message: successMessage,
          position: 'top'
        });

        // Refresh data
        await this.fetchData();

        // Close modal unless we're adding outputs (where we want to keep it open)
        if (!(this.modal.mode === 'add' && this.form.showOutputField)) {
          this.closeModal();
        } else {
          // For output addition, just reset the output field
          this.form.output = { id: null, name: "" };
          this.$refs.outputInput.resetValidation();
        }
      } catch (error) {
        if (!error.message.includes("required")) {
          console.error('Save error:', error);
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || error.message || 'Failed to save entry',
            position: 'top'
          });
        }
      } finally {
        this.modal.loading = false;
      }
    },

    resetOutputField() {
      this.form.output = { id: null, name: "" };
      if (this.$refs.outputInput) {
        this.$refs.outputInput.resetValidation();
      }
    },

    async addEntry() {
      // For support function, we just add the MFO directly
      if (this.isSupportCategory) {
        await api.post('/add_mfo', {
          office_id: this.user.office_id,
          name: this.form.mfo.name,
          f_category_id: this.form.category.id
        });
        return;
      }

      // For outputs to existing MFOs
      if (this.modal.context?.mfo && this.form.showOutputField) {
        await api.post('/add_output', {
          mfo_id: this.modal.context.mfo.id,
          name: this.form.output.name
        });
        return;
      }

      // For new strategic/core MFOs
      await api.post('/add_mfo', {
        office_id: this.user.office_id,
        name: this.form.mfo.name,
        f_category_id: this.form.category.id
      });
    },

    async updateEntry() {
      if (this.form.showOutputField && this.modal.context?.output && !this.isSupportCategory) {
        // Updating output (only for Strategic/Core)
        await api.post(`/outputs/${this.form.output.id}`, {
          mfo_id: this.form.mfo.id,
          name: this.form.output.name
        });
      } else {
        // Updating MFO (including Support)
        await api.post(`/mfos/${this.form.mfo.id}`, {
          office_id: this.user.office_id,
          name: this.form.mfo.name,
          f_category_id: this.form.category.id
        });
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
    },

    resetForm() {
      this.form = {
        category: null,
        mfo: { id: null, name: "" },
        output: { id: null, name: "" },
        showOutputField: false
      };
      if (this.$refs.mfoInput) this.$refs.mfoInput.resetValidation();
      if (this.$refs.outputInput) this.$refs.outputInput.resetValidation();
    }
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
  max-width: 100%;
}

.q-pa-md {
  padding: 16px;
}

.text-h6 {
  font-size: 1.25rem;
}

.text-subtitle1 {
  font-size: 1rem;
}

.q-mb-sm {
  margin-bottom: 8px;
}

/* Header content styles */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content .q-btn {
  margin-left: 8px;
}

/* Enhanced Table Styling */
.table-container {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width: 100%;
  margin: 0 auto;
}

.full-width-table {
  width: 100%;
  min-width: 100%;
  table-layout: fixed;
}

.category-column {
  width: 33.33%;
  min-width: 300px;
  padding: 12px;
  text-align: left;
  background: #f5f5f5;
  font-weight: bold;
  font-size: 0.9rem;
  border-right: 2px solid #e0e0e0;
}

.category-column:last-child {
  border-right: none;
}

.category-cell {
  padding: 12px;
  vertical-align: top;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

.category-cell:last-child {
  border-right: none;
}

/* MFO and Output Styling */
.mfo-item {
  padding: 10px;
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.output-item {
  padding: 8px 10px;
  margin: 6px 0;
  background: #f9f9f9;
  border-radius: 4px;
}

.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  padding-right: 70px;
  /* Make space for the buttons */
}

.text-content {
  flex-grow: 1;
  padding-right: 10px;
  min-width: 0;
  /* This prevents text overflow */
  overflow: hidden;
}

.item-actions {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
}

.mfo-text,
.output-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.mfo-text {
  font-size: 0.85rem;
  font-weight: bold;
}

.output-text {
  font-size: 0.8rem;
}

/* Modal card */
.modal-card {
  width: 600px;
  max-width: 90%;
  padding: 16px;
}

.modal-card .q-card__section:first-child {
  padding-bottom: 0;
}

/* Category display */
.text-caption {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.75rem;
}

.text-body1 {
  font-size: 1rem;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .category-column {
    min-width: 250px;
    padding: 10px;
    font-size: 0.85rem;
  }

  .category-cell {
    padding: 10px;
  }

  .mfo-item {
    padding: 8px;
  }

  .output-item {
    padding: 6px 8px;
  }
}

@media (max-width: 768px) {
  .table-container {
    border-radius: 0;
  }

  .category-column {
    min-width: 200px;
    padding: 8px;
  }

  .q-pa-md {
    padding: 12px;
  }

  .button-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-container .q-btn {
    margin-bottom: 8px;
    width: 100%;
  }

  .item-container {
    padding-right: 60px;
  }

  .item-actions {
    right: 5px;
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

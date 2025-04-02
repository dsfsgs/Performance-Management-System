<template>
  <q-page class="q-pa-md full-width">
    <div class="text-h6 q-mb-sm">MFO</div>

    <!-- Add Button -->
    <div class="button-container">
      <q-btn color="green" icon="add" label="Add" @click="openAddModal" size="sm" />
    </div>

    <!-- Table inside a responsive card -->
    <q-card class="table-container full-width">
      <table class="mfo-table full-width-table">
        <thead>
          <tr>
            <th class="category-column">A. STRATEGIC FUNCTION</th>
            <th class="category-column">B. CORE FUNCTION</th>
            <th class="category-column">C. SUPPORT FUNCTION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="category-cell">
              <ul>
                <li v-for="(mfo, index) in mfoData.strategic" :key="mfo.id" class="mfo-item">
                  <div class="item-container">
                    <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editMfo(mfo, 'strategic')"/>
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo, 'strategic')"/>
                    </div>
                  </div>
                  <ul>
                    <li v-for="(output, outputIndex) in mfo.outputs" :key="output.id" class="output-item">
                      <div class="item-container">
                        <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        <div class="item-actions">
                          <q-btn icon="edit" size="xs" flat round dense @click="editOutput(output, mfo, 'strategic')"/>
                          <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDeleteOutput(output, mfo, 'strategic')"/>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn
                    icon="add"
                    size="xs"
                    flat
                    dense
                    label="Add Output"
                    @click="openAddOutputModal(mfo, 'strategic')"
                    class="q-mt-xs"
                  />
                </li>
              </ul>
            </td>
            <td class="category-cell">
              <ul>
                <li v-for="(mfo, index) in mfoData.core" :key="mfo.id" class="mfo-item">
                  <div class="item-container">
                    <strong class="mfo-text">{{ `MFO ${index + 1}. ${mfo.name}` }}</strong>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editMfo(mfo, 'core')"/>
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(mfo, 'core')"/>
                    </div>
                  </div>
                  <ul>
                    <li v-for="(output, outputIndex) in mfo.outputs" :key="output.id" class="output-item">
                      <div class="item-container">
                        <span class="output-text">{{ `OUTPUT ${outputIndex + 1}. ${output.name}` }}</span>
                        <div class="item-actions">
                          <q-btn icon="edit" size="xs" flat round dense @click="editOutput(output, mfo, 'core')"/>
                          <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDeleteOutput(output, mfo, 'core')"/>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <q-btn
                    icon="add"
                    size="xs"
                    flat
                    dense
                    label="Add Output"
                    @click="openAddOutputModal(mfo, 'core')"
                    class="q-mt-xs"
                  />
                </li>
              </ul>
            </td>
            <td class="category-cell">
              <ul>
                <li v-for="(output, index) in mfoData.support" :key="output.id" class="mfo-item">
                  <div class="item-container">
                    <span class="output-text">{{ `OUTPUT ${index + 1}. ${output.name}` }}</span>
                    <div class="item-actions">
                      <q-btn icon="edit" size="xs" flat round dense @click="editSupport(output)"/>
                      <q-btn icon="delete" size="xs" flat round dense color="negative" @click="confirmDelete(output, 'support')"/>
                    </div>
                  </div>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </q-card>

    <!-- Add/Edit Modal -->
    <q-dialog v-model="modal.show" persistent>
      <q-card class="modal-card">
        <q-card-section>
          <div class="text-subtitle1">{{ modal.title }}</div>
        </q-card-section>
        <q-card-section>
          <!-- Category Selection -->
          <q-select
            v-model="form.category"
            :options="categories"
            label="Select Category"
            :disable="modal.mode === 'edit'"
            @update:model-value="handleCategoryChange"
            :rules="[val => !!val || 'Category is required']"
            dense
          />

          <!-- MFO Input -->
          <q-input
            v-if="!isSupportCategory"
            v-model="form.mfo.name"
            label="MFO Name"
            class="q-mt-sm"
            :rules="[val => !!val || 'MFO name is required']"
            dense
          />

          <!-- Output Input -->
          <q-input
            v-if="form.showOutputField"
            v-model="form.output.name"
            label="Output Name"
            class="q-mt-sm"
            :rules="[val => !!val || 'Output name is required']"
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="red" flat size="sm" @click="closeModal" />
          <q-btn
            label="Save"
            color="green"
            size="sm"
            @click="saveEntry"
            :loading="modal.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "MFOComponent",
  data() {
    return {
      mfoData: {
        strategic: [
          { id: 1, name: "Sample Strategic MFO", outputs: [] }
        ],
        core: [
          { id: 1, name: "Sample Core MFO", outputs: [] }
        ],
        support: [
          { id: 1, name: "Sample Support Output" }
        ]
      },
      categories: ["A. STRATEGIC FUNCTION", "B. CORE FUNCTION", "C. SUPPORT FUNCTION"],
      modal: {
        show: false,
        title: "Add MFO / Output",
        mode: "add", // 'add' or 'edit'
        loading: false,
        context: null // stores additional context for edits
      },
      form: {
        category: "",
        mfo: { id: null, name: "" },
        output: { id: null, name: "" },
        showOutputField: false
      }
    };
  },
  computed: {
    isSupportCategory() {
      return this.form.category === "C. SUPPORT FUNCTION";
    }
  },
  methods: {
    openAddModal() {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Add MFO / Output",
        mode: "add",
        loading: false,
        context: null
      };
      this.form.showOutputField = false;
    },

    openAddOutputModal(mfo, category) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Add Output",
        mode: "add",
        loading: false,
        context: { mfo, category }
      };
      this.form.category = this.categories[category === 'strategic' ? 0 : 1];
      this.form.mfo = { ...mfo };
      this.form.showOutputField = true;
    },

    editMfo(mfo, category) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit MFO",
        mode: "edit",
        loading: false,
        context: { category }
      };
      this.form.category = this.categories[category === 'strategic' ? 0 : 1];
      this.form.mfo = { ...mfo };
    },

    editOutput(output, mfo, category) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit Output",
        mode: "edit",
        loading: false,
        context: { output, mfo, category }
      };
      this.form.category = this.categories[category === 'strategic' ? 0 : 1];
      this.form.mfo = { ...mfo };
      this.form.output = { ...output };
      this.form.showOutputField = true;
    },

    editSupport(output) {
      this.resetForm();
      this.modal = {
        show: true,
        title: "Edit Support Output",
        mode: "edit",
        loading: false,
        context: { output }
      };
      this.form.category = this.categories[2]; // Support category
      this.form.output = { ...output };
      this.form.showOutputField = true;
    },

    handleCategoryChange() {
      this.form.mfo = { id: null, name: "" };
      this.form.output = { id: null, name: "" };
      this.form.showOutputField = this.isSupportCategory;
    },

    async saveEntry() {
      try {
        this.modal.loading = true;

        if (this.modal.mode === 'add') {
          await this.addEntry();
        } else {
          await this.updateEntry();
        }

        this.$q.notify({
          type: 'positive',
          message: 'Entry saved successfully',
          position: 'top'
        });
        this.closeModal();
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to save entry',
          position: 'top'
        });
      } finally {
        this.modal.loading = false;
      }
    },

    addEntry() {
      return new Promise((resolve) => {
        const key = this.getCategoryKey(this.form.category);

        if (this.isSupportCategory) {
          const newOutput = {
            id: Date.now(),
            name: this.form.output.name
          };
          this.mfoData.support.push(newOutput);
          return resolve();
        }

        // For MFOs with outputs
        if (this.modal.context?.mfo) {
          // Adding output to existing MFO
          const mfoIndex = this.mfoData[key].findIndex(m => m.id === this.modal.context.mfo.id);
          if (mfoIndex >= 0) {
            const newOutput = {
              id: Date.now(),
              name: this.form.output.name
            };
            this.mfoData[key][mfoIndex].outputs.push(newOutput);
            return resolve();
          }
        }

        // Adding new MFO
        const newMfo = {
          id: Date.now(),
          name: this.form.mfo.name,
          outputs: this.form.output.name ? [{
            id: Date.now(),
            name: this.form.output.name
          }] : []
        };
        this.mfoData[key].push(newMfo);
        resolve();
      });
    },

    updateEntry() {
      return new Promise((resolve) => {
        const key = this.getCategoryKey(this.form.category);

        if (this.isSupportCategory) {
          const outputIndex = this.mfoData.support.findIndex(o => o.id === this.modal.context.output.id);
          if (outputIndex >= 0) {
            this.mfoData.support[outputIndex].name = this.form.output.name;
          }
          return resolve();
        }

        if (this.modal.context?.output) {
          // Editing output
          const mfoIndex = this.mfoData[key].findIndex(m => m.id === this.modal.context.mfo.id);
          if (mfoIndex >= 0) {
            const outputIndex = this.mfoData[key][mfoIndex].outputs.findIndex(
              o => o.id === this.modal.context.output.id
            );
            if (outputIndex >= 0) {
              this.mfoData[key][mfoIndex].outputs[outputIndex].name = this.form.output.name;
            }
          }
        } else {
          // Editing MFO
          const mfoIndex = this.mfoData[key].findIndex(m => m.id === this.form.mfo.id);
          if (mfoIndex >= 0) {
            this.mfoData[key][mfoIndex].name = this.form.mfo.name;
          }
        }
        resolve();
      });
    },

    confirmDelete(item, category) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this item?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteEntry(item, category);
      });
    },

    confirmDeleteOutput(output, mfo, category) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this output?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.deleteOutput(output, mfo, category);
      });
    },

    deleteEntry(item, category) {
      const key = this.getCategoryKey(this.categories[category === 'strategic' ? 0 :
                                     category === 'core' ? 1 : 2]);
      this.mfoData[key] = this.mfoData[key].filter(i => i.id !== item.id);
      this.$q.notify({
        type: 'positive',
        message: 'Item deleted successfully',
        position: 'top'
      });
    },

    deleteOutput(output, mfo, category) {
      const key = this.getCategoryKey(this.categories[category === 'strategic' ? 0 : 1]);
      const mfoIndex = this.mfoData[key].findIndex(m => m.id === mfo.id);
      if (mfoIndex >= 0) {
        this.mfoData[key][mfoIndex].outputs = this.mfoData[key][mfoIndex].outputs.filter(
          o => o.id !== output.id
        );
        this.$q.notify({
          type: 'positive',
          message: 'Output deleted successfully',
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
        category: "",
        mfo: { id: null, name: "" },
        output: { id: null, name: "" },
        showOutputField: false
      };
    },

    getCategoryKey(category) {
      return category.includes("STRATEGIC") ? "strategic" :
             category.includes("CORE") ? "core" : "support";
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

/* Button container */
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.output-item {
  padding: 8px 10px 8px 20px;
  margin: 6px 0;
  background: #f9f9f9;
  border-radius: 4px;
}

.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.item-actions {
  display: flex;
  gap: 6px;
}

.mfo-text {
  font-size: 0.85rem;
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
    padding: 6px 8px 6px 18px;
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
}
</style>

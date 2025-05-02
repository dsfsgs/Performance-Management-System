<template>
  <q-card style="width: 90vw; max-width: 1200px; border-radius: 12px;">
    <q-card-section class="header-section row items-center justify-between"
      style="background-color: #00703C; height: 50px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      <div class="text-h6 text-white q-pl-md">View/Edit OPCR</div>
      <q-btn v-if="!isEditing" label="Edit" color="primary" @click="startEditing" />
    </q-card-section>

    <q-card-section style="overflow-y: auto; max-height: 70vh; padding: 16px;">
      <!-- Similar table structure as InputPage.vue but with v-model bound to the fetched data -->
      <!-- Add edit/save buttons when in edit mode -->

      <div v-if="isEditing" class="q-mt-md">
        <q-btn label="Save" color="primary" @click="saveChanges" />
        <q-btn label="Cancel" color="grey" @click="cancelEditing" class="q-ml-sm" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useOpcrStore } from 'src/stores/office/opcrStore';

export default {
  props: ['opcrId'],
  setup(props) {
    const $q = useQuasar();
    const opcrStore = useOpcrStore();

    const isEditing = ref(false);
    const originalData = ref(null);
    const opcrData = ref({
      strategic_function: [],
      core_function: [],
      support_function: []
    });

    onMounted(async () => {
      try {
        const data = await opcrStore.fetchOpcr(props.opcrId);
        originalData.value = JSON.parse(JSON.stringify(data));
        opcrData.value = data;
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Failed to load OPCR data',
          position: 'top'
        });
      }
    });

    const startEditing = () => {
      isEditing.value = true;
    };

    const cancelEditing = () => {
      opcrData.value = JSON.parse(JSON.stringify(originalData.value));
      isEditing.value = false;
    };

    const saveChanges = async () => {
      try {
        await opcrStore.updateOpcr({
          id: props.opcrId,
          formData: opcrData.value
        });

        $q.notify({
          type: 'positive',
          message: 'OPCR updated successfully!',
          position: 'top'
        });

        isEditing.value = false;
        originalData.value = JSON.parse(JSON.stringify(opcrData.value));
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Failed to update OPCR',
          position: 'top'
        });
      }
    };

    return {
      isEditing,
      opcrData,
      startEditing,
      cancelEditing,
      saveChanges
    };
  }
}
</script>

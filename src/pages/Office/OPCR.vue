<!-- In OPCR.vue -->
<template>
  <q-page padding>
    <div class="q-mb-md">
      <h6 class="text-h6 q-mb-xs">OPCR</h6>
    </div>

    <MainTable :rows="opcrStore.divisions" :hideCreateButton="true" :hideUnitWorkPlanButton="true"
      @input-click="showInputModal = true" />

    <GenerateOPCR v-model="opcrStore.showGenerateModal" @save="handleSave" />

    <!-- Add InputModal component here -->
    <q-dialog v-model="showInputModal" persistent>
      <InputModal @save="handleInputSave" @close="showInputModal = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { useOpcrStore } from 'src/stores/office/opcrStore'
import { onMounted, ref } from 'vue'
import MainTable from 'src/components/office/MainTable.vue'
import GenerateOPCR from 'src/components/office/GenerateOPCR.vue'
import InputModal from 'src/components/office/InputPage.vue' // Import the InputModal component

export default {
  components: {
    MainTable,
    GenerateOPCR,
    InputModal // Register the InputModal component
  },

  setup() {
    const opcrStore = useOpcrStore()
    const showInputModal = ref(false) // Add this ref to control the InputModal visibility

    onMounted(() => {
      opcrStore.fetchDivisions()
    })

    const handleSave = (data) => {
      console.log('Saved data:', data)
      // Handle OPCR save logic here
    }

    const handleInputSave = (inputData) => {
      console.log('Input data saved:', inputData)
      // Handle input data save logic here
      showInputModal.value = false
    }

    return {
      opcrStore,
      showInputModal,
      handleSave,
      handleInputSave
    }
  }
}
</script>

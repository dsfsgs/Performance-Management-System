<template>
  <q-dialog v-model="showPdfModal" persistent>
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">OPCR Content</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        This would show the generated OPCR content.
        <br><br>
        In a real implementation, this would display the PDF preview.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
        <q-btn flat label="Download" color="primary" @click="downloadOPCR" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'OPCRPdfGenerator',
  props: {
    value: Boolean
  },
  computed: {
    showPdfModal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    downloadOPCR() {
      // In a real implementation, this would trigger the PDF download
      alert("OPCR download would be triggered here");
      this.showPdfModal = false;
    }
  }
}
</script>

<style scoped>
/* Basic styling for the modal */
</style>

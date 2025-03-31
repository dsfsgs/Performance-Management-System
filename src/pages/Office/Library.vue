<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="library-container">
    <!-- <h1>Library</h1> -->
    <MFOComponent />
  </div>
</template>

<script>
import MFOComponent from '../../components/MFOComponent.vue';

export default {
  components: {
    MFOComponent,
  },
};
</script>

<style scoped>
.library-container {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>

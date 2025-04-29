//opcrStore.js
import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import { useUserStore } from 'src/stores/userStore'

export const useOpcrStore = defineStore('opcr', {
  state: () => ({
    divisions: [],
    loading: false,
    error: null,
    showGenerateModal: false
  }),

  actions: {
    async fetchDivisions() {
      this.loading = true;
      try {
        const response = await api.get('/opcr/divisions');
        this.divisions = response.data;
        this.error = null;
      } catch (err) {
        this.error = 'Failed to fetch divisions';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

   
  }
})

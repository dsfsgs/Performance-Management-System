import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useMfoStore = defineStore('mfo', {
  state: () => ({
 categories: [],
    mfos: [],
    outputs: [],
    loading: false,
    error: null,
    skipMfo: false,
    supportOutputs: []
  }),

  actions: {
       async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/f_category')
        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

     async fetchMfosByCategory(categoryId) {
      this.loading = true
      this.error = null
      try {
        const category = this.categories.find(c => c.id === categoryId)
        // Only skip MFO for C. Support Function
        this.skipMfo = category?.name.includes("C. SUPPORT FUNCTION")

        if (this.skipMfo) {
          this.mfos = []
          await this.fetchSupportOutputs(categoryId)
        } else {
          const response = await api.get('/mfo', {
            params: { category_id: categoryId }
          })
          this.mfos = response.data.mfos || []
        }
      } catch (error) {
        console.error('Error fetching MFOs:', error)
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
      async fetchSupportOutputs(categoryId) {
        this.loading = true
        this.error = null
        try {
          const response = await api.get('/getSupportOutputs', {
            params: { category_id: categoryId }
          })
          this.supportOutputs = response.data
        } catch (error) {
          console.error('Error fetching support outputs:', error)
          this.error = error
          throw error
        } finally {
          this.loading = false
        }
      },

    async fetchOutputsByMfo(mfoId) {
      this.loading = true
      try {
        const response = await api.get('/output', {
          params: { mfo_id: mfoId }
        })
        this.outputs = response.data
      } catch (error) {
        console.error('Error fetching outputs:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

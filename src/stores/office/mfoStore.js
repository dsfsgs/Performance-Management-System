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
    // Ensure categoryId is a number
    const numericCategoryId = Number(categoryId)
    if (isNaN(numericCategoryId)) {
      throw new Error('Invalid category ID')
    }

    const response = await api.get('/mfo', {
      params: { category_id: numericCategoryId }
    })

    this.mfos = response.data.mfos || []
    this.supportOutputs = response.data.support_outputs || []
    this.skipMfo = response.data.skip_mfo || false

    if (this.skipMfo && this.supportOutputs.length === 1) {
      this.rows[2].output = this.supportOutputs[0].value
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

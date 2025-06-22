import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/tmf-api'


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Geographic Address API
export const addressAPI = {
  getAddresses: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddress?${params.toString()}`)
  },

  getAddressById: (id, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddress/${id}?${params.toString()}`)
  },

  getSubAddresses: (addressId) => {
    return api.get(`/geographicAddress/${addressId}/geographicSubAddress`)
  },

  getSubAddress: (addressId, subAddressId) => {
    return api.get(`/geographicAddress/${addressId}/geographicSubAddress/${subAddressId}`)
  },
}

// Address Validation API
export const validationAPI = {
  createValidation: (validationData) => {
    return api.post('/geographicAddressValidation', validationData)
  },

  getValidations: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value)
      }
    })
    return api.get(`/geographicAddressValidation?${params.toString()}`)
  },

  getValidationById: (id, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddressValidation/${id}?${params.toString()}`)
  },

  updateValidation: (id, updates) => {
    return api.patch(`/geographicAddressValidation/${id}`, updates, {
      headers: {
        'Content-Type': 'application/merge-patch+json'
      }
    })
  },
}

export default api

import axios from 'axios'

const API_BASE_URL = '/tmf-api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Geographic Address API
export const addressAPI = {
  // Get all addresses with optional filters
  getAddresses: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddress?${params.toString()}`)
  },

  // Get address by ID
  getAddressById: (id, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddress/${id}?${params.toString()}`)
  },

  // Get sub-addresses for an address
  getSubAddresses: (addressId) => {
    return api.get(`/geographicAddress/${addressId}/geographicSubAddress`)
  },

  // Get specific sub-address
  getSubAddress: (addressId, subAddressId) => {
    return api.get(`/geographicAddress/${addressId}/geographicSubAddress/${subAddressId}`)
  },
}

// Address Validation API
export const validationAPI = {
  // Create address validation
  createValidation: (validationData) => {
    return api.post('/geographicAddressValidation', validationData)
  },

  // Get all validations with optional filters
  getValidations: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value)
      }
    })
    return api.get(`/geographicAddressValidation?${params.toString()}`)
  },

  // Get validation by ID
  getValidationById: (id, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/geographicAddressValidation/${id}?${params.toString()}`)
  },

  // Update validation
  updateValidation: (id, updates) => {
    return api.patch(`/geographicAddressValidation/${id}`, updates, {
      headers: {
        'Content-Type': 'application/merge-patch+json'
      }
    })
  },
}

export default api
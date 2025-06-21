import React, { useState, useEffect } from 'react'
import { validationAPI } from '../services/api'

const ValidationList = () => {
  const [validations, setValidations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    state: '',
    provideAlternative: ''
  })
  const [selectedValidation, setSelectedValidation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchValidations()
  }, [])

  const fetchValidations = async (filterParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await validationAPI.getValidations(filterParams)
      setValidations(response.data)
    } catch (err) {
      setError('Failed to fetch validations: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key] = value.trim()
      }
      return acc
    }, {})
    fetchValidations(activeFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      state: '',
      provideAlternative: ''
    })
    fetchValidations()
  }

  const handleValidationClick = async (validation) => {
    try {
      const response = await validationAPI.getValidationById(validation.id)
      setSelectedValidation(response.data)
      setShowModal(true)
    } catch (err) {
      setError('Failed to fetch validation details: ' + err.message)
    }
  }

  const handleUpdateValidation = async (id, updates) => {
    try {
      setUpdating(true)
      await validationAPI.updateValidation(id, updates)
      
      // Refresh the validation details
      const response = await validationAPI.getValidationById(id)
      setSelectedValidation(response.data)
      
      // Refresh the list
      fetchValidations()
    } catch (err) {
      setError('Failed to update validation: ' + err.message)
    } finally {
      setUpdating(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedValidation(null)
  }

  const renderAddress = (address, title) => (
    <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
      <h4>{title}</h4>
      <p><strong>Street:</strong> {address.streetNr} {address.streetName} {address.streetType}</p>
      <p><strong>City:</strong> {address.city}</p>
      <p><strong>State/Province:</strong> {address.stateOrProvince}</p>
      <p><strong>Country:</strong> {address.country}</p>
      <p><strong>Postcode:</strong> {address.postcode}</p>
      <p><strong>Locality:</strong> {address.locality}</p>
    </div>
  )

  if (loading) {
    return <div className="loading">Loading validations...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Search Validations</h2>
        <div className="filters">
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
          >
            <option value="">All States</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            name="provideAlternative"
            value={filters.provideAlternative}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="true">With Alternatives</option>
            <option value="false">Without Alternatives</option>
          </select>
          <button className="btn" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Validation History ({validations.length})</h2>
        {validations.length === 0 ? (
          <p>No validations found.</p>
        ) : (
          <div className="address-list">
            {validations.map((validation) => (
              <div
                key={validation.id}
                className="address-item"
                onClick={() => handleValidationClick(validation)}
              >
                <h3>Validation {validation.id}</h3>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`validation-status ${validation.state?.toLowerCase()}`}>
                    {validation.state}
                  </span>
                </p>
                <p><strong>Result:</strong> {validation.validationResult}</p>
                <p><strong>Date:</strong> {new Date(validation.validationDate).toLocaleString()}</p>
                <p><strong>Alternatives:</strong> {validation.provideAlternative ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedValidation && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Validation Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="form-group">
              <label><strong>Validation ID:</strong></label>
              <p>{selectedValidation.id}</p>
            </div>

            <div className="form-group">
              <label><strong>Status:</strong></label>
              <span className={`validation-status ${selectedValidation.state?.toLowerCase()}`}>
                {selectedValidation.state}
              </span>
            </div>

            <div className="form-group">
              <label><strong>Result:</strong></label>
              <p>{selectedValidation.validationResult}</p>
            </div>

            <div className="form-group">
              <label><strong>Validation Date:</strong></label>
              <p>{new Date(selectedValidation.validationDate).toLocaleString()}</p>
            </div>

            <div className="form-group">
              <label><strong>Provide Alternative:</strong></label>
              <p>{selectedValidation.provideAlternative ? 'Yes' : 'No'}</p>
            </div>

            {selectedValidation.submittedGeographicAddress && 
              renderAddress(selectedValidation.submittedGeographicAddress, 'Submitted Address')
            }

            {selectedValidation.validGeographicAddress && 
              renderAddress(selectedValidation.validGeographicAddress, 'Valid Address')
            }

            {selectedValidation.alternateGeographicAddress && 
             selectedValidation.alternateGeographicAddress.length > 0 && (
              <div>
                <h3>Alternative Addresses</h3>
                {selectedValidation.alternateGeographicAddress.map((address, index) => 
                  renderAddress(address, `Alternative Address ${index + 1}`)
                )}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-success" 
                onClick={() => handleUpdateValidation(selectedValidation.id, { state: 'Completed' })}
                disabled={updating}
              >
                Mark as Completed
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleUpdateValidation(selectedValidation.id, { state: 'Failed' })}
                disabled={updating}
              >
                Mark as Failed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValidationList
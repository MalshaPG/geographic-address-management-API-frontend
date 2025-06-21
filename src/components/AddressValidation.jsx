import React, { useState } from 'react'
import { validationAPI } from '../services/api'

const AddressValidation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [validationResult, setValidationResult] = useState(null)
  const [formData, setFormData] = useState({
    provideAlternative: false,
    submittedGeographicAddress: {
      name: '',
      streetNr: '',
      streetName: '',
      streetType: 'street',
      city: '',
      stateOrProvince: '',
      country: '',
      postcode: '',
      locality: ''
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'provideAlternative') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        submittedGeographicAddress: {
          ...prev.submittedGeographicAddress,
          [name]: value
        }
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setValidationResult(null)

      const response = await validationAPI.createValidation(formData)
      setValidationResult(response.data)
      setSuccess('Address validation completed successfully!')
      
      // Reset form
      setFormData({
        provideAlternative: false,
        submittedGeographicAddress: {
          name: '',
          streetNr: '',
          streetName: '',
          streetType: 'street',
          city: '',
          stateOrProvince: '',
          country: '',
          postcode: '',
          locality: ''
        }
      })
    } catch (err) {
      setError('Failed to validate address: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderAddress = (address, title) => (
    <div className="card">
      <h3>{title}</h3>
      <div className="form-group">
        <label><strong>Name:</strong></label>
        <p>{address.name || 'N/A'}</p>
      </div>
      <div className="form-group">
        <label><strong>Street:</strong></label>
        <p>{address.streetNr} {address.streetName} {address.streetType}</p>
      </div>
      <div className="form-group">
        <label><strong>City:</strong></label>
        <p>{address.city}</p>
      </div>
      <div className="form-group">
        <label><strong>State/Province:</strong></label>
        <p>{address.stateOrProvince}</p>
      </div>
      <div className="form-group">
        <label><strong>Country:</strong></label>
        <p>{address.country}</p>
      </div>
      <div className="form-group">
        <label><strong>Postcode:</strong></label>
        <p>{address.postcode}</p>
      </div>
      <div className="form-group">
        <label><strong>Locality:</strong></label>
        <p>{address.locality}</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="card">
        <h2>Address Validation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name (Optional):</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.submittedGeographicAddress.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="streetNr">Street Number:</label>
            <input
              type="text"
              id="streetNr"
              name="streetNr"
              value={formData.submittedGeographicAddress.streetNr}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="streetName">Street Name:</label>
            <input
              type="text"
              id="streetName"
              name="streetName"
              value={formData.submittedGeographicAddress.streetName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="streetType">Street Type:</label>
            <select
              id="streetType"
              name="streetType"
              value={formData.submittedGeographicAddress.streetType}
              onChange={handleInputChange}
            >
              <option value="street">Street</option>
              <option value="avenue">Avenue</option>
              <option value="road">Road</option>
              <option value="lane">Lane</option>
              <option value="drive">Drive</option>
              <option value="boulevard">Boulevard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.submittedGeographicAddress.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stateOrProvince">State/Province:</label>
            <input
              type="text"
              id="stateOrProvince"
              name="stateOrProvince"
              value={formData.submittedGeographicAddress.stateOrProvince}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.submittedGeographicAddress.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postcode">Postcode:</label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.submittedGeographicAddress.postcode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="locality">Locality:</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={formData.submittedGeographicAddress.locality}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="provideAlternative"
                checked={formData.provideAlternative}
                onChange={handleInputChange}
              />
              Provide Alternative Addresses
            </label>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Validating...' : 'Validate Address'}
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {validationResult && (
        <div>
          <div className="card">
            <h2>Validation Result</h2>
            <div className="form-group">
              <label><strong>Validation ID:</strong></label>
              <p>{validationResult.id}</p>
            </div>
            <div className="form-group">
              <label><strong>Status:</strong></label>
              <span className={`validation-status ${validationResult.state?.toLowerCase()}`}>
                {validationResult.state}
              </span>
            </div>
            <div className="form-group">
              <label><strong>Result:</strong></label>
              <p>{validationResult.validationResult}</p>
            </div>
            <div className="form-group">
              <label><strong>Validation Date:</strong></label>
              <p>{new Date(validationResult.validationDate).toLocaleString()}</p>
            </div>
          </div>

          {validationResult.submittedGeographicAddress && 
            renderAddress(validationResult.submittedGeographicAddress, 'Submitted Address')
          }

          {validationResult.validGeographicAddress && 
            renderAddress(validationResult.validGeographicAddress, 'Valid Address')
          }

          {validationResult.alternateGeographicAddress && 
           validationResult.alternateGeographicAddress.length > 0 && (
            <div>
              <h3>Alternative Addresses</h3>
              {validationResult.alternateGeographicAddress.map((address, index) => 
                renderAddress(address, `Alternative Address ${index + 1}`)
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddressValidation
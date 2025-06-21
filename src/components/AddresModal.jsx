import React, { useState, useEffect } from 'react'
import { addressAPI } from '../services/api'

const AddressModal = ({ address, onClose }) => {
  const [subAddresses, setSubAddresses] = useState([])
  const [loadingSubAddresses, setLoadingSubAddresses] = useState(false)
  const [subAddressError, setSubAddressError] = useState(null)

  useEffect(() => {
    if (address.id) {
      fetchSubAddresses()
    }
  }, [address.id])

  const fetchSubAddresses = async () => {
    try {
      setLoadingSubAddresses(true)
      setSubAddressError(null)
      const response = await addressAPI.getSubAddresses(address.id)
      setSubAddresses(response.data)
    } catch (err) {
      setSubAddressError('Failed to fetch sub-addresses: ' + err.message)
    } finally {
      setLoadingSubAddresses(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Address Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-group">
          <label><strong>ID:</strong></label>
          <p>{address.id}</p>
        </div>

        <div className="form-group">
          <label><strong>Name:</strong></label>
          <p>{address.name || 'N/A'}</p>
        </div>

        <div className="form-group">
          <label><strong>Street Address:</strong></label>
          <p>
            {address.streetNr} {address.streetName} {address.streetType}
            {address.streetSuffix && ` ${address.streetSuffix}`}
          </p>
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

        {address.href && (
          <div className="form-group">
            <label><strong>HREF:</strong></label>
            <p>{address.href}</p>
          </div>
        )}

        <div className="form-group">
          <label><strong>Sub-Addresses:</strong></label>
          {loadingSubAddresses ? (
            <p>Loading sub-addresses...</p>
          ) : subAddressError ? (
            <p className="error">{subAddressError}</p>
          ) : subAddresses.length === 0 ? (
            <p>No sub-addresses found.</p>
          ) : (
            <div className="sub-address-list">
              {subAddresses.map((subAddress, index) => (
                <div key={subAddress.id || index} className="sub-address-item">
                  <p><strong>ID:</strong> {subAddress.id}</p>
                  <p><strong>Type:</strong> {subAddress.subAddressType}</p>
                  <p><strong>Name:</strong> {subAddress.subAddressName}</p>
                  <p><strong>Number:</strong> {subAddress.subAddressNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressModal
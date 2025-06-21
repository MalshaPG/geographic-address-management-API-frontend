import React, { useState, useEffect } from 'react'
import { addressAPI } from '../services/api'
import AddressModal from "./AddresModal"

const AddressList = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    postcode: '',
    fields: ''
  })
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async (filterParams = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await addressAPI.getAddresses(filterParams)
      setAddresses(response.data)
    } catch (err) {
      setError('Failed to fetch addresses: ' + err.message)
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
    fetchAddresses(activeFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      country: '',
      city: '',
      postcode: '',
      fields: ''
    })
    fetchAddresses()
  }

  const handleAddressClick = async (address) => {
    try {
      // Fetch full address details if we only have partial data
      if (filters.fields) {
        const response = await addressAPI.getAddressById(address.id)
        setSelectedAddress(response.data)
      } else {
        setSelectedAddress(address)
      }
      setShowModal(true)
    } catch (err) {
      setError('Failed to fetch address details: ' + err.message)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAddress(null)
  }

  if (loading) {
    return <div className="loading">Loading addresses...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Search Addresses</h2>
        <div className="filters">
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={filters.country}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="postcode"
            placeholder="Postcode"
            value={filters.postcode}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="fields"
            placeholder="Fields (comma-separated)"
            value={filters.fields}
            onChange={handleFilterChange}
          />
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
        <h2>Addresses ({addresses.length})</h2>
        {addresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          <div className="address-list">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="address-item"
                onClick={() => handleAddressClick(address)}
              >
                <h3>{address.name || 'Unnamed Address'}</h3>
                <p><strong>Street:</strong> {address.streetNr} {address.streetName}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>Country:</strong> {address.country}</p>
                <p><strong>Postcode:</strong> {address.postcode}</p>
                {address.stateOrProvince && (
                  <p><strong>State/Province:</strong> {address.stateOrProvince}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedAddress && (
        <AddressModal
          address={selectedAddress}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default AddressList
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import AddressList from './components/AddressList'
import AddressValidation from './components/AddressValidation'
import ValidationList from './components/ValidationList'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="nav">
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'active' : ''}
      >
        Addresses
      </Link>
      <Link 
        to="/validation" 
        className={location.pathname === '/validation' ? 'active' : ''}
      >
        Address Validation
      </Link>
      <Link 
        to="/validations" 
        className={location.pathname === '/validations' ? 'active' : ''}
      >
        Validation History
      </Link>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header width-fit flex align-right margin-left">
          <div className="logo-container" style={{ width: '35%', display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
            <img
              src="/slt.png"
              alt="Logo"
              className="logo"
              style={{ maxWidth: '50%', height: 'auto', display: 'block' }}
            />
          </div>
          <div className="container">
            <h1>Geographic Address Management</h1>
            <Navigation />
          </div>
        </header>
        
        <main className="container">
          <Routes>
            <Route path="/" element={<AddressList />} />
            <Route path="/validation" element={<AddressValidation />} />
            <Route path="/validations" element={<ValidationList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
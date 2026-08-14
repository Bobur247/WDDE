import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { Home,Convert,CreateDocument,History,InformationAllocation,Settings,Templates,Login } from '../page/index'
import { Navbar, Sidebar } from '../components/components';

const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true'

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)
  const location = useLocation()

  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />} />
      </Routes>
    )
  }

  return (
    <div className="App">
      <div className="topbar">
        <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      </div>
      <div className={`sidebar${isSidebarOpen ? ' open' : ''}`}>
        <Sidebar onLinkClick={closeSidebar} onClose={closeSidebar} />
      </div>
      <div
        className={`sidebarOverlay${isSidebarOpen ? ' show' : ''}`}
        onClick={closeSidebar}
      />
      <div className="main">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/information-allocation" element={<ProtectedRoute><InformationAllocation /></ProtectedRoute>} />
          <Route path="/convert" element={<ProtectedRoute><Convert /></ProtectedRoute>} />
          <Route path="/create-document" element={<ProtectedRoute><CreateDocument /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated() ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  )
}

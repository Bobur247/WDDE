import React, { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import { Home,Convert,CreateDocument,History,InformationAllocation,Settings,Templates } from '../page/index'
import { Navbar, Sidebar } from '../components/components';
export const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)
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
          <Route path="/" element={<Home />} />
          <Route path="/information-allocation" element={<InformationAllocation />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/create-document" element={<CreateDocument />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

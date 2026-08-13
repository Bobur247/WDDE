import React from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import { Home,Convert,CreateDocument,History,InformationAllocation,Settings,Templates } from '../page/index'
import { Navbar, Sidebar } from '../components/components';
export const App = () => {
  return (
    <div className="App">
      <div className="topbar">
        <Navbar />
      </div>
      <div className="sidebar">
        <Sidebar />
      </div>
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

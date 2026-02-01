import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './page/Dashboard'
import CityDetails from './page/CityDetails'
import Settings from './page/Settings'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/20 to-purple-600/20'></div>
      <div className='absolute top-0 left-0 w-full h-full opacity-30'>
        <div className='absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute top-40 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl'></div>
      </div>
      <div className='relative z-10'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/city/:cityName' element={<CityDetails />}/>
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App

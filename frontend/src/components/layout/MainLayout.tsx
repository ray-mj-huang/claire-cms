import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'

const MainLayout = (): React.ReactElement => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow mt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout; 
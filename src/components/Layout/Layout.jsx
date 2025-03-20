import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'

export default function Layout() {
  const [showButton, setShowButton] = useState(false)

  // دالة لمراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

   
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className='mt-[]'>
        <Sidebar/>
        </div>
        
        
        <div className="flex-grow mt-0 relative">
          <Outlet />

          {showButton && (
            <div
              onClick={scrollToTop}
              className="flex justify-center items-center rounded-r-full p-5 bg-black fixed right-5 bottom-6 cursor-pointer z-[999999] rounded-full shadow-lg transition-all duration-300 hover:bg-yellow-600"
            >
              <i class="fa-solid fa-up-long text-white text-3xl"></i>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  )
}

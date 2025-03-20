import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
export default function Navbar() {

  const [toggle, setToggle] = useState(true)
  const [toggleF, setToggleF] = useState(true)
  const [dropdown, setDropDwon] = useState(true)

   const [isVisible, setIsVisible] = useState(false);
  
    const toggleSidebar = () => {
      setIsVisible(!isVisible);
    };
  
  

  let nav = useNavigate()


  
  function logOut(){
    localStorage.removeItem("token")
    nav("/login")
  }


  function toggleRequiem(){

    setToggleF(!toggleF)
    if(dropdown==false){
      setDropDwon(true)
    }
    
  }

  function toggleRequiemx(){

    setDropDwon(!dropdown)
    if(toggleF==false){
      setToggleF(true)
    }
    
  }

  return <>


<nav className=" border-gray-200  fixed w-full bg-black z-[999] font-serif ">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div to="#" className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse  lg:w-1/3 md:w-auto ">
    <i class="fa-solid fa-dumbbell text-white text-3xl"></i>
      <span className="self-center text-2xl font-semibold whitespace-nowrap  text-white">Project Test</span>
    </div>
<button onClick={toggleSidebar}>

    {/* {isVisible ? <i class="fa-solid fa-cart-shopping text-yellow-600 duration-500 text-2xl"></i> : <i class="fa-solid fa-cart-shopping text-white text-2xl duration-300"></i>} */}
</button>

    
    <button onClick={()=>setToggle(!toggle)} data-collapse-toggle="navbar-multi-level" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-gray-200  z-[999999999999]" aria-controls="navbar-multi-level" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
      </svg>
    </button>

    <div className={toggle==true? "hidden  lg:w-1/2 md:w-auto md:block   " :"  w-full md:block md:w-auto" }id="navbar-multi-level">
      <ul className="lg:gap-10 md:gap-7  flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  bg-black lg:justify-center lg:items-center">
       
        <div className='flex flex-col font-medium p-4 md:p-0    md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  bg-black'>
        <li className='bg-black'>
          <NavLink to="home" className=" block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Home</NavLink>
        </li>
       
        <li>
          <NavLink to="dashboard" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="workouts" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Workouts</NavLink>
        </li>
        <li className='bg-black'>
          <NavLink to="progress" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Progress</NavLink>
        </li>
        <li className='bg-black'>
          <NavLink to="Profile" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Profile</NavLink>
        </li>
        <li className='bg-black'>
          <NavLink to="settings" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>Settings</NavLink>
        </li>
        <li className='bg-black'>
          <NavLink to="meals" className="block py-2 px-3 text-white rounded-sm aria-[current=page]:bg-yellow-600 md:p-0  md:aria-[current=page]:bg-transparent md:aria-[current=page]:text-yellow-600 " onClick={()=>setToggle(true)}>MealPlan</NavLink>
        </li>
        



        <li className='bg-black cursor-pointer' onClick={()=>toggleRequiem()}>
          {/* <div  to="" id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 px-3  md:hover:bg-transparent md:border-0  md:p-0 md:w-auto  text-white aria-[current=page]:bg-yellow-600 md:aria-[current=page]:bg-transparent  hover:bg-yellow-600"  ><p className='flex gap-1'> <span>Other</span>  <span>Features</span> </p> <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
            </svg></div> */}
          {/* Dropdown menu */}
          <div id="dropdownNavbar" className={toggleF==true?" hidden  z-10 font-normal absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 ":"   z-10 font-normal absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 "}>
            <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownLargeButton">
              <li>
                <NavLink to="caloriecalc" className="block px-4 py-2  hover:bg-yellow-600 "  onClick={()=>setToggle(true)}      >calc</NavLink>
              </li>
              <li>
                <NavLink to="shredded" className="block px-4 py-2 hover:bg-yellow-600  " onClick={()=>setToggle(true)}>Shredded</NavLink>
              </li>
              <li>
                <NavLink to="bulk" className="block px-4 py-2 hover:bg-yellow-600  " onClick={()=>setToggle(true)}>Bluk</NavLink>
              </li>

              <li aria-labelledby="dropdownNavbarLink">
                <NavLink  id="doubleDropdownButton" data-dropdown-toggle="doubleDropdown" data-dropdown-placement="right-start" type="button" className="flex items-center justify-between w-full px-4 py-2 hover:bg-yellow-600  ">Dropdown<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg></NavLink>
                <div id="doubleDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 ">
                  <ul className="py-2 text-sm text-gray-700 " aria-labelledby="doubleDropdownButton">
                    <li>
                      <NavLink to="bulk" className="block px-4 py-2 hover:bg-gray-100  text-white" onClick={()=>setToggle(true)}>Bulk</NavLink>
                    </li>
                    <li>
                      <NavLink to="shredded" className="block px-4 py-2 hover:bg-gray-100 " onClick={()=>setToggle(true)}>Shredded</NavLink>
                    </li>
                    <li>
                      <NavLink to="#" className="block px-4 py-2 hover:bg-gray-100 " onClick={()=>setToggle(true)}>Billing</NavLink>
                    </li>
                    <li>
                      <NavLink to="#" className="block px-4 py-2 hover:bg-gray-100 " onClick={()=>setToggle(true)}>Rewards</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div className="py-1">
              
            </div>
          </div>
          
        </li>

        </div>

        

        <div className='flex flex-col font-medium p-4 md:p-0    md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0   bg-black'>
        <li className='bg-black'>
          <button onClick={()=>toggleRequiemx()} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto  text-white hover:bg-yellow-600 ">
            My account 
            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
            </svg></button>
          {/* Dropdown menu */}
          <div id="dropdownNavbar" className={dropdown==true?"hidden z-10 font-normal absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 ":" z-10 font-normal absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"}>
            <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownLargeButton">
              <li>
                <NavLink to="register" className="block px-4 py-2 hover:bg-gray-100 " onClick={()=>setToggle(true)}>Sign up</NavLink>
              </li>
              <li>
                <NavLink to="login" className="block px-4 py-2 hover:bg-gray-100  " onClick={()=>setToggle(true)}>Logn in</NavLink>
              </li>
            </ul>
            <div className="py-1">
              <NavLink to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " onClick={()=>setToggle(true)}>Sign out</NavLink>
            </div>
          </div>
        </li>
        </div>
        
      </ul>
    </div>

    
    
  </div>
  
</nav>





<div className="w-full text-center fixed z-[99999999999999999] ">
        <button
          className= " absolute  top-5 left-[30%] "
          
        >
        </button>
      </div>

      <div
        className={` top-0 left-0  w-64 h-screen p-4 overflow-y-auto bg-white dark:bg-gray-800 transition-transform  z-[9999999999999999999999999999999] fixed duration-1000 ${isVisible ? '' : 'hidden '}`}
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Quick cart</h5>
        <p className='text-sm mt-2'>This is a quick access to cart . </p>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={toggleSidebar}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        <ul className="space-y-2 font-medium">
       
        </ul>
      </div>






  
  
  </>
}

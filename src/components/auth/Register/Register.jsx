import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Signup() {
    const [sucess, setSucess] = useState(null)
    const [faild, setFaild] = useState(null)
    const [token, setToken] = useState(null)
    const [toggle, setToggle] = useState(false)
    const [toggle2, setToggle2] = useState(false)
   

    


    return <>
        <form className="max-w-sm ms-auto mt-[100px] mb-10 container" >
            <div className='flex gap-3'>
                <div className="mb-5 w-1/2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Your name</label>
                    <input  type="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                </div>

                <div className="mb-5 w-1/2">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input  type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
                </div>
            </div>

            <div className="mb-5 relative">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    Your password
                </label>
                <input
                    
                    type={toggle ? "text" : "password"}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                />
                <i
                    onClick={() => setToggle(!toggle)}
                    className={`absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer mt-3 ${toggle ? "text-yellow-600 fa-solid fa-eye" : "fa-solid fa-eye-slash"}`}
                ></i>
            </div>

            <div className="mb-5 relative">
                <label htmlFor="rePassword" className="block mb-2 text-sm font-medium text-gray-900">
                    Your repassword
                </label>
                <input
                    
                    type={toggle2 ? "text" : "password"}
                    id="rePassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                    placeholder=""
                    required
                />
                <i
                    onClick={() => setToggle2(!toggle2)}
                    className={`absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer mt-3 ${toggle2 ? "text-yellow-600 fa-solid fa-eye" : "fa-solid fa-eye-slash"}`}
                ></i>
            </div>

            <div className="mb-5">
                <label htmlFor="tel" className="block mb-2 text-sm font-medium text-gray-900">Your phone</label>
                <input  type="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required />
            </div>

            <button type="submit" className="text-white bg-black hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            <h1>{sucess}</h1>
            <h1>{faild}</h1>
        </form>
    </>
}

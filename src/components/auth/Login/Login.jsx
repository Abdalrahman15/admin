import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../Context/AuthContext.jsx";
import { toast } from 'react-toastify';



export default function Login() {
    const [sucess, setSucess] = useState(null)
    const [faild, setFaild] = useState(null)
    const [token, setToken] = useState(null)
    const [toggle, setToggle] = useState(false)
    const [goal, setGoal] = useState(null)
    let nav = useNavigate()
    




  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await login(formData);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.toString() || 'Failed to login. Please check your credentials.');
        setErrors({
          ...errors,
          general: error.toString() || 'Invalid username or password'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

















    return <>
        <form className="max-w-sm mx-auto mt-[100px]" onSubmit={handleSubmit} >
            <div className="mb-5">
                <label htmlFor="email" className={`block mb-2 text-sm font-medium `}>User Name</label>
                <input  

                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'}
                required />
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}

            <div className="mb-5 relative">
                <label htmlFor="password" className={`block mb-2 text-sm font-medium `}>
                    Your password
                </label>
                <input
                    
                type={toggle ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'}
                />
                <i
                    onClick={() => setToggle(!toggle)}
                    className={`absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer mt-3 ${toggle ? "text-yellow-600 fa-solid fa-eye" : "fa-solid fa-eye-slash"}`}
                ></i>
            </div>

            {errors.password && <span className="error-message">{errors.password}</span>}

            <div>
                
            </div>
 <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="text-white bg-black hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-10 py-2.5 text-center mt-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logging in...
              </>
            ) : 'Login'}
          </button>
            
        </form>

         <div className="auth-footer text-center mt-4">
                  <p>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                  </p>
                </div>
              

        


    </>
}

import React, { useState } from 'react';
import img1 from '../../Assets/img1.webp';
import img2 from '../../Assets/img2.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../RegisterPage/RegisterPage.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    /* state mangement for eye */
    const [showPassword, setShowPassword] = useState(false);

  
    /* formdata state management */
    const [formData, setFormData] = useState({email:"",password:""});

    const navigate = useNavigate(); // use inside component

    const onLoginSubmitHandler = (e) => {
      e.preventDefault();

      const { email, password } = formData;

      if (!email || !password) {
        toast.error("All fields are required.");
        return;
      }

      //email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return;
      }

      //retreiving data from local storage
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        toast.error("No user found. Please register first.");
        return;
      }

      if (storedUser.email !== email || storedUser.password !== password) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success("Login successful!");
      navigate("/home"); 
    };


  return (
        <section className="register-main">
          {/* form section */}
          <div className="form-section">
            <h1 className='register-heading'>Join the millions building smart solutions with Shunyaekai Technologies for free.</h1>
            <p className='register-first-para'>
              <span className='register-first-span'>Build IoT skills for today, tomorrow, and beyond. </span>
              <span className='register-second-span'>Innovation to future-proof your career with Shunyaekai Technologies.</span>
            </p>
    
            {/* form */}
            <form onSubmit={onLoginSubmitHandler}  className='register-form'>
    
              {/* Email */}
              <div className='register-name-div'>
                <label className='register-label'>Enter Email<sup className='register-sup'>*</sup></label>
                <input
                 type="email"
                 placeholder='Enter Your Email*'
                 required
                 name='email'
                 value={formData.email}
                 onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]:e.target.value}))}
                 className='register-input'
                 />
              </div>
    
              {/* password */}
              <div className='register-name-div'>
                <label className='register-label'>Enter Password<sup className='register-sup'>*</sup></label>
                <div className='password-wrapper'>
                  <input
                  type={showPassword?"text":"password"}
                  placeholder='Enter Your Password*'
                  required
                  name='password'
                  value={formData.password}
                  onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]:e.target.value}))}
                  className='register-input'
                  />
    
                  {/* show-password-eye */}
                  <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                    {showPassword ? <FaEyeSlash size={20} fill='#f1f2f3'/> : <FaEye size={20} fill='#f1f2f3' />}
                  </span>
                </div>
              </div>
    
    
              {/* button */}
              <button
              type='submit'
              className='register-button'
              >
               Create Account
              </button>
            </form>
            <p onClick={()=>navigate('/register')} className='register-link' >Create Account</p>
          </div>
    
          {/* image section */}
          <div className="image-section">
            <img src={img1} alt="profile-img" className="main-img" />
            <img src={img2} alt="background-profile-img" className="bg-img" />
          </div>
        </section>
  )
}

export default LoginPage
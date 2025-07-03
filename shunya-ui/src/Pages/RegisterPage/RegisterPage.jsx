import React, { useState } from 'react';
import img1 from '../../Assets/img1.webp';
import img2 from '../../Assets/img2.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterPage.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {

  /* state mangement for eye */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* formdata state management */
  const [formData, setFormData] = useState({name:"",email:"",password:"",confirmPassword:""});

  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    //consoling formdata
    console.log(formData);
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }
    
    if(password.length < 6){
      toast.error('Please should be atleast 6 length');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    //saving in localstorage
    const userData = { name, email, password };
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success('Account Created Successfully');

    navigate('/login');
  }

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
        <form onSubmit={onSubmitHandler} className='register-form'>
          {/* name */}
          <div className='register-name-div'>
            <label className='register-label'>Enter Name<sup className='register-sup'>*</sup></label>
            <input
             type="text"
             required
             placeholder='Enter Your Name*'
             name='name'
             value={formData.name}
             onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]: e.target.value}))}
             className='register-input'
             />
          </div>

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

          {/* Confirm-password */}
          <div className='register-name-div'>
            <label className='register-label'>Confirm Password<sup className='register-sup'>*</sup></label>
            <div className='password-wrapper'>
              <input
              type={showConfirmPassword?"text":"password"}
              placeholder='Confirm Password*'
              required
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]:e.target.value}))}
              className='register-input'
              />

              {/* show-password-eye */}
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
                {showConfirmPassword ? <FaEyeSlash size={20} fill='#f1f2f3'/> : <FaEye size={20} fill='#f1f2f3' />}
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

        <p onClick={()=>navigate('/login')} className='register-link' >Login</p>
      </div>

      {/* image section */}
      <div className="image-section">
        <img src={img1} alt="profile-img" className="main-img" />
        <img src={img2} alt="background-profile-img" className="bg-img" />
      </div>
    </section>
  );
};

export default RegisterPage;

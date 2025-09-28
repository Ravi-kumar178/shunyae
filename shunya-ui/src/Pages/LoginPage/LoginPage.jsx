import React, { useState } from 'react';
import img1 from '../../Assets/img1.webp';
import img2 from '../../Assets/img2.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../RegisterPage/RegisterPage.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { apiRequests } from '../../Api';

const LoginPage = () => {

    /* state mangement for eye */
    const [showPassword, setShowPassword] = useState(false);

  
    /* formdata state management */
    const [formData, setFormData] = useState({email:"",password:"",role:""});

    const navigate = useNavigate(); // use inside component

    const onLoginSubmitHandler = async(e) => {
      e.preventDefault();
      const { email, password, role } = formData;

      if (!email || !password || !role) {
        toast.error("All fields are required.");
        return;
      }

      //email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format.");
        return;
      }

      const userData = { email, password, role };

      try {
        // Call API
        const response = await apiRequests.postRequestWithNoToken(
          "auth/login",
          userData
        );
  
        
        if (response?.token && response?.user) {
          const { token, user } = response;
  
          // Save token & user in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
  
          toast.success(response?.message || "Logged In successfully!");
          navigate("/home"); 
        } 
        else if(response?.message){
          toast.error(response.message);
        }
        else {
          toast.error("Login failed. Please check your credentials.");
         
        }
      } catch (error) {
  
     
  
        const errorMsg =
          error.response?.data?.message ||
          error?.message ||
          "Something went wrong!";
        toast.error(errorMsg);
      }
    };

    const roleOptions = [
      { value: "teacher", label: "Teacher" },
      { value: "student", label: "Student" }
    ];

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

              {/* Select role */}
              <div className='register-name-div '>
                <label className='register-label'>
                  Select Role<sup className='register-sup'>*</sup>
                </label>
                <Select
                options={roleOptions}
                value={roleOptions.find(opt => opt.value === formData.role)}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, role: selected.value }))
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor:" #1F2833",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "3px",
                    marginTop:"8px",
                    boxShadow:"rgba(255, 255, 255, 0.18) 0px -1px 0px inset",
                    letterSpacing:"1px",
                    fontWeight:"500"
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1F2833",
                    borderRadius: "8px",
                    padding: "5px",
                    color: "#fff",
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    backgroundColor: isFocused ? "#333" : "#1F2833",
                    color: "#fff",
                    padding: "10px"
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#F1F2F3",  
                    fontWeight:"500"
                  }),
                }}
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
               Login
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
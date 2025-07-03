import React, { useState } from 'react';
import img1 from '../../Assets/img1.webp';
import img2 from '../../Assets/img2.png';
import '../RegisterPage/RegisterPage.css'
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com';

const HomePage = () => {


  /* formdata state management */
  const [formData, setFormData] = useState({name:"",email:"",subject:"",message:""});
  

  //retreiving data from local storage
  const userData = JSON.parse(localStorage.getItem("user"));

  const messageFormSubmitHandler = (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    // Simple validations
    if (!name || !email || !subject || !message) {
      toast.error("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return;
    }

    
    const serviceId = 'service_xb8286f';
    const templateId = 'template_2szh6cl';
    const publicKey = 'YlMwf8jeMwzg1nz48';

    const templateParams = {
      from_name: name,
      from_email: userData.email,
      to_email: email,
      subject,
      message
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        toast.success("Email sent via EmailJS");
        // Success message
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
    .catch((error) => {
      console.error("EmailJS Error:", error); 
      toast.error("Failed to send message.");
    });

    

    // Clear form
    //setFormData({ name: "", email: "", subject: "", message: "" });
  };


  return (
        <section className="register-main">
          {/* form section */}
          <div className="form-section">
            <h1 className='register-first-para'><span className='register-first-span'>Welcome - </span><span className='register-second-span'>{userData?.name || "User"}</span></h1>
            <h1 className='register-heading'>Join the millions building smart solutions with Shunyaekai Technologies for free.</h1>
            <p className='register-first-para'>
              <span className='register-first-span'>Build IoT skills for today, tomorrow, and beyond. </span>
              <span className='register-second-span'>Innovation to future-proof your career with Shunyaekai Technologies.</span>
            </p>
    
            {/* form */}
            <form onSubmit={messageFormSubmitHandler} className='register-form'>

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
    
              {/* Subject */}
              <div className='register-name-div'>
                <label className='register-label'>Enter Subject<sup className='register-sup'>*</sup></label>
                <input
                type="text"
                required
                placeholder='Enter Your Subject*'
                name='subject'
                value={formData.subject}
                onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]: e.target.value}))}
                className='register-input'
                />
              </div>

              {/* Message */}
              <div className='register-name-div'>
                <label className='register-label'>Enter Message<sup className='register-sup'>*</sup></label>
                <textarea
                rows={8}
                required
                placeholder='Enter Your Subject*'
                name='message'
                value={formData.message}
                onChange={(e)=>setFormData(prev => ({...prev,[e.target.name]: e.target.value}))}
                className='register-input'
                />
              </div>


    
    
              {/* button */}
              <button
              type='submit'
              className='register-button'
              >
               Send Message
              </button>
            </form>
          </div>
    
          {/* image section */}
          <div className="image-section">
            <img src={img1} alt="profile-img" className="main-img" />
            <img src={img2} alt="background-profile-img" className="bg-img" />
          </div>
        </section>
  )
}

export default HomePage
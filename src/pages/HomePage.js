// src/pages/HomePage.js
import React, { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom'; 

const HomePage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [rpw,setRpw]=useState('');
  const [error,setError]=useState(0);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate()
  const homePageStyle = {
    background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://cdn.shopify.com/s/files/1/0070/7032/files/inventory-management-software.png?format=webp&v=1678484855')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  };

  const contentStyle = {
    display: 'flex',
    width: '80%',
    margin: '0 auto',
  };

  const leftHalfStyle = {
    flex: 1,
    marginRight: '20px',
  };

  const rightHalfStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
  };

  const paragraphStyle = {
    fontSize: '1.2rem',
    marginBottom: '20px',
  };

  const formContainerStyle = {
    width: '80%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: 'rgba(255, 255, 255, 0.3)',
  };

  const formStyle = {
    width: '100%',
    height: '50vh',
    overflow: 'auto',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    background: '#4caf50',
    color: '#fff',
    padding: '10px 20px',
    textDecoration: 'none',
    fontSize: '1.2rem',
    marginTop: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const switchView = () => {
    setIsLoginView(!isLoginView);
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    contactNumber: '',
    userType: 'retailer', // Default userType for registration
  });

  const validateForm = () => {
    const errors = {};

    // Common validation for both login and register
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    // Register-specific validations
    if (!isLoginView) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full Name is required';
      }

      if (!formData.contactNumber.trim()) {
        errors.contactNumber = 'Contact Number is required';
      }

      if (!formData.userType.trim()) {
        errors.userType = 'User Type is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    // Clear form errors when formData changes
    setFormErrors({});
    setError('');
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isLoginView)
    if (!validateForm()) {
      return; // Do not proceed if form is not valid
    }
    if(!isLoginView){
      console.log('hello');
    }
    
    if(isLoginView) {
      const apiUrl = 'https://saichaitanyamuthyala.com/user/login';
      const LoginRequest = {
        username: formData.email,
        password: formData.password
      }
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(isLoginView?LoginRequest:formData),
        });
  
        if (response.ok) {
          localStorage.setItem('userId',formData.email );
          const user = await response.json();
          localStorage.setItem('role',user.role);
          console.log({user})
          if (user.role === 'RETAILER') {
            navigate('/retailer');
          } else if (user.role === "SUPPLIER") {
            navigate('/suppliers');
          } else if (user.role === 'ADMIN') {
            console.log("Admin")
            navigate('/admin');
          }else if (user.role === 'INVENTORY') {
            console.log("Admin")
            navigate('/inventory');
          }
          setIsLoginView(true);
          // You can also handle redirection using React Router if applicable
        } else {
          // Handle error response
          const errorDa = await response.json();
          console.log(errorDa['Error Message'])
          setError(errorDa['Error Message'] || 'Failed to authenticate or register.');

          console.error('Failed to authenticate or register.');
        }
      } catch (error) {
        setError('Error during API call: ' + error.message);
        console.error('Error during API call:', error);
      }
    }
    // const apiUrl = isLoginView ? 'https://saichaitanyamuthyala.com/user/login ' : 'https://saichaitanyamuthyala.com/user/adduser';
  };

  const handleSubmitRegister=async(e)=>{
    if(rpw!==formData.password){
      setError(1);
    }
    else{
    console.log('register')
    const UserRequest = {
      userID : formData.email,
      password: formData.password,
      name: formData.fullName,
      contact: formData.contactNumber,
      role: formData.userType.toUpperCase() 
    }
    const apiUrl = 'https://saichaitanyamuthyala.com/user/adduser';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserRequest),
      });

      if (response.ok) {

        setIsLoginView(true);
        // You can also handle redirection using React Router if applicable
      } else {
        // Handle error response
        console.error('Failed to authenticate or register.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: '', // Clear error when user starts typing
    });
  };

  return (
    <div style={homePageStyle}>
      <div style={contentStyle}>
        {/* Left Half - Description */}
        <div style={leftHalfStyle}>
          <h1 style={headingStyle}>Welcome to Grocery Management System</h1>
          <p style={paragraphStyle}>
            An efficient solution for managing your grocery inventory, suppliers, and retailers.
          </p>
          <p style={paragraphStyle}>
            Easily track products, handle orders, and streamline your supply chain.
          </p>
        </div>

        {/* Right Half - Login/Register Form */}
        <div style={rightHalfStyle}>
          <div style={formContainerStyle}>
            <h2>{isLoginView ? 'Login' : 'Register'}</h2>
            <form style={formStyle} onSubmit={handleSubmit}>
              {/* Form fields go here */}
              {!isLoginView &&(
                <>
                  <p>
                    {/* Additional register-specific fields if needed */}
                    <label htmlFor="fullName" style={labelStyle}>
                      Full Name:
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      style={inputStyle}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {formErrors.fullName && <span style={{ color: 'red' }}>{formErrors.fullName}</span>}
                  </p>
                  <p>
                    {/* Additional register-specific fields if needed */}
                    <label htmlFor="contactNumber" style={labelStyle}>
                      Contact Number:
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      style={inputStyle}
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                    />
                    {formErrors.contactNumber && <span style={{ color: 'red' }}>{formErrors.contactNumber}</span>}
                  </p>
                  <p>
                    {/* Additional register-specific fields if needed */}
                    <label htmlFor="contactNumber" style={labelStyle}>
                      Address:
                    </label>
                    <input
                      type="text"
                      id="address"
                      style={inputStyle}
                      name="address"
                      onChange={handleInputChange}
                    />
                    {/* <label htmlFor="contactNumber" style={labelStyle}>
                      State:
                    </label>
                    <input
                      type="text"
                      id="address"
                      style={inputStyle}
                      name="address"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="contactNumber" style={labelStyle}>
                      Zip Code:
                    </label>
                    <input
                      type="text"
                      id="address"
                      style={inputStyle}
                      name="address"
                      onChange={handleInputChange}
                    />
                     */}
                    
                    {formErrors.contactNumber && <span style={{ color: 'red' }}>{formErrors.contactNumber}</span>}
                  </p>
                  <p>
                    {/* Additional register-specific fields if needed */}
                    <label htmlFor="userType" style={labelStyle}>
                      User Type:
                    </label>
                    <select
                      id="userType"
                      style={selectStyle}
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                    >
                      <option value="RETAILER">Retailer</option>
                      <option value="SUPPLIER">Supplier</option>
                    </select>
                    {formErrors.userType && <span style={{ color: 'red' }}>{formErrors.userType}</span>}
                  </p>
                </>
              )}
              <p>
                  {/* Common form fields */}
                  <label htmlFor="email" style={labelStyle}>
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    style={inputStyle}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
                </p>
              <p>
                <label htmlFor="password" style={labelStyle}>
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  style={inputStyle}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
              </p>
              {!isLoginView &&(
                <p>
                 
                <label htmlFor="password" style={labelStyle}>
                  Re-Enter Password:
                </label>
                <input
                  type="password"
                  id="password"
                  style={inputStyle}
                  name="password"
                  onChange={(e)=>setRpw(e.target.value)}
                />
                {error? <span style={{ color: 'red' }}>password doesnot match</span>:''}
              </p>
              )}


              <button type="button" style={buttonStyle} onClick={switchView}>
                {isLoginView ? 'Switch to Register' : 'Switch to Login'}
              </button>
              
              <br></br>
                {isLoginView ? <button type="submit" style={buttonStyle} onClick={handleSubmit}>
                login
              </button>: <button type="submit" style={buttonStyle} onClick={handleSubmitRegister}>
                Register
              </button> }
             
            </form>
            {error ? <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>:''}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

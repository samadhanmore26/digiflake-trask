import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // State for login form
  const [form, setForm] = useState({ email: '', password: '' });

  // State for registration form
  const [registrationForm, setRegistrationForm] = useState({ email: '', password: '' });

  // State for showing registration form
  const [showRegistration, setShowRegistration] = useState(false);

  // State for forgot password popup
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = (formData) => {
    // Simple email validation
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Simple password validation
    if (!formData.password || formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };
  const handleOnClick = async (e) => {
    e.preventDefault();

    // Validate the login form
    if (!validateForm(form)) {
      return;
    }

    try {
      // Check if the user is registered (you may need to adjust the API endpoint)
      const registrationCheckResponse = await fetch('http://localhost:4000/check-registration', {
        method: 'POST',
        body: JSON.stringify({ email: form.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!registrationCheckResponse.ok) {
        throw new Error('Registration check FAILED');
      }

      const registrationCheckData = await registrationCheckResponse.json();

      if (!registrationCheckData.isRegistered) {
        // User is not registered, show alert and return
        alert('You are not registered. Please register first.');
        return;
      }

      // User is registered, proceed with login
      const loginResponse = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!loginResponse.ok) {
        const loginErrorData = await loginResponse.json();
        // Check if the error indicates incorrect password
        if (loginErrorData.error === 'Authentication failed: Incorrect password') {
          alert('Incorrect password. Please try again.');
        } else {
          throw new Error('Authentication FAILED');
        }
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('user logged in with token', token);

      // Redirect to the dashboard upon successful login
      navigate('dashboard');
    } catch (error) {
      console.log(error);
      // Show alert for other authentication failures
      alert('Authentication failed. Please check your Password and try again.');
    }
  };

  const validateRegistrationForm = () => {
    // Validate the registration form
    if (!validateForm(registrationForm)) {
      return false;
    }

    // Additional validation for registration, if needed

    return true;
  };

  const handleRegistrationClick = async (e) => {
    e.preventDefault();

    if (!validateRegistrationForm()) {
      return;
    }

    try {
      // Simulate API call for registration
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationForm.email,
          password: registrationForm.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration FAILED');
      }

      const data = await response.json();
      const token = data.token;
      console.log('user registered with token', token);

      // Redirect to the dashboard or login page upon successful registration
      navigate('dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPopup(true);
  };

  const closeForgotPasswordPopup = () => {
    setShowForgotPasswordPopup(false);
  };

  const toggleRegistrationForm = () => {
    // Toggle the state to show/hide registration form
    setShowRegistration(!showRegistration);
  };

  
  const requestResetPasswordLink = async () => {
    try {
      const response = await fetch('http://localhost:4000/reset-password-request', {
        method: 'POST',
        body: JSON.stringify({ email: resetPasswordEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Reset password link request FAILED');
      }

      alert('Reset password link sent successfully. Check your email.');
      // You can also navigate to a success page or show a success message
      // depending on your application flow.

      // Close the reset password form
      setShowResetPasswordForm(false);
    } catch (error) {
      console.log(error);
      alert('Error sending reset password link. Please try again.');
    }
  };

  return (
    <div className='flex bg-[#eef0ff] ml-1 items-center min-h-screen bg-cover bg-center' style={{ backgroundImage: 'url("./img/image1.png")' }}>
      <div className='bg-white pb-24 pt-10 w-[700px] mt-8 ml-10 shadow-md p-6 rounded-md w-96'>
        <div className='flex justify-center mx-28'>
          <img className='' src="./img/image2.png" alt="" />
        </div>

        <p className="text-[#717070] text-center mb-2 text-[32px]">Welcome to Digitalflake Admin</p>

        {/* Conditional rendering based on showRegistration state */}
        {showRegistration ? (
          <form>
            {/* Registration Form */}
            <h3>Registration Form</h3>
            <div className='mb-3 mt-8'>
              <label htmlFor='formRegistrationEmail' className='font-normal block text-[25px] leading-4 not-italic font-medium text-gray-700'>
                Email address
              </label>
              <input
                type="email"
                className='w-full p-2 mt-1 border rounded-md'
                id="formRegistrationEmail"
                placeholder="Enter email"
                onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='formRegistrationPassword' className='font-normal block text-[25px] leading-4 not-italic font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className='w-full p-2 mt-1 border rounded-md'
                  id="formRegistrationPassword"
                  placeholder="Password"
                  value={registrationForm.password}
                  onChange={(e) => setRegistrationForm({ ...registrationForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className='absolute top-1/2 right-2 transform -translate-y-1/2'
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className='bg-[#5C218B] mt-4 shadow-md text-white w-full py-2 rounded-md' onClick={handleRegistrationClick}>
              Register
            </button>
            <p className='mt-2 text-center text-[#5C218B] cursor-pointer' onClick={toggleRegistrationForm}>
              Already have an account? Log in here.
            </p>
          </form>
        ) : (
          <form>
            {/* Login Form */}
            <h1>Login Form</h1>
            <div className='mx-5 mt-10'>
              <div className="mb-5">
                <label htmlFor='formBasicEmail' className='font-normal  block text-[25px] leading-4 not-italic font-medium text-gray-700'>
                  Email address
                </label>
                <input
                  type="email"
                  className='w-full p-2 mt-1 border rounded-md'
                  id="formBasicEmail"
                  placeholder="Enter email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor='formBasicPassword' className='font-normal block text-[25px] leading-4 not-italic font-medium text-gray-700 mt-10'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    className='w-full p-2 mt-1 border rounded-md'
                    id="formBasicPassword"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className='absolute top-1/2 right-2 transform -translate-y-1/2'
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className='flex justify-end'>
                <p className='text-[#5C218B] cursor-pointer' onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </p>
              </div>

              <button type="submit" className='bg-[#5C218B] mt-28 shadow-md text-white w-full mt-24 py-2 rounded-md' onClick={handleOnClick}>
                Log In
              </button>
              <p className='mt-2 text-center text-[#5C218B] cursor-pointer' onClick={toggleRegistrationForm}>
                Don't have an account? Register here.
              </p>
            </div>
          </form>
        )}

      {/* Forgot Password Popup */}
        {showForgotPasswordPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="px-10 py-5 bg-white rounded-md">
              <div className=''>
                {/* ... (Other JSX) */}
              </div>
              <div className='mx-10 mt-4'>
                <p className='font-Poppins leading-normal text-[17px] text-[#676767]'>Email Address</p>
                <input
                  type="text"
                  className='border 1px px-32 py-2 rounded-md solid transferent border-redius-[5px]'
                  value={resetPasswordEmail}
                  onChange={(e) => setResetPasswordEmail(e.target.value)}
                />
              </div>
              <div className='w-full px-10 mt-5'>
                <button className='w-full py-2 rounded bg-[#5C218B]' onClick={requestResetPasswordLink}>
                  Request reset link
                </button>
              </div>
              <div className='flex justify-center mt-4'>
                <button className="text-[#5C218B] underline cursor-pointer" onClick={closeForgotPasswordPopup}>
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Form */}
        {showResetPasswordForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="px-10 py-5 bg-white rounded-md">
              <div className=''>
                {/* ... (Other JSX) */}
              </div>
              <div className='mx-10 mt-4'>
                <p className='font-Poppins leading-normal text-[17px] text-[#676767]'>Email Address</p>
                <input
                  type="text"
                  className='border 1px px-32 py-2 rounded-md solid transferent border-redius-[5px]'
                  value={resetPasswordEmail}
                  onChange={(e) => setResetPasswordEmail(e.target.value)}
                />
              </div>
              <div className='w-full px-10 mt-5'>
                <button className='w-full py-2 rounded bg-[#5C218B]' onClick={requestResetPasswordLink}>
                  Request reset link
                </button>
              </div>
              <div className='flex justify-center mt-4'>
                <button className="text-[#5C218B] underline cursor-pointer" onClick={() => setShowResetPasswordForm(false)}>
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

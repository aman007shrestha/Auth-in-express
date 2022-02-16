import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordScreen.css';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        '/api/auth/forgotpassword',
        { email },
        config
      );
      setSuccess(data.data);
    } catch (error) {
      setError(error.response.data.error);
      setEmail('');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <div className='forgotpassword-screen'>
      <form onSubmit={forgotPasswordHandler} className='forgot-password__form'>
        <h3 className='forgotpassword-screen__title'>Forgot Password</h3>
        {error && <span className='error-message'>{error}</span>}
        {success && <span className='success-message'>{success}</span>}
        <div className='form-group'>
          <p className='forgotpassword-screen__subtext'>
            Please enter the email address you register your account with. We
            will send you reset link to this email
          </p>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            name=''
            id='email'
            required
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Send Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordScreen;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log('login');
  const [error, setError] = useState('');
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      history.push('/');
    }
  }, [history]);

  const loginHandler = async (e) => {
    console.log('j');
    e.preventDefault();
    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );
      localStorage.setItem('authToken', data.token);
      history.push('/');
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  return (
    <div className='login-screen'>
      <form onSubmit={loginHandler} className='login-screen__form'>
        <h3 className='login-screen__title'>Login</h3>
        {error && <span className='error-message'>{error}</span>}
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            name=''
            required
            id='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            tabIndex={1}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>

          <Link
            to='/forgotpassword'
            tabIndex={4}
            className='login-screen__subtext'
          >
            Forgot password
          </Link>

          <input
            type='password'
            name=''
            required
            id='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tabIndex={2}
          />
        </div>
        <button type='submit' className='btn btn-submit' tabIndex={3}>
          Login
        </button>
        <span className='login-screen__subtext'>
          Do not have an account?<Link to='/register'>Sign up</Link>
        </span>
      </form>
    </div>
  );
};
export default LoginScreen;

import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState('');
  const [privateData, setPrivateData] = useState('');
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }
    console.log(localStorage.getItem('authToken').length);
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      try {
        console.log('Try catch block activate');
        console.log(config.headers);

        const { data } = await axios.get('/api/private', config);
        console.log(`Data is ${data}`);
        setPrivateData(data.data);
      } catch (error) {
        console.log('terminal error');
        localStorage.removeItem('authToken');
        setError('You are not authorized please login');
      }
    };
    fetchPrivateData();
  }, [history]);
  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };
  return error ? (
    <span className='error-message'>{error}</span>
  ) : (
    <>
      <div style={{ background: 'green', color: 'white' }}>{privateData}</div>
      <button onClick={logoutHandler}>Logout</button>
    </>
  );
};
// const PrivateScreen = () => {
//   return(
//     <div>He</div>
//   )
// }

export default PrivateScreen;

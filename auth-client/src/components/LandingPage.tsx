import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleSigninClick = () => {
    navigate('/signin');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // inline style with correct type
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        textAlign: 'center',
      }}
    >
      <h2>Welcome to Our App</h2>
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            transition: 'background-color 0.3s',
          }}
          onClick={handleSignupClick}
        >
          Signup
        </button>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            transition: 'background-color 0.3s',
          }}
          onClick={handleSigninClick}
        >
          Signin
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

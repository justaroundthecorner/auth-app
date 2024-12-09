import React, { useState } from 'react';
import { signup } from '../api/authApi'; 
import { TextField, Button, Typography, Container, Box, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Signup component
const Signup: React.FC = () => {
  // State variables to hold form inputs and errors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // General error message
  const [emailError, setEmailError] = useState<boolean>(false); // Email validation error
  const [passwordError, setPasswordError] = useState<boolean>(false); // Password validation error

  const navigate = useNavigate(); 

  // Email validation function using a regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function using a regex
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear previous errors
    setEmailError(false); // Reset email error
    setPasswordError(false); // Reset password error

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError(true);
      setError('Please enter a valid email address.');
      return; 
    }

    // Validate password
    if (!isValidPassword(password)) {
      setPasswordError(true);
      setError(
        'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.'
      );
      return; // Stop submission if invalid
    }

    try {
      // Call the signup API
      const response = await signup(name, email, password);
      alert('Signup successful'); // Notify user of success

      // Set authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // Handle API errors
      if (error.response?.status === 400) {
        // If status 400, it's likely a duplicate email
        setError('This email is already registered. Please use a different email.');
      } else {
        setError('Signup failed: ' + error.message); // Display generic error
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3, 
        }}
      >
        {/* Title */}
        <Typography variant="h5" component="h1" gutterBottom>
          Sign Up
        </Typography>

        {/* Signup form */}
        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email field */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={emailError} 
            helperText={emailError ? 'Invalid email address' : ''} 
          />

          {/* Password field */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={passwordError}
          />

          {/* Error message */}
          {<FormHelperText error>{error}</FormHelperText>}

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;

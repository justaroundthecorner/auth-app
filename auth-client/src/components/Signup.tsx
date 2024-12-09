import React, { useState } from 'react';
import { signup } from '../api/authApi';
import { TextField, Button, Typography, Container, Box, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(false);
    setPasswordError(false);

    // Validate email and password
    if (!isValidEmail(email)) {
      setEmailError(true);
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(true);
      setError('Password must be at least 8 characters long, contain at least one letter, one number, and one special character.');
      return;
    }

    try {
      const response = await signup(name, email, password);
      alert('Signup successful');
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 400) {
        // If the error status is 400, it indicates a duplicate email
        setError('This email is already registered. Please use a different email.');
      } else {
        setError('Signup failed: ' + error.message);
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
        <Typography variant="h5" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={emailError}  // Show error if email is invalid
            helperText={emailError ? 'Invalid email address' : ''}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={passwordError}  // Show error if password is invalid
          />
          {<FormHelperText error>{error}</FormHelperText>}  {/* Display general error */}
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

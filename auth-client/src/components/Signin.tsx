import React, { useState } from 'react';
import { signin } from '../api/authApi'; // Import the signin API function
import { TextField, Button, Typography, Container, Grid, Box, Alert } from '@mui/material'; // Material-UI components
import { useNavigate } from 'react-router-dom'; // Hook for navigation

// Signin component
interface SigninProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signin: React.FC<SigninProps> = ({ setIsAuthenticated }) => {
  // State variables to store form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Error state to store error messages

  const navigate = useNavigate(); // Hook to handle programmatic navigation

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    setError(null); // Clear any previous errors

    try {
      // Call the signin API with email and password
      const response = await signin(email, password);
      alert('Signin successful'); // Notify the user of successful login

      // Store authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Update state in the parent component immediately
      setIsAuthenticated(true);

      // Redirect the user to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // Handle errors and display an error message
      console.error('Signin error:', error);
      setError('Signin failed. Please try again.'); // Set error message in state
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* Main container for styling */}
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
        {/* Page title */}
        <Typography variant="h5" component="h1" gutterBottom>
          Signin
        </Typography>

        {/* Error message display */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
            {error} {/* Display the error message */}
          </Alert>
        )}

        {/* Signin form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            {/* Email input field */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required // Mark the field as required
              />
            </Grid>

            {/* Password input field */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required // Mark the field as required
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary" 
                sx={{ padding: '10px' }} 
              >
                Signin
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Signup link for users without an account */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{' '}
            <a href="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Signup
            </a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;

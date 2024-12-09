import React, { useState } from 'react';
import { signin } from '../api/authApi'; // Import the signin API function
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material'; // Material-UI components
import { useNavigate } from 'react-router-dom'; // Hook for navigation

// Signin component
const Signin: React.FC = () => {
  // State variables to store form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // Hook to handle programmatic navigation

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Call the signin API with email and password
      const response = await signin(email, password);
      alert('Signin successful'); // Notify the user of successful login

      // Store authentication status in localStorage
      localStorage.setItem('isAuthenticated', 'true');

      // Redirect the user to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Handle errors and display an alert
      alert('Signin failed: ' + error);
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
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
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
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
                required // Mark the field as required
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary" // Set button color
                sx={{ padding: '10px' }} // Add padding for a larger button
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

import React, { useState } from 'react';
import { signin } from '../api/authApi';
import { TextField, Button, Typography, Container, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Hook to navigate programmatically

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signin(email, password);
      alert('Signin successful');
      // Redirect to dashboard after successful login
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } catch (error) {
      alert('Signin failed: ' + error);
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
          Signin
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
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

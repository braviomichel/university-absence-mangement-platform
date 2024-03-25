import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

const PageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: 'url("https://img.freepik.com/free-vector/dark-gradient-background-with-copy-space_53876-99548.jpg?w=360")',
  backgroundSize: 'cover',
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login'); // Replace '/auth' with the actual path to your authentication page
  };

  return (
    <PageContainer>
      <Typography variant="h2" component="h2" align="center">
        Bienvenue sur le site des absences
      </Typography>
      <Button variant="contained" onClick={handleButtonClick}>
        Se connecter
      </Button>
    </PageContainer>
  );
};

export default LandingPage;

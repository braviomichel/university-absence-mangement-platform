import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';



import { styled } from '@mui/system';
import {
  CssBaseline,
  Container,
  Snackbar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
} from '@mui/material';

import Alert from '@mui/material/Alert';
import { authenticateUser } from '../../Store/actions/AuthActions';
 

const FormContainer = styled('div')(({ theme }) =>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  //backgroundColor: theme.palette.bg.main,
  backgroundSize: 'cover',
}));

const StyledSnackbar = styled(Snackbar)({
  // Styles for Snackbar component
});

const StyledAlert = styled(Alert)({
  // Styles for Alert component
});



const LoginPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({
    open: false,
    type: 'info',
    message: '',
  });

  const onNotificationClosed = () => {
    setNotification({
      open: false,
      type: 'info',
      message: '',
    });
  };

  const openNotification = (type, message) => {
    setNotification({
      open: true,
      type,
      message,
    });
  };

  const firstAuthentication = useSelector((state) => state.auth.firstAuthentication)
 
 const {role} = useSelector((state) => state.auth.userInfos);
 useEffect(() => {
  // Effectue une action à chaque mise à jour de firstAuthentication
  // ou à chaque changement de sa valeur
  console.log('firstAuthentication changed:', firstAuthentication);

  // Effectue une action à chaque mise à jour de role
  // ou à chaque changement de sa valeur
  console.log('role changed:', role);

   // Vérifie si les conditions de redirection sont remplies
   if (firstAuthentication === false) {
    if (role === 'etudiant') {
      navigate('/consulterAbsence');
    } else if (role === 'professeur') {
      navigate('/profmodule');
    } else if (role === 'admin') {
      
      navigate('/filiere');
    } 
  } else {
    navigate('/firstLoginPage');
  }
}, [firstAuthentication, role]);

const onSubmit = async (event) => {
  event.preventDefault();

  await dispatch(authenticateUser(email, password))
    .then((state) => {
      console.log(role);
      if (state) {
        console.log('authentification reussie');
        openNotification('success', 'Authentification Réussie');
      } else {
        console.log("erreur d'authentification");
        openNotification('error', "Authentification Echouée");
        setEmail(null);
        setPassword(null);
      }
    });
};

  const handleEmailChange = (event) => {  
    setEmail(event.target.value);
  };
 
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledSnackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={onNotificationClosed}
      >
        <StyledAlert severity={notification.type}>{notification.message}</StyledAlert>
      </StyledSnackbar>
      <CssBaseline />
      <FormContainer>
        <Typography component="h1" variant="h4"
        sx={{
          
          color: theme.palette.gold.main,
        }}>
          S'authentifier
        </Typography>
        <form noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handleEmailChange}
            value={email || ''}
            id="email"
            label="N° Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handlePasswordChange}
            value={password || ''}
            name="password"
            label="Mot de Passe"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
            }}
            
          >
            S'authentifier
          </Button>
          <Grid container alignContent="center">
            <Grid item xs>
              <Link href="#" variant="body2">
                Mot de passe oublié ?
              </Link>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;

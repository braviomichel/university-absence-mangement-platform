import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert ,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { UPDATE_ETUDIANT, GET_FILIERE, UPDATE_PROF } from "../../Routes";
import {  useSelector } from 'react-redux';

const FirstLoginPage = () => {
  const role = useSelector((state) => state.auth.userInfos.role);
  
 // const firstAuthentication = useSelector((state) => state.auth.firstAuthentication);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "stateEmail",
    nouveauMotDePasse: "",
    confirmerMotDePasse: "",
    filiere: "",
    cin : "",
  });
  const [filieres, setFilieres] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetchFilieres();
  }, []);

  const fetchFilieres = () => {
    axios
      .get(GET_FILIERE)
      .then((response) => {
        setFilieres(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFormChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (formData.nouveauMotDePasse !== formData.confirmerMotDePasse) {
      setNotificationType("error");
      setNotificationMessage(
        "Les champs Nouveau mot de passe et Confirmer le mot de passe doivent correspondre."
      );
      setLoading(false);
      setNotificationOpen(true);
      return;
    }
    try {
      let updateData;
      
      if (role === "etudiant") {
        updateData = {
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          password: formData.nouveauMotDePasse,
          CIN: formData.cin,
          filiere: formData.filiere,
        };
      } else if (role === "professeur") {
        updateData = {
          email: formData.email,
          nom: formData.nom,
          prenom: formData.prenom,
          password: formData.nouveauMotDePasse,
          Tel: formData.cin,
        };
      }
    
      const response = await axios.put(role === "etudiant" ? UPDATE_ETUDIANT : UPDATE_PROF, updateData);
      
      if (response.status === 200) {
        setNotificationType("success");
        setNotificationMessage("Votre compte a été créé avec succès. Veuillez vous connecter.");
        setLoading(false);
        setNotificationOpen(true);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setNotificationType("error");
      setNotificationMessage("Une erreur s'est produite lors de la création de votre compte. Veuillez réessayer.");
      setLoading(false);
      setNotificationOpen(true);
    }
    
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Créer un nouveau compte
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nom"
              label="Nom"
              fullWidth
              required
              value={formData.nom}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="prenom"
              label="Prénom"
              fullWidth
              required
              value={formData.prenom}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={6}>
        <TextField
          name="email"
          label="Email"
          fullWidth
          required
          value={formData.email}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="nouveauMotDePasse"
          label="Nouveau mot de passe"
          type="password"
          fullWidth
          required
          value={formData.nouveauMotDePasse}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="confirmerMotDePasse"
          label="Confirmer le mot de passe"
          type="password"
          fullWidth
          required
          value={formData.confirmerMotDePasse}
          onChange={handleFormChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          name="cin"
          label={role==="etudiant"? "cin" : "Tel"}
          fullWidth
          required
          value={formData.cin}
          onChange={handleFormChange}
        />
      </Grid>
      {role==="etudiant" && (

        <Grid item xs={6}>
        <InputLabel id="filiere-label">Filière</InputLabel>
        <Select
          name="filiere"
          labelId="filiere-label"
          value={formData.filiere}
          onChange={handleFormChange}
          fullWidth
          required
        >
          {filieres.map((filiere)=> (
            <MenuItem value= {filiere.codefiliere}>{filiere.filiere}</MenuItem>
          )
          )}
        </Select>
        </Grid>
        )}
      
    </Grid>
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Valider"}
    </Button>
  </form>
  <Snackbar
    open={notificationOpen}
    autoHideDuration={5000}
    onClose={handleNotificationClose}
  >
    <Alert onClose={handleNotificationClose} severity={notificationType}>
      {notificationMessage}
    </Alert>
  </Snackbar>
</div>
);
};

export default FirstLoginPage;

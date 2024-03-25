import React, { useState } from "react";
import { TextField, Button, Snackbar, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "../../axios";
import { ADD_PROF } from "../../Routes";
import AddButton from "./AddButtonProf";
import { useTheme } from '@mui/material/styles';


const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: "400px",
  margin: "auto",
  marginTop: "32px",
  padding: "16px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
});

function AddProf() {
  const theme = useTheme();
  const [studentEmails, setProfEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

 //  const navigate = useNavigate();

  const handleProfEmailsChange = (event) => {
    setProfEmails(event.target.value);
  };
  const extractEmails =(emailString) => {
    const emails = emailString.split(',').map(email => email.trim());
    return emails;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const sentEmails = {
        liste_email: extractEmails(studentEmails),
      }
      const response = await axios.post(ADD_PROF,sentEmails );
      if (response.status===200){
       
      setNotificationMessage("Les professeurs ont été ajoutés avec succès !");
      }
      
    } catch (error) {
      console.error(error);
      
      setNotificationMessage(
        "Une erreur s'est produite lors de l'ajout des professeurs. Veuillez réessayer."
      );
    }
    setLoading(false);
    setNotificationOpen(true);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <div>
      <Typography variant="h3" align="center" gutterBottom>
       Ajouter Professeur
      </Typography>
      <StyledForm>

<AddButton/>
</StyledForm>
<Typography variant="h4" align="center" gutterBottom>
       Ou  Ajouter via Saisie
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        
        <TextField
          id="Prof-emails"
          label="Adresses e-mail des professeurs  (séparées par des virgules)"
          value={studentEmails}
          onChange={handleProfEmailsChange}
          variant="outlined"
          fullWidth
          required       
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.bg.main,
            color: theme.palette.gold.main,
            marginBottom: '10px'
          }}
          disabled={loading}
        > 
          {loading ? <CircularProgress size={24} /> : "Valider"}
        </Button>
      </StyledForm>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        message={notificationMessage}
      />
    </div>
  );
}

export default AddProf;

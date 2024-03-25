import React, { useState } from "react";
import { TextField, Button, Snackbar, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";
// import axios from "axios";
import axios from "../../axios"
import { ADD_STUDENT } from "../../Routes";
import AddButton from "./AddButtonEtudiant";
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

function AddStudentsPage() {
  const theme = useTheme();
  const [studentEmails, setStudentEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

 //  const navigate = useNavigate();

  const handleStudentEmailsChange = (event) => {
    setStudentEmails(event.target.value);
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
      
      const response = await axios.post(ADD_STUDENT,sentEmails );
      if (response.status===200){
       
      setNotificationMessage("Les étudiants ont été ajoutés avec succès !");
      }
      
    } catch (error) {
      console.error(error);
  
      setNotificationMessage(
        "Une erreur s'est produite lors de l'ajout des étudiants. Veuillez réessayer."
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
      <Typography variant="h2" align="center" gutterBottom>
       Ajouter Etudiant
      </Typography>
      <StyledForm>

      <AddButton/>
      </StyledForm>
      
      <Typography variant="h4" align="center" gutterBottom>
       Ou  Ajouter via Saisie
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          id="student-emails"
          label="Adresses e-mail des étudiants (séparées par des virgules)"
          value={studentEmails}
          onChange={handleStudentEmailsChange}
          variant="outlined"
          fullWidth
          required       
        />
        <Button
          type="submit"
          variant="contained"
          
          disabled={loading}
          sx={{
            backgroundColor: theme.palette.bg.main,
            color: theme.palette.gold.main,
            marginBottom: '10px'
          }}
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

export default AddStudentsPage;

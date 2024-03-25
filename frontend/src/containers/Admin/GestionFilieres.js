import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Modal,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { GET_FILIERE, ADD_FILIERE , UPDATE_FILIERE, DELETE_FILIERE} from "../../Routes";


const AjoutBloc = styled("div")(({ theme })=>({
  flex: "1 1 100%",
  paddingRight: "10px",
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const AffichageBloc = styled("div")({
  paddingLeft: "10px",
});

const GestionFilieres = () => {
  const theme = useTheme();
  
  const navigate = useNavigate();
  const [filieres, setFilieres] = useState([{}]);
  const [nouvelleFiliere, setNouvelleFiliere] = useState("");
  const [nouveauCodeFiliere, setNouveauCodeFiliere] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filiereToUpdate, setFiliereToUpdate] = useState(null);
  const [ajoutFiliere, setAjoutFiliere] = useState(false);
  const [updateFiliere, setUpdateFiliere] = useState(false);

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

  const ajouterFiliere = () => {
    const nouvelleFiliereObj = {
      codefiliere: nouveauCodeFiliere,
      filiere: nouvelleFiliere,
    };

    axios
      .post(ADD_FILIERE, nouvelleFiliereObj)
      .then((response) => {
        fetchFilieres(); // Actualiser la liste des filières
        setNouvelleFiliere("");
        setNouveauCodeFiliere("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAjouterNouvelleFiliere = () => {
    
    setAjoutFiliere(true);
    setModalOpen(true);
  };
  const handleNouvelleFiliereChange = (event) => {
    setNouvelleFiliere(event.target.value);
  };

  const handleNouveauCodeFiliereChange = (event) => {
    setNouveauCodeFiliere(event.target.value);
  };

  const handleGererFiliere = (codeFiliere) => {
    navigate('/semestres', { state: { codeFiliere: codeFiliere } });
  };

  const handleModifierFiliere = (codeFiliere) => {
    setFiliereToUpdate(codeFiliere);
    setUpdateFiliere(true);
      setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setAjoutFiliere(false);
    setUpdateFiliere(false);
  };

  const handleValidationModifierFiliere = (event) => {
    event.preventDefault();
    if (filiereToUpdate) {
      const modifiedFiliere = {
        ancienCodeFiliere :  filiereToUpdate,
        nouveauCodeFiliere: nouveauCodeFiliere,
        nouveauNomFiliere: nouvelleFiliere,
      };

      axios
        .put(
          UPDATE_FILIERE,modifiedFiliere
        )
        .then((response) => {
          fetchFilieres(); // Actualiser la liste des filières
          setModalOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteFiliere = (codeFiliere) => {
    const filiereToDelete = {
      codeFiliere: codeFiliere,
      
    }
    console.log(filiereToDelete)

      axios
      .delete(
        DELETE_FILIERE, codeFiliere
      )
      .then((response) => {
        fetchFilieres(); 
      })
      .catch((error) => {
        console.log(error);
      });
    
  };

  return (
    <div>
      <h1>Gestion des filières</h1>
      <h3>Ajouter une Filière</h3>


<Button variant="contained" onClick= {handleAjouterNouvelleFiliere}
sx={{
          backgroundColor: theme.palette.bg.main,
          color: theme.palette.gold.main,
          marginLeft: '10px'
        }}
>
  Ajouter
</Button>



<Grid container spacing={2}>
  {filieres.map((filiere, index) => (
    <Grid item xs={12} sm={6} key={Math.floor(Math.random() * 10000) + 1}>
      <AffichageBloc>
        <Accordion
          style={{ marginTop: "10px" }}
          sx={{
            backgroundColor: theme.palette.background.default,
            "&.Mui-expanded": {
              backgroundColor: theme.palette.accordion.main,
            },
            color: theme.palette.default.main,
          }}
        >
         <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: theme.palette.bg.main, // Changer la couleur de fond de l'en-tête de l'accordéon
          }}
           >
            <Typography variant="h5" component="div">
              {filiere.codefiliere}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h4" color={theme.palette.secondary.main}
            sx={{ marginTop: '10px', paddingBottom: '20px' }}
            >
              {filiere.filiere}
            </Typography>
            <Button onClick={() => handleGererFiliere(filiere.codefiliere)}
            sx={{
              
              color: theme.palette.bg.main,
              fontSize : theme.typography.body1.fontSize,
            }}
            >
              Gérer
            </Button>
            <Button onClick={() => handleModifierFiliere(filiere.codefiliere)}
            sx={{
              
              color: theme.palette.bg.main,
              fontSize : theme.typography.body1.fontSize,
            }}
            >
              Modifier
            </Button>
            <Button onClick={() => handleDeleteFiliere(filiere.codefiliere)}
            sx={{
              
              color: theme.palette.bg.main,
              fontSize : theme.typography.body1.fontSize,
            }}
            >
              Supprimer
            </Button>
          </AccordionDetails>
        </Accordion>
      </AffichageBloc>
    </Grid>
  ))}
</Grid>

      <Modal open={modalOpen} onClose={handleModalClose}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
    }}
  >
    {ajoutFiliere && (
     <AjoutBloc>
     <Typography variant="h5" component="div">
            Ajouter une Filiere
           </Typography>
     <TextField
       label="Code de la filière"
       value={nouveauCodeFiliere}
       onChange={handleNouveauCodeFiliereChange}
     />
     <TextField
       label="Nouvelle filière"
       value={nouvelleFiliere}
       onChange={handleNouvelleFiliereChange}
     />
     <Button variant="contained" onClick={ajouterFiliere}
      sx={{
       backgroundColor: theme.palette.bg.main,
       color: theme.palette.gold.main,
     }}
     >
       Ajouter
     </Button>
     </AjoutBloc>
      )}

{updateFiliere && (
  <form onSubmit={handleValidationModifierFiliere}>
    <Typography variant="h5" component="div">
            Modifier une Filiere
           </Typography>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}
  >
    <TextField
      label="Code de la filière"
      value={nouveauCodeFiliere}
      onChange={handleNouveauCodeFiliereChange}
    />
    <TextField
      label="Nouvelle filière"
      value={nouvelleFiliere}
      onChange={handleNouvelleFiliereChange}
    />
    <Button type="submit" 
     variant="contained"
     sx={{
       backgroundColor: theme.palette.bg.main,
       color: theme.palette.gold.main,
     }}
     >
      Valider</Button>
  </Box>
</form>
      
      )}
    
  </Box>
</Modal>

    </div>
  );
};

export default GestionFilieres;

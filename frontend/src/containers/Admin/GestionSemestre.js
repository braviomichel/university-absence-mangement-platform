import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Modal,
  Box,
} from "@mui/material";
import GestionModule from "./GestionModule";
import { useLocation } from 'react-router-dom';
import axios from "../../axios";
import {  ADD_SEMESTRE, DELETE_SEMESTRE } from "../../Routes";

const Container = styled("div")({
  display: "flex",
  padding: "10px",
  gap : "50px"
 
});

const AjoutBloc = styled("div")(({ theme })=>({
  flex: "1 1 20%",
  paddingRight: "10px",
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const AffichageBloc = styled("div")({
  flex: "1 1 80%",
  paddingLeft: "10px",
});


const GestionSemestre = () => {
  const theme = useTheme();
  const location = useLocation();
  const codeFiliere = location.state && location.state.codeFiliere;
  const [semestres, setSemestres] = useState([]);
  const [nouveauSemestre, setNouveauSemestre] = useState("");
  const [activeSemestre, setActiveSemestre] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState(null);
  
 

  useEffect(() => {
    fetchSemestres();
  }, []);

  const fetchSemestres = () => {
    console.log(codeFiliere);
    ///setSemestres([{ numero: 1 }, { numero: 2 }, { numero: 5 }]);
    axios
      .get(`https://indiapfa.pythonanywhere.com/api/GetSemestre/?codeFiliere=${codeFiliere}`)
      .then((response) => {
        console.log(response.data);
        setSemestres(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ajouterSemestre = () => {
    const nouveauSemestreObj = {
      filiere: codeFiliere,
      numero:Number(nouveauSemestre),
    };

    axios
      .post(
        ADD_SEMESTRE,
        nouveauSemestreObj
      )
      .then((response) => {
        fetchSemestres(); // Actualiser la liste des semestres
        setNouveauSemestre("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNouveauSemestreChange = (event) => {
    setNouveauSemestre(event.target.value);
  };

  const handleSelectedSemestreChange = (event) => {
    setSelectedSemestre(event.target.value);
  };


  const handleSemestreClick = (semestre) => {
    setActiveSemestre(semestre);
  };

  const handleSupprimerSemestre = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleValidationSupprimerSemestre = () => {
    if (selectedSemestre) {
      axios
        .delete(
          DELETE_SEMESTRE,{selectedSemestre, codeFiliere}
        )
        .then((response) => {
          fetchSemestres(); // Actualiser la liste des semestres
          setModalOpen(false);
          setSelectedSemestre(null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <h2>Gestion des semestres</h2>
      <Container>
        
      <AffichageBloc>
      <AppBar position="static"
      sx={{
        backgroundColor: theme.palette.bg.main, // Changer la couleur de fond de l'en-tête de l'accordéon
      }}>
        <Toolbar>
          {semestres.map((semestre) => (
            <Button
              key={Math.floor(Math.random()*10000)+1}
              sx={{
                
                color: activeSemestre && activeSemestre.numero === semestre.numero
                ? theme.palette.gold.main
                : theme.palette.default.main,
              }}
             
              onClick={() => handleSemestreClick(semestre)}
            >
              {`Semestre ${semestre.numero}`}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      {activeSemestre && (
        <div>
          <Typography variant="h4" gutterBottom>
            {`Semestre ${activeSemestre.numero}`}
          </Typography>
          <GestionModule
            codeFiliere={codeFiliere}
            numeroSemestre={activeSemestre.numero}
          />
        </div>
      )}

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
          <select
            value={selectedSemestre ? selectedSemestre.numero : ""}
            onChange={handleSelectedSemestreChange}
            style={{ width: "100%", marginBottom: "20px" }}
          >
            {semestres.map((semestre) => (
              <option key={Math.floor(Math.random()*10000)+1} value={semestre.numero}>
                {`Semestre ${semestre.numero}`}
              </option>
            ))}
          </select>
          <Button onClick={handleValidationSupprimerSemestre}>Valider</Button>
        </Box>
      </Modal>
      </AffichageBloc>
      <AjoutBloc>
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <select
      value={nouveauSemestre}
      onChange={handleNouveauSemestreChange}
      style={{ width: "250px" }}
    >
      {[...Array(10)].map((_, index) => (
        <option key={Math.floor(Math.random() * 10000) + 1} value={index + 1}>
          {index + 1}
        </option>
      ))}
    </select>
    <Button variant="contained"
     
     sx={{
       backgroundColor: theme.palette.bg.main,
       color: theme.palette.gold.main,
     }}
      onClick={ajouterSemestre}>
      Ajouter
    </Button>
    <Button 
     variant="contained"
     sx={{
       backgroundColor: theme.palette.bg.main,
       color: theme.palette.gold.main,
     }}
      onClick={handleSupprimerSemestre}>
      Supprimer Semestre
    </Button>
  </div>
</AjoutBloc>

      </Container>
    </div>
  );
};

export default GestionSemestre;

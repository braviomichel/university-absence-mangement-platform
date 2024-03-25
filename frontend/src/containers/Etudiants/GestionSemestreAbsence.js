import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

import axios from "../../axios";
import EtudiantAbsences from "./EtudiantAbsences";
import { useSelector } from 'react-redux';

const Container = styled("div")({
  display: "flex",
  padding: "10px",
  gap : "50px"
 
});



const AffichageBloc = styled("div")({
  flex: "1 1 80%",
  paddingLeft: "10px",
});


const GestionSemestre = () => {
  const codeFiliere  = useSelector((state) => state.auth.userInfos.roleInfos.filiere);
  const theme = useTheme();
  
 
  const [semestres, setSemestres] = useState([]);
  const [activeSemestre, setActiveSemestre] = useState(null);
  


  const handleSemestreClick = (semestre) => {
    setActiveSemestre(semestre);
  };


  useEffect(() => {
    fetchSemestres();
  }, []);

  const fetchSemestres = () => {
    
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


  return (
    <div>
      <h2>Absences</h2>
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
            {/* {`Semestre ${activeSemestre.numero}`} */}
          </Typography>
          <EtudiantAbsences
            codeFiliere={codeFiliere}
            numeroSemestre={activeSemestre.numero}
          />
        </div>
      )}

      </AffichageBloc>
      </Container>
    </div>
  );
};

export default GestionSemestre;

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

const ProfModules = () => {
  const theme = useTheme();
  const { emailAdress } = useSelector((state) => state.auth.userInfos);
  const { nom } = useSelector((state) => state.auth.userInfos);
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    console.log(emailAdress);

    axios
      .get(`https://indiapfa.pythonanywhere.com/api/GetElementDeModuleEtModuleParProf/?emailProf=${emailAdress}`)
      .then((response) => {
        console.log(response.data);
        setModules(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des modules et éléments :', error);
      });
  }, []);

  const handleModuleClick = (code, filiere, semestre, codeModule) => {
    navigate('/seance', { state: { code: code, filiere: filiere, semestre: semestre, codeModule: codeModule } });
  };

  return (
    <>
      <h1>Liste de vos Modules</h1>

      <Grid container spacing={2}>
        {modules.map((module) => (
          <Grid item key={module.codeModule || module.codeElement} xs={12} sm={6} md={6} lg={6}>
            <Accordion
              sx={{
                backgroundColor: theme.palette.background.default, // Changer la couleur de fond de l'accordéon
                '&.Mui-expanded': {
                  backgroundColor: theme.palette.accordion.main, // Changer la couleur de fond lorsque l'accordéon est ouvert
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: theme.palette.bg.main, // Changer la couleur de fond de l'en-tête de l'accordéon
                }}
              >
                <Typography variant="h6" sx={{ color: theme.palette.primary.contrastText }}>
                  {`Module : ${module.nomModule || module.nomElement} - Filiere : ${module.filiere}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div key={module.codeModule}>
                  <p>Nom du responsable : {nom}</p>
                  <p>Code du module : {module.codeModule}</p>
                  <h2>Elements :</h2>
                  {module.elementsModule.map((element) => (
                    <div key={element.codeElement}>
                      <p>Code de l'élément : {element.codeElement}</p>
                      <p>Nom de l'élément : {element.nomElement}</p>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: theme.palette.bg.main,
                          color: theme.palette.gold.main,
                          marginLeft: '10px'
                        }}
                        onClick={() => handleModuleClick(element.codeElement, module.filiere, module.semestre, module.codeModule)}
                      >
                        Gérer
                      </Button>
                    </div>
                  ))}
                  {module.elementsModule.length === 0 && (
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: theme.palette.bg.main,
                        color: theme.palette.gold.main,
                        marginLeft: '10px'
                      }}
                      onClick={() => handleModuleClick("", module.filiere, module.semestre, module.codeModule)}
                    >
                      Gérer
                    </Button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProfModules;

import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {

  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import AjouterElementdeModule from "./AjouterElementdeModule";
import GestionElementModule from "./GestionElementModule";
import { GET_PROF, ADD_MODULE } from "../../Routes";
import { styled } from "@mui/system";
const Container = styled("div")({
  display: "flex",
  gap : "50px"
 
});


const AjoutBloc = styled("div")(({ theme })=>({
  flex: "1 1 100%",
  paddingRight: "10px",
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const AffichageBloc = styled("div")({
  flex: "1 1 100%",
  paddingLeft: "10px",
});

const GestionModule = ({ codeFiliere, numeroSemestre }) => {
  const theme = useTheme();
  const [modules, setModules] = useState([]);
  const [numeroModule, setNumeroModule] = useState("");
  const [nomModule, setNomModule] = useState("");
  const [responsableModule, setResponsableModule] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [nomsProfesseurs, setNomsProfesseurs] = useState([]);
  const [ajoutModule, setAjoutModule] = useState(false);

  const fetchProf = async () => {
    
    try {
      const response = await axios.get(GET_PROF);
      setNomsProfesseurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modules :", error);
    }
  };
  useEffect(() => {
    

    fetchProf();
  }, []);
  const fetchModules = async () => {
   
    try {
      const response = await axios.get(`https://indiapfa.pythonanywhere.com/api/GetModule/?codeFiliere=${codeFiliere}&numeroSemestre=${numeroSemestre}`, 
      {
        "codeFiliere" : codeFiliere,
        "numeroSemestre" : numeroSemestre,
      }
      );
      setModules(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modules :", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [codeFiliere, numeroSemestre]);


  function getEmailByNomPrenom(data, nomPrenom) {
    const found = data.find((item) => (item.nom + " " + item.prenom) === nomPrenom);
    return found ? found.email : null;
  }

  
  const ajouterModule = async () => {
    
    
    if (
      numeroModule.trim() === "" ||
      nomModule.trim() === "" ||
      responsableModule.trim() === ""
    ) {
      return;
    }

    const nouveauModuleObj = {
 
      codeFiliere: codeFiliere,
        numeroSemestre: numeroSemestre,
        codeModule: numeroModule,
        nomModule: nomModule,
        responsableModule: getEmailByNomPrenom(nomsProfesseurs, responsableModule),
    };
   

    axios
    .post(
      ADD_MODULE,
      nouveauModuleObj
    )
    .then((response) => {
      fetchModules(); // Actualiser la liste des semestres
    })
    .catch((error) => {
      console.log(error);
    });

   
  };

  const handleNumeroModuleChange = (event) => {
    setNumeroModule(event.target.value);
  };

  const handleNomModuleChange = (event) => {
    setNomModule(event.target.value);
  };

  const handleResponsableModuleChange = (event) => {
    setResponsableModule(event.target.value);
  };
  const handleAjouterNouveauModule = () => {
    
    setAjoutModule(true);
    setModalOpen(true);
  };

  const handleAjouterElement = (codeM) => {
    console.log(`Ajouter un élément au module avec l'ID ${codeM}`);
    setSelectedModule(codeM);
    setModalOpen(true);
  };

  const handleSupprimerModule = (moduleId) => {
    console.log(`Supprimer le module avec l'ID ${moduleId}`);
    // Faire une requête Axios pour supprimer le module avec l'ID spécifié
  };

  const handleModifierModule = (moduleId) => {
    console.log(`Modifier le module avec l'ID ${moduleId}`);
    const module = modules.find((mod) => mod.id === moduleId);
    if (module) {
      setModuleToEdit(module);
      setModalOpen(true);
    }
  };
  const handleModifier = (moduleId) => {
    console.log(`Modifier le module avec l'ID ${moduleId}`);
    const module = modules.find((mod) => mod.id === moduleId);
    if (module) {
      setModuleToEdit(module);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    fetchModules();
    setSelectedModule(null);
    setModuleToEdit(null);
    setModalOpen(false);
    setAjoutModule(false);
  };

  function getNomPrenomByEmail(data, email) {
    const found = data.find((item) => item.email === email);
    return found ? (found.nom + " " + found.prenom) : null;
  }

  return (
    <div>
      
      <h1>Gestion des modules</h1>

     <div>
      <h3>Ajouter un Module</h3>


      <Button variant="contained" onClick= {handleAjouterNouveauModule}
      sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
                marginLeft: '10px'
              }}
      >
        Ajouter
      </Button>
      </div>
      <Container>
       
      <AffichageBloc>
        <h3>Liste des modules</h3>

      {modules.map((module) => (
        <Accordion key={Math.floor(Math.random()*10000)+1} style={{ marginTop: "10px" }}
        sx={{
          backgroundColor: theme.palette.background.default, // Changer la couleur de fond de l'accordéon
          '&.Mui-expanded': {
            backgroundColor: theme.palette.accordion.main, // Changer la couleur de fond lorsque l'accordéon est ouvert
          },
          color : theme.palette.secondary.main,
        }}
        >
          <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: theme.palette.bg.main, // Changer la couleur de fond de l'en-tête de l'accordéon
            color : theme.palette.default.main,
          }}
          >
            <h3>{`Module ${module.codeModule}`}</h3>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <p>Nom du module: {module.nomModule}</p>
              <p>Responsable: {getNomPrenomByEmail(nomsProfesseurs,module.responsable)}</p>
            </div>
            <Button
              
              sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
                marginLeft: '10px'
              }}
              onClick={() => handleAjouterElement(module.codeModule)}
            >
              Ajouter élément
            </Button>
            <Button
             
             sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
              marginLeft: '10px'
            }}
              onClick={() => handleModifierModule(module.codeModule)}
              style={{ marginLeft: "10px" }}
            >
              Modifier
            </Button>
            <Button
             
             sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
              marginLeft: '10px'
            }}
              onClick={() => handleSupprimerModule(module.codeModule)}
              style={{ marginLeft: "10px" }}
            >
              Supprimer
            </Button>
            
            <GestionElementModule 
             
             codeFiliere={codeFiliere}
             numeroSemestre={numeroSemestre}
             codeModule = {module.codeModule}
            
            />
          </AccordionDetails>
        </Accordion>
      ))}

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
          {ajoutModule && (
            <AjoutBloc>
            <TextField
              label="Numéro de module"
              value={numeroModule}
              onChange={handleNumeroModuleChange}
            />
            <TextField
              label="Nom du module"
              value={nomModule}
              onChange={handleNomModuleChange}
            />
            
              <InputLabel id="respoModule">Responsable</InputLabel>
              <Select
                name="responsable"
                labelId="respoModule"
                value={responsableModule}
                onChange={handleResponsableModuleChange}
                fullWidth
                required
              >
                {nomsProfesseurs.map((nomProfesseur) => (
                          <MenuItem key={Math.floor(Math.random()*10000)+1} value={nomProfesseur.nom + " "+ nomProfesseur.prenom}>
                            {nomProfesseur.nom + " "+ nomProfesseur.prenom}
                          </MenuItem>
                        ))} 
              </Select>
              
            <Button variant="contained"  
            sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
              marginLeft: '10px'
            }}
            onClick= {ajouterModule}>
              Ajouter
            </Button>
            </AjoutBloc>
          )}
          {selectedModule && (
            <AjouterElementdeModule 
            codeModule={selectedModule}
            codeFiliere={codeFiliere}
            numeroSemestre={numeroSemestre}
               />
          )}
          {moduleToEdit && (
            <div>
              <h3>Modifier le module</h3>
              <TextField
                label="Numéro de module"
                value={moduleToEdit.numero}
                onChange={(e) =>
                  setModuleToEdit({
                    ...moduleToEdit,
                    numero: e.target.value,
                  })
                }
              />
              <TextField
                label="Nom du module"
                value={moduleToEdit.nom}
                onChange={(e) =>
                  setModuleToEdit({
                    ...moduleToEdit,
                    nom: e.target.value,
                  })
                }
              />

          <TextField
                  select
                  label="Nom du responsable"
                  value={moduleToEdit.responsable}
                  onChange={(e) =>
                    setModuleToEdit({
                      ...moduleToEdit,
                      responsable: e.target.value,
                    })
                  }
                  required
                >
                  {nomsProfesseurs.map((nomProfesseur) => (
                    <MenuItem key={Math.floor(Math.random()*10000)+1} value={nomProfesseur.nom + " "+ nomProfesseur.prenom}>
                      {nomProfesseur.nom + " "+ nomProfesseur.prenom}
                    </MenuItem>
                  ))}
                </TextField>
              <Button variant="contained" 
              sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
                marginLeft: '10px'
              }}
              onClick={() => handleModifier(moduleToEdit)}>
                Enregistrer
              </Button>
            </div>
          )}
        </Box>
      </Modal>
      </AffichageBloc>
      
      </Container>
    </div>
  );
};

export default GestionModule;

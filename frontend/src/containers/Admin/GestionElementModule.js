import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useTheme } from '@mui/material/styles';
import {
  Button,
  TextField,
  Modal,
  Box,
  MenuItem,
} from "@mui/material";


const GestionElementModule = ({ codeFiliere, numeroSemestre ,codeModule}) => {
  const theme = useTheme();
  
    const [modalOpen, setModalOpen] = useState(false);
  const [modules, setElementModule] = useState([]);
  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [nomsProfesseurs, setNomsProfesseurs] = useState([]);
  const fetchProf = async () => {
    try {
      const response = await axios.get("https://indiapfa.pythonanywhere.com/api/GetTeacher/");
      setNomsProfesseurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modules :", error);
    }
  };
  useEffect(() => {
    

    fetchProf();
  }, []);

  const fetchElementModule = async () => {
    await axios
      .get(`https://indiapfa.pythonanywhere.com/api/GetEModule/?codeFiliere=${codeFiliere}&numeroSemestre=${numeroSemestre}`)
      .then((response) => {
        setElementModule(response.data)
         // Actualiser la liste des semestres
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchElementModule();
  }, [codeFiliere, numeroSemestre, codeModule]);

  const handleSupprimerModule = (moduleId) => {
    console.log(`Supprimer le module avec l'ID ${moduleId}`);
    axios
        .delete(
          "https://indiapfa.pythonanywhere.com/api/DeleteSemestre/",{moduleId, codeFiliere,numeroSemestre ,codeModule}
        )
        .then((response) => {
          fetchElementModule(); // Actualiser la liste des semestres
          setModalOpen(false);
          //setSelectedSemestre(null);
        })
        .catch((error) => {
          console.log(error);
        });
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
    fetchElementModule();
    setModuleToEdit(null);
    setModalOpen(false);
  };
  function getNomPrenomByEmail(data, email) {
    const found = data.find((item) => item.email === email);
    return found ? (found.nom + " " + found.prenom) : null;
  }
  
  return (
    <div>
      <h2>Elements de Module</h2>

      {modules.map((module) => (
        <div key={Math.floor(Math.random()*10000)+1} style={{ marginTop: "10px" }}>
            <h3>{`Module ${module.codeEModule}`} </h3>
            <div>
              <p>Nom du module: {module.nomEModule}</p>
              <p>Responsable: {getNomPrenomByEmail(nomsProfesseurs,module.responsable)}</p>
            </div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
              }}
              onClick={() => handleModifierModule(module.id)}
              
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSupprimerModule(module.id)}
              sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
                marginLeft: '10px'
              }}
            >
              Supprimer
            </Button>
          
        </div>
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
              <Button variant="contained" onClick={() => handleModifier(moduleToEdit)}>
                Enregistrer
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default GestionElementModule;

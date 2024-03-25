import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from '../../axios';
import {  ADD_SEANCE } from '../../Routes';
import { useTheme } from '@mui/material/styles';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,FormControl,FormLabel, Paper,TextField,Modal ,Box} from '@mui/material';
const Seance = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const code = location.state && location.state.code;
  const codeModule = location.state && location.state.codeModule;
  const filiere = location.state && location.state.filiere;

  const semestre = location.state && location.state.semestre;

  const [seances, setSeances] = useState([]);

  useEffect(() => {
    axios
  
    .get(`https://indiapfa.pythonanywhere.com/api/GetSeance/?codeElement=${code}&codeModule=${codeModule}&codeFiliere=${filiere}&numeroSemestre=${semestre}`)
    .then((response) => {
      setSeances(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [seanceForm, setSeanceForm] = useState({
    
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (event) => {
    setSeanceForm({
      ...seanceForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSeance = async () => {
    // Effectue l'appel à l'API pour ajouter la séance avec les informations de seanceForm


    const SeanceData = {
      date: seanceForm.date,
  heure: seanceForm.heure,
      code_emodule: code,
      codeModule: codeModule,
    codeFiliere: filiere,
    codeSemestre : semestre,
    }

    try {
      console.log(SeanceData);
      await axios.post(ADD_SEANCE, SeanceData);
    } catch (error) {  
      console.error("Erreur lors de l'ajout du module :", error);
    }
  
    // ...
    // Une fois la séance ajoutée avec succès, met à jour la liste des séances
    setSeances([...seances, seanceForm]);
    handleCloseModal();
  };
  const handleMarquerAbsence = (date, heure) => {
    navigate('/marquerAbsence', { state: { codeElement : code, codeModule: codeModule , filiere : filiere
    , date : date, heure :heure, semestre : semestre} });
  };
  const handleConsulterAbsence = (date, heure) => {
    navigate('/consulterAbsences',  { state: { codeElement : code, codeModule: codeModule , filiere : filiere
      , date : date, heure : heure, semestre : semestre} });
  };
  const handleModifierAbsence = () => {
    navigate('/modifierAbsence', { state: { codeModule: seances.codeModule } });
  };



  const handleDeleteSeance = (id) => {
    // Logique pour supprimer une séance avec l'ID donné
  };
 
  
  
  return (
    <div>
      <h2>Liste des séances</h2>
      <Button variant="outlined"
       sx={{
        backgroundColor: theme.palette.bg.main,
        color: theme.palette.gold.main,
        marginLeft: '10px'
      }}
       onClick={handleOpenModal}>
        Ajouter une séance
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heure</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {seances.map((seance) => (
              <TableRow key={seance.date}>
                <TableCell>{seance.date}</TableCell>
                <TableCell>{seance.heure}</TableCell>
                
                <TableCell>
                <Button style = {{marginRight:"20px"}} variant="outlined" 
                 sx={{
                  backgroundColor: theme.palette.bg.main,
                  color: theme.palette.gold.main,
                  marginLeft: '10px'
                }}
                onClick={() => handleMarquerAbsence(seance.date, seance.heure)}>
                    MarquerAbsence
                  </Button>
                  <Button style ={{marginRight:"20px"}} variant="outlined"
                   sx={{
                    backgroundColor: theme.palette.bg.main,
                    color: theme.palette.gold.main,
                    marginLeft: '10px'
                  }}
                   onClick={() => handleModifierAbsence(seance.id)}>
                    Modifier absence
                  </Button>
                  <Button style ={{marginRight:"20px"}} variant="outlined"
                   sx={{
                    backgroundColor: theme.palette.bg.main,
                    color: theme.palette.gold.main,
                    marginLeft: '10px'
                  }}
                   onClick={() => handleConsulterAbsence(seance.date, seance.heure)}>
                    Consulter
                  </Button>
                  <Button style ={{marginRight:"20px"}} variant="outlined" 
                   sx={{
                    backgroundColor: theme.palette.bg.main,
                    color: theme.palette.gold.main,
                    marginLeft: '10px'
                  }}
                  onClick={() => handleDeleteSeance(seance.id)}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
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
        <div>
          <h2>Ajouter une séance</h2>
          <form>
              <FormControl fullWidth margin="normal" required>
                <FormLabel>Code Filière</FormLabel>
                <TextField
                name="date"
                label="Date"
                type="date"
                value={seanceForm.date}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />

              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <FormLabel>Code Filière</FormLabel>
                <TextField
                name="heure"
                label="Heure"
                type="time"
                value={seanceForm.heure}
                onChange={handleFormChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </FormControl>
              
                
              
            <Button variant="outlined" 
             sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
              marginLeft: '10px'
            }}
            onClick={handleAddSeance}>
              Ajouter
            </Button>
            <Button variant="outlined" 
             sx={{
              backgroundColor: theme.palette.bg.main,
              color: theme.palette.gold.main,
              marginLeft: '10px'
            }}
            onClick={handleCloseModal}>
              Annuler
            </Button>
          </form>
        </div>
        </Box>
      </Modal>
      
    </div>
  );
};

export default Seance;

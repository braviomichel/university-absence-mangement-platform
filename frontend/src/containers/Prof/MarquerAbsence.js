import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import axios from '../../axios';
import { ADD_ABSENCE } from '../../Routes';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const MarquerAbsence = () => {
  const theme = useTheme();
  const location = useLocation();
  const codeModule = location.state && location.state.codeModule;
  const codeElement = location.state && location.state.codeElement;
  const filiere = location.state && location.state.filiere;
  const date = location.state && location.state.date;
  const heure = location.state && location.state.heure;
  const semestre = location.state && location.state.semestre;
  const [etudiants, setEtudiants] = useState([]);

  useEffect(() => {
    fetchEtudiants();
  }, []);
  
  const fetchEtudiants = () => {
    axios
      .get(`https://indiapfa.pythonanywhere.com/api/GetEtudiantsParFiliere/?codeFiliere=${filiere}`)
      .then((response) => {
        // Initialisez chaque étudiant avec une valeur par défaut pour le commentaire
        const initialEtudiants = response.data.map((etudiant) => ({
          ...etudiant,
          commentaire: '',
        }));
        setEtudiants(initialEtudiants);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  const handleToggleAbsence = (id) => {
    setEtudiants((prevEtudiants) =>
      prevEtudiants.map((etudiant) =>
        etudiant.nom === id ? { ...etudiant, absence: !etudiant.absence } : etudiant
      )
    );
  };

  const handleCommentChange = (id, commentaire) => {
    setEtudiants((prevEtudiants) =>
      prevEtudiants.map((etudiant) =>
        etudiant.nom === id ? { ...etudiant, commentaire } : etudiant
      )
    );
  };

  const handleSubmit =async  () => {
    // Créer l'objet à envoyer au backend
    const data = {
      codeFiliere: filiere,
      codesemester: semestre,
      codeModule: codeModule,
      codeEModule: codeElement,
      dateSeance: date,
      heureSeance: heure,
      listeEtudiants: etudiants.map((etudiant) => ({
        mail: etudiant.email,
        commentaire: etudiant.commentaire,
        absence: etudiant.absence,
      })),
    };


    try {
     
      await axios.post(ADD_ABSENCE, data);
      console.log("sucess");
    } catch (error) {   
      console.error("Erreur lors de l'enregistrement de absences :", error);
    }
  
    console.log(data); // Affichage de l'objet dans la console (pour vérification)
  };

  return (
    <div>
      <h2>Marquer l'absence des étudiants</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Absent</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {etudiants.map((etudiant) => (
              <TableRow key={etudiant.nom}>
                <TableCell>{etudiant.nom}</TableCell>
                <TableCell>{etudiant.prenom}</TableCell> 
                <TableCell>
                  <Button
                    variant={etudiant.absence ? 'contained' : 'outlined'}
                    onClick={() => handleToggleAbsence(etudiant.nom)}
                  >
                   {etudiant.absence ? 'Oui' : 'Non'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Select
                    value={etudiant.commentaire}
                    onChange={(e) => handleCommentChange(etudiant.nom, e.target.value)}
                    disabled={!etudiant.absence}
                    fullWidth
                  >
                    <MenuItem value="">Non justifié</MenuItem>
                    <MenuItem value="Permission">Permission</MenuItem>
                    <MenuItem value="Malade">Malade</MenuItem>
                    <MenuItem value="Autre">Autre</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" 
       sx={{
        backgroundColor: theme.palette.bg.main,
        color: theme.palette.gold.main,
        marginLeft: '10px'
      }}
      onClick={handleSubmit}>
        Enregistrer les absences
      </Button>
    </div>
  );
};

export default MarquerAbsence;

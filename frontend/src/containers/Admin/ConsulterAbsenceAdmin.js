import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';

const ConsulterAbsenceAdmin = () => {
  
  const [absence, setAbsence] = useState([]);
  const theme = useTheme();
  const location = useLocation();
  const code = location.state && location.state.codeElement;
  const codeModule = location.state && location.state.codeModule;
  const filiere = location.state && location.state.filiere;
  const date = location.state && location.state.date;
  const heure = location.state && location.state.heure;
  const semestre = location.state && location.state.semestre;
  const { emailAdress } = useSelector((state) => state.auth.userInfos);

  useEffect(() => {
    axios
  
    .get(`https://indiapfa.pythonanywhere.com/api/GetAbsenceProf/?emailProf=${emailAdress}&codeElement=${code}&codeModule=${codeModule}&codeSemestre=${semestre}&codeFiliere=${filiere}&dateSeance=${code}&heureSeance=${code}`)
    .then((response) => {
      console.log(response.data);
      setAbsence(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);



  return (
    <div>
      <h2>Absences des étudiants pour la séance du {date} à {heure} heure</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Absence</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {absence.map(abs => (
              <TableRow key={abs.id}>
                <TableCell>{abs.nom}</TableCell>
                <TableCell>{abs.prenom}</TableCell>
                <TableCell>{abs.absence}</TableCell>
                <TableCell>{abs.commentaire}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  );
};

export default ConsulterAbsenceAdmin;

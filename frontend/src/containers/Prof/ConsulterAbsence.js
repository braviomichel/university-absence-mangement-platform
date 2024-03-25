import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';

const ConsulterAbsence = () => {
  
  const [absence, setAbsence] = useState([]);
  const location = useLocation();
  const code = location.state && location.state.codeElement;
  const codeModule = location.state && location.state.codeModule;
  const filiere = location.state && location.state.filiere;
  const date = location.state && location.state.date;
  const heure = location.state && location.state.heure;
  const semestre = location.state && location.state.semestre;
  const { emailAdress } = useSelector((state) => state.auth.userInfos);
  const [noms, setNoms] = useState([]);

  

  useEffect(() => {
    axios
  
    .get(`https://indiapfa.pythonanywhere.com/api/GetAbsenceProf/?emailProf=${emailAdress}&codeElement=${code}&codeModule=${codeModule}&codeSemestre=${semestre}&codeFiliere=${filiere}&dateSeance=${date}&heureSeance=${heure}`)
    .then((response) => {
      console.log(response.data);
      setAbsence(response.data);
      console.log(emailAdress, code, codeModule,filiere,semestre,date, heure)
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const getNames = async (mail) => {
    try {
      const response = await axios.get("GetStudentByMail/", mail);
      const Names = response.data;
      setNoms(prevNoms => [...prevNoms, Names.nom]);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    absence.forEach(abs => {
      getNames(abs.mail);
    });
  }, [absence]);
  
    



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
  {absence.map((abs, index) => (
    <TableRow key={abs.mail}>
      <TableCell>{abs.mail}</TableCell>
      <TableCell>{noms[index]}</TableCell>
      <TableCell>{String(abs.absence)}</TableCell>
      <TableCell>{abs.commentaire}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      
    </div>
  );
};

export default ConsulterAbsence;

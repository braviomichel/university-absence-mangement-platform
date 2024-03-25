import React, { useState,useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

import axios from '../../axios';

import { useSelector } from 'react-redux';


const EtudiantAbsences = ({ codeFiliere, numeroSemestre }) => {

  const [absences, setAbsences] = useState([]);
  const { emailAdress } = useSelector((state) => state.auth.userInfos);
  
  const fetchAbsences = async () => {
   
    try {
      const response = await axios.get(`https://indiapfa.pythonanywhere.com/api/GetAbsenceEtud/?emailEtud=${emailAdress}&codeSemestre=${numeroSemestre}&codeFiliere=${codeFiliere}`
      );
      setAbsences(response.data);
      console.log(response.data);
      

    } catch (error) {
      console.error("Erreur lors de la récupération des mabse,ces :", error);
    }
  };

 
  useEffect(() => {
    fetchAbsences();
  }, []);

  return (
    <div>
     

      <Box mt={2}>
        <Grid container spacing={2}>
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heure</TableCell>
              <TableCell>codeElementModule</TableCell>
              <TableCell>CodeModule</TableCell>
              <TableCell>Absence</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {absences.map((abs, index) => (
    <TableRow key={abs.date}>
      <TableCell>{abs.date}</TableCell>
      <TableCell>{abs.heure}</TableCell>
      <TableCell>{abs.e_module}</TableCell>
      <TableCell>{abs.module}</TableCell>
      <TableCell>{abs.absence  ? 'OUI' : 'NON'}</TableCell>
      <TableCell>{abs.commentaire}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
        </Grid>
      </Box>
    </div>
  );
};

export default EtudiantAbsences;

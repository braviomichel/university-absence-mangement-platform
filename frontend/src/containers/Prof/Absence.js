import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Absence = () => {
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    // Données fictives pour le test
    const tempData = [
      {
        id: 1,
        etudiant: {
          nom: 'Doe',
          prenom: 'John',
        },
        presence: false,
        absenceJustifiee: false,
        commentaire: '',
      },
      {
        id: 2,
        etudiant: {
          nom: 'Smith',
          prenom: 'Jane',
        },
        presence: true,
        absenceJustifiee: true,
        commentaire: 'Raison de l\'absence',
      },
    ];

    setAbsences(tempData);
    // Effectuer une requête à l'API pour récupérer les absences
    // axios.get('/api/absences')
    //   .then(response => {
    //     setAbsences(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Erreur lors de la récupération des absences:', error);
    //   });
  }, []);

  return (
    <div>
      <h2>Liste des absences</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Présence</TableCell>
              <TableCell>Absence justifiée</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {absences.map(absence => (
              <TableRow key={absence.id}>
                <TableCell>{absence.etudiant.nom}</TableCell>
                <TableCell>{absence.etudiant.prenom}</TableCell>
                <TableCell>{absence.presence ? 'Présent' : 'Absent'}</TableCell>
                <TableCell>{absence.absenceJustifiee  ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{absence.commentaire}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Absence;

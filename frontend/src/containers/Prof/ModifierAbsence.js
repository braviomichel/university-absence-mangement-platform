import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

const ModifierAbsence = () => {
  const [etudiants, setEtudiants] = useState([
    {
      id: 1,
      nom: 'Doe',
      prenom: 'John',
      absence: false,
      commentaire: '',
    },
    {
      id: 2,
      nom: 'Smith',
      prenom: 'Jane',
      absence: false,
      commentaire: '',
    },
    // Ajoute d'autres étudiants si nécessaire
  ]);

  const handleToggleAbsence = (id) => {
    setEtudiants(prevEtudiants => (
      prevEtudiants.map(etudiant => (
        etudiant.id === id ? { ...etudiant, absence: !etudiant.absence } : etudiant
      ))
    ));
  };

  const handleCommentChange = (id, commentaire) => {
    setEtudiants(prevEtudiants => (
      prevEtudiants.map(etudiant => (
        etudiant.id === id ? { ...etudiant, commentaire } : etudiant
      ))
    ));
  };

  const handleSaveChanges = () => {
    // Envoyer les modifications des absences à l'API
    // ...
  };

  return (
    <div>
      <h2>Modifier les absences des étudiants</h2>
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
            {etudiants.map(etudiant => (
              <TableRow key={etudiant.id}>
                <TableCell>{etudiant.nom}</TableCell>
                <TableCell>{etudiant.prenom}</TableCell>
                <TableCell>
                  <Button variant={etudiant.absence ? 'contained' : 'outlined'} onClick={() => handleToggleAbsence(etudiant.id)}>
                    {etudiant.absence ? 'Oui' : 'Non'}
                  </Button>
                </TableCell>
                <TableCell>
                  <TextField
                    value={etudiant.commentaire}
                    onChange={(e) => handleCommentChange(etudiant.id, e.target.value)}
                    disabled={!etudiant.absence}
                    fullWidth
                    multiline
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleSaveChanges}>
        Enregistrer les modifications
      </Button>
    </div>
  );
};

export default ModifierAbsence;

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, AppBar, Tabs, Tab } from '@mui/material';

const StudentDashboard = () => {
  const [courseFilter, setCourseFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [activeSemester, setActiveSemester] = useState(0); // Indice du semestre actif

  const semesters = ['Semestre 1', 'Semestre 2', 'Semestre 3']; // Liste des semestres

  // Données fictives représentant les absences par semestre
  const absencesBySemester = [
    [
      { course: 'Mathématiques', professor: 'M. Dupont', time: '8h30', date: '2023-05-18' },
      { course: 'Physique', professor: 'Mme. Martin', time: '9h45', date: '2023-05-19' },
    ],
    [
      { course: 'Histoire', professor: 'M. Dubois', time: '10h30', date: '2023-05-20' },
      // Ajoute ici d'autres données fictives d'absences pour le semestre 2
    ],
    [
      // Ajoute ici d'autres données fictives d'absences pour le semestre 3
    ]
  ];

  const filteredAbsences = absencesBySemester[activeSemester].filter((absence) => {
    return absence.course.toLowerCase().includes(courseFilter.toLowerCase()) &&
           absence.date.includes(dateFilter);
  });

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={activeSemester}
          onChange={(event, newValue) => setActiveSemester(newValue)}
          aria-label="Semesters"
        >
          {semesters.map((semester, index) => (
            <Tab key={index} label={semester} />
          ))}
        </Tabs>
      </AppBar>
      <h1>Tableau des absences - {semesters[activeSemester]}</h1>
      <TextField
        label="Filtrer par cours"
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
      />
      <TextField
        label="Filtrer par date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du cours</TableCell>
              <TableCell>Prof en charge</TableCell>
              <TableCell>Heure</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAbsences.map((absence, index) => (
              <TableRow key={index}>
                <TableCell>{absence.course}</TableCell>
                <TableCell>{absence.professor}</TableCell>
                <TableCell>{absence.time}</TableCell>
                <TableCell>{absence.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudentDashboard;

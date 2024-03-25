import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  // Données factices pour les graphiques
  const moduleStatsData = {
    labels: ['Module A', 'Module B', 'Module C', 'Module D', 'Module E'],
    series: [30, 20, 15, 25, 18],
  };

  const studentStatsData = {
    labels: ['Étudiant 1', 'Étudiant 2', 'Étudiant 3', 'Étudiant 4', 'Étudiant 5'],
    series: [8, 12, 5, 10, 7],
  };

  const branchStatsData = {
    labels: ['Filière A', 'Filière B', 'Filière C', 'Filière D', 'Filière E'],
    series: [50, 40, 30, 35, 42],
  };

  const trendsData = {
    labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4', 'Semaine 5'],
    series: [10, 15, 12, 18, 14],
  };

  const topStudentsData = {
    labels: ['Étudiant 1', 'Étudiant 2', 'Étudiant 3', 'Étudiant 4', 'Étudiant 5'],
    series: [20, 18, 15, 22, 17],
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h4">Statistiques globales</Typography>
          {/* Afficher les statistiques globales */}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h4">Statistiques par module</Typography>
          {/* Afficher la liste des modules avec les statistiques */}
          <Chart
            options={{ labels: moduleStatsData.labels }}
            series={moduleStatsData.series}
            type="bar"
            width="100%"
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h4">Statistiques par étudiant</Typography>
          {/* Afficher la liste des étudiants avec les statistiques */}
          <Chart
            options={{ labels: studentStatsData.labels }}
            series={studentStatsData.series}
            type="pie"
            width="100%"
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h4">Statistiques par filière</Typography>
          {/* Afficher la liste des filières avec les statistiques */}
          <Chart
            options={{ labels: branchStatsData.labels }}
            series={branchStatsData.series}
            type="bar"
            width="100%"
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper>
          <Typography variant="h4">Tendances temporelles</Typography>
          {/* Afficher un graphique linéaire montrant l'évolution des absences */}
          <Chart
            options={{ labels: trendsData.labels }}
            series={[{ data: trendsData.series }]}
            type="line"
            width="100%"
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper>
          <Typography variant="h4">Statistiques sur les absences justifiées et non justifiées</Typography>
          {/* Afficher les statistiques sur les absences justifiées et non justifiées */}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper>
          <Typography variant="h4">Top des étudiants les plus absents</Typography>
          {/* Afficher le classement des étudiants les plus absents */}
          <Chart
            options={{ labels: topStudentsData.labels }}
            series={topStudentsData.series}
            type="bar"
            width="100%"
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
 
export default Dashboard;

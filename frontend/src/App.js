import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import LoginPage from './containers/Login/LoginPage';
import AddStudentsPage from './containers/Admin/AddStudentsPage';
import { BrowserRouter as Router  } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./App.css";
import FirstLoginPage from './containers/Login/FirstLoginPage';
import DashboardEtudiant from "./containers/Student/DashboardEtudiant";
import GestionFilieres from "./containers/Admin/GestionFilieres";
import GestionSemestre from "./containers/Admin/GestionSemestre";
import AjouterElementdeModule from "./containers/Admin/AjouterElementdeModule";
import GestionModule from "./containers/Admin/GestionModule";
import AddProf from "./containers/Admin/AddProf";
import ProfModules from "./containers/Prof/ProfModules";
import Seance from "./containers/Prof/Seance";
import Absence from "./containers/Prof/Absence";
import MarquerAbsence from "./containers/Prof/MarquerAbsence";
import ModifierAbsence from "./containers/Prof/ModifierAbsence";

import Dashboard from "./containers/Admin/Dashboard";
import ConsulterAbsence from './containers/Prof/ConsulterAbsence';
import GestionSemestreAbsence from './containers/Etudiants/GestionSemestreAbsence';



const theme = createTheme({
  typography : {
    body1 : {
      fontSize : '20px',
    }

  },
  palette: {
    primary: {
      main: '#1e88e5', // Couleur principale
    },
    secondary: {
      main: '#000', // Couleur secondaire
    },
    default :  {
      main: '#fff', // Couleur secondaire
    },
    bg : {
      main : "#002349"
    },
    button : {
      main : "#F5810F"
    },
    accordion : {
      main: "#B7CDE6"
    },
    gold:{
      main: "#957C3D"
    }

  },
});



function App() {
console.log(useSelector((state)=>state.auth.role))

  const firstAuthentication = useSelector((state) => state.auth.firstAuthentication)
  const authenticated = useSelector((state) => state.auth.authenticated)
 //  const role = "professeur";
 // console.log(role);
  const role = useSelector((state) => state.auth.userInfos.role)
  //const role ="admin"
  const [isAuth,setIsAuth] = useState(false) 
  useEffect(() => {
    setIsAuth(authenticated)
    },[authenticated])

 
// const Unauthorized = () => {
//   // Redirection vers une page d'accès non autorisé
//   return <Navigate to="/unauthorized" />;
// };

const userRoutes = {
  etudiant: [
    
    { path: "/consulterAbsence", component: <GestionSemestreAbsence /> },
    { path: "/etudiant", component: <DashboardEtudiant /> },
    { path: "/absence", component: <Absence /> },

  ],

  professeur: [
    
    { path: "/seance", component: <Seance /> },
    { path: "/profmodule", component: <ProfModules/> },
    { path: "/marquerAbsence", component: <MarquerAbsence /> },
    { path: "/modifierAbsence", component: <ModifierAbsence /> },
    { path: "/consulterAbsences", component: <ConsulterAbsence /> }
  ],
  admin: [
   
    { path: "/add-student", component: <AddStudentsPage /> },
    { path: "/filiere", component: <GestionFilieres /> },
    { path: "/semestres", component: <GestionSemestre />},
    { path: "/addmodule", component: <AjouterElementdeModule /> },
    { path: "/module", component:<GestionModule />},
    { path: "/add-student", component: <AddStudentsPage /> },
    
    { path: "/addprof", component: <AddProf /> },
  ],
};

const getUserRoutes = (role) => {
  return userRoutes[role] || [];
};

const renderUserRoutes = (role) => {
  const routes = getUserRoutes(role);
  if (routes.length === 0) {
    // Gérer le cas où le rôle de l'utilisateur est inconnu
    //return <Unauthorized />;
  }
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.component} />
  ));
};

  return ( 


    <ThemeProvider theme={theme}>
    <Router>


    <div className="app-container">
        <Header />
        <div className="content-container">
          <Sidebar/>
          <div className="main-content">
            <Routes>
            {/* <Route path="/" element={<LandingPage />} /> */}
              
                 {isAuth && firstAuthentication ? (
                  <>
                    <Route path="/firstLoginPage" element={<FirstLoginPage />} />
                    {/* <Route path="/" element={<FirstLoginPage replace />} /> */}
                  </>
                ) : (
                  <Route path="/" element={<LoginPage />} />
                )}
          
                {isAuth && renderUserRoutes(role)}

                {/* <Route path="/login" element={<LoginPage />} /> */}
          
                <Route path="/dashboard" element={<Dashboard />} />
          
                {/* Redirection vers une page d'accès non autorisé
                <Route path="/unauthorized" element={<Unauthorized />} /> */}

              
                <Route path="/" element={<LoginPage />} />
               
               
            </Routes> 
          </div>
        </div>
        <Footer />
      </div>


    </Router>
    
    </ThemeProvider>
   
 
  ); 
}

export default App;
 

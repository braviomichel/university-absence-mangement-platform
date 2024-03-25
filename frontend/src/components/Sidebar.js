import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useNavigate } from "react-router-dom";
import {  useSelector } from 'react-redux';



const StyledSidebar = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "250px",
    backgroundColor: theme.palette.bg.main,
    color: theme.palette.primary.contrastText,
  },
}));

const Sidebar = () => {

  const role = useSelector((state) => state.auth.userInfos.role)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarTitle = "Menu";
  const sidebarItems = getSidebarItems(role);

  function getSidebarItems(role) {
    switch (role) {
      case "admin":
        return [
          { icon: <DashboardIcon />, text: "Tableau de bord", path: "/dashboard" },
          { icon: <AddIcon />, text: "Ajouter Étudiant", path: "/add-student" },
          { icon: <PersonAddIcon />, text: "Ajouter Prof", path: "/addprof" },
          { icon: <SettingsIcon />, text: "Paramètres", path: "/settings" },
          { icon: <PersonAddIcon />, text: "Gestion de Filieres",path: "/filiere" },
          { icon: <PersonAddIcon />, text: "Consulter Absence",path: "/adminAbsence", },




        ];
      case "etudiant":
        return [
          { icon: <DashboardIcon />, text: "Tableau de bord", path: "/dashboard" },
          { icon: <ScheduleIcon />, text: "Consulter Absence", path: "/consulterAbsence" },
          { icon: <SettingsIcon />, text: "Paramètres", path: "/absence" },
        ];
      case "professeur":
        return [
          { icon: <DashboardIcon />, text: "Tableau de bord", path: "/dashboard" },
          { icon: <DashboardIcon />, text: "Modules", path: "/profModule" },
          { icon: <ScheduleIcon />, text: "Consulter Absence", path: "/absences" },
          { icon: <SettingsIcon />, text: "Paramètres", path: "/settings" },
        ];
        case "ano":
        return [
          { icon: <SettingsIcon />, text: "ENSAM", path: "/settings" },
          { icon: <ScheduleIcon />, text: "InfosUtiles", path: "/absences" },
          { icon: <SettingsIcon />, text: "Se Connecter", path: "/settings" },
          { icon: <SettingsIcon />, text: "Se Décoonnecter", path: "/settings" },
          
        ];
      default:
        return [];
    }
  }

  const handleSidebarItemClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open sidebar"
        onClick={handleToggleSidebar}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <StyledSidebar
        variant="persistent"
        anchor="left"
        open={isOpen}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <List>
          <ListItem disablePadding>
            <ListItemText>
              <Typography variant="h6">{sidebarTitle}</Typography>
            </ListItemText>
          </ListItem>
          <Divider />
          {sidebarItems.map((item, index) => (
            <ListItem button key={index} onClick={() => handleSidebarItemClick(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </StyledSidebar>
    </>
  );
};

export default Sidebar;

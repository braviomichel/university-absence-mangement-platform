import React from "react";
import { styled } from "@mui/system";
import { Button, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { disconnectUser } from '../Store/actions/AuthActions';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";

const StyledHeader = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: theme.palette.bg.main,
}));

const StyledLinkButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginLeft: "auto",
}));

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(disconnectUser());
    navigate("/");
  };

  return (
    <StyledHeader>
       <img src="https://media.licdn.com/dms/image/C561BAQEK7NjqJHeGOA/company-background_10000/0/1624307160346?e=1689246000&v=beta&t=ZM1MBPsJj_IkXdzLTnUw3kK747Pj9Jbsu-qz1Mt7-0o" 
       alt="Logo" 
       width={100}
       height={70}/> {/* Insérer votre image ici */}
      <StyledLinkButton component={Link} to="/" >
        <HomeIcon />
        Accueil
      </StyledLinkButton>
      <StyledLinkButton component={Link} to="/my-info" >
        <InfoIcon />
        Informations
      </StyledLinkButton>
      <LogoutButton onClick={handleLogout}>
        <LogoutIcon />
        Déconnexion
      </LogoutButton>
    </StyledHeader>
  );
}

export default Header;

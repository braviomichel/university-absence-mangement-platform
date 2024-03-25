import React from "react";
import { styled } from "@mui/system";
import { Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const StyledFooter = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.bg.main,
  color: theme.palette.primary.contrastText,
  padding: "16px",
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  gap: "16px",
  margin: "auto",
  maxWidth: "960px",
}));

const Footer = () => {
  return (
    <StyledFooter>
      <StyledGrid container justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Liens utiles
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <Link component={RouterLink} to="/about" color="inherit">
              À propos de nous
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <Link component={RouterLink} to="/contact" color="inherit">
              Contactez-nous
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <Link
              href="https://www.example.com"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              Site officiel de l'université
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" align="center">
            Adresse de l'école, Ville, Pays
          </Typography>
        </Grid>
      </StyledGrid>
    </StyledFooter>
  );
};

export default Footer;

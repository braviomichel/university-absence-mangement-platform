import React, { useState,useEffect } from "react";
import { Button, TextField, Box, Typography, MenuItem } from "@mui/material";
import axios from "../../axios";
import { ADD_ELEMENT_MODULE } from "../../Routes";

const AjouterElementdeModule = ({ codeFiliere, numeroSemestre ,codeModule}) => {
  const [codeElement, setCodeElement] = useState("");
  const [nomElement, setNomElement] = useState("");
  const [nomResponsable, setNomResponsable] = useState("");
  const [nomsProfesseurs, setNomsProfesseurs] = useState([]); // Tableau de noms de professeurs

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const response = await axios.get("https://indiapfa.pythonanywhere.com/api/GetTeacher/");
        setNomsProfesseurs(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des modules :", error);
      }
    };

    fetchProf();
  }, []);
  function getEmailByNomPrenom(data, nomPrenom) {
    const found = data.find((item) => (item.nom + " " + item.prenom) === nomPrenom);
    return found ? found.email : null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
//console.log(codeFiliere)
    const nouveauModuleObj = {
      codefiliere: codeFiliere,
  numeroSemestre: numeroSemestre,
  codeModule: codeModule,
  codeElementModule: codeElement,
  NomElementModule: nomElement,
  ResponsabeElementModule: getEmailByNomPrenom(nomsProfesseurs, nomResponsable),
    }
    try {

      await axios
      .post(
        ADD_ELEMENT_MODULE,
        nouveauModuleObj
      )
      .then((response) => {
        
         // Actualiser la liste des semestres
      })
      .catch((error) => {
        console.log(error);
      });
  
      // const response = await axios.post("URL_DE_VOTRE_API", {
      //   codeFiliere : codeFiliere,
      //   numeroSemestre : numeroSemestre,
      //   codeModule : codeModule,
      //   codeElement : codeElement,
      //   nomElement : nomElement ,
      //   nomResponsable: nomResponsable,
      // });

      // console.log(response.data);

      // Réinitialiser les champs après la soumission réussie
      setCodeElement("");
      setNomElement("");
      setNomResponsable("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <Typography variant="h5" gutterBottom>
        Ajouter un élément de module
      </Typography>
      <TextField
        label="Code de l'élément"
        value={codeElement}
        onChange={(event) => setCodeElement(event.target.value)}
        required
      />
      <TextField
        label="Nom de l'élément"
        value={nomElement}
        onChange={(event) => setNomElement(event.target.value)}
        required
      />
      <TextField
        select
        label="Nom du responsable"
        value={nomResponsable}
        onChange={(event) => setNomResponsable(event.target.value)}
        required
      >
        {nomsProfesseurs.map((nomProfesseur) => (
          <MenuItem key={Math.floor(Math.random()*10000)+1} value={nomProfesseur.nom + " "+ nomProfesseur.prenom}>
            {nomProfesseur.nom + " "+ nomProfesseur.prenom}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" type="submit">
        Ajouter
      </Button>
    </Box>
  );
};

export default AjouterElementdeModule;

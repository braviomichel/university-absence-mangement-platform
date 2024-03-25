import React, { useState } from "react";
import * as XLSX from "xlsx";
import DownloadButton from "./DownloadButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, Grid } from "@mui/material";
import { TableContainer,Modal, Box,Snackbar, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from "../../axios";
import { ADD_PROF } from "../../Routes";



export default function AddButton(props) {
  
  const [notificationOpen, setNotificationOpen] = useState(false);
 
  const [notificationMessage, setNotificationMessage] = useState("");
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState(null);
  
  const handleOnChange = async (e) => {
    let dataFinal = [];
    const file = e.target.files[0];

    setFileName(file.name);
    const readOpts = {
      cellText: false,
      cellDates: true,
    };
    const jsonOpts = {
      header: 0,
      defval: "",
      blankrows: true,
      raw: false,
      dateNF: 'd"/"mm"/"yyyy',
    };
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, readOpts);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, jsonOpts);
    dataFinal = jsonData.filter(
      (row) =>
        row.email !== "" 
    );
    setRows(dataFinal);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setRows(null)
    setFileName(null)   
    setModalOpen(false);
  };




  
  const extractEmails = (emailsArray) => {
    const emails = emailsArray.map(obj => obj.email.trim());
    return emails;
  };
  
  const handleAjouterList = async () => {
    
   
    const sentEmails = {
      liste_email: extractEmails(rows),
    }
 
    try {
     
      
      const response = await axios.post(ADD_PROF,sentEmails );
      if (response.status===200){
       
      setNotificationMessage("Les profs ont été ajoutés avec succès !");
      }
      
    } catch (error) {
      console.error(error);
    
      setNotificationMessage(
        "Une erreur s'est produite lors de l'ajout des profs. Veuillez réessayer."
      );
    }
  
    setNotificationOpen(true);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };




  return (
    <>
    <Typography variant="h4" align="center" gutterBottom>
        Ajouter  Via Excel
      </Typography>
          
      <Grid container justifyContent="center" alignItems="center">
  <form>
    <Grid item xs={12} >
      <DownloadButton />
    </Grid>
    <Grid item xs={12} >
      {fileName && (
        <p>
          Fichier : <span>{fileName}</span>
        </p>
      )}
      <input
        onChange={(e) => handleOnChange(e)}
        style={{ display: "none" }}
        accept=".xlsx"
        id="contained-button-file"
        multiple={false}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          fullWidth
          startIcon={<CloudUploadIcon />}
          component="span"
          sx={{
            backgroundColor: theme.palette.bg.main,
            color: theme.palette.gold.main,
            marginBottom: '10px'
          }}
        >
          Chargez la liste Remplie
        </Button>
      </label>
    </Grid>
  </form>
</Grid>


          <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          
            <Grid item xs={12}>
            {fileName && rows &&
            <>
            <Typography variant="h2" align="center"> Listes des Mail</Typography>
             <TableContainer component={Paper}>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell>Email</TableCell>                
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {rows.map((row) => (
                     <TableRow key={Math.floor(Math.random()*10000)+1}>
                       <TableCell>{row.email}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
             </>
             }
             <Button
              variant="contained"
              onClick={() => handleAjouterList()}
              sx={{
                backgroundColor: theme.palette.bg.main,
                color: theme.palette.gold.main,
                marginLeft: '10px'
              }}
            >
              Ajouter
            </Button>
          </Grid>
          
        </Box>
      </Modal>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        message={notificationMessage}
      />
       
      
    </>
  );
}

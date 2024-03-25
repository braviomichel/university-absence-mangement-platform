import React from "react";
import { Button } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import DownloadIcon from "@mui/icons-material/Download";

import * as XLSX from "xlsx";

export default function DownloadButton() {
  const theme = useTheme();
  const ExcelFields = [
    { email: "" },
  
  ];

  const handleOnDownload = () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(ExcelFields);
    XLSX.utils.book_append_sheet(wb, ws, "liste");
    XLSX.writeFile(wb, "ListedDesEtudiants.xlsx");
  };

  return (
    <>
      <Button
        fullWidth
        color="primary"
        onClick={handleOnDownload}
        startIcon={<DownloadIcon />}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.bg.main,
          color: theme.palette.gold.main,
          marginBottom: '10px'
        }}
      >
        Télécharger la template
      </Button>
    </>
  );
}

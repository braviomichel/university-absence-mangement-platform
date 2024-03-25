// Fichier: components/ElementModuleForm.js
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const ElementModuleForm = ({ onCreateElementModule }) => {
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const elementModule = { nom, code };
    onCreateElementModule(elementModule);
    setNom('');
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nom de l'élément de module"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <TextField
        label="Code de l'élément de module"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Button type="submit">Créer élément de module</Button>
    </form>
  );
};

export default ElementModuleForm;

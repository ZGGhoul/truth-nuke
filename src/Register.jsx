import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Register({ auth }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleReg = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      alert("Hiba: " + err.message);
    }
  };

  return (
    <Box className="auth-container">
      <Paper elevation={3} sx={{ p: 4, width: 350, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Regisztráció</Typography>
        <TextField label="Email" fullWidth margin="normal" onChange={e => setEmail(e.target.value)} />
        <TextField label="Jelszó" type="password" fullWidth margin="normal" onChange={e => setPass(e.target.value)} />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleReg}>Fiók létrehozása</Button>
        <Typography sx={{ mt: 2 }}>Van már fiókod? <Link to="/login">Belépés</Link></Typography>
      </Paper>
    </Box>
  );
}
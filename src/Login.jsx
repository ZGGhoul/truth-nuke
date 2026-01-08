import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button, TextField, Paper, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Hibás adatok!");
    }
  };

  const googleLogin = () => signInWithPopup(auth, new GoogleAuthProvider());

  return (
    <Box className="auth-container">
      <Paper elevation={3} sx={{ p: 4, width: 350, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Bejelentkezés</Typography>
        <TextField label="Email" fullWidth margin="normal" onChange={e => setEmail(e.target.value)} />
        <TextField label="Jelszó" type="password" fullWidth margin="normal" onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>Belépés</Button>
        <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={googleLogin}>Google Belépés</Button>
        <Typography sx={{ mt: 2 }}>Nincs fiókod? <Link to="/register">Regisztráció</Link></Typography>
      </Paper>
    </Box>
  );
}
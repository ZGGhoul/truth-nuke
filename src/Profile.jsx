import { signOut } from "firebase/auth";
import { Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, auth }) {
  const navigate = useNavigate();

  return (
    <Box className="auth-container">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Profil</Typography>
        <Typography sx={{ my: 2 }}>Bejelentkezve: {user.email}</Typography>
        <Button variant="contained" fullWidth onClick={() => navigate("/")} sx={{ mb: 1 }}>Vissza a chathez</Button>
        <Button variant="outlined" color="error" fullWidth onClick={() => signOut(auth)}>Kijelentkezés</Button>
      </Paper>
    </Box>
  );
}
import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Button, TextField, AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

export default function Chat({ user, db }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const dummy = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "uzenetek"), orderBy("ido", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [db]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "uzenetek"), {
      uzenet: text,
      kitol: user.email,
      ido: serverTimestamp()
    });
    setText("");
  };

  return (
    <Box className="chat-layout">
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Chat</Typography>
          <IconButton color="inherit" onClick={() => navigate("/profile")}><AccountCircle /></IconButton>
        </Toolbar>
      </AppBar>
      <Box className="messages-area">
        {messages.map((m) => (
          <Box key={m.id} className={`msg-wrapper ${m.kitol === user.email ? 'own' : 'other'}`}>
            <Typography variant="caption" className="msg-sender">{m.kitol}</Typography>
            <Box className="msg-bubble">{m.uzenet}</Box>
          </Box>
        ))}
        <div ref={dummy}></div>
      </Box>
      <form onSubmit={handleSend} className="chat-input-row">
        <TextField fullWidth size="small" value={text} onChange={e => setText(e.target.value)} placeholder="Üzenet..." />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}><SendIcon /></Button>
      </form>
    </Box>
  );
}
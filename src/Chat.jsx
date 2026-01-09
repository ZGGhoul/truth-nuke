import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs, serverTimestamp } from "firebase/firestore";
import { Button, TextField, AppBar, Toolbar, Typography, IconButton, Box, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

export default function Chat({ user, db }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const dummy = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const userList = userSnapshot.docs
          .map(doc => doc.data())
          .filter(u => u.uid !== user.uid);
        setUsers(userList);
      } catch (err) {
        console.error("Hiba a felhasználók betöltésekor:", err);
      }
    };
    getUsers();
  }, [db, user.uid]);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const chatId = [user.uid, selectedUser.uid].sort().join("_");

    const q = query(
      collection(db, "uzenetek"),
      where("chatId", "==", chatId),
      orderBy("ido", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setMessages(newMessages);
      
      setTimeout(() => dummy.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      console.error("Firestore figyelési hiba:", error);
    });

    return () => unsubscribe();
  }, [selectedUser, db, user.uid]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    const currentChatId = [user.uid, selectedUser.uid].sort().join("_");

    try {
      await addDoc(collection(db, "uzenetek"), {
        uzenet: text,
        kitol: user.email,
        kitolUid: user.uid,
        ido: serverTimestamp(),
        chatId: currentChatId
      });
      setText("");
    } catch (err) {
      console.error("Hiba az üzenet küldésekor:", err);
    }
  };

  return (
    <Box className="chat-layout" sx={{ display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ bgcolor: '#30ca8f' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {selectedUser ? `Chat: ${selectedUser.email}` : "Válassz partnert a bal oldalon"}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ width: '250px', borderRight: '1px solid #ddd', bgcolor: 'white', overflowY: 'auto' }}>
          <List>
            {users.map((u) => (
              <Box key={u.uid}>
                <ListItem 
                  button 
                  onClick={() => setSelectedUser(u)} 
                  selected={selectedUser?.uid === u.uid}
                  sx={{ '&.Mui-selected': { bgcolor: 'rgba(48, 202, 143, 0.2)' } }}
                >
                  <Avatar sx={{ mr: 1, bgcolor: '#30ca8f', fontSize: '1rem' }}>
                    {u.email[0].toUpperCase()}
                  </Avatar>
                  <ListItemText 
                    primary={u.email} 
                    primaryTypographyProps={{ fontSize: '0.9rem', noWrap: true }} 
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box className="messages-area">
            {messages.length === 0 && selectedUser && (
              <Typography sx={{ textAlign: 'center', mt: 4, color: 'white', bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 2 }}>
                Nincs még üzenet. Kezdj el beszélgetni!
              </Typography>
            )}

            {messages.map((m) => (
              <Box 
                key={m.id} 
                className={`msg-wrapper ${m.kitolUid === user.uid ? 'own' : 'other'}`}
              >
                <span className="msg-sender">{m.kitol}</span>
                <div className="msg-bubble">
                  {m.uzenet}
                </div>
              </Box>
            ))}
            <div ref={dummy}></div>
          </Box>
          {selectedUser && (
            <form onSubmit={handleSend} className="chat-input-row">
              <TextField 
                fullWidth 
                size="small" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="Írj egy üzenetet..." 
                autoComplete="off"
              />
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ bgcolor: '#30ca8f', '&:hover': { bgcolor: '#28a878' }, minWidth: '50px' }}
              >
                <SendIcon />
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
}
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import './App.css';

import Login from "./Login";
import Register from "./Register";
import Chat from "./Chat";
import Profile from "./Profile";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading">Betöltés...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Chat user={user} db={db} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login auth={auth} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register auth={auth} db={db} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
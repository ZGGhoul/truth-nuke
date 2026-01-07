import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export default function Login({auth, user}) {

  let [ email, setEmail ]  = useState("");
  let [ password, setPassword ] = useState("");
  let [ loginError, setLoginError ] = useState(false);
  let [ errorText, setErrorText ] = useState("");

    async function login(){
        try{
            await signInWithEmailAndPassword(auth, email, password);
            setLoginError(false)
            setErrorText("");
            setEmail(""); setPassword("");
        }
        catch (err){
            setLoginError(true)
            setErrorText("Hibás felhasználónév vagy jelszó")
        }   
    }

    async function googleLogin(){
        await signInWithPopup(auth, new GoogleAuthProvider());
    }

    async function logout(){
        await signOut(auth);
    }

  return (
    <div>
      <div className='login'>
            <img src="https://www.rover.com/blog/wp-content/uploads/2019/04/cute-big-eyes-1024x682.jpg" alt="" />
            {user ? <div className='info'>
              {user.email} <span className='logout' onClick={logout}>Logout</span>
            </div> : <div className='urlap'>
              <TextField
                  error={loginError}
                  helperText={errorText}
                  className='email'
                  label="Email"
                  value={email}
                  onChange={e =>setEmail(e.target.value)}
              />
              <TextField
                  error={loginError}
                  helperText={errorText}
                  type='password'
                  className='jelszo'
                  label="Jelszó"
                  value={password}
                  onChange={e =>setPassword(e.target.value)}
              />
              <Button variant='contained' size='large' onClick={login}>Login</Button>
              <Button variant='contained' size='large' onClick={googleLogin} color='secondary'>Google</Button>
              </div>}
          </div>
    </div>
  )
}

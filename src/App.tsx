import React, { useState } from 'react';
import logo from './logo.svg';
import styles from './app.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { produce } from 'immer';

function App() {
  const [idInstance, setIdInstance] = useState('1101819963');
  const [apiToken, setApiToken] = useState(
    '882e9b55f6ef4d279e70a6e5a99b82b881515afc577e46cf8d'
  );
  const [phoneN, setPhoneN] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<string[]>([]);

  function sendMsg() {
    fetch(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${phoneN}@c.us`,
        message,
      }),
      // redirect: 'follow',
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }

  return (
    <div className={styles.app}>
      {/* <h1>Green API</h1> */}
      <AppBar position='static'>
        <Toolbar
        // variant='dense'
        >
          {/* <IconButton edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}
          <Typography variant='h6' color='inherit' component='div'>
            GREEN API
          </Typography>
        </Toolbar>
      </AppBar>
      <Box paddingX={5}>
        <Paper elevation={5} sx={{ marginY: 2, padding: 2, borderRadius: 2 }}>
          <TextField
            required
            // id='outlined-required'
            label='IdInstance'
            value={idInstance}
            onChange={(e) => {
              setIdInstance(e.target.value);
            }}
            size='small'
          />
          <TextField
            required
            // id='outlined-required'
            label='ApiTokenInstance'
            value={apiToken}
            onChange={(e) => {
              setApiToken(e.target.value);
            }}
            sx={{ width: 500 }}
            size='small'
          />
        </Paper>
        <Box display={'flex'}>
          <Paper sx={{ height: 'calc(100vh - 220px)', overflow: 'auto' }}>
            <TextField
              // id='outlined-required'
              label='Номер телефона'
              value={phoneN}
              onChange={(e) => {
                setPhoneN(e.target.value);
              }}
            />
            <Button
              variant='contained'
              onClick={(e) => {
                setChats((chats) => [...chats, phoneN]);
              }}
            >
              Создать чат
            </Button>
            <ul>
              {chats.map((chat) => (
                <li key={chat}>{chat}</li>
              ))}
            </ul>
          </Paper>
          <Paper>
            <TextField
              id='standard-multiline-flexible'
              label='Текст сообщения'
              multiline
              maxRows={10}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button variant='contained' onClick={sendMsg}>
              Отправить сообщение
            </Button>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default App;

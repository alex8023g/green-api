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
import { Collapse, Divider, IconButton, InputBase, List, ListItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TransitionGroup } from 'react-transition-group';
import SendIcon from '@mui/icons-material/Send';

function App() {
  const [idInstance, setIdInstance] = useState('1101819963');
  const [apiToken, setApiToken] = useState(
    '882e9b55f6ef4d279e70a6e5a99b82b881515afc577e46cf8d'
  );
  const [phoneN, setPhoneN] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState('');

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
      <AppBar position='static' sx={{ padding: '0 20px' }}>
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
          <Paper sx={{ minWidth: 310, height: 'calc(100vh - 220px)', overflow: 'auto' }}>
            {/* <TextField
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
            </Button> */}
            <Paper
              component='form'
              elevation={3}
              sx={{
                p: '2px 4px',
                mb: '8px',
                display: 'flex',
                alignItems: 'center',
                width: '300px',
              }}
              // onSubmit={(e) => addTask(e)}
              onSubmit={(e) => {
                e.preventDefault();
                setChats((chats) => [phoneN, ...chats]);
                setPhoneN('');
              }}
            >
              <InputBase
                id='input-task'
                sx={{ ml: 1, flex: 1 }}
                placeholder='номер телефона'
                inputProps={{ 'aria-label': 'input task' }}
                // value={newTask.taskText}
                // onChange={(e) => {
                //   setNewTask((task) => ({ ...task, taskText: e.target.value }));
                // }}
                value={phoneN}
                onChange={(e) => {
                  setPhoneN(e.target.value);
                }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
              <IconButton
                color='primary'
                sx={{ p: '10px' }}
                aria-label='directions'
                type='submit'
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Paper>
            {/* <ul>
              {chats.map((chat) => (
                <li key={chat}>{chat}</li>
              ))}
            </ul> */}
            <List sx={{ minWidth: 0 }}>
              <TransitionGroup>
                {chats.map((chat: string) => (
                  <Collapse key={chat}>
                    {/* <Task task={task} key={task.id} index={index} /> */}
                    <ListItem
                      key={chat}
                      onClick={() => {
                        setActiveChat(chat);
                      }}
                    >
                      {chat}
                    </ListItem>
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
          </Paper>
          <Paper sx={{ width: '100%' }}>
            <Paper sx={{ p: '8px 15px', mb: '2px' }} elevation={7}>
              <Typography variant='h5' component='h4'>
                Чат с {activeChat}
              </Typography>
            </Paper>
            <Paper sx={{ height: '80%' }}>chat</Paper>
            <TextField
              id='standard-multiline-flexible'
              // label='Текст сообщения'
              placeholder='Введите сообщение'
              multiline
              maxRows={10}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            {/* <Button variant='contained' onClick={sendMsg}>
              Отправить сообщение
            </Button> */}
            <Button
              variant='contained'
              // endIcon={<SendIcon />}
              onClick={sendMsg}
            >
              <SendIcon />
            </Button>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default App;

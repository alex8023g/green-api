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
import UpdateIcon from '@mui/icons-material/Update';
import { create } from 'zustand';
import { useChatStore } from './store';

function App() {
  const [phoneN, setPhoneN] = useState('');
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState('');
  const chats = useChatStore((st) => st.chats);
  const idInstance = useChatStore((st) => st.idInstance);
  const apiToken = useChatStore((st) => st.apiToken);
  const addChat = useChatStore((st) => st.addChat);
  const addSentMsg = useChatStore((st) => st.addSentMsg);
  const addReceivedMsg = useChatStore((st) => st.addReceivedMsg);
  const addIdInstance = useChatStore((st) => st.addIdInstance);
  const addApiToken = useChatStore((st) => st.addApiToken);

  function sendMsg() {
    fetch(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${activeChat}@c.us`,
        message,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log({
          chatId: `${activeChat}@c.us`,
          textMessage: message,
          inOut: 'out',
          timestamp: Date.now(),
          idMessage: result.idMessage,
        });
        addSentMsg({
          chatId: `${activeChat}@c.us`,
          textMessage: message,
          inOut: 'out',
          timestamp: Date.now() / 1000,
          idMessage: result.idMessage,
        });
      })
      .catch((error) => console.log('error', error));
    setMessage('');
  }

  async function ReceiveMsgs() {
    let isPossibleMsg = true;
    while (isPossibleMsg) {
      const responseRec = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiToken}`,
        {
          method: 'GET',
        }
      );

      const resultRec = await responseRec.json();
      if (!resultRec) {
        console.log('нет входящих сообщений');
        isPossibleMsg = false;
        return;
      }
      console.log(
        resultRec,
        resultRec.body,
        resultRec.body.idMessage,
        resultRec.receiptId
      );

      if (resultRec.body.typeWebhook === 'incomingMessageReceived') {
        addReceivedMsg({
          chatId: resultRec.body.senderData.chatId,
          textMessage: resultRec.body.messageData.textMessageData?.textMessage,
          inOut: 'in',
          timestamp: resultRec.body.timestamp,
          idMessage: resultRec.idMessage,
        });
      }

      const responseDel = await fetch(
        `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiToken}/${resultRec.receiptId}`,
        {
          method: 'DELETE',
          redirect: 'follow',
        }
      );
      const resultDel = await responseDel.json();
      console.log(resultDel);
    }
  }

  function splitPhoneN(str: string) {
    return [
      str.slice(0, 1),
      ' ',
      str.slice(1, 4),
      ' ',
      str.slice(4, 7),
      ' ',
      str.slice(7, 9),
      ' ',
      str.slice(9, 11),
    ].join('');
  }

  return (
    <div className={styles.app}>
      <AppBar position='static' sx={{ padding: '0 20px' }}>
        <Toolbar>
          <Typography variant='h6' color='inherit' component='div'>
            GREEN API
          </Typography>
        </Toolbar>
      </AppBar>
      <Box paddingX={5}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            marginY: 2,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <TextField
            required
            label='IdInstance'
            value={idInstance}
            onChange={(e) => {
              addIdInstance(e.target.value);
            }}
            size='small'
          />
          <TextField
            required
            label='ApiTokenInstance'
            value={apiToken}
            onChange={(e) => {
              addApiToken(e.target.value);
            }}
            sx={{ width: 500 }}
            size='small'
          />
        </Paper>
        <Box display={'flex'}>
          <Paper>
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
              onSubmit={(e) => {
                e.preventDefault();
                addChat(phoneN);
                setPhoneN('');
              }}
            >
              <InputBase
                id='input-task'
                sx={{ ml: 1, flex: 1 }}
                placeholder='номер телефона'
                inputProps={{ 'aria-label': 'input task' }}
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
            <List sx={{ minWidth: 310, height: 'calc(100vh - 280px)', overflow: 'auto' }}>
              <TransitionGroup>
                {chats.map((chat) => (
                  <Collapse key={chat.chatId}>
                    <ListItem
                      key={chat.chatId}
                      onClick={() => {
                        setActiveChat(chat.phoneN);
                      }}
                    >
                      <Paper
                        sx={
                          activeChat === chat.phoneN
                            ? { px: 5, py: 2, backgroundColor: '#03a9f4' }
                            : { px: 5, py: 2 }
                        }
                      >
                        {splitPhoneN(chat.phoneN)}
                      </Paper>
                    </ListItem>
                  </Collapse>
                ))}
              </TransitionGroup>
            </List>
          </Paper>
          <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Paper
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: '4px 15px',
                mb: '2px',
              }}
              elevation={4}
            >
              <Typography
                variant='h5'
                component='h4'
                sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}
              >
                Чат с {splitPhoneN(activeChat)}
              </Typography>
              <IconButton
                color='primary'
                aria-label='add to shopping cart'
                onClick={ReceiveMsgs}
              >
                <UpdateIcon />
              </IconButton>
            </Paper>
            <Paper
              sx={{ minWidth: 310, height: 'calc(100vh - 300px)', overflow: 'auto' }}
            >
              <List>
                {chats
                  .find((item) => item.phoneN === activeChat)
                  ?.msgs.map((msgObj) => (
                    <ListItem
                      sx={msgObj.inOut === 'out' ? { justifyContent: 'end' } : {}}
                    >
                      <span
                        style={
                          msgObj.inOut === 'out'
                            ? {
                                padding: '5px',
                                borderRadius: '7px',
                                backgroundColor: '#b8e4ff',
                              }
                            : {
                                padding: '5px',
                                borderRadius: '7px',
                                backgroundColor: '#bcf5bc',
                              }
                        }
                      >
                        {msgObj.textMessage}
                      </span>
                    </ListItem>
                  ))}
              </List>
            </Paper>
            <Box
              component={'form'}
              sx={{ display: 'flex', padding: '5px', backgroundColor: '#e8e8e8' }}
              onSubmit={(e) => {
                e.preventDefault();
                sendMsg();
              }}
            >
              <TextField
                id='standard-multiline-flexible'
                placeholder='Введите сообщение'
                maxRows={10}
                sx={{ flexGrow: 1, backgroundColor: 'white' }}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button type='submit' sx={{ alignSelf: 'flex-end' }}>
                <SendIcon />
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default App;

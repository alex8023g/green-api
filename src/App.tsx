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

type TInOut = 'in' | 'out';

interface IMsg {
  textMessage: string;
  inOut: TInOut;
  timestamp: number;
  idMessage: string;
}

interface IChat {
  chatId: string;
  phoneN: string;
  msgs: IMsg[];
}

function App() {
  const [idInstance, setIdInstance] = useState('1101820479');
  const [apiToken, setApiToken] = useState(
    '79be0c51b25848dbbdeb7d5e6a555b337addbd097c844ebea4'
  );
  const [phoneN, setPhoneN] = useState('');
  const [message, setMessage] = useState('');
  // const [chats, setChats] = useState<IChat[]>([
  //   { chatId: '79100024677@c.us', phoneN: '79100024677', msgs: [] },
  //   { chatId: '79660358555@c.us', phoneN: '79660358555', msgs: [] },
  // ]);
  const [activeChat, setActiveChat] = useState('');
  // const [chatMsgs, setChatMsgs] = useState<any[]>([]);

  const chats = useChatStore((st) => st.chats);
  const addChat = useChatStore((st) => st.addChat);
  const addSentMsg = useChatStore((st) => st.addSentMsg);
  const addReceivedMsg = useChatStore((st) => st.addReceivedMsg);

  function sendMsg() {
    fetch(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${activeChat}@c.us`,
        message,
      }),
      // redirect: 'follow',
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
          // redirect: 'follow',
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
          textMessage: resultRec.body.messageData.textMessageData.textMessage,
          inOut: 'in',
          timestamp: resultRec.body.timestamp,
          idMessage: resultRec.idMessage,
        });
      }

      // setChatMsgs((chatMsg) => [...chatMsg, resultRec.body]);

      // .then((response) => response.json())
      // .then((result) =>
      //   console.log(result, result.body, result.body.idMessage, result.receiptId)
      // )
      // .catch((error) => console.log('error', error));

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
          <Paper
          // sx={{ minWidth: 310, height: 'calc(100vh - 220px)', overflow: 'auto' }}
          >
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
                // setChats((chats) => [
                //   { chatId: `${phoneN}@c.us`, phoneN, msgs: [] },
                //   ...chats,
                // ]);
                addChat(phoneN);
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
            <List sx={{ minWidth: 310, height: 'calc(100vh - 280px)', overflow: 'auto' }}>
              <TransitionGroup>
                {chats.map((chat) => (
                  <Collapse key={chat.chatId}>
                    {/* <Task task={task} key={task.id} index={index} /> */}
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
                        {/* {chat.phoneN} */}
                        {[
                          chat.phoneN.slice(0, 1),
                          ' ',
                          chat.phoneN.slice(1, 4),
                          ' ',
                          chat.phoneN.slice(4, 7),
                          ' ',
                          chat.phoneN.slice(7, 9),
                          ' ',
                          chat.phoneN.slice(9, 11),
                        ].join('')}
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
                Чат с {activeChat}
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
              // sx={{ height: '80%', flexGrow: 1 }}
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
                // multiline
                maxRows={10}
                sx={{ flexGrow: 1, backgroundColor: 'white' }}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button
                type='submit'
                // variant='contained'
                // endIcon={<SendIcon />}
                sx={{ alignSelf: 'flex-end' }}
                // onClick={sendMsg}
              >
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

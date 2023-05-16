import React, { useState } from 'react';
import styles from './chat.module.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useChatStore } from '../store';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import List from '@mui/material/List';
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import UpdateIcon from '@mui/icons-material/Update';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

export function Chat() {
  const [phoneN, setPhoneN] = useState('');
  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState('');
  const chats = useChatStore((st) => st.chats);
  const idInstance = useChatStore((st) => st.idInstance);
  const apiToken = useChatStore((st) => st.apiToken);
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
        <Paper sx={{ minWidth: 310, height: 'calc(100vh - 300px)', overflow: 'auto' }}>
          <List>
            {chats
              .find((item) => item.phoneN === activeChat)
              ?.msgs.map((msgObj) => (
                <ListItem sx={msgObj.inOut === 'out' ? { justifyContent: 'end' } : {}}>
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
  );
}

import React from 'react';
import styles from './inputsidtoken.module.css';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useChatStore } from '../store';

export function InputsIdToken() {
  const idInstance = useChatStore((st) => st.idInstance);
  const apiToken = useChatStore((st) => st.apiToken);
  const addIdInstance = useChatStore((st) => st.addIdInstance);
  const addApiToken = useChatStore((st) => st.addApiToken);

  return (
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
  );
}

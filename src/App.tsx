import React from 'react';
import Box from '@mui/material/Box';
import { Header } from './Header';
import { InputsIdToken } from './InputsIdToken';
import { Chat } from './Chat';

function App() {
  return (
    <>
      <Header />
      <Box paddingX={5}>
        <InputsIdToken />
        <Chat />
      </Box>
    </>
  );
}
export default App;

import React from 'react';
import styles from './header.module.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export function Header() {
  return (
    <AppBar position='static' sx={{ padding: '0 20px' }}>
      <Toolbar>
        <Typography variant='h6' color='inherit' component='div'>
          GREEN API
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

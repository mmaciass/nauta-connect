import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Typography } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const MenuOptionsCustom = ({ anchorEl, handleClose, theme, ...props }) => {
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={() => {
        chrome.runtime.sendMessage({ type: 'NEXT_THEME' });
      }}>
        <ListItemIcon>
          {theme === 'auto'
            ? <BrightnessAutoIcon fontSize="small"/>
            : theme === 'dark'
              ? <Brightness4Icon fontSize="small"/>
              : <Brightness7Icon fontSize="small"/>}
        </ListItemIcon>

        {theme === 'auto'
          ? <Typography children="Modo Automático"/>
          : theme === 'dark'
            ? <Typography children="Modo Oscuro"/>
            : <Typography children="Modo Claro"/>}
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small"/>
        </ListItemIcon>
        <Typography>Ver Cuentas</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MenuOptionsCustom;

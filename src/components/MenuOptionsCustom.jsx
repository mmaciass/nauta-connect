import React, { Fragment } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Typography } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import InfoIcon from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const MenuOptionsCustom = ({ anchorEl, handleClose, theme, preventSleep, disableWarnings, ...props }) => {
  return (
    <Fragment>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          if (preventSleep) chrome.runtime.sendMessage({ type: 'ALLOW_SLEEP_CONNECTED' });
          else chrome.runtime.sendMessage({ type: 'PREVENT_SLEEP_CONNECTED' });
        }}>
          <ListItemIcon>
            {preventSleep
              ? <DesktopWindowsIcon fontSize="small"/>
              : <DesktopAccessDisabledIcon fontSize="small"/>}
          </ListItemIcon>

          <Typography>{preventSleep ? `Prevenir` : `Permitir`} Reposo</Typography>
        </MenuItem>
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
        <MenuItem onClick={() => {
          if (disableWarnings)
            chrome.runtime.sendMessage({ type: 'ENABLE_WARNINGS' });
          else chrome.runtime.sendMessage({ type: 'DISABLE_WARNINGS' });
        }}>
          <ListItemIcon>
            {disableWarnings
              ? <NotificationsOffIcon fontSize="small"/>
              : <NotificationsActiveIcon fontSize="small"/>}
          </ListItemIcon>

          {disableWarnings
            ? <Typography children="Ocultar Advertencias"/>
            : <Typography children="Mostrar Advertencias"/>}
        </MenuItem>
        <Divider/>
        <MenuItem onClick={() => {
          chrome.runtime.sendMessage({ type: 'OPEN_DIALOG_USERS' });
          handleClose();
        }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small"/>
          </ListItemIcon>
          <Typography>Ver Cuentas</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          chrome.runtime.sendMessage({ type: 'LOAD_SESSION_FROM_STORAGE' });
          handleClose();
        }}>
          <ListItemIcon>
            <RotateLeftIcon fontSize="small"/>
          </ListItemIcon>
          <Typography>Recuperar sesión</Typography>
        </MenuItem>
        <Divider/>
        <MenuItem onClick={() => {
          chrome.runtime.sendMessage({ type: 'OPEN_DIALOG_ABOUT' });
          handleClose();
        }}>
          <ListItemIcon>
            <InfoIcon fontSize="small"/>
          </ListItemIcon>
          <Typography>Acerca de...</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default MenuOptionsCustom;

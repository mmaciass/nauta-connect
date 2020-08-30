import React, { Fragment, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import AlertDialogCustom from './AlertDialogCustom';
import Typography from '@material-ui/core/Typography';

const DialogUsersCustom = ({ configs, userStorage, ...props }) => {
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [openDialogRemove, setOpenDialogRemove] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['users'], ({ users }) => {
      if (users) {
        setUsers(users);
      }
    });
  }, [userStorage.lastUpdate]);

  const handleClose = () => {
    chrome.runtime.sendMessage({
      type: 'CLOSE_DIALOG_USERS',
    });
  };

  const handleClick = (user) => {

  };

  return (
    <Fragment>
      <AlertDialogCustom openInit={openDialogRemove} agreeText="Eliminar" disagreeText="Cancelar"
                         title="Eliminar cuenta guardada"
                         description={`¿Seguro que quiere eliminar el usuario ${userSelected} de las cuentas guardadas?`}
                         handleClose={() => {
                           setOpenDialogRemove(false);
                         }} disagreeClick={() => {
        setOpenDialogRemove(false);
      }} agreeClick={() => {
        setOpenDialogRemove(false);
        chrome.runtime.sendMessage({
          type: 'REMOVE_USER_STORE',
          payload: {
            username: userSelected,
          },
        });
      }}/>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={configs.openDialogUsers}>
        <DialogTitle id="simple-dialog-title">Cuentas Guardadas</DialogTitle>
        <List>
          {users.length === 0 ? <Typography style={{margin: 10}} children="No existen cuentas guardadas."/> : null}
          {users.map((user) => (
            <ListItem button onClick={handleClick} key={user}>
              <Tooltip title={getTypeAccountDescription(user.username)} aria-label="descripcion">
                <ListItemAvatar style={{ minWidth: 30 }}>
                  <Avatar style={{ height: 25, width: 25, backgroundColor: '#665bfa', color: 'white' }}>
                    {getTypeAccountInitial(user.username)}
                  </Avatar>
                </ListItemAvatar>
              </Tooltip>
              <ListItemText primary={(user.username.split('@')[0]).slice(0, 23)}/>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="eliminar" onClick={() => {
                  setUserSelected(user.username);
                  setOpenDialogRemove(true);
                }}>
                  <DeleteForeverIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Dialog>;
    </Fragment>
  );

};

const getTypeAccountInitial = (username) => {
  const type = username.split('@')[1];
  switch (type) {
    case 'nauta.com.cu':
      return 'i';
    case 'nauta.co.cu':
      return 'n';
    default:
      return 'o';
  }
};

const getTypeAccountDescription = (username) => {
  const type = username.split('@')[1];
  switch (type) {
    case 'nauta.com.cu':
      return 'Navegación Internacional';
    case 'nauta.co.cu':
      return 'Navegación Nacional';
    default:
      return 'Otro tipo de cuenta';
  }
};

const mapStateToProps = (state) => {
  return {
    configs: state.configs,
    userStorage: state.userStorage,
  };
};

export default connect(mapStateToProps)(DialogUsersCustom);

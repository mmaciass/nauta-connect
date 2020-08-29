import { Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

const NotifierMessenger = (props) => {
  const classes = useStyles();
  const [snackOpen, setSnackOpen] = useState(false);
  const [msgSnack, setMsgSnack] = useState('Todo va bien!?!?');

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch (request.type) {
          case 'LOGIN_ERROR':
            setMsgSnack(request.payload);
            setSnackOpen(true);
            break;
          case 'SHOW_MESSAGE_ERROR':
            setMsgSnack(request.payload);
            setSnackOpen(true);
            break;
        }
      },
    );
  }, []);


  const handleClose = () => {
    setSnackOpen(false);
  };
  return (
    <Snackbar autoHideDuration={6000} severity="error" message={msgSnack} open={snackOpen} onClose={handleClose}/>
  );
};

export default NotifierMessenger;

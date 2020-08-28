import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialogCustom = ({ openInit, title, description, disagreeText, agreeText, handleClose, disagreeClick, agreeClick }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(openInit);
  }, [openInit]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={disagreeClick} color="secondary">
          {disagreeText}
        </Button>
        <Button onClick={agreeClick} color="secondary" autoFocus>
          {agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialogCustom;

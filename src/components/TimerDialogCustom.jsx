import React from 'react';
import Slider from '@material-ui/core/Slider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { connect } from 'react-redux';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';


const marks = [
  { value: 0, label: '0' },
  { value: 60, label: '1h' },
  { value: 60 * 2, label: '2h' },
  { value: 60 * 3, label: '3h' },
  { value: 60 * 4, label: '4h' },
  { value: 60 * 5, label: '5h' },
];

const TimerDialog = ({ login, timerConnection, ...props }) => {
  const [timeLeft, setTimeLeft] = React.useState('1 hora');
  const [msDuration, setMsDuration] = React.useState(60);

  const valuetext = (value) => {
    setMsDuration(value);
    let textTime = '';
    if (parseInt((value / 60).toString()) !== 0)
      if (parseInt((value / 60).toString()) === 1) textTime += '1 hora';
      else textTime += `${parseInt((value / 60).toString())} horas`;

    if ((value % 60) > 0) {
      if (textTime)
        textTime += ' y ';
      textTime += `${value % 60} minutos`;
    }
    setTimeLeft(textTime);

    return `${value % 60}`.length === 1 ? `0${value % 60}m` : `${value % 60}m`;
  };

  return (
    <Dialog fullWidth={true}
            open={timerConnection.openDialog}
            onClose={() => {
              chrome.runtime.sendMessage({ type: 'CLOSE_DIALOG_TIMER' });
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography style={{ fontSize: '1em' }}>Desconectarse</Typography>
          <br/>
          {timerConnection.enabled
            ? null
            : <Slider getAriaValueText={valuetext} valueLabelFormat={valuetext}
                      aria-labelledby="discrete-slider" valueLabelDisplay="auto"
                      defaultValue={msDuration} step={5} min={5} max={300} marks={marks}/>}
          <Typography style={{ fontSize: '1em' }}>{timerConnection.enabled ? `` : `en ${timeLeft}`}</Typography>
        </DialogContentText>
        <DialogActions>
          {timerConnection.enabled
            ? null
            : <Button onClick={() => {
              chrome.runtime.sendMessage({ type: 'CLOSE_DIALOG_TIMER' });
            }} color="secondary">
              Cancelar
            </Button>
          }
          <Button onClick={() => {
            if (timerConnection.enabled) {
              chrome.runtime.sendMessage({ type: 'CLOSE_DIALOG_TIMER' });
              chrome.runtime.sendMessage({ type: 'STOP_TIMER_DISCONNECT' });
            } else {
              chrome.runtime.sendMessage({ type: 'CLOSE_DIALOG_TIMER' });
              chrome.runtime.sendMessage({ type: 'START_TIMER_DISCONNECT', payload: 1000 * 60 * msDuration });
            }
          }} color="secondary" autoFocus>
            {timerConnection.enabled ? `Desactivar` : `Activar`}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};


const mapStateToProps = (state) => {
  return {
    login: state.login,
    timerConnection: state.timerConnection,
  };
};

export default connect(mapStateToProps)(TimerDialog);

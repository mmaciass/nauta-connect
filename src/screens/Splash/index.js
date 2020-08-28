import React from 'react';
import { Box, Typography } from '@material-ui/core';
import bordUp from '../../assets/vector/bord-up.svg';
import bordDown from '../../assets/vector/bord-down.svg';
import rectUp from '../../assets/vector/rect-up.svg';
import rectDown from '../../assets/vector/rect-down.svg';
import logo from '../../assets/vector/logo.svg';
import './staticsStyles.css';
import './anims.css';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuOptionsCustom from '../../components/MenuOptionsCustom';

const Splash = ({ configs, login, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const animClass =
    (login.status === 'connected')
      // (true)
      ? 'animConnect'
      : (login.status === 'disconected')
      ? 'animDisconnect'
      : (configs.animSplashInit)
        ? 'animOpen'
        : 'staticOpen';
  return (
    <Box className={`boxSplashInit`} {...props}>
      <img className={`rectUp ${animClass}`} src={rectUp} alt="rect-up"/>
      <img className={`rectDown ${animClass}`} src={rectDown} alt="rect-down"/>
      <img className={`bordUp ${animClass}`} src={bordUp} alt="bord-up"/>
      <img className={`bordDown ${animClass}`} src={bordDown} alt="bord-down"/>
      <img className={`logo ${animClass}`} src={logo} alt="logo"/>
      <Typography className={`name ${animClass}`}>Nauta Connect</Typography>
      <Typography className={`slogan ${animClass}`}>Conectarse nunca fue tan simple ...</Typography>

      <IconButton aria-label="opciones" className={`optionBtn ${animClass}`} onClick={handleClick}>
        <MoreVertIcon/>
      </IconButton>
      <MenuOptionsCustom anchorEl={anchorEl} handleClose={handleClose} theme={configs.theme}/>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    configs: state.configs,
    login: state.login,
  };
};

export default connect(mapStateToProps)(Splash);

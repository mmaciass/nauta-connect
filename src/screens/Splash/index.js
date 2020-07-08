import React from 'react';
import { Box, Typography } from '@material-ui/core';
import bordUp from '../../assets/vector/bord-up.svg';
import bordDown from '../../assets/vector/bord-down.svg';
import rectUp from '../../assets/vector/rect-up.svg';
import rectDown from '../../assets/vector/rect-down.svg';
import logo from '../../assets/vector/logo.svg';
import './staticsStyles.css';
import './animatedBorder.css';
import './animatedObjectsIn.css';
import './animatedObjectsOut.css';
import { connect } from 'react-redux';

const Splash = ({ configs, ...props }) => {
  const animClass = configs.animSplashInit ? 'animFluid' : 'animStatic';
  return (
    <Box className={`boxSplashInit ${configs.animSplashInit ? "overAll" : null}`} {...props}>
      <img className={`rectUp ${animClass}`} src={rectUp} alt="rect-up"/>
      <img className={`rectDown ${animClass}`} src={rectDown} alt="rect-down"/>
      <img className={`bordUp ${animClass}`} src={bordUp} alt="bord-up"/>
      <img className={`bordDown ${animClass}`} src={bordDown} alt="bord-down"/>
      <img className={`logo ${animClass}`} src={logo} alt="logo"/>
      <Typography className={`name ${animClass}`}>Nauta Connect</Typography>
      <Typography className={`slogan ${animClass}`}>Conectarse nunca fue tan simple ...</Typography>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(Splash);

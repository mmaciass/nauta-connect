import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: 5,
  },
}));

export const ShareSocialBtn = ({ Btn, Icon, tooltip, title, shareUrl, ...props }) => {
  const classes = useStyles();
  return (
    <Tooltip title={tooltip} arrow>
      <Btn quote={title} url={shareUrl} className={classes.icons} {...props}>
        <Icon size={32} round={true}/>
      </Btn>
    </Tooltip>
  );
};

const ShareButtons = ({ className, configs, ...props }) => {
  const shareUrl = configs.urlShared;
  const title = configs.navigator === 'firefox'
  ? "Complemento de Mozilla Firefox para conectarse a la Red Nauta de ETECSA"
  : "Extensión de Google Chrome para conectarse a la Red Nauta de ETECSA";
  return (
    <Box className={className} {...props}>
      <Typography align="left">Compartir extensión por:</Typography>
      <ShareSocialBtn Btn={FacebookShareButton} Icon={FacebookIcon} tooltip="Facebook" title={title}
                      shareUrl={shareUrl}/>
      <ShareSocialBtn Btn={FacebookMessengerShareButton} Icon={FacebookMessengerIcon} tooltip="Messenger" title={title}
                      shareUrl={shareUrl}/>
      <ShareSocialBtn Btn={WhatsappShareButton} Icon={WhatsappIcon} tooltip="Whatsapp" title={title}
                      shareUrl={shareUrl}/>
      <ShareSocialBtn Btn={TwitterShareButton} Icon={TwitterIcon} tooltip="Twitter" title={title} shareUrl={shareUrl}/>
      <ShareSocialBtn Btn={TelegramShareButton} Icon={TelegramIcon} tooltip="Telegram" title={title}
                      shareUrl={shareUrl}/>
      <ShareSocialBtn Btn={LinkedinShareButton} Icon={LinkedinIcon} tooltip="Linkedin" title={title}
                      shareUrl={shareUrl}/>
      {/*<ShareSocialBtn Btn={EmailShareButton} Icon={EmailIcon} tooltip="Enviar URL por correo"  title={title} shareUrl={shareUrl}/>*/}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(ShareButtons);

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {
  EmailIcon,
  EmailShareButton,
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

const useStyles = makeStyles((theme) => ({
  icons: {
    marginRight: 5,
  },
}));

const shareUrl = 'http://github.com/mmaciass';
const title = 'GitHub Marcos Macias Sánchez';

export const ShareSocialBtn = ({ Btn, Icon, tooltip, ...props }) => {
  const classes = useStyles();
  return (
    <Tooltip title={tooltip}>
      <Btn quote={title} url={shareUrl} className={classes.icons} {...props}>
        <Icon size={32} round={true}/>
      </Btn>
    </Tooltip>
  );
};

const ShareButtons = ({ className, ...props }) => {
  return (
    <Box className={className} {...props}>
      <Typography align="left">Compartir extensión por:</Typography>
      <ShareSocialBtn Btn={FacebookShareButton} Icon={FacebookIcon} tooltip="Facebook"/>
      <ShareSocialBtn Btn={FacebookMessengerShareButton} Icon={FacebookMessengerIcon} tooltip="Messenger"/>
      <ShareSocialBtn Btn={WhatsappShareButton} Icon={WhatsappIcon} tooltip="Whatsapp"/>
      <ShareSocialBtn Btn={TwitterShareButton} Icon={TwitterIcon} tooltip="Twitter"/>
      <ShareSocialBtn Btn={TelegramShareButton} Icon={TelegramIcon} tooltip="Telegram"/>
      <ShareSocialBtn Btn={LinkedinShareButton} Icon={LinkedinIcon} tooltip="Linkedin"/>
      <ShareSocialBtn Btn={EmailShareButton} Icon={EmailIcon} tooltip="Enviar por correo"/>
    </Box>
  );
};

export default ShareButtons;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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

const ShareButtons = ({ className, ...props }) => {
  const classes = useStyles();

  const shareUrl = 'http://github.com/mmaciass';
  const title = 'GitHub Marcos Macias Sánchez';

  return (
    <Box className={className}>
      <Typography align="left">Compartir extensión por:</Typography>
      <FacebookShareButton quote={title} url={shareUrl} className={classes.icons}>
        <FacebookIcon size={32} round={true}/>
      </FacebookShareButton>

      <FacebookMessengerShareButton quote={title} url={shareUrl} className={classes.icons}>
        <FacebookMessengerIcon size={32} round={true}/>
      </FacebookMessengerShareButton>

      <WhatsappShareButton quote={title} url={shareUrl} className={classes.icons}>
        <WhatsappIcon size={32} round={true}/>
      </WhatsappShareButton>

      <TwitterShareButton quote={title} url={shareUrl} className={classes.icons}>
        <TwitterIcon size={32} round={true}/>
      </TwitterShareButton>

      <TelegramShareButton quote={title} url={shareUrl} className={classes.icons}>
        <TelegramIcon size={32} round={true}/>
      </TelegramShareButton>

      <LinkedinShareButton quote={title} url={shareUrl} className={classes.icons}>
        <LinkedinIcon size={32} round={true}/>
      </LinkedinShareButton>

      <EmailShareButton quote={title} url={shareUrl} className={classes.icons}>
        <EmailIcon size={32} round={true}/>
      </EmailShareButton>
    </Box>
  );
};

export default ShareButtons;
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  logo: {
    maxHeight: 80,
    maxWidth: 80,
    marginTop: 10,
  },
  logoContainer: {
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  ShareButtons: {
    marginTop: 20,
    textAlign: 'center',
  },
}));

export default useStyles;
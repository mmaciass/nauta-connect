import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AccountCircle } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import logo from '../../assets/img/icon-128.png';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  logo: {
    maxHeight: 80,
    maxWidth: 80,
    marginTop: 10,
  },
  logoContainer: {
    textAlign: 'center',
  },
  field: {
    marginTop: 10,
  },
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const initialValue = {
  username: '',
  password: '',
  remember: true,
};

const Login = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.logoContainer}>
        <img src={logo} alt="logo" className={classes.logo}/>
      </div>
      <Formik initialValues={initialValue} onSubmit={(values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        setTimeout(() => {
          formikHelpers.setSubmitting(false);
        }, 3500);
      }}>
        {(formikBag) => (
          <Form>
            <Field as={TextField} name="username" label="Usuario" fullWidth className={classes.field}
                   disabled={formikBag.isSubmitting}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <AccountCircle/>
                       </InputAdornment>
                     ),
                   }}
            />

            <Field as={TextField} name="pasword" label="Contraseña" fullWidth type="password" className={classes.field}
                   disabled={formikBag.isSubmitting}
                   InputProps={{
                     startAdornment: (
                       <InputAdornment position="start">
                         <VpnKeyIcon/>
                       </InputAdornment>
                     ),
                   }}
            />
            <div className={classes.buttonsContainer}>
              <Button fullWidth variant="contained" color="primary" onClick={formikBag.submitForm}
                      startIcon={formikBag.isSubmitting
                        ? <CircularProgress color="inherit" size={20}/> : <ExitToAppIcon/>}
              >
                Iniciar Sesión
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default Login;
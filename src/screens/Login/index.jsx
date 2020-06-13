import React, { Fragment } from 'react';
import { Form, Formik } from 'formik';
import logo from '../../assets/img/icon-128.png';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import TextFieldCustom from '../../components/TextFieldCustom';
import ShareButtons from '../../components/SharedButtons';
import schemaValidation from './schemaValidation';
import useStyles from './useStyles';

const initialValue = {
  username: '',
  password: '',
  remember: false,
};

const Login = (props) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.logoContainer}>
        <img src={logo} alt="logo" className={classes.logo}/>
      </div>
      <Formik initialValues={initialValue} onSubmit={(values, formikHelpers) => {
        formikHelpers.setSubmitting(true);

      }} validationSchema={schemaValidation}>
        {(formikBag) => (
          <Form>
            <TextFieldCustom label="Usuario" fullWidth errors={formikBag.errors} isSubmitting={formikBag.isSubmitting}
                             name="username" id="username"/>
            <TextFieldCustom label="Contraseña" fullWidth errors={formikBag.errors}
                             isSubmitting={formikBag.isSubmitting}
                             name="password" id="password" type="password"/>

            <div className={classes.buttonsContainer}>
              <Button fullWidth variant="contained" color="primary" onClick={formikBag.submitForm}
                      startIcon={formikBag.isSubmitting
                        ? <CircularProgress color="inherit" size={20}/> : <ExitToAppIcon/>}>
                Iniciar Sesión
              </Button>
              <ShareButtons className={classes.ShareButtons} fullWidth={true} variant="text" color="secondary"
                            size="small"/>
            </div>
            {/*{JSON.stringify(props.login, null, 2)}*/}
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(Login);
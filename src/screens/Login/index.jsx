import React, { Fragment } from 'react';
import { Form, Formik } from 'formik';
import logo from '../../assets/img/icon-128.png';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import * as yup from 'yup';
import TextFieldCustom from '../../components/TextFieldCustom';
import ShareButtons from '../../components/SharedButtons';

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
    marginBottom: 20,
  },
  ShareButtons: {
    marginTop: 20,
    textAlign: "center"
  },
}));

const initialValue = {
  username: '',
  password: '',
  remember: false,
};

const schemaValidation = yup.object({
  username: yup.string().required('Este campo es obligatorio').email('Este campo no coincide con una cuenta valida.')
    .test('only-numbers', 'Este campo no coincide con una cuenta valida.',
      (value) => {
        return !!value && !!value.split('@')[1]
          && (value.split('@')[1] === 'nauta.com.cu' || value.split('@')[1] === 'nauta.co.cu');
      },
    ),
  password: yup.string().required('Este campo es obligatorio'),
  remember: yup.boolean(),
});

const Login = ({ dispatch, ...props }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.logoContainer}>
        <img src={logo} alt="logo" className={classes.logo}/>
      </div>
      <Formik initialValues={initialValue} onSubmit={(values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        fetch('https://secure.etecsa.net:8443//LoginServlet', {
          method: 'POST',
          body: JSON.stringify({ username: values.username, password: values.password }),
        })
          .then(value => {
            cconsole.log(value);
            formikHelpers.setSubmitting(false);
          })
          .catch(reason => {
            console.log(reason);
            formikHelpers.setSubmitting(false);
          });
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
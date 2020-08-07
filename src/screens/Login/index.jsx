import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import TextFieldCustom from '../../components/TextFieldCustom';
import schemaValidation from './schemaValidation';
import useStyles from '../useStyles';
import CheckBoxCustom from '../../components/CheckBoxCustom';
import ButtonCustom from '../../components/ButtonCustom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Container from '@material-ui/core/Container';

const initialValue = {
  username: '',
  password: '',
  remember: false,
};

const Login = ({ login, userStorage, configs, ...props }) => {
  const classes = useStyles();
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'FORM_OVER_ALL' });
  }, []);

  return (
    <Container style={{ zIndex: -1000, position: configs.animSplashInit ? 'absolute' : 'unset' }}>
      <Formik
        initialValues={initialValue}
        onSubmit={(values, formikHelpers) => {
          chrome.runtime.sendMessage({ type: 'LOGIN', payload: values });
        }}
        validationSchema={schemaValidation}
      >
        {(formikBag) => {
          useEffect(() => {
            formikBag.setSubmitting(login.status === 'loading');
          }, [login.status]);
          useEffect(() => {
            if (!!userStorage.password)
              formikBag.setFieldValue('password', userStorage.password);
          }, [userStorage.password]);

          return (
            <Form>
              <TextFieldCustom
                label="Usuario"
                errors={formikBag.errors}
                isSubmitting={formikBag.isSubmitting}
                name="username"
                id="username"
                next={document.querySelector('#password')}
                submitted={formikBag.submitCount > 0}
              />
              <TextFieldCustom
                label="Contraseña"
                errors={formikBag.errors}
                isSubmitting={formikBag.isSubmitting}
                submitAction={formikBag.submitForm}
                name="password"
                id="password"
                type="password"
                submitted={formikBag.submitCount > 0}
              />

              <CheckBoxCustom label="Guardar contraseña" name="remember" id="remember"/>

              <div className={classes.buttonsContainer}>
                <ButtonCustom onClick={formikBag.submitForm} startIcon={
                  formikBag.isSubmitting ? (
                    <CircularProgress color="inherit" size={20}/>
                  ) : (
                    <ExitToAppIcon/>
                  )
                }>CONECTARSE</ButtonCustom>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    userStorage: state.userStorage,
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(Login);

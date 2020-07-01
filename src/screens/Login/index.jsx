import React, { Fragment, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import TextFieldCustom from '../../components/TextFieldCustom';
import schemaValidation from './schemaValidation';
import useStyles from '../useStyles';
import CheckBoxCustom from '../../components/CheckBoxCustom';
import ButtonCustom from '../../components/ButtonCustom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const initialValue = {
  username: '',
  password: '',
  remember: false,
};

const Login = ({ login, userStorage, ...props }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Formik
        initialValues={initialValue}
        onSubmit={(values, formikHelpers) => {
          chrome.runtime.sendMessage({ type: 'LOGIN', payload: values });
        }}
        validationSchema={schemaValidation}
      >
        {(formikBag) => {
          useEffect(() => {
            formikBag.setSubmitting(login.state === 'loading');
          }, [login.state]);
          useEffect(() => {
            if (!!userStorage.password)
              formikBag.setFieldValue('password', userStorage.password);
          }, [userStorage.password]);

          return (
            <Form>
              <TextFieldCustom
                label="Usuario"
                fullWidth
                errors={formikBag.errors}
                isSubmitting={formikBag.isSubmitting}
                name="username"
                id="username"
                autoFocus
                next={document.querySelector('#password')}
                submitted={formikBag.submitCount > 0}
              />
              <TextFieldCustom
                label="Contraseña"
                fullWidth
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
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.login,
    userStorage: state.userStorage,
  };
};

export default connect(mapStateToProps)(Login);

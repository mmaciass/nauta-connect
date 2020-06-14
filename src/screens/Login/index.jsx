import React, {Fragment, useEffect} from "react";
import {Form, Formik} from "formik";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import {connect} from "react-redux";
import TextFieldCustom from "../../components/TextFieldCustom";
import schemaValidation from "./schemaValidation";
import useStyles from "../useStyles";
import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";
import Typography from "@material-ui/core/Typography";

const initialValue = {
  username: "",
  password: "",
  remember: false,
};

const Login = ({login, ...props}) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography>
        {/*<Timer active duration={null} time={50000}>*/}
        {/*  <Timecode format="HH:mm:ss"/>*/}
        {/*</Timer>*/}
      </Typography>
      <Formik
        initialValues={initialValue}
        onSubmit={(values, formikHelpers) => {
          chrome.runtime.sendMessage({type: "LOGIN", payload: values});
        }}
        validationSchema={schemaValidation}
      >
        {(formikBag) => {
          useEffect(() => {
            formikBag.setSubmitting(login.state === "loading");
          }, [login.state]);
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
                next={document.querySelector("#password")}
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

              <div className={classes.buttonsContainer}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={formikBag.submitForm}
                  size="small"
                  startIcon={
                    formikBag.isSubmitting ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <ExitToAppIcon />
                    )
                  }
                >
                  Iniciar Sesión
                </Button>
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
  };
};

export default connect(mapStateToProps)(Login);

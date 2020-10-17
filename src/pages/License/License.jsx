import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core';
import Content from './content';
import Container from '@material-ui/core/Container';


const License = ({ configs, ...props }) => {
  let [theme, setTheme] = useState(createMuiTheme({
    palette: {
      primary: indigo,
      secondary: blue,
      type: configs.theme === 'auto'
        ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : (configs.theme || 'light'),
    }, props: {
      MuiMenuItem: { dense: true },
      MuiListItem: { dense: true },
    },
  }));

  useEffect(() => {
    const themeNew = createMuiTheme({
      palette: {
        primary: indigo,
        secondary: blue,
        type: configs.theme === 'auto'
          ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : (configs.theme || 'light'),
      }, props: {
        MuiMenuItem: { dense: true },
        MuiListItem: { dense: true },
      },
    });
    setTheme(themeNew);
  }, [configs.theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Container maxWidth="md">
        <Content/>
      </Container>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    configs: state.configs,
  };
};

export default connect(mapStateToProps)(License);

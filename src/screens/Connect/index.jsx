import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Connect from './connect';
import Container from '@material-ui/core/Container';

const connectController = (props) => {
  const [loading, setLoading] = useState(true);
  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1000 * 1.3);
    return (
      <Container style={{ textAlign: 'center', marginTop: 100 }}>
        <CircularProgress style={{color: 'white'}}/>
      </Container>
    );
  }

  return <Connect/>;
};

export default connectController;

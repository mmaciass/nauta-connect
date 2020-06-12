import React, { Fragment, useEffect } from 'react';

const Background = (props) => {
  useEffect(()=>{
    console.log('in background init time is', new Date().getTime())
  }, []);
  return (
    <Fragment/>
  );
};

export default Background;
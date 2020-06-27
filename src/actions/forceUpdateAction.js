const forceUpdateAction = () => {
  return (dispatch) => {
    dispatch({ type: 'FORCE_UPDATE_ACTION' });

    setTimeout(()=>{
      dispatch({ type: 'FORCE_UPDATE_ACTION' });
    }, 1000)
    setTimeout(()=>{
      dispatch({ type: 'FORCE_UPDATE_ACTION' });
    }, 2000)
    setTimeout(()=>{
      dispatch({ type: 'FORCE_UPDATE_ACTION' });
    }, 8000)
  };
};

export default forceUpdateAction;

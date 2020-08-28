export const openDialogUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'OPEN_DIALOG_USERS' });
  };
};

export const closeDialogUsers = () => {
  return (dispatch) => {
    dispatch({ type: 'CLOSE_DIALOG_USERS' });
  };
};

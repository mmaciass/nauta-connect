export const openDialogAbout = () => {
  return (dispatch) => {
    dispatch({ type: 'OPEN_DIALOG_ABOUT' });
  };
};

export const closeDialogAbout = () => {
  return (dispatch) => {
    dispatch({ type: 'CLOSE_DIALOG_ABOUT' });
  };
};

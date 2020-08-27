export const nextTheme = () => {
  return (dispatch) => {
    dispatch({ type: 'NEXT_THEME' });
  };
};

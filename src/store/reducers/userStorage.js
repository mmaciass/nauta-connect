const userStorageInitial = {
  status: 'none', // "loaded" || "cleared" || "saved"
  username: '',
  password: '',
};

const userStorage = (state = userStorageInitial, { type, payload }) => {
  switch (type) {
    case 'LOAD_USER_STORE':
      return { ...state, status: 'loaded', username: payload.username, password: payload.password };
    case 'SAVE_USER_STORE':
      return { ...state, status: 'saved', username: payload.username, password: payload.password };
    case 'CLEAR_USER_STORE':
      return { status: 'cleared' };
    default:
      return state;
  }
};

export default userStorage;

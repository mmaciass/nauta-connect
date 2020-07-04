export const clog = (message, ...optionalParams) => {
  if (process.env.NODE_ENV === 'development')
    console.log(message, ...optionalParams);
};

window.browser = (function() {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

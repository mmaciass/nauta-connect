export const clog = console.log;

window.browser = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

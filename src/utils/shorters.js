export const clog = (message, ...optionalParams) => {
  if (process.env.NODE_ENV === 'development')
    console.log(message, ...optionalParams);
};

window.browser = (function() {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

export const openInNewTab = (url) => {
  var win = window.open(url, '_blank');
  win.focus();
};

export const msToHMMSS = (time) => {
  const cantHoras = parseInt((time / (1000 * 60 * 60)).toString());
  const restHoras = time % (1000 * 60 * 60);
  const cantMinut = parseInt((restHoras / (1000 * 60)).toString());
  const restMinut = restHoras % (1000 * 60);
  const cantSegun = parseInt((restMinut / (1000)).toString());
  return `${cantHoras}:${cantMinut.toString().length > 1 ? cantMinut : '0' + cantMinut}:${cantSegun.toString().length > 1 ? cantSegun : '0' + cantSegun}`;
};

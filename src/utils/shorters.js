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

/**
 *  Este método devuelve el numero del próximo dia.
 *  @example Si hoy es dia "2" el método devuelve "3".
 *  @example Si hoy es dia "31" de diciembre el método devuelve "1" correspondiente al mes de enero del próximo año.
 * @returns {number}
 */
const nextDate = () => {
  let d;
  (d = new Date()).setDate(d.getDate() + 1);
  return d.getDate();
};

const setTimeOutMH = (TimerHandler, horas, minutos = 0, segundos = 0) => {
  return setTimeout(TimerHandler, (1000 * segundos) + (1000 * 60 * minutos) + (1000 * 60 * 60 * horas));
};

export const msToHMMSS = (time) => {
  const cantHoras = parseInt((time / (1000 * 60 * 60)).toString());
  const restHoras = time % (1000 * 60 * 60);
  const cantMinut = parseInt((restHoras / (1000 * 60)).toString());
  const restMinut = restHoras % (1000 * 60);
  const cantSegun = parseInt((restMinut / (1000)).toString());
  return `${cantHoras}:${cantMinut.toString().length > 1 ? cantMinut : '0' + cantMinut}:${cantSegun.toString().length > 1 ? cantSegun : '0' + cantSegun}`;
};

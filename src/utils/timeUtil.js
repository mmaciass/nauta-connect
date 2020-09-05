export const formatTime = (ms) => {
  let mili = ms % 1000;
  ms -= mili;
  ms /= 1000;
  let segs = ms % 60;
  ms -= segs;
  ms /= 60;
  let mins = ms % 60;
  ms -= mins;
  ms /= 60;
  let horas = ms;
  return `${(horas + '').length === 1 ? '0' + horas : horas}:${
    (mins + '').length === 1 ? '0' + mins : mins
  }:${(segs + '').length === 1 ? '0' + segs : segs}`;
};


/**
 *  Este método devuelve el numero del próximo dia.
 *  @example Si hoy es dia "2" el método devuelve "3".
 *  @example Si hoy es dia "31" de diciembre el método devuelve "1" correspondiente al mes de enero del próximo año.
 * @returns {number}
 */
export const nextDate = () => {
  let d;
  (d = new Date()).setDate(d.getDate() + 1);
  return d.getDate();
};

export const msToNextFirstDate = (currentDate = new Date()) => {
  const nextMonth = currentDate.getMonth() + 2;
  const nextMonthZero = nextMonth.toString().length > 1 ? nextMonth.toString() : `0${nextMonth.toString()}`;
  const nextDate = new Date(`2020-${nextMonthZero}-01T00:05:00`);
  return nextDate - currentDate;
};

const setTimeOutMH = (TimerHandler, horas, minutos = 0, segundos = 0) => {
  return setTimeout(TimerHandler, (1000 * segundos) + (1000 * 60 * minutos) + (1000 * 60 * 60 * horas));
};

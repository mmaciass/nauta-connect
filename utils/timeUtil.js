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

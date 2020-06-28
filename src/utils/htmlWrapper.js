import cheerio from 'cheerio';

const cleanRightSide = (texto) => {
  while (
    texto[texto.length - 1] === '"' ||
    texto[texto.length - 1] === '+' ||
    texto[texto.length - 1] === ' '
    ) {
    texto = texto.slice(0, texto.length - 1);
    texto = texto.trim();
  }
  return texto;
};

const dataWrapper = (html) => {
  const $ = cheerio.load(html);
  const data = $('script').get(0).children[0].data;
  const attrID = data.split('ATTRIBUTE_UUID=')[1].split('&')[0];
  let csrFHW = cleanRightSide(data.split('&CSRFHW=')[1].split('&')[0]);
  let wlanuserip = cleanRightSide(data.split('&wlanuserip=')[1].split('&')[0]);
  let loggerId = cleanRightSide(data.split('&loggerId=')[1].split('&')[0]);
  let username = cleanRightSide(data.split('&username=')[1].split('&')[0]);

  return {
    ATTRIBUTE_UUID: attrID,
    CSRFHW: csrFHW,
    wlanuserip,
    loggerId,
    username,
  };
};

export default dataWrapper;

const fetchCustom = (url, bodyData = {}, method = 'POST', contentType = 'application/x-www-form-urlencoded') => {
  const formBody = processBody(bodyData);
  return fetch(url, {
    method,
    body: formBody,
    headers: {
      'Content-Type': contentType,
    },
  });
};

const processBody = (sendData) => {
  let formBody = [];
  for (let property in sendData) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(sendData[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  return formBody;
};


export default fetchCustom;
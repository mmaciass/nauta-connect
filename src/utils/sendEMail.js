export const sendEMailIdentity = (identity) => {
  const subject = `Solicitud de licencia para Nauta Connect`;
  const body = `Identidad del usuario: 
                  ${JSON.stringify(identity)}`;
  window.location.href = `mailto:mmaciass940412@gmail.com?subject=${subject}&body=${body}`;
};

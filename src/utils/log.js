const Log = {
  /**
   * @param message
   * @param optionalParams
   * @constructor
   * @description Un console.log para mostrar en todos los entornos
   */
  All: (message, ...optionalParams) => {
    console.info(message, optionalParams);
  },

  /**
   * @param message
   * @param optionalParams
   * @constructor
   * @description Un console.log que solo se ejecuta cuando estas en modo producción
   */
  Production: (message, ...optionalParams) => {
    if (process.env.NODE_ENV === 'production')
      console.info(message, optionalParams);
  },

  /**
   * @param message
   * @param optionalParams
   * @constructor
   * @description Un console.log que solo se ejecuta cuando estas en modo desarrollo
   */
  Debug: (message, ...optionalParams) => {
    if (process.env.NODE_ENV === 'development')
      console.info(message, optionalParams);
  },
};

export default Log;

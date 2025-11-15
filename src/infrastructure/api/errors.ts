/**
 * Custom errors for ETECSA API
 */

export class EtecsaApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EtecsaApiError'
  }
}

export class NetworkError extends EtecsaApiError {
  constructor(message: string = 'Error de conexión de red') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class InvalidCredentialsError extends EtecsaApiError {
  constructor() {
    super('El nombre de usuario o contraseña son incorrectos')
    this.name = 'InvalidCredentialsError'
  }
}

export class AlreadyConnectedError extends EtecsaApiError {
  constructor() {
    super('Ya se encuentra un usuario conectado')
    this.name = 'AlreadyConnectedError'
  }
}

export class TooManyAttemptsError extends EtecsaApiError {
  constructor() {
    super('Usted ha realizado muchos intentos. Por favor intente más tarde')
    this.name = 'TooManyAttemptsError'
  }
}

export class NoBalanceError extends EtecsaApiError {
  constructor() {
    super('Su cuenta no tiene saldo disponible')
    this.name = 'NoBalanceError'
  }
}

export class AccountInUseError extends EtecsaApiError {
  constructor() {
    super('Su cuenta está siendo usada')
    this.name = 'AccountInUseError'
  }
}

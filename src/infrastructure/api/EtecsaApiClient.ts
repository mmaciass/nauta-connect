import type { IApiClient, LoginCredentials } from '@/domain/interfaces'
import type { Session } from '@/domain/entities'
import { TimeLeft } from '@/domain/entities'
import {
  NetworkError,
  InvalidCredentialsError,
  AlreadyConnectedError,
  TooManyAttemptsError,
  NoBalanceError,
  AccountInUseError,
} from './errors'

/**
 * EtecsaApiClient
 *
 * Cliente HTTP para interactuar con la API de ETECSA.
 * Maneja login, logout y consultas de tiempo restante.
 */
export class EtecsaApiClient implements IApiClient {
  private readonly baseUrl = 'https://secure.etecsa.net:8443'

  /**
   * Realiza login a Nauta y retorna el HTML de respuesta
   */
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/LoginServlet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
      })

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      // Verificar errores en la respuesta HTML
      this.checkForErrors(html)

      return html
    } catch (error) {
      if (error instanceof TypeError) {
        // Error de red (fetch failed)
        throw new NetworkError('No se pudo conectar con el servidor de ETECSA')
      }
      throw error
    }
  }

  /**
   * Realiza logout de una sesión activa
   */
  async logout(session: Session): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/LogoutServlet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ATTRIBUTE_UUID: session.uuid,
          CSRFHW: session.csrf,
          username: session.username,
          wlanuserip: session.userIp,
          loggerId: session.loggerId,
        }),
      })

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }

      // El logout exitoso retorna HTML simple
      await response.text()
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError('No se pudo conectar con el servidor de ETECSA')
      }
      throw error
    }
  }

  /**
   * Consulta el tiempo restante de una sesión
   */
  async queryTimeLeft(uuid: string): Promise<TimeLeft> {
    try {
      const response = await fetch(`${this.baseUrl}/EtecsaQueryServlet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ATTRIBUTE_UUID: uuid,
          op: 'getLeftTime',
        }),
      })

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      // Extraer el tiempo del HTML (formato: "HH:MM:SS")
      const timeMatch = html.match(/(\d{2}:\d{2}:\d{2})/)
      if (!timeMatch) {
        throw new NetworkError('No se pudo obtener el tiempo restante')
      }

      return TimeLeft.fromString(timeMatch[1])
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError('No se pudo conectar con el servidor de ETECSA')
      }
      throw error
    }
  }

  /**
   * Verifica la conectividad con el servidor de ETECSA
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000), // 5 segundos timeout
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Verifica si el HTML de respuesta contiene errores conocidos
   */
  private checkForErrors(html: string): void {
    // Error: credenciales incorrectas
    if (
      html.includes('Entre el nombre de usuario y contraseña correctos') ||
      html.includes('No se pudo autorizar al usuario') ||
      html.includes('El nombre de usuario o contraseña son incorrectos')
    ) {
      throw new InvalidCredentialsError()
    }

    // Error: usuario ya conectado
    if (html.includes('El usuario ya está conectado')) {
      throw new AlreadyConnectedError()
    }

    // Error: demasiados intentos
    if (html.includes('Usted ha realizado muchos intentos')) {
      throw new TooManyAttemptsError()
    }

    // Error: sin saldo
    if (html.includes('Su tarjeta no tiene saldo disponible')) {
      throw new NoBalanceError()
    }

    // Error: cuenta en uso
    if (html.includes('esta siendo usada')) {
      throw new AccountInUseError()
    }
  }
}

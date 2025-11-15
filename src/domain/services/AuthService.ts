import type { IApiClient, IStorageService, INotificationService } from '../interfaces'
import { User, Session } from '../entities'
import { EtecsaResponseParser } from '@/infrastructure/api/EtecsaResponseParser'
import {
  InvalidCredentialsError,
  AlreadyConnectedError,
  TooManyAttemptsError,
  NoBalanceError,
  AccountInUseError,
  NetworkError,
} from '@/infrastructure/api/errors'

/**
 * AuthService
 *
 * Servicio de autenticación que maneja login/logout.
 * Sigue el principio de Single Responsibility.
 */
export class AuthService {
  constructor(
    private readonly apiClient: IApiClient,
    private readonly storage: IStorageService,
    private readonly notifications: INotificationService
  ) {}

  /**
   * Realiza login con las credenciales proporcionadas
   */
  async login(
    username: string,
    password: string,
    remember: boolean = false
  ): Promise<Session> {
    try {
      // 1. Validar entrada
      const user = new User(username, password)

      // 2. Llamar API de login
      const html = await this.apiClient.login({
        username: user.username,
        password: user.getPassword(),
      })

      // 3. Parsear respuesta
      const parser = new EtecsaResponseParser(html)
      const session = parser.toSession(user.username)

      // 4. Persistir sesión
      await this.storage.saveSession(session)

      // 5. Guardar usuario si se requiere
      if (remember) {
        await this.storage.saveUser(user, true)
      }

      // 6. Obtener tiempo restante
      const timeLeft = await this.apiClient.queryTimeLeft(session.uuid)
      const updatedSession = session.updateTimeLeft(timeLeft)
      await this.storage.updateSession(updatedSession)

      // 7. Notificar éxito
      await this.notifications.success(
        'Usted se ha conectado satisfactoriamente. Ahora puede comenzar a navegar.'
      )

      // 8. Notificar al background para activar alarms
      chrome.runtime.sendMessage({
        type: 'auth:login-success',
        payload: { session: updatedSession.toJSON() },
      })

      return updatedSession
    } catch (error) {
      // Manejo de errores específico
      await this.handleLoginError(error)
      throw error
    }
  }

  /**
   * Realiza logout de la sesión actual
   */
  async logout(): Promise<void> {
    try {
      // 1. Cargar sesión actual
      const session = await this.storage.loadSession()

      if (!session) {
        await this.notifications.warning('No hay ninguna sesión activa')
        return
      }

      // 2. Llamar API de logout
      await this.apiClient.logout(session)

      // 3. Limpiar storage
      await this.storage.clearSession()

      // 4. Notificar éxito
      await this.notifications.success('Sesión cerrada exitosamente')

      // 5. Notificar al background
      chrome.runtime.sendMessage({
        type: 'auth:logout',
      })
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiar localmente
      await this.storage.clearSession()

      if (error instanceof NetworkError) {
        await this.notifications.warning(
          'Sesión cerrada localmente. No se pudo conectar con el servidor.'
        )
      } else {
        await this.notifications.error('Error al cerrar sesión')
      }

      throw error
    }
  }

  /**
   * Fuerza el logout sin intentar comunicarse con el servidor
   */
  async forceLogout(): Promise<void> {
    await this.storage.clearSession()
    await this.notifications.info('Sesión cerrada localmente')

    chrome.runtime.sendMessage({
      type: 'auth:logout',
    })
  }

  /**
   * Verifica si hay una sesión activa
   */
  async hasActiveSession(): Promise<boolean> {
    const session = await this.storage.loadSession()
    return session !== null && !session.isExpired()
  }

  /**
   * Obtiene la sesión actual (si existe)
   */
  async getCurrentSession(): Promise<Session | null> {
    return await this.storage.loadSession()
  }

  /**
   * Maneja los errores de login mostrando notificaciones apropiadas
   */
  private async handleLoginError(error: unknown): Promise<void> {
    if (error instanceof InvalidCredentialsError) {
      await this.notifications.error('El nombre de usuario o contraseña son incorrectos')
    } else if (error instanceof AlreadyConnectedError) {
      await this.notifications.warning('Ya se encuentra un usuario conectado')
    } else if (error instanceof TooManyAttemptsError) {
      await this.notifications.error(
        'Usted ha realizado muchos intentos. Por favor intente más tarde.'
      )
    } else if (error instanceof NoBalanceError) {
      await this.notifications.error('Su cuenta no tiene saldo disponible')
    } else if (error instanceof AccountInUseError) {
      await this.notifications.error('Su cuenta está siendo usada')
    } else if (error instanceof NetworkError) {
      await this.notifications.error('Ha ocurrido un error con la conexión de red')

      // Advertencia adicional sobre VPN
      const disableWarnings = await this.storage.getConfig<boolean>('disableWarnings')
      if (!disableWarnings) {
        setTimeout(async () => {
          await this.notifications.warning(
            'Por favor revise su conexión de red y asegúrese de no tener ningún VPN o ' +
              'herramienta que filtre el tráfico de red activa.'
          )
        }, 1000)
      }
    } else {
      await this.notifications.error('Ha ocurrido un error inesperado')
    }
  }
}

import type { IApiClient, IStorageService, INotificationService } from '../interfaces'
import type { Session } from '../entities'
import { NetworkError } from '@/infrastructure/api/errors'

/**
 * SessionManager
 *
 * Servicio para gestionar sesiones activas:
 * - Actualizar tiempo restante
 * - Notificar cuando la sesión está por expirar
 * - Restaurar sesiones guardadas
 */
export class SessionManager {
  private session: Session | null = null
  private readonly WARNING_THRESHOLD_MINUTES = 5 // Advertir cuando queden 5 minutos

  constructor(
    private readonly apiClient: IApiClient,
    private readonly storage: IStorageService,
    private readonly notifications: INotificationService
  ) {}

  /**
   * Inicia el seguimiento de una sesión
   */
  async startTracking(session: Session): Promise<void> {
    this.session = session
    await this.storage.saveSession(session)
  }

  /**
   * Actualiza el tiempo restante de la sesión actual
   */
  async updateRemainingTime(): Promise<Session | null> {
    try {
      // Cargar sesión actual
      const currentSession = this.session || (await this.storage.loadSession())

      if (!currentSession) {
        return null
      }

      // Consultar tiempo restante
      const newTimeLeft = await this.apiClient.queryTimeLeft(currentSession.uuid)

      // Actualizar sesión
      const updatedSession = currentSession.updateTimeLeft(newTimeLeft)
      this.session = updatedSession

      // Persistir
      await this.storage.updateSession(updatedSession)

      // Verificar si está por expirar
      if (updatedSession.isAboutToExpire(this.WARNING_THRESHOLD_MINUTES)) {
        await this.notifyLowTime(updatedSession)
      }

      // Verificar si ya expiró
      if (updatedSession.isExpired()) {
        await this.handleExpiredSession()
        return null
      }

      // Broadcast actualización
      chrome.runtime.sendMessage({
        type: 'session:updated',
        payload: updatedSession.toJSON(),
      })

      return updatedSession
    } catch (error) {
      if (error instanceof NetworkError) {
        // Solo notificar en el primer fallo, no en cada intento
        // TODO: implementar lógica de retry con contador
      }
      throw error
    }
  }

  /**
   * Restaura una sesión desde el storage
   */
  async restoreSession(): Promise<Session | null> {
    const session = await this.storage.loadSession()

    if (!session) {
      return null
    }

    // Verificar si la sesión no ha expirado
    if (session.isExpired()) {
      await this.storage.clearSession()
      return null
    }

    this.session = session

    // Intentar actualizar el tiempo
    try {
      return await this.updateRemainingTime()
    } catch {
      // Si falla la actualización, aún podemos usar la sesión guardada
      return session
    }
  }

  /**
   * Obtiene la sesión actual
   */
  getCurrentSession(): Session | null {
    return this.session
  }

  /**
   * Limpia la sesión actual
   */
  async clearSession(): Promise<void> {
    this.session = null
    await this.storage.clearSession()
  }

  /**
   * Notifica al usuario cuando queda poco tiempo
   */
  private async notifyLowTime(session: Session): Promise<void> {
    const disableWarnings = await this.storage.getConfig<boolean>('disableWarnings')

    if (disableWarnings) {
      return
    }

    await this.notifications.warning(
      `Quedan solo ${session.timeLeft.toHumanReadable()} de conexión. ` +
        'Considere recargar su cuenta pronto.',
      'Tiempo restante bajo'
    )
  }

  /**
   * Maneja una sesión que ha expirado
   */
  private async handleExpiredSession(): Promise<void> {
    await this.notifications.info(
      'Su sesión de Nauta ha expirado. Por favor, conéctese nuevamente.',
      'Sesión expirada'
    )

    await this.clearSession()

    chrome.runtime.sendMessage({
      type: 'session:expired',
    })
  }

  /**
   * Calcula el tiempo de conexión transcurrido
   */
  getElapsedTime(): string | null {
    if (!this.session) {
      return null
    }

    return this.session.elapsedTime.toHumanReadable()
  }

  /**
   * Verifica si hay una sesión activa
   */
  hasActiveSession(): boolean {
    return this.session !== null && !this.session.isExpired()
  }
}

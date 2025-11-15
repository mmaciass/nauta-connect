/**
 * Interface: INotificationService
 *
 * Define el contrato para mostrar notificaciones al usuario.
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions {
  title: string
  message: string
  type: NotificationType
  duration?: number
}

export interface INotificationService {
  /**
   * Muestra una notificación al usuario
   */
  show(options: NotificationOptions): Promise<void>

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, title?: string): Promise<void>

  /**
   * Muestra una notificación de error
   */
  error(message: string, title?: string): Promise<void>

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, title?: string): Promise<void>

  /**
   * Muestra una notificación informativa
   */
  info(message: string, title?: string): Promise<void>
}

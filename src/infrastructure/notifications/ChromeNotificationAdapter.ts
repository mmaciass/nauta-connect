import type {
  INotificationService,
  NotificationOptions,
  NotificationType,
} from '@/domain/interfaces'

/**
 * ChromeNotificationAdapter
 *
 * Implementación de INotificationService usando chrome.notifications API.
 */
export class ChromeNotificationAdapter implements INotificationService {
  private notificationId = 0

  /**
   * Muestra una notificación al usuario
   */
  async show(options: NotificationOptions): Promise<void> {
    const id = `nauta-notification-${++this.notificationId}-${Date.now()}`

    await chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: this.getIconForType(options.type),
      title: options.title,
      message: options.message,
      priority: this.getPriorityForType(options.type),
    })

    // Auto-clear después de la duración especificada
    if (options.duration && options.duration > 0) {
      setTimeout(() => {
        chrome.notifications.clear(id).catch(() => {
          // Ignorar errores si la notificación ya fue cerrada
        })
      }, options.duration)
    }
  }

  /**
   * Muestra una notificación de éxito
   */
  async success(message: string, title: string = 'Éxito'): Promise<void> {
    await this.show({
      title,
      message,
      type: 'success',
      duration: 5000, // 5 segundos
    })
  }

  /**
   * Muestra una notificación de error
   */
  async error(message: string, title: string = 'Error'): Promise<void> {
    await this.show({
      title,
      message,
      type: 'error',
      duration: 8000, // 8 segundos (más tiempo para errores)
    })
  }

  /**
   * Muestra una notificación de advertencia
   */
  async warning(message: string, title: string = 'Advertencia'): Promise<void> {
    await this.show({
      title,
      message,
      type: 'warning',
      duration: 6000, // 6 segundos
    })
  }

  /**
   * Muestra una notificación informativa
   */
  async info(message: string, title: string = 'Información'): Promise<void> {
    await this.show({
      title,
      message,
      type: 'info',
      duration: 5000, // 5 segundos
    })
  }

  /**
   * Obtiene el icono apropiado según el tipo de notificación
   */
  private getIconForType(type: NotificationType): string {
    // En una extensión Chrome, las rutas son relativas al manifest
    const iconMap: Record<NotificationType, string> = {
      success: 'icons/icon-128.png',
      error: 'icons/icon-128.png',
      warning: 'icons/icon-128.png',
      info: 'icons/icon-128.png',
    }

    return iconMap[type]
  }

  /**
   * Obtiene la prioridad según el tipo de notificación
   */
  private getPriorityForType(type: NotificationType): number {
    const priorityMap: Record<NotificationType, number> = {
      error: 2, // Alta
      warning: 1, // Media
      success: 0, // Normal
      info: 0, // Normal
    }

    return priorityMap[type]
  }
}

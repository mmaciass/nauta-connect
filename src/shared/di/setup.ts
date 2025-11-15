/**
 * Dependency Injection Setup
 *
 * Configura e inicializa todas las dependencias del sistema.
 */

import { container } from './ServiceContainer'
import { EtecsaApiClient } from '@/infrastructure/api'
import { ChromeStorageAdapter } from '@/infrastructure/storage'
import { ChromeNotificationAdapter } from '@/infrastructure/notifications'
import { AuthService, SessionManager } from '@/domain/services'

/**
 * Inicializa el container con todas las dependencias
 */
export function setupDependencies(): void {
  // Infrastructure Layer
  container.register('ApiClient', () => new EtecsaApiClient())
  container.register('StorageService', () => new ChromeStorageAdapter())
  container.register('NotificationService', () => new ChromeNotificationAdapter())

  // Domain Services Layer
  container.register(
    'AuthService',
    () =>
      new AuthService(
        container.resolve('ApiClient'),
        container.resolve('StorageService'),
        container.resolve('NotificationService')
      )
  )

  container.register(
    'SessionManager',
    () =>
      new SessionManager(
        container.resolve('ApiClient'),
        container.resolve('StorageService'),
        container.resolve('NotificationService')
      )
  )
}

/**
 * Helper para obtener el AuthService
 */
export function getAuthService(): AuthService {
  return container.resolve<AuthService>('AuthService')
}

/**
 * Helper para obtener el SessionManager
 */
export function getSessionManager(): SessionManager {
  return container.resolve<SessionManager>('SessionManager')
}

/**
 * Helper para obtener el StorageService
 */
export function getStorageService(): ChromeStorageAdapter {
  return container.resolve<ChromeStorageAdapter>('StorageService')
}

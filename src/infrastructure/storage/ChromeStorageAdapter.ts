import type { IStorageService } from '@/domain/interfaces'
import { Session, User } from '@/domain/entities'

/**
 * ChromeStorageAdapter
 *
 * Implementación de IStorageService usando chrome.storage API.
 * Usa chrome.storage.local para sesiones y chrome.storage.sync para usuarios guardados.
 */
export class ChromeStorageAdapter implements IStorageService {
  private readonly SESSION_KEY = 'nauta_session'
  private readonly USERS_KEY = 'nauta_saved_users'
  private readonly CONFIG_PREFIX = 'nauta_config_'

  /**
   * Guarda una sesión en storage
   */
  async saveSession(session: Session): Promise<void> {
    await chrome.storage.local.set({
      [this.SESSION_KEY]: session.toJSON(),
    })
  }

  /**
   * Carga la sesión guardada (si existe)
   */
  async loadSession(): Promise<Session | null> {
    const result = await chrome.storage.local.get(this.SESSION_KEY)
    const sessionData = result[this.SESSION_KEY]

    if (!sessionData) {
      return null
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Session.fromJSON(sessionData as any)
    } catch {
      // Si hay error al parsear, eliminar sesión corrupta
      await this.clearSession()
      return null
    }
  }

  /**
   * Elimina la sesión guardada
   */
  async clearSession(): Promise<void> {
    await chrome.storage.local.remove(this.SESSION_KEY)
  }

  /**
   * Actualiza una sesión existente
   */
  async updateSession(session: Session): Promise<void> {
    // En este caso, update = save
    await this.saveSession(session)
  }

  /**
   * Guarda un usuario (con o sin contraseña encriptada)
   */
  async saveUser(user: User, remember: boolean): Promise<void> {
    if (!remember) {
      // Si no se debe recordar, solo guardamos el username
      return
    }

    // Cargar usuarios existentes
    const users = await this.loadUsers()

    // Verificar si el usuario ya existe
    const existingIndex = users.findIndex((u) => u.username === user.username)

    if (existingIndex >= 0) {
      // Actualizar usuario existente
      users[existingIndex] = user
    } else {
      // Agregar nuevo usuario
      users.push(user)
    }

    // Guardar en sync storage (se sincroniza entre dispositivos)
    await chrome.storage.sync.set({
      [this.USERS_KEY]: users.map((u) => ({
        username: u.username,
        password: u.getPassword(), // TODO: Encriptar antes de guardar
      })),
    })
  }

  /**
   * Carga todos los usuarios guardados
   */
  async loadUsers(): Promise<User[]> {
    const result = await chrome.storage.sync.get(this.USERS_KEY)
    const usersData = result[this.USERS_KEY] as Array<{
      username: string
      password: string
    }> | undefined

    if (!usersData || !Array.isArray(usersData)) {
      return []
    }

    return usersData.map((data) => new User(data.username, data.password))
  }

  /**
   * Elimina un usuario guardado
   */
  async removeUser(username: string): Promise<void> {
    const users = await this.loadUsers()
    const filtered = users.filter((u) => u.username !== username)

    await chrome.storage.sync.set({
      [this.USERS_KEY]: filtered.map((u) => ({
        username: u.username,
        password: u.getPassword(),
      })),
    })
  }

  /**
   * Obtiene un valor de configuración
   */
  async getConfig<T>(key: string): Promise<T | null> {
    const result = await chrome.storage.local.get(this.CONFIG_PREFIX + key)
    const value = result[this.CONFIG_PREFIX + key]

    return value !== undefined ? (value as T) : null
  }

  /**
   * Guarda un valor de configuración
   */
  async setConfig<T>(key: string, value: T): Promise<void> {
    await chrome.storage.local.set({
      [this.CONFIG_PREFIX + key]: value,
    })
  }

  /**
   * Elimina un valor de configuración
   */
  async removeConfig(key: string): Promise<void> {
    await chrome.storage.local.remove(this.CONFIG_PREFIX + key)
  }

  /**
   * Limpia todo el storage (útil para testing o reset)
   */
  async clearAll(): Promise<void> {
    await chrome.storage.local.clear()
    await chrome.storage.sync.clear()
  }
}

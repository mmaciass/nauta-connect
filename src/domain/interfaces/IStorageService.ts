import { Session } from '../entities/Session'
import { User } from '../entities/User'

/**
 * Interface: IStorageService
 *
 * Define el contrato para persistencia de datos.
 * Abstrae el storage (chrome.storage, localStorage, etc)
 */

export interface IStorageService {
  // Session storage
  saveSession(session: Session): Promise<void>
  loadSession(): Promise<Session | null>
  clearSession(): Promise<void>
  updateSession(session: Session): Promise<void>

  // User credentials storage
  saveUser(user: User, remember: boolean): Promise<void>
  loadUsers(): Promise<User[]>
  removeUser(username: string): Promise<void>

  // Config storage
  getConfig<T>(key: string): Promise<T | null>
  setConfig<T>(key: string, value: T): Promise<void>
}

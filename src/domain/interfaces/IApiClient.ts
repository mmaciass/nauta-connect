import { Session } from '../entities/Session'
import { TimeLeft } from '../entities/TimeLeft'

/**
 * Interface: IApiClient
 *
 * Define el contrato para interactuar con la API de ETECSA.
 * Esta interface permite cambiar la implementación sin afectar el dominio.
 */

export interface LoginCredentials {
  username: string
  password: string
}

export interface IApiClient {
  /**
   * Realiza el login y retorna el HTML de respuesta
   */
  login(credentials: LoginCredentials): Promise<string>

  /**
   * Realiza el logout de una sesión
   */
  logout(session: Session): Promise<void>

  /**
   * Consulta el tiempo restante de una sesión
   */
  queryTimeLeft(uuid: string): Promise<TimeLeft>

  /**
   * Verifica la conectividad con el servidor de ETECSA
   */
  checkConnection(): Promise<boolean>
}

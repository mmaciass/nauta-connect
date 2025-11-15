import { TimeLeft } from './TimeLeft'

/**
 * Entity: Session
 *
 * Representa una sesión activa de conexión a Nauta.
 * Contiene todos los tokens y datos necesarios para mantener y cerrar la sesión.
 */
export class Session {
  constructor(
    public readonly username: string,
    public readonly uuid: string,
    public readonly csrf: string,
    public readonly userIp: string,
    public readonly loggerId: string,
    public readonly startTime: Date,
    private _timeLeft: TimeLeft,
    private _lastUpdate: Date = new Date()
  ) {
    this.validate()
  }

  /**
   * Valida que todos los campos requeridos estén presentes
   */
  private validate(): void {
    if (!this.username) throw new Error('Session username is required')
    if (!this.uuid) throw new Error('Session UUID is required')
    if (!this.csrf) throw new Error('Session CSRF token is required')
    if (!this.userIp) throw new Error('Session user IP is required')
    if (!this.loggerId) throw new Error('Session logger ID is required')
  }

  /**
   * Obtiene el tiempo restante de la sesión
   */
  get timeLeft(): TimeLeft {
    return this._timeLeft
  }

  /**
   * Obtiene la última vez que se actualizó el tiempo
   */
  get lastUpdate(): Date {
    return this._lastUpdate
  }

  /**
   * Obtiene el tiempo transcurrido desde el inicio de la sesión
   */
  get elapsedTime(): TimeLeft {
    const elapsedMs = new Date().getTime() - this.startTime.getTime()
    const elapsedSeconds = Math.floor(elapsedMs / 1000)
    return TimeLeft.fromSeconds(elapsedSeconds)
  }

  /**
   * Verifica si la sesión ha expirado
   */
  isExpired(): boolean {
    return this._timeLeft.isExpired()
  }

  /**
   * Verifica si quedan menos de N minutos
   */
  isAboutToExpire(minutes: number): boolean {
    return this._timeLeft.isLessThan(minutes)
  }

  /**
   * Actualiza el tiempo restante (retorna una nueva instancia - immutability)
   */
  updateTimeLeft(newTimeLeft: TimeLeft): Session {
    return new Session(
      this.username,
      this.uuid,
      this.csrf,
      this.userIp,
      this.loggerId,
      this.startTime,
      newTimeLeft,
      new Date() // Actualizar timestamp
    )
  }

  /**
   * Convierte a objeto JSON serializable para storage
   */
  toJSON(): {
    username: string
    uuid: string
    csrf: string
    userIp: string
    loggerId: string
    startTime: string
    timeLeft: string
    lastUpdate: string
  } {
    return {
      username: this.username,
      uuid: this.uuid,
      csrf: this.csrf,
      userIp: this.userIp,
      loggerId: this.loggerId,
      startTime: this.startTime.toISOString(),
      timeLeft: this._timeLeft.toString(),
      lastUpdate: this._lastUpdate.toISOString(),
    }
  }

  /**
   * Crea una Session desde un objeto JSON
   */
  static fromJSON(data: {
    username: string
    uuid: string
    csrf: string
    userIp: string
    loggerId: string
    startTime: string
    timeLeft: string
    lastUpdate?: string
  }): Session {
    return new Session(
      data.username,
      data.uuid,
      data.csrf,
      data.userIp,
      data.loggerId,
      new Date(data.startTime),
      TimeLeft.fromString(data.timeLeft),
      data.lastUpdate ? new Date(data.lastUpdate) : new Date()
    )
  }

  /**
   * Compara con otra sesión
   */
  equals(other: Session): boolean {
    return this.uuid === other.uuid && this.username === other.username
  }

  /**
   * Obtiene información resumida de la sesión
   */
  getSummary(): string {
    return `Session for ${this.username} - Time left: ${this._timeLeft.toHumanReadable()}`
  }
}

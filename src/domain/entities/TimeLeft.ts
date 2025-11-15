/**
 * Value Object: TimeLeft
 *
 * Representa el tiempo restante de una sesión de Nauta.
 * Es inmutable y valida sus valores.
 */
export class TimeLeft {
  constructor(
    public readonly hours: number,
    public readonly minutes: number,
    public readonly seconds: number
  ) {
    // Validación
    if (hours < 0 || minutes < 0 || seconds < 0) {
      throw new Error('Time values cannot be negative')
    }

    if (minutes >= 60 || seconds >= 60) {
      throw new Error('Minutes and seconds must be less than 60')
    }
  }

  /**
   * Retorna el tiempo total en segundos
   */
  get totalSeconds(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds
  }

  /**
   * Retorna el tiempo total en minutos
   */
  get totalMinutes(): number {
    return this.hours * 60 + this.minutes + this.seconds / 60
  }

  /**
   * Verifica si el tiempo ha expirado (0 segundos restantes)
   */
  isExpired(): boolean {
    return this.totalSeconds === 0
  }

  /**
   * Verifica si quedan menos de N minutos
   */
  isLessThan(minutes: number): boolean {
    return this.totalMinutes < minutes
  }

  /**
   * Crea un TimeLeft desde un string en formato "HH:MM:SS"
   */
  static fromString(timeStr: string): TimeLeft {
    const parts = timeStr.split(':')

    if (parts.length !== 3) {
      throw new Error(`Invalid time format: ${timeStr}. Expected HH:MM:SS`)
    }

    const [hours, minutes, seconds] = parts.map((part) => {
      const num = parseInt(part, 10)
      if (isNaN(num)) {
        throw new Error(`Invalid time format: ${timeStr}. Non-numeric value found`)
      }
      return num
    })

    return new TimeLeft(hours, minutes, seconds)
  }

  /**
   * Crea un TimeLeft desde segundos totales
   */
  static fromSeconds(totalSeconds: number): TimeLeft {
    if (totalSeconds < 0) {
      throw new Error('Total seconds cannot be negative')
    }

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.floor(totalSeconds % 60)

    return new TimeLeft(hours, minutes, seconds)
  }

  /**
   * Retorna el tiempo en formato "HH:MM:SS"
   */
  toString(): string {
    return `${this.pad(this.hours)}:${this.pad(this.minutes)}:${this.pad(this.seconds)}`
  }

  /**
   * Retorna el tiempo en formato legible (ej: "2h 30m 15s")
   */
  toHumanReadable(): string {
    const parts: string[] = []

    if (this.hours > 0) {
      parts.push(`${this.hours}h`)
    }
    if (this.minutes > 0) {
      parts.push(`${this.minutes}m`)
    }
    if (this.seconds > 0 || parts.length === 0) {
      parts.push(`${this.seconds}s`)
    }

    return parts.join(' ')
  }

  /**
   * Convierte a objeto JSON serializable
   */
  toJSON(): { hours: number; minutes: number; seconds: number; totalSeconds: number } {
    return {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      totalSeconds: this.totalSeconds,
    }
  }

  /**
   * Compara con otro TimeLeft
   */
  equals(other: TimeLeft): boolean {
    return (
      this.hours === other.hours &&
      this.minutes === other.minutes &&
      this.seconds === other.seconds
    )
  }

  /**
   * Helper para agregar padding de 0s
   */
  private pad(num: number): string {
    return num.toString().padStart(2, '0')
  }
}

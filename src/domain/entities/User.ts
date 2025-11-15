/**
 * Entity: User
 *
 * Representa un usuario de Nauta con sus credenciales.
 * Encapsula la lógica de validación y manejo de contraseñas.
 */
export class User {
  constructor(
    public readonly username: string,
    private readonly password: string
  ) {
    this.validateUsername(username)
    this.validatePassword(password)
  }

  /**
   * Valida el formato del username
   * Username de Nauta tiene formato: nombre@nauta.com.cu o nombre@nauta.co.cu
   */
  private validateUsername(username: string): void {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty')
    }

    // Validar formato de email de Nauta
    const nautaPattern = /^[a-zA-Z0-9._-]+@nauta\.(com\.cu|co\.cu)$/
    if (!nautaPattern.test(username)) {
      throw new Error(
        'Invalid Nauta username format. Expected: user@nauta.com.cu or user@nauta.co.cu'
      )
    }
  }

  /**
   * Valida que la contraseña no esté vacía
   */
  private validatePassword(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty')
    }

    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long')
    }
  }

  /**
   * Obtiene la contraseña (usada para autenticación)
   * NOTA: En un sistema real, esto debería estar encriptado
   */
  getPassword(): string {
    return this.password
  }

  /**
   * Retorna el username sin el dominio (@nauta.com.cu)
   */
  getUsernameWithoutDomain(): string {
    return this.username.split('@')[0]
  }

  /**
   * Verifica si es un usuario de Nauta Hogar (nauta.co.cu)
   */
  isNautaHogar(): boolean {
    return this.username.endsWith('@nauta.co.cu')
  }

  /**
   * Verifica si es un usuario de Nauta WiFi (nauta.com.cu)
   */
  isNautaWiFi(): boolean {
    return this.username.endsWith('@nauta.com.cu')
  }

  /**
   * Convierte a objeto JSON serializable (sin contraseña)
   */
  toJSON(): { username: string; isNautaHogar: boolean } {
    return {
      username: this.username,
      isNautaHogar: this.isNautaHogar(),
    }
  }

  /**
   * Crea un User desde un objeto plano
   */
  static fromJSON(data: { username: string; password: string }): User {
    return new User(data.username, data.password)
  }

  /**
   * Compara con otro usuario
   */
  equals(other: User): boolean {
    return this.username === other.username
  }
}

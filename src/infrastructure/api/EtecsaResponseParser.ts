import * as cheerio from 'cheerio'
import { Session, TimeLeft } from '@/domain/entities'
import { NetworkError } from './errors'

/**
 * SessionData extraído del HTML de login
 */
export interface SessionData {
  username: string
  uuid: string
  csrf: string
  userIp: string
  loggerId: string
}

/**
 * EtecsaResponseParser
 *
 * Parser para extraer información del HTML de respuesta de ETECSA.
 * Usa Cheerio para parsear HTML y extraer tokens de sesión.
 */
export class EtecsaResponseParser {
  private $: cheerio.CheerioAPI

  constructor(html: string) {
    this.$ = cheerio.load(html)
  }

  /**
   * Extrae los datos de sesión del HTML de login exitoso
   */
  extractSessionData(username: string): SessionData {
    const uuid = this.extractValue('ATTRIBUTE_UUID')
    const csrf = this.extractValue('CSRFHW')
    const userIp = this.extractValue('wlanuserip')
    const loggerId = this.extractValue('loggerId')

    if (!uuid || !csrf || !userIp || !loggerId) {
      throw new NetworkError('No se pudieron extraer los datos de sesión del HTML')
    }

    return {
      username,
      uuid,
      csrf,
      userIp,
      loggerId,
    }
  }

  /**
   * Extrae el tiempo restante del HTML de query
   */
  extractTimeLeft(): TimeLeft {
    const html = this.$.html()

    // Buscar patrón de tiempo "HH:MM:SS"
    const timeMatch = html.match(/(\d{2}:\d{2}:\d{2})/)

    if (!timeMatch) {
      throw new NetworkError('No se pudo extraer el tiempo restante del HTML')
    }

    return TimeLeft.fromString(timeMatch[1])
  }

  /**
   * Crea un objeto Session desde el HTML de login
   */
  toSession(username: string): Session {
    const sessionData = this.extractSessionData(username)

    return new Session(
      sessionData.username,
      sessionData.uuid,
      sessionData.csrf,
      sessionData.userIp,
      sessionData.loggerId,
      new Date(), // startTime
      TimeLeft.fromSeconds(0) // Se actualizará después con queryTimeLeft
    )
  }

  /**
   * Extrae el valor de un input hidden por su name
   */
  private extractValue(name: string): string | null {
    // Buscar input hidden con el name especificado
    const input = this.$(`input[name="${name}"]`)

    if (input.length > 0) {
      return input.attr('value') || null
    }

    // Algunos valores pueden estar en formato form
    const formMatch = this.$.html().match(
      new RegExp(`${name}[\\s]*=[\\s]*["\']([^"\']+)["\']`, 'i')
    )

    if (formMatch) {
      return formMatch[1]
    }

    return null
  }

  /**
   * Verifica si el HTML contiene un mensaje de error
   */
  hasError(): boolean {
    const html = this.$.html()
    return (
      html.includes('error') ||
      html.includes('incorrecto') ||
      html.includes('failed') ||
      html.includes('no autorizado')
    )
  }

  /**
   * Extrae el mensaje de error del HTML (si existe)
   */
  extractErrorMessage(): string | null {
    // Buscar elementos que típicamente contienen mensajes de error
    const errorSelectors = [
      '.error-message',
      '.alert-danger',
      '#error',
      '.notification.error',
    ]

    for (const selector of errorSelectors) {
      const element = this.$(selector)
      if (element.length > 0) {
        return element.text().trim()
      }
    }

    // Buscar en el HTML directamente
    const html = this.$.html()
    const errorPatterns = [
      /error[:\s]*([^<]+)/i,
      /mensaje[:\s]*([^<]+)/i,
      /alert[:\s]*([^<]+)/i,
    ]

    for (const pattern of errorPatterns) {
      const match = html.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    return null
  }
}

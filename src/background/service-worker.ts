/**
 * Service Worker para Nauta Connect v2
 *
 * Este service worker es MINIMALISTA y solo maneja:
 * 1. Alarms para actualización periódica de tiempo
 * 2. Mensajes del dominio (login, logout, session updates)
 * 3. Badge updates del icono
 * 4. Lifecycle events (install, update)
 *
 * TODO lo demás (UI, dialogs, themes, etc) se maneja en el popup.
 */

import { setupDependencies, getSessionManager } from '@/shared/di'

// Setup dependencies una vez al iniciar el service worker
setupDependencies()

// Listener para cuando se instala la extensión
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Primera instalación
    chrome.storage.local.set({
      firstInstall: true,
      installedAt: new Date().toISOString()
    })

    // Abrir página de bienvenida (opcional)
    // chrome.tabs.create({ url: 'options.html' })
  } else if (details.reason === 'update') {
    // Actualización de versión
    const previousVersion = details.previousVersion
    chrome.storage.local.set({
      lastUpdate: new Date().toISOString(),
      previousVersion
    })
  }
})

// Listener para alarms (actualizaciones periódicas)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'update-session-time') {
    try {
      // Actualizar tiempo restante usando SessionManager
      const sessionManager = getSessionManager()
      const updatedSession = await sessionManager.updateRemainingTime()

      if (updatedSession) {
        // La actualización fue exitosa
        updateBadge('connected')
      } else {
        // La sesión ya no existe o expiró
        updateBadge('disconnected')
        chrome.alarms.clear('update-session-time')
      }
    } catch (error) {
      // Error al actualizar, pero no detenemos el alarm
      console.error('Error updating session time:', error)
      updateBadge('error')
    }
  }
})

// Listener para mensajes del popup/options
chrome.runtime.onMessage.addListener((message) => {
  // Solo manejamos mensajes de dominio (auth, session)
  // NO manejamos UI (dialogs, themes, etc)

  switch (message.type) {
    case 'auth:login-success':
      // Sesión iniciada, configurar alarm para actualización
      chrome.alarms.create('update-session-time', {
        periodInMinutes: 1
      })
      // Actualizar badge
      updateBadge('connected')
      break

    case 'auth:logout':
      // Sesión cerrada, limpiar alarm
      chrome.alarms.clear('update-session-time')
      // Actualizar badge
      updateBadge('disconnected')
      break

    case 'session:updated':
      // Sesión actualizada, broadcast a todas las pestañas abiertas
      chrome.runtime.sendMessage(message)
      break

    default:
      // Mensaje no reconocido
      break
  }

  // No necesitamos sendResponse async, por eso no retornamos true
})

/**
 * Actualiza el badge del icono de la extensión
 */
function updateBadge(status: 'connected' | 'disconnected' | 'error'): void {
  if (status === 'connected') {
    chrome.action.setBadgeText({ text: '✓' })
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' })
  } else if (status === 'disconnected') {
    chrome.action.setBadgeText({ text: '' })
  } else if (status === 'error') {
    chrome.action.setBadgeText({ text: '!' })
    chrome.action.setBadgeBackgroundColor({ color: '#F44336' })
  }
}

// Restaurar sesión al iniciar (si existe)
chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get('session')
  const session = result.session as { uuid?: string } | undefined

  if (session?.uuid) {
    // Hay una sesión guardada, actualizar badge
    updateBadge('connected')

    // Reiniciar alarm de actualización
    chrome.alarms.create('update-session-time', {
      periodInMinutes: 1
    })
  }
})

// Export para testing (si se necesita)
export { updateBadge }

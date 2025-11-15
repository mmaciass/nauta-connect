# Comparación de Funcionalidades: v1 vs v2

## 📋 Resumen Ejecutivo

Este documento compara las funcionalidades del proyecto original (v1 - Manifest V2) con el proyecto modernizado (v2 - Manifest V3).

**Referencia v1**: `/home/user/nauta-connect-v1-reference` (branch: master)
**Proyecto v2**: `/home/user/nauta-connect` (branch: claude/modernize-deprecated-dependencies-01QSYquVoSHUfv5UxH4KVaFm)

---

## ✅ Funcionalidades Implementadas en v2

### Core Features (Completadas)
| Funcionalidad | v1 | v2 | Estado | Notas |
|---------------|----|----|--------|-------|
| Login/Logout | ✅ | ✅ | ✅ Completado | Mejorado con TypeScript y validación Zod |
| Session Management | ✅ | ✅ | ✅ Completado | SessionManager con Clean Architecture |
| Time Display | ✅ | ✅ | ✅ Completado | TimeDisplay component |
| Auto-refresh | ✅ | ✅ | ✅ Completado | Chrome alarms cada 1 minuto |
| Notifications | ✅ | ✅ | ✅ Completado | ChromeNotificationAdapter |
| Saved Users | ✅ | ✅ | ✅ Completado | Con autocomplete en LoginForm |
| Theme Support | ✅ | ✅ | ✅ Completado | Light/Dark/Auto con MUI 7 |
| Storage | ✅ | ✅ | ✅ Completado | ChromeStorageAdapter (local + sync) |
| Badge Updates | ✅ | ✅ | ✅ Completado | Service worker actualiza badge |
| Error Handling | ⚠️ Básico | ✅ | ✅ Mejorado | Error Boundaries + Custom Errors |

---

## ❌ Funcionalidades Faltantes en v2

### 1. **Sistema de Proxy** ⚠️ IMPORTANTE

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/actions/proxyAutoAction.js`, `proxyDisableAction.js`, `proxyEnableAction.js`
- `src/utils/proxy.js`
- `src/store/reducers/proxy.js`
- Permiso `"proxy"` en manifest

**Descripción**:
- Configura proxy automático o manual para Firefox
- Lista de servidores proxy configurables
- Bypass list (localhost, 127.0.0.1)
- Auto-rotación de proxies

**Prioridad**: 🔴 **ALTA** - Esta funcionalidad es crítica para la red Nauta en Cuba

**Acciones requeridas**:
```typescript
// Necesitamos implementar:
1. ProxyService en infrastructure layer
2. Proxy configuration en configStore
3. UI para habilitar/deshabilitar proxy
4. Auto-detección y rotación de proxies
5. Agregar permiso "proxy" en manifest.json
```

**Manifest V3 Consideraciones**:
- El API de proxy cambió en Manifest V3
- Usar `chrome.proxy` API
- Verificar compatibilidad con Firefox

---

### 2. **Sistema de Licencias** ℹ️ OPCIONAL

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/pages/License/` (6 archivos)
  - `License.jsx` - Página principal
  - `activate.jsx` - Activación
  - `content.jsx` - Contenido
  - `description.jsx` - Descripción
  - `identity.jsx` - Identidad del usuario
  - `request.jsx` - Solicitud de licencia

**Descripción**:
Sistema completo de licencias para activación de la extensión

**Prioridad**: 🟡 **BAJA** - Solo si la extensión será de pago

**Decisión requerida**: ¿La v2 será gratuita o de pago?

---

### 3. **Splash Screen**

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/screens/Splash/index.js`
- `src/screens/Splash/anims.css`
- `src/screens/Splash/staticsStyles.css`
- `src/actions/splashAction.js`

**Descripción**:
- Pantalla de bienvenida al abrir la extensión
- Animaciones CSS
- Se oculta después de cargar

**Prioridad**: 🟢 **MEDIA** - Mejora UX pero no es crítica

**Implementación sugerida**:
```typescript
// src/presentation/components/Splash/Splash.tsx
- Componente con animación de carga
- Timeout de 2-3 segundos
- Mostrar logo de Nauta Connect
```

---

### 4. **Diálogo About/Acerca de**

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/components/AboutDialogCustom.jsx`
- `src/actions/dialogAboutAction.js`

**Descripción**:
- Información sobre la extensión
- Versión, autor, créditos
- Accesible desde menú de opciones

**Prioridad**: 🟢 **MEDIA**

**Implementación sugerida**:
```typescript
// src/presentation/components/AboutDialog/AboutDialog.tsx
- Dialog component con MUI
- Información de la extensión
- Link a GitHub, licencia, etc.
```

---

### 5. **Timer de Desconexión**

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/components/TimerDialogCustom.jsx`
- `src/actions/dialogTimerAction.js`
- `src/store/reducers/timerConnection.js`

**Descripción**:
- Programar desconexión automática
- Configurar tiempo en minutos/horas
- Notificación antes de desconectar

**Prioridad**: 🔴 **ALTA** - Funcionalidad muy útil

**Implementación sugerida**:
```typescript
// src/presentation/components/DisconnectTimer/DisconnectTimer.tsx
- Dialog para configurar timer
- Chrome alarms para programar desconexión
- Notificación 5 minutos antes
```

---

### 6. **Diálogo de Usuarios Guardados**

**Estado**: ⚠️ Parcialmente implementado

**v1 Implementación**:
- `src/components/DialogUsersCustom.jsx`
- `src/actions/dialogUsersAction.js`
- UI completa para gestionar usuarios

**v2 Estado actual**:
- ✅ Autocomplete en LoginForm
- ❌ No hay UI para eliminar usuarios
- ❌ No hay UI para ver lista completa

**Prioridad**: 🟡 **MEDIA**

**Implementación sugerida**:
```typescript
// Agregar a Options page:
- Lista de usuarios guardados
- Botón para eliminar cada usuario
- Opción "Olvidar todos"
```

---

### 7. **Menú de Opciones Completo**

**Estado**: ⚠️ Parcialmente implementado

**v1 Implementación**:
- `src/components/MenuOptionsCustom.jsx`
- Menú contextual en el popup
- Acceso a: About, Users, Settings, Theme

**v2 Estado actual**:
- ✅ Theme switcher en header
- ❌ No hay menú de opciones
- ❌ Options page está vacía

**Prioridad**: 🔴 **ALTA**

**Implementación sugerida**:
```typescript
// src/presentation/components/OptionsMenu/OptionsMenu.tsx
- IconButton con Menu (MUI)
- Items: About, Settings, Users, Disconnect Timer
- Shortcut a options page
```

---

### 8. **Configuraciones Adicionales**

**Estado**: ⚠️ Parcialmente implementado

**v1 Features en configs**:
- ✅ `theme` - Implementado ✅
- ❌ `preventSleep` - NO implementado
- ✅ `disableWarnings` - Implementado en código ✅
- ❌ `proxy` settings - NO implementado

**Faltantes**:

#### 8.1 Prevent Sleep
```typescript
// Evitar que la computadora entre en suspensión mientras esté conectado
// Usar chrome.power API
interface PowerState {
  level: 'system' | 'display'
  enabled: boolean
}
```

#### 8.2 Proxy Settings
```typescript
// Configuración de proxy
interface ProxySettings {
  automatic: boolean
  active: boolean
  serversList: string[]
  byPassList: string[]
  currentProxy: number
}
```

**Prioridad**: 🟢 **MEDIA**

---

### 9. **Detectar Navegador**

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/actions/detectNavigatorAction.js`
- Detecta si es Chrome, Firefox, Edge, etc.
- Ajusta comportamiento según navegador

**v2 Consideración**:
- Manifest V3 es más estándar
- Menos diferencias entre navegadores
- Pero aún puede ser útil para features específicos (ej: proxy en Firefox)

**Prioridad**: 🟢 **MEDIA**

**Implementación sugerida**:
```typescript
// src/shared/utils/detectBrowser.ts
export const detectBrowser = (): Browser => {
  const ua = navigator.userAgent
  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Edg')) return 'edge'
  if (ua.includes('Chrome')) return 'chrome'
  // ...
}
```

---

### 10. **Connect Qualified Dialog**

**Estado**: ❌ No implementado

**v1 Implementación**:
- `src/actions/connectQualifiedAction.js`
- Diálogo de "Conectar como calificado"
- Contador de conexiones

**Descripción**:
Sistema para conectarse con credenciales especiales (cuenta calificada de Nauta)

**Prioridad**: 🟡 **BAJA** - Feature específico de usuarios avanzados

---

### 11. **Utilidades Adicionales**

**v1 Utils no implementados**:

#### 11.1 Copy to Clipboard
- `src/utils/copyToClipboard.js`
- Copiar información de sesión al portapapeles

#### 11.2 Send Email
- `src/utils/sendEMail.js`
- Enviar reporte por email

#### 11.3 HTML Wrapper
- `src/utils/htmlWrapper.js`
- Wrapper para manipulación HTML

**Prioridad**: 🟢 **BAJA** - Utils no críticas

---

## 📊 Resumen de Prioridades

### 🔴 Prioridad ALTA (Críticas)
1. **Sistema de Proxy** - Funcionalidad core para Cuba
2. **Timer de Desconexión** - Feature muy útil
3. **Menú de Opciones** - Acceso a configuraciones

### 🟡 Prioridad MEDIA (Importantes)
4. **Splash Screen** - Mejora UX
5. **Diálogo About** - Información de la app
6. **Prevent Sleep** - Configuración útil
7. **Detectar Navegador** - Compatibilidad multi-browser

### 🟢 Prioridad BAJA (Opcionales)
8. **Sistema de Licencias** - Solo si es de pago
9. **Connect Qualified** - Feature avanzado
10. **Utilidades adicionales** - Nice to have

---

## 🎯 Roadmap Sugerido

### Phase 5: Critical Features (Prioridad ALTA)
```
├── Sistema de Proxy
│   ├── ProxyService infrastructure
│   ├── Proxy configuration UI
│   ├── Auto-rotación de proxies
│   └── Actualizar manifest con permiso "proxy"
│
├── Timer de Desconexión
│   ├── DisconnectTimer component
│   ├── Chrome alarms para timer
│   └── Notificación antes de desconectar
│
└── Menú de Opciones
    ├── OptionsMenu component
    ├── Navegación a settings
    └── Shortcuts a features
```

### Phase 6: Important Features (Prioridad MEDIA)
```
├── Splash Screen
├── About Dialog
├── Prevent Sleep
├── Browser Detection
└── Options Page completa
```

### Phase 7: Optional Features (Prioridad BAJA)
```
├── Sistema de Licencias (si aplica)
├── Connect Qualified
└── Utils adicionales
```

---

## 📝 Notas Técnicas

### Manifest V3 Changes Impactan
- **Proxy API**: Cambió de V2 a V3, necesita actualización
- **Persistent background**: Ya no existe, usamos service worker
- **Content Security Policy**: Más restrictivo en V3

### Decisiones de Diseño v2
- ✅ Clean Architecture permite agregar features fácilmente
- ✅ TypeScript asegura type safety
- ✅ Zustand simplifica state management vs Redux
- ✅ Material UI 7 tiene componentes para dialogs, menus, etc.

### Recomendaciones
1. **Proxy**: Implementar primero - es crítico para Cuba
2. **Timer**: Segunda prioridad - muy solicitado por usuarios
3. **Options Menu**: Tercero - da acceso a todo lo demás
4. **Licencias**: Decidir si la v2 será gratuita o de pago

---

**Última actualización**: 2025-11-15
**Versión v1 analizada**: master branch
**Versión v2 actual**: 2.0.0 - Phase 4 complete

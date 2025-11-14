# 🚀 Estrategia de Modernización: Nauta Connect v2.0

## 📋 Tabla de Contenidos
1. [Análisis de la Situación Actual](#análisis-situación-actual)
2. [Problemas Identificados](#problemas-identificados)
3. [Objetivos de la Modernización](#objetivos)
4. [Nueva Arquitectura Propuesta](#nueva-arquitectura)
5. [Stack Tecnológico Moderno](#stack-tecnológico)
6. [Migración a Manifest V3](#manifest-v3)
7. [Arquitectura por Capas (SOLID/DRY)](#arquitectura-capas)
8. [Plan de Implementación](#plan-implementación)
9. [Soporte Multi-Navegador](#multi-navegador)
10. [Deuda Técnica: Zero](#deuda-técnica)

---

## 📊 Análisis de la Situación Actual {#análisis-situación-actual}

### Stack Actual (DEPRECADO)
```
Manifest V2         ❌ Deprecado desde 2023
React 16.13.1       ❌ 4+ años desactualizado
Redux 4.0.5         ⚠️  No sigue mejores prácticas modernas
Material-UI 4       ❌ EOL, ahora es MUI 5+
Webpack 4           ❌ Antiguo, lento
Babel transpiling   ⚠️  Innecesario con tooling moderno
react-chrome-redux  ⚠️  Arquitectura compleja innecesaria
CryptoJS            ⚠️  Puede usar Web Crypto API nativa
No TypeScript       ❌ Sin type safety
No tests            ❌ Sin cobertura de tests
Formik v2           ⚠️  Puede usar React Hook Form
```

### Arquitectura Actual (PROBLEMÁTICA)

**Background Script hace DEMASIADO:**
```javascript
❌ Maneja 20+ mensajes del popup solo para Redux actions
❌ Controla estado de UI (dialogs, themes, animaciones)
❌ Usa React solo para un switch/case gigante
❌ Video trick hacky para prevenir sleep
❌ Proxy management mezclado con UI logic
```

**Problemas de Arquitectura:**
- ❌ Violación de SRP (Single Responsibility Principle)
- ❌ Alto acoplamiento entre background y UI
- ❌ Lógica de negocio mezclada con UI
- ❌ Código duplicado en múltiples actions
- ❌ No hay separación de concerns
- ❌ Tests imposibles sin refactoring mayor

---

## 🔴 Problemas Identificados {#problemas-identificados}

### 1. Background Script Innecesario
El background actual hace cosas que NO debería:

**LO QUE HACE (MALO):**
```javascript
✗ Abrir/cerrar dialogs (UI state)
✗ Cambiar temas (UI preference)
✗ Manejar animaciones (UI)
✗ Prevenir sleep con video (hack)
✗ Gestionar configuración de UI
✗ Ser intermediario para todas las Redux actions
```

**LO QUE DEBERÍA HACER (BUENO):**
```javascript
✓ Llamadas HTTP a ETECSA API
✓ Gestión de sesión persistente
✓ Alarms para actualización de tiempo
✓ Notificaciones de sistema
✓ Gestión de proxy (solo si es necesario)
✓ Badge updates (icono extensión)
```

### 2. Manifest V2 → V3 Requiere Cambios Grandes

| Manifest V2 (Actual) | Manifest V3 (Requerido) |
|---------------------|------------------------|
| `background.page` persistent | `service_worker` no-persistent |
| XMLHttpRequest | fetch API only |
| `browser_action` | `action` |
| Blocking webRequest | declarativeNetRequest |
| `executeScript` direct | scripting API |

### 3. Dependencias Críticas Desactualizadas

```bash
react@16.13.1       → react@18.3.1       (CVE fixes + performance)
webpack@4.42.1      → vite@5.4.0         (10x más rápido)
@material-ui/core@4 → @mui/material@6    (nuevo API)
redux@4             → zustand o jotai    (más simple, menos boilerplate)
formik@2            → react-hook-form@7  (mejor performance)
```

### 4. Violación de Principios SOLID

**Single Responsibility Principle:**
- ❌ `Background.jsx`: 20+ responsabilidades diferentes
- ❌ `loginAction.js`: HTTP + parsing + storage + notification
- ❌ Actions mezcladas con side effects

**Open/Closed Principle:**
- ❌ Difícil extender sin modificar código existente
- ❌ Switch/case gigante para mensajes

**Dependency Inversion:**
- ❌ Components directamente acoplados a Chrome API
- ❌ No hay abstractions/interfaces

---

## 🎯 Objetivos de la Modernización {#objetivos}

### Objetivos Principales

1. ✅ **Manifest V3 Compliant** - 100% compatible con últimos estándares
2. ✅ **Multi-Browser** - Chrome, Firefox, Edge, Brave, Opera
3. ✅ **TypeScript** - Type safety completo
4. ✅ **SOLID Principles** - Arquitectura mantenible y escalable
5. ✅ **DRY Code** - Cero duplicación
6. ✅ **Zero Deuda Técnica** - Código limpio desde día 1
7. ✅ **Testing** - >80% cobertura de tests
8. ✅ **Performance** - Carga <100ms, bundle <200KB
9. ✅ **Accessibility** - WCAG 2.1 AA compliant
10. ✅ **Security** - CSP strict, permisos mínimos

---

## 🏗️ Nueva Arquitectura Propuesta {#nueva-arquitectura}

### Arquitectura de 3 Capas (Clean Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Popup    │  │   Options  │  │  Offscreen │        │
│  │  (React)   │  │   (React)  │  │  (Service) │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│         │               │                │              │
└─────────┼───────────────┼────────────────┼──────────────┘
          │               │                │
┌─────────┼───────────────┼────────────────┼──────────────┐
│         ▼               ▼                ▼              │
│                   APPLICATION LAYER                     │
│  ┌──────────────────────────────────────────────┐      │
│  │         State Management (Zustand)           │      │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────┐   │      │
│  │  │  Auth   │  │  Session │  │   Config  │   │      │
│  │  │  Store  │  │  Store   │  │   Store   │   │      │
│  │  └─────────┘  └──────────┘  └───────────┘   │      │
│  └──────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────┐      │
│  │              Use Cases (Hooks)               │      │
│  │  useLogin, useLogout, useSession, useTimer   │      │
│  └──────────────────────────────────────────────┘      │
└─────────┬───────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│                    DOMAIN LAYER                         │
│  ┌──────────────────────────────────────────────┐      │
│  │              Business Logic                   │      │
│  │  ┌────────────┐  ┌──────────────┐           │      │
│  │  │  Entities  │  │  Services     │           │      │
│  │  │  - User    │  │  - AuthSvc    │           │      │
│  │  │  - Session │  │  - SessionSvc │           │      │
│  │  │  - Time    │  │  - StorageSvc │           │      │
│  │  └────────────┘  └──────────────┘           │      │
│  └──────────────────────────────────────────────┘      │
└─────────┬───────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                    │
│  ┌──────────────────────────────────────────────┐      │
│  │           External Adapters                   │      │
│  │  ┌──────────────┐  ┌──────────────┐         │      │
│  │  │  ETECSA API  │  │  Storage API │         │      │
│  │  │  Repository  │  │  (chrome.*)  │         │      │
│  │  └──────────────┘  └──────────────┘         │      │
│  │  ┌──────────────┐  ┌──────────────┐         │      │
│  │  │  Notification│  │   Alarm API  │         │      │
│  │  │   Adapter    │  │   Adapter    │         │      │
│  │  └──────────────┘  └──────────────┘         │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Service Worker (Background) - SOLO LO ESENCIAL

**Nueva responsabilidad MÍNIMA:**
```typescript
// background/service-worker.ts

import { sessionManager } from '@/domain/services/SessionManager'
import { alarmManager } from '@/domain/services/AlarmManager'
import { badgeManager } from '@/domain/services/BadgeManager'

// SOLO maneja:
// 1. Alarms persistentes
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'update-time') {
    await sessionManager.updateRemainingTime()
  }
})

// 2. Badge updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'session:connected') {
    badgeManager.setConnected()
  }
})

// 3. Install/update lifecycle
chrome.runtime.onInstalled.addListener(() => {
  sessionManager.restoreSession()
})

// ESO ES TODO. Nada más.
```

**TODO LO DEMÁS va al Popup/UI:**
- Dialogs → React state local
- Themes → localStorage + React context
- Animations → CSS/Framer Motion
- Forms → React Hook Form

---

## 💻 Stack Tecnológico Moderno {#stack-tecnológico}

### Core Stack

```typescript
// package.json (nuevo)
{
  "dependencies": {
    // UI Framework
    "react": "^18.3.1",
    "react-dom": "^18.3.1",

    // State Management (más simple que Redux)
    "zustand": "^4.5.0",              // 3KB, API simple

    // UI Components
    "@mui/material": "^6.1.0",
    "@mui/icons-material": "^6.1.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",

    // Forms
    "react-hook-form": "^7.53.0",     // Mejor performance que Formik
    "zod": "^3.23.0",                 // Validación con TypeScript

    // Utilities
    "date-fns": "^3.0.0",             // Mejor que moment (tree-shakeable)
    "webextension-polyfill": "^0.12.0" // Multi-browser support
  },
  "devDependencies": {
    // Build Tool
    "vite": "^5.4.0",                 // 10x más rápido que webpack
    "@crxjs/vite-plugin": "^2.0.0",   // Manifest V3 support

    // TypeScript
    "typescript": "^5.6.0",
    "@types/react": "^18.3.0",
    "@types/chrome": "^0.0.270",
    "@types/webextension-polyfill": "^0.12.0",

    // Testing
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "playwright": "^1.47.0",          // E2E tests

    // Linting
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "prettier": "^3.3.0",

    // Git Hooks
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### Por qué estos cambios?

| Antiguo | Nuevo | Razón |
|---------|-------|-------|
| Redux + react-chrome-redux | Zustand | -90% código boilerplate, API más simple |
| Webpack 4 | Vite + CRXJS | Build 10x más rápido, HMR instantáneo |
| Material-UI 4 | MUI 6 | Soporte actual, mejores APIs, menos bugs |
| Formik | React Hook Form + Zod | Mejor performance, TypeScript nativo |
| Moment.js | date-fns | Tree-shakeable, más pequeño |
| CryptoJS | Web Crypto API | Nativo del browser, más seguro |
| Babel | Vite (esbuild) | 10-100x más rápido |
| No TypeScript | TypeScript 5.6 | Type safety, menos bugs |

---

## 📦 Migración a Manifest V3 {#manifest-v3}

### Manifest V3 Completo

```json
{
  "manifest_version": 3,
  "name": "Nauta Connect",
  "version": "2.0.0",
  "description": "Conecta a la red Nauta de ETECSA de forma rápida y segura",

  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },

  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },

  "permissions": [
    "storage",
    "alarms",
    "notifications",
    "scripting"
  ],

  "host_permissions": [
    "https://secure.etecsa.net/*"
  ],

  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },

  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },

  "options_page": "options.html"
}
```

### Cambios Clave de V2 → V3

#### 1. Background: Persistent Page → Service Worker
```typescript
// ❌ ANTIGUO (V2): background.html con React
<html>
  <body>
    <div id="root"></div>
    <video loop>...</video>  <!-- hack innecesario -->
  </body>
</html>

// ✅ NUEVO (V3): service-worker.ts minimalista
// Solo JavaScript puro, NO React, NO DOM
// Se ejecuta cuando es necesario, se duerme cuando no
```

#### 2. Storage API (sin cambios, pero mejor uso)
```typescript
// ✅ Usar chrome.storage.session para sesiones temporales (V3 nuevo)
await chrome.storage.session.set({ sessionToken: token })

// ✅ Usar chrome.storage.local para config persistente
await chrome.storage.local.set({ theme: 'dark' })

// ✅ Usar chrome.storage.sync para multi-device (10KB max)
await chrome.storage.sync.set({ savedUsers: users })
```

#### 3. Alarms para tareas periódicas
```typescript
// ❌ ANTIGUO: setTimeout (se pierde al cerrar popup)
setTimeout(() => updateTime(), 60000)

// ✅ NUEVO: chrome.alarms (persiste)
chrome.alarms.create('update-time', { periodInMinutes: 1 })
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'update-time') {
    await updateRemainingTime()
  }
})
```

#### 4. Mensajes solo cuando es necesario
```typescript
// ❌ ANTIGUO: 20+ tipos de mensajes solo para Redux
chrome.runtime.sendMessage({ type: 'OPEN_DIALOG_USERS' })
chrome.runtime.sendMessage({ type: 'NEXT_THEME' })
chrome.runtime.sendMessage({ type: 'HIDE_SPLASH' })

// ✅ NUEVO: Solo mensajes de dominio (lógica de negocio)
chrome.runtime.sendMessage({ type: 'auth:login', payload })
chrome.runtime.sendMessage({ type: 'session:logout' })
// Dialogs, themes, etc → manejados localmente en React
```

---

## 🧱 Arquitectura por Capas (SOLID/DRY) {#arquitectura-capas}

### 1. Domain Layer (Núcleo de Negocio)

```typescript
// src/domain/entities/User.ts
export class User {
  constructor(
    public readonly username: string,
    private password: string
  ) {}

  // Encapsulación: password no es accesible directamente
  async getEncryptedPassword(): Promise<string> {
    const key = await crypto.subtle.importKey(...)
    return encrypt(this.password, key)
  }
}

// src/domain/entities/Session.ts
export class Session {
  constructor(
    public readonly uuid: string,
    public readonly csrf: string,
    public readonly userIp: string,
    public readonly loggerId: string,
    public readonly startTime: Date,
    private _timeLeft: TimeLeft
  ) {}

  get timeLeft(): TimeLeft {
    return this._timeLeft
  }

  updateTimeLeft(newTime: TimeLeft): Session {
    // Immutability: retorna nueva instancia
    return new Session(
      this.uuid,
      this.csrf,
      this.userIp,
      this.loggerId,
      this.startTime,
      newTime
    )
  }

  isExpired(): boolean {
    return this._timeLeft.totalSeconds === 0
  }
}

// src/domain/value-objects/TimeLeft.ts
export class TimeLeft {
  constructor(
    public readonly hours: number,
    public readonly minutes: number,
    public readonly seconds: number
  ) {
    if (hours < 0 || minutes < 0 || seconds < 0) {
      throw new Error('Time cannot be negative')
    }
  }

  get totalSeconds(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds
  }

  static fromString(timeStr: string): TimeLeft {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number)
    return new TimeLeft(hours, minutes, seconds)
  }

  toString(): string {
    return `${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}`
  }
}
```

### 2. Services Layer (Lógica de Aplicación)

```typescript
// src/domain/services/AuthService.ts
// SOLID: Single Responsibility - solo autenticación

export interface IAuthService {
  login(username: string, password: string): Promise<Session>
  logout(session: Session): Promise<void>
}

export class AuthService implements IAuthService {
  constructor(
    private readonly apiClient: IEtecsaApiClient,
    private readonly storage: IStorageService,
    private readonly notifier: INotificationService
  ) {} // Dependency Injection

  async login(username: string, password: string): Promise<Session> {
    try {
      // 1. Validar entrada
      if (!username || !password) {
        throw new ValidationError('Credenciales requeridas')
      }

      // 2. Llamar API
      const response = await this.apiClient.login({ username, password })

      // 3. Parsear respuesta
      const session = this.parseLoginResponse(response)

      // 4. Persistir sesión
      await this.storage.saveSession(session)

      // 5. Notificar éxito
      await this.notifier.success('Conectado exitosamente')

      return session

    } catch (error) {
      // Manejo de errores específico
      if (error instanceof InvalidCredentialsError) {
        await this.notifier.error('Usuario o contraseña incorrectos')
      } else if (error instanceof AlreadyConnectedError) {
        await this.notifier.warning('Ya hay un usuario conectado')
      } else {
        await this.notifier.error('Error de conexión')
      }
      throw error
    }
  }

  private parseLoginResponse(html: string): Session {
    // DRY: lógica de parsing centralizada
    const parser = new EtecsaResponseParser(html)
    return parser.toSession()
  }
}

// src/domain/services/SessionManager.ts
// SOLID: Single Responsibility - solo gestión de sesión

export class SessionManager {
  private session: Session | null = null
  private updateAlarm: string = 'update-session-time'

  constructor(
    private readonly apiClient: IEtecsaApiClient,
    private readonly storage: IStorageService,
    private readonly alarmService: IAlarmService
  ) {}

  async startSession(session: Session): Promise<void> {
    this.session = session

    // Programar actualización periódica
    await this.alarmService.create(this.updateAlarm, {
      periodInMinutes: 1
    })
  }

  async updateRemainingTime(): Promise<void> {
    if (!this.session) return

    const newTimeLeft = await this.apiClient.queryTime(this.session.uuid)
    this.session = this.session.updateTimeLeft(newTimeLeft)

    await this.storage.updateSession(this.session)

    // Broadcast cambio a UI
    chrome.runtime.sendMessage({
      type: 'session:updated',
      payload: this.session
    })
  }

  async endSession(): Promise<void> {
    if (!this.session) return

    await this.apiClient.logout(this.session)
    await this.storage.clearSession()
    await this.alarmService.clear(this.updateAlarm)

    this.session = null
  }
}
```

### 3. Infrastructure Layer (Adaptadores Externos)

```typescript
// src/infrastructure/api/EtecsaApiClient.ts
// Adapter para API de ETECSA

export class EtecsaApiClient implements IEtecsaApiClient {
  private readonly baseUrl = 'https://secure.etecsa.net:8443'

  async login(credentials: LoginCredentials): Promise<string> {
    const response = await fetch(`${this.baseUrl}/LoginServlet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
      }),
    })

    if (!response.ok) {
      throw new NetworkError('Failed to connect to ETECSA')
    }

    return response.text()
  }

  async logout(session: Session): Promise<void> {
    await fetch(`${this.baseUrl}/LogoutServlet`, {
      method: 'POST',
      body: new URLSearchParams({
        ATTRIBUTE_UUID: session.uuid,
        CSRFHW: session.csrf,
        username: session.username,
        wlanuserip: session.userIp,
        loggerId: session.loggerId,
      }),
    })
  }

  async queryTime(uuid: string): Promise<TimeLeft> {
    const response = await fetch(`${this.baseUrl}/EtecsaQueryServlet`, {
      method: 'POST',
      body: new URLSearchParams({
        ATTRIBUTE_UUID: uuid,
        op: 'getLeftTime',
      }),
    })

    const html = await response.text()
    const parser = new EtecsaResponseParser(html)
    return parser.extractTimeLeft()
  }
}

// src/infrastructure/storage/ChromeStorageAdapter.ts
// Adapter para Chrome Storage API

export class ChromeStorageAdapter implements IStorageService {
  async saveSession(session: Session): Promise<void> {
    await chrome.storage.local.set({
      session: {
        uuid: session.uuid,
        csrf: session.csrf,
        userIp: session.userIp,
        loggerId: session.loggerId,
        startTime: session.startTime.toISOString(),
        timeLeft: session.timeLeft.toString(),
      },
    })
  }

  async loadSession(): Promise<Session | null> {
    const { session } = await chrome.storage.local.get('session')
    if (!session) return null

    return new Session(
      session.uuid,
      session.csrf,
      session.userIp,
      session.loggerId,
      new Date(session.startTime),
      TimeLeft.fromString(session.timeLeft)
    )
  }

  async clearSession(): Promise<void> {
    await chrome.storage.local.remove('session')
  }
}
```

### 4. Presentation Layer (React + Hooks)

```typescript
// src/presentation/hooks/useAuth.ts
// Custom hook para autenticación (separa lógica de UI)

export function useAuth() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'authenticated' | 'error'>('idle')
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const login = async (username: string, password: string) => {
    setStatus('loading')
    setError(null)

    try {
      const authService = container.resolve<IAuthService>('AuthService')
      const newSession = await authService.login(username, password)

      setSession(newSession)
      setStatus('authenticated')
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }

  const logout = async () => {
    if (!session) return

    const authService = container.resolve<IAuthService>('AuthService')
    await authService.logout(session)

    setSession(null)
    setStatus('idle')
  }

  // Escuchar cambios de sesión desde background
  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.type === 'session:updated') {
        setSession(msg.payload)
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return { status, session, error, login, logout }
}

// src/presentation/components/LoginForm.tsx
// Componente React limpio, solo UI

export function LoginForm() {
  const { login, status, error } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data.username, data.password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('username')}
        label="Usuario"
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        {...register('password')}
        type="password"
        label="Contraseña"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Conectando...' : 'Conectar'}
      </Button>
      {error && <Alert severity="error">{error.message}</Alert>}
    </form>
  )
}
```

### Dependency Injection Container

```typescript
// src/infrastructure/di/container.ts
// Inversión de dependencias (SOLID: D)

class Container {
  private services = new Map<string, any>()

  register<T>(name: string, factory: () => T): void {
    this.services.set(name, factory)
  }

  resolve<T>(name: string): T {
    const factory = this.services.get(name)
    if (!factory) {
      throw new Error(`Service ${name} not registered`)
    }
    return factory()
  }
}

export const container = new Container()

// Setup
container.register('EtecsaApiClient', () => new EtecsaApiClient())
container.register('StorageService', () => new ChromeStorageAdapter())
container.register('NotificationService', () => new ChromeNotificationAdapter())
container.register('AuthService', () => new AuthService(
  container.resolve('EtecsaApiClient'),
  container.resolve('StorageService'),
  container.resolve('NotificationService')
))
```

---

## 📅 Plan de Implementación (Desde Cero) {#plan-implementación}

### Fase 1: Setup Inicial (Semana 1)

**Día 1-2: Proyecto Base**
```bash
# Crear nuevo proyecto
npm create vite@latest nauta-connect-v2 -- --template react-ts

# Instalar dependencias
npm install @crxjs/vite-plugin webextension-polyfill
npm install @mui/material @emotion/react @emotion/styled
npm install zustand react-hook-form zod date-fns

# Setup dev tools
npm install -D @types/chrome vitest @testing-library/react
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier husky lint-staged
```

**Día 3-4: Estructura del Proyecto**
```
nauta-connect-v2/
├── src/
│   ├── background/
│   │   └── service-worker.ts       ← MÍNIMO
│   ├── popup/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       ├── ConnectedPage.tsx
│   │       └── OptionsPage.tsx
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Session.ts
│   │   │   └── TimeLeft.ts
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   ├── SessionManager.ts
│   │   │   └── StorageService.ts
│   │   └── interfaces/
│   │       ├── IAuthService.ts
│   │       ├── IApiClient.ts
│   │       └── IStorageService.ts
│   ├── infrastructure/
│   │   ├── api/
│   │   │   ├── EtecsaApiClient.ts
│   │   │   └── EtecsaResponseParser.ts
│   │   ├── storage/
│   │   │   └── ChromeStorageAdapter.ts
│   │   └── notifications/
│   │       └── ChromeNotificationAdapter.ts
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   ├── SessionInfo/
│   │   │   └── TimeDisplay/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSession.ts
│   │   │   └── useStorage.ts
│   │   └── store/
│   │       └── authStore.ts        ← Zustand
│   ├── shared/
│   │   ├── constants/
│   │   ├── utils/
│   │   └── types/
│   └── manifest.json
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Día 5-7: Configuraciones**
- Manifest V3 completo
- Vite + CRXJS config
- ESLint + Prettier rules
- Git hooks (Husky)
- CI/CD GitHub Actions

### Fase 2: Domain Layer (Semana 2)

**Implementar:**
1. Entities (User, Session, TimeLeft)
2. Value Objects
3. Interfaces de servicios
4. Business logic pura
5. Tests unitarios (>90% coverage)

### Fase 3: Infrastructure Layer (Semana 3)

**Implementar:**
1. EtecsaApiClient (fetch a API)
2. EtecsaResponseParser (Cheerio → Entities)
3. ChromeStorageAdapter
4. ChromeNotificationAdapter
5. Tests de integración con mocks

### Fase 4: Service Worker (Semana 3)

**Implementar:**
1. Service worker minimalista
2. Alarm handlers
3. Message listeners (solo lo esencial)
4. Badge updates
5. Session restoration

### Fase 5: Presentation Layer (Semana 4-5)

**Implementar:**
1. Zustand stores (auth, session, config)
2. Custom hooks (useAuth, useSession)
3. UI Components (Material UI)
4. Formularios (React Hook Form + Zod)
5. Temas (MUI theming)
6. Animaciones (Framer Motion)

### Fase 6: Multi-Browser Support (Semana 6)

**Implementar:**
1. webextension-polyfill para cross-browser
2. Firefox-specific manifest
3. Edge/Brave testing
4. Build separados por navegador

### Fase 7: Testing (Semana 7)

**Implementar:**
1. Unit tests (Vitest)
2. Integration tests
3. E2E tests (Playwright)
4. Coverage >80%

### Fase 8: Optimización & Deploy (Semana 8)

**Implementar:**
1. Code splitting
2. Bundle optimization (<200KB)
3. Performance profiling
4. Documentation completa
5. Release a Chrome Web Store
6. Release a Firefox Add-ons

---

## 🌐 Soporte Multi-Navegador {#multi-navegador}

### webextension-polyfill

```typescript
// src/shared/browser.ts
import browser from 'webextension-polyfill'

// Usar siempre 'browser' en vez de 'chrome'
// Funciona en Chrome, Firefox, Edge, Opera, Brave

export { browser }

// Ejemplo de uso:
await browser.storage.local.set({ key: 'value' })
await browser.notifications.create({ ... })
```

### Manifests por Navegador

```json
// manifest.chrome.json
{
  "manifest_version": 3,
  // Chrome-specific features
}

// manifest.firefox.json
{
  "manifest_version": 3,
  "browser_specific_settings": {
    "gecko": {
      "id": "nauta-connect@mmaciass.dev",
      "strict_min_version": "109.0"
    }
  }
}
```

### Build Multi-Browser

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'

export default defineConfig(({ mode }) => {
  const browser = process.env.TARGET_BROWSER || 'chrome'
  const manifest = await import(`./manifest.${browser}.json`)

  return {
    plugins: [crx({ manifest })],
    build: {
      outDir: `dist/${browser}`,
    },
  }
})
```

```json
// package.json scripts
{
  "scripts": {
    "build:chrome": "TARGET_BROWSER=chrome vite build",
    "build:firefox": "TARGET_BROWSER=firefox vite build",
    "build:all": "npm run build:chrome && npm run build:firefox"
  }
}
```

---

## ✨ Deuda Técnica: Zero {#deuda-técnica}

### Estrategias para Mantener 0 Deuda Técnica

#### 1. TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### 2. ESLint Rules Estrictas
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'no-console': 'error',              // No console.log en producción
    'no-debugger': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'complexity': ['error', 10],        // Max complejidad ciclomática
    'max-lines-per-function': ['error', 50],
    'max-depth': ['error', 3],
  }
}
```

#### 3. Pre-commit Hooks
```json
// .husky/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test
```

#### 4. Code Coverage Mínimo
```javascript
// vitest.config.ts
export default {
  test: {
    coverage: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    }
  }
}
```

#### 5. Dependency Updates Automáticos
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

#### 6. Code Review Checklist

**Antes de cada commit:**
- [ ] Pasa todos los tests
- [ ] Coverage >80%
- [ ] Sin errores de TypeScript
- [ ] Sin warnings de ESLint
- [ ] Documentación actualizada
- [ ] Sigue principios SOLID
- [ ] No hay código duplicado (DRY)
- [ ] Performance optimizado
- [ ] Accesibilidad verificada

#### 7. Arquitectura Modular

**Reglas:**
- Cada módulo tiene UNA responsabilidad
- Dependencias siempre van hacia adentro (Clean Architecture)
- Nunca importar de `presentation` en `domain`
- Nunca importar de `infrastructure` en `domain`
- Interfaces siempre en `domain`

---

## 🎯 Métricas de Éxito

### Performance
- [ ] Bundle size <200KB
- [ ] Popup load <100ms
- [ ] Login request <500ms
- [ ] Memory usage <50MB

### Quality
- [ ] 0 TypeScript errors
- [ ] 0 ESLint warnings
- [ ] >80% test coverage
- [ ] <10 cyclomatic complexity

### User Experience
- [ ] WCAG 2.1 AA compliant
- [ ] Multi-language (ES, EN)
- [ ] Offline support (cached session)
- [ ] Error recovery automático

---

## 📚 Próximos Pasos

1. **Revisar y aprobar esta estrategia**
2. **Crear repo nuevo: `nauta-connect-v2`**
3. **Setup inicial (Fase 1)**
4. **Implementar domain layer primero (TDD)**
5. **Avanzar fase por fase**
6. **Deploy beta para testing**
7. **Migration guide para usuarios**
8. **Release v2.0.0**

---

## 🤝 Conclusión

Esta estrategia elimina TODA la deuda técnica y crea una base sólida para los próximos 5+ años:

✅ Manifest V3 (futuro-proof)
✅ TypeScript (type-safe)
✅ Clean Architecture (mantenible)
✅ SOLID principles (escalable)
✅ Zero duplication (DRY)
✅ Multi-browser (alcance mayor)
✅ Modern stack (performance)
✅ High test coverage (confiable)

**Tiempo estimado:** 8 semanas
**Resultado:** Código limpio, moderno, y mantenible a largo plazo

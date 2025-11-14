# Migración a Manifest V3

Este documento describe todos los cambios realizados para migrar la extensión Nauta Connect de Manifest V2 a Manifest V3.

## Resumen de Cambios

La migración a Manifest V3 fue completada exitosamente con los siguientes cambios principales:

### 1. Actualización del Manifest (src/manifest.json)

**Cambios realizados:**
- `manifest_version`: 2 → 3
- `browser_action` → `action`
- `background.page` → `background.service_worker`
- Eliminado `background.persistent`
- Agregado `background.type: "module"`
- Movido `https://secure.etecsa.net/*` de `permissions` a `host_permissions`
- Agregado permiso `power` para gestión de energía
- Eliminado `content_security_policy` (ya no se necesita con CSP de MV3)

**Manifest V3 final:**
```json
{
  "manifest_version": 3,
  "name": "nauta-connect",
  "description": "Extensión para conectarse a la red Nauta de ETECSA de forma rápida, fácil y segura.",
  "version": "1.4.0",
  "background": {
    "service_worker": "background.bundle.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon-34.png"
  },
  "permissions": [
    "storage",
    "notifications",
    "proxy",
    "power"
  ],
  "host_permissions": [
    "https://secure.etecsa.net/*"
  ]
}
```

### 2. Conversión del Background de React a Service Worker

**Archivo creado:** `src/pages/Background/background.js`

El componente React del background (`Background.jsx`) no puede ejecutarse en un service worker de MV3, por lo que se creó un nuevo archivo JavaScript puro que:

- Importa el store de Redux directamente (sin React)
- Usa `wrapStore` de react-chrome-redux para sincronización con el popup
- Implementa todos los listeners de `chrome.runtime.onMessage`
- Maneja la inicialización de la extensión con `chrome.runtime.onInstalled` y `chrome.runtime.onStartup`
- Monitorea cambios en el store de Redux para gestionar el modo "prevent sleep"

**Gestión de energía mejorada:**
- Reemplazado el video HTML5 (no disponible en service workers) por `chrome.power.requestKeepAwake('display')`
- El service worker monitorea el estado de conexión y previene el sleep del sistema cuando es necesario

### 3. Actualización de Webpack (webpack.config.js)

**Cambios realizados:**
- Punto de entrada del background cambiado de `index.jsx` a `background.js`
- Eliminado `HtmlWebpackPlugin` para el background (ya no se necesita HTML)
- El background ahora se compila como un archivo JavaScript puro para el service worker

### 4. Corrección de Dependencias

**Archivo creado:** `src/utils/env.js`
- Copiado de `env.example.js` para resolver dependencias faltantes durante el build

### 5. Scripts de NPM Actualizados (package.json)

Agregado `NODE_OPTIONS=--openssl-legacy-provider` a los scripts de build y start para compatibilidad con Node.js 17+:
```json
{
  "build": "NODE_OPTIONS=--openssl-legacy-provider node utils/build.js",
  "start": "NODE_OPTIONS=--openssl-legacy-provider node utils/webserver.js"
}
```

### 6. Mejoras en el Script de Build (utils/build.js)

Actualizado el script de build para mostrar errores de webpack claramente:
```javascript
webpack(config, function(err, stats) {
  if (err) throw err;
  if (stats.hasErrors()) {
    console.error(stats.toString({
      colors: true,
      all: false,
      errors: true,
      warnings: true
    }));
    process.exit(1);
  }
  console.log(stats.toString({
    colors: true,
    chunks: false
  }));
});
```

## APIs de Chrome Actualizadas

Todas las APIs utilizadas son compatibles con Manifest V3:
- ✅ `chrome.storage` - Compatible
- ✅ `chrome.runtime.sendMessage` - Compatible
- ✅ `chrome.runtime.onMessage` - Compatible
- ✅ `chrome.notifications` - Compatible
- ✅ `chrome.proxy` - Compatible
- ✅ `chrome.power` - **NUEVO** para gestión de energía

## Compatibilidad

La extensión ahora es compatible con:
- ✅ Chrome 88+ (Manifest V3 completo)
- ✅ Edge 88+ (basado en Chromium)
- ✅ Firefox 109+ (soporte básico de MV3)
- ⚠️ Opera (verificar versión específica)

## Notas Importantes

1. **Service Workers vs Background Pages:**
   - Los service workers en MV3 no tienen acceso al DOM
   - Los service workers pueden ser terminados cuando están inactivos
   - El estado debe persistirse usando `chrome.storage`

2. **React Chrome Redux:**
   - La biblioteca `react-chrome-redux` sigue funcionando con service workers
   - `wrapStore` en el service worker permite la sincronización con el popup

3. **Gestión de Energía:**
   - El método anterior (video HTML5 invisible) no funciona en service workers
   - `chrome.power.requestKeepAwake('display')` es la solución estándar de MV3
   - Requiere el permiso `power` en el manifest

## Testing Recomendado

Antes de publicar, se recomienda probar:

1. **Funcionalidad básica:**
   - Login y logout
   - Gestión de usuarios guardados
   - Configuraciones de tema y proxy
   - Notificaciones

2. **Gestión de energía:**
   - Verificar que el sistema no entre en modo sleep durante conexión activa
   - Confirmar que el modo sleep se restaura al desconectar

3. **Sincronización de estado:**
   - Abrir/cerrar el popup varias veces
   - Verificar que el estado se mantiene sincronizado
   - Probar en ventanas incógnito (si es aplicable)

4. **Compatibilidad:**
   - Probar en Chrome, Edge y Firefox
   - Verificar en diferentes versiones del navegador

## Build y Deploy

Para compilar la extensión:
```bash
npm install
npm run build
```

El build generará la extensión en el directorio `build/` lista para ser empaquetada y publicada en Chrome Web Store.

## Recursos Adicionales

- [Migrating to Manifest V3 - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/mv3-migration/)
- [Service Workers in Extensions](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

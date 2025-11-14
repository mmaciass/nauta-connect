# Guía de Depuración - Menú de Opciones

Esta guía te ayudará a identificar por qué las opciones del menú no están funcionando.

## 🔍 Cómo Ver los Logs del Service Worker

### En Chrome/Edge:

1. **Abre la página de extensiones:**
   ```
   chrome://extensions/
   ```

2. **Encuentra "nauta-connect"**

3. **Click en "service worker"** (aparece debajo del nombre de la extensión)
   - Esto abre DevTools específico del service worker

4. **Mira la consola** y verás logs como:
   ```
   [SW] 📨 Message received: NEXT_THEME
   [SW] 🎨 Changing theme
   [SW] ✅ Message processed successfully
   ```

5. **Prueba las opciones del menú** mientras observas la consola

### En Firefox:

1. **Abre:**
   ```
   about:debugging#/runtime/this-firefox
   ```

2. **Encuentra la extensión "nauta-connect"**

3. **Click en "Inspect"**

4. **Ve a la pestaña Console**

## 🎯 Qué Buscar

### Si los logs aparecen:
```
[SW] 📨 Message received: NEXT_THEME
[SW] 🎨 Changing theme
[SW] ✅ Message processed successfully
```

✅ **El mensaje llega al service worker**
- El problema está en la sincronización con el popup
- Verifica que react-chrome-redux esté funcionando

### Si NO aparecen logs:

❌ **El service worker no recibe los mensajes**

Causas posibles:
1. **Service worker está dormido**
   - Solución: Ya agregamos `return true` en el listener

2. **Service worker falló al iniciar**
   - Revisa errores en la consola del service worker

3. **react-chrome-redux interfiere**
   - Los mensajes pueden estar siendo interceptados

## 🐛 Testing Paso a Paso

### Test 1: Verificar Service Worker Activo

1. Abre DevTools del service worker
2. Verifica que veas:
   ```
   Nauta Connect service worker initialized
   ```

3. Si no ves nada → El service worker no está corriendo

### Test 2: Enviar Mensaje Manual

En la consola del **popup** (no del service worker), ejecuta:

```javascript
chrome.runtime.sendMessage({ type: 'NEXT_THEME' }, response => {
  console.log('Response:', response);
});
```

Luego mira la consola del **service worker** para ver si llega.

### Test 3: Verificar Estado del Store

En la consola del **service worker**, ejecuta:

```javascript
// Ver el estado actual
store.getState()

// Ver específicamente configs
store.getState().configs
```

### Test 4: Verificar react-chrome-redux

En la consola del **popup**, ejecuta:

```javascript
// Ver si el proxy store está conectado
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
```

## 🔧 Soluciones Comunes

### Problema: Service Worker no inicia

**Solución:**
1. Ve a `chrome://extensions/`
2. Desactiva la extensión
3. Actívala de nuevo
4. Mira la consola del service worker

### Problema: Service Worker se duerme

**Solución:** Ya agregamos `return true` en todos los listeners, lo cual debería mantenerlo activo durante el procesamiento.

### Problema: Mensajes no llegan

**Verifica:**
1. ¿El popup está abierto?
2. ¿El service worker está en la pestaña de extensiones?
3. ¿Hay errores en la consola?

## 📋 Checklist de Debugging

- [ ] Service worker muestra "initialized" en consola
- [ ] Al abrir el popup, ves actividad en SW console
- [ ] Al hacer click en opción, ves mensaje en SW console
- [ ] El mensaje se procesa exitosamente (✅)
- [ ] El estado del store cambia (verifica con `store.getState()`)
- [ ] El popup refleja el cambio

## 🆘 Si Nada Funciona

Intenta estas soluciones extremas:

1. **Recarga completa:**
   ```
   chrome://extensions/ → ⟳ Reload
   ```

2. **Reinstala la extensión:**
   - Elimina la extensión
   - Cierra todas las ventanas de Chrome
   - Vuelve a cargar la extensión

3. **Limpia datos de la extensión:**
   - Haz click derecho en el ícono
   - "Manage extension"
   - Scroll down → "Clear all data"

## 📞 Reportar el Problema

Si después de todo esto no funciona, proporciona:

1. **Logs de la consola del Service Worker**
2. **Logs de la consola del Popup**
3. **Navegador y versión**
4. **Qué opción del menú probaste**
5. **Screenshots si es posible**

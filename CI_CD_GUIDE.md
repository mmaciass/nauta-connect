# Guía de CI/CD - Nauta Connect

Esta guía explica cómo funciona el sistema de CI/CD configurado para la extensión Nauta Connect.

## 🚀 ¿Qué hace el CI/CD?

El sistema automáticamente:
1. **Construye** la extensión cuando creas un Pull Request
2. **Genera archivos ZIP** listos para instalar
3. **Ejecuta verificaciones** de calidad y compatibilidad MV3
4. **Crea releases** automáticos cuando haces un tag
5. **Publica artifacts** que puedes descargar y probar

## 📋 Workflows Configurados

### 1️⃣ Build Extension (automático en PRs)

**Se ejecuta:** En cada Pull Request y push a ramas principales

```yaml
Trigger: Pull Request / Push
├── Instala Node.js 18
├── Instala dependencias (npm ci)
├── Crea env.js desde env.example.js
├── Compila la extensión (npm run build)
├── Genera ZIP: nauta-connect-vXXX.zip
├── Sube artifacts (disponibles 30 días)
└── Comenta en el PR con instrucciones
```

**Cómo descargar el artifact:**
1. Ve a tu Pull Request
2. Click en la pestaña "Checks"
3. Selecciona "Build Extension"
4. Baja hasta "Artifacts"
5. Descarga `nauta-connect-extension.zip`

### 2️⃣ Lint & Quality Checks (automático)

**Se ejecuta:** En cada Pull Request y push

```yaml
Verificaciones:
├── ❌ APIs deprecadas (chrome.extension, chrome.browserAction, etc.)
├── ⚠️  window/document en service worker
├── ✅ Manifest version 3
└── 🔒 npm audit (vulnerabilidades)
```

### 3️⃣ Release (manual con tags)

**Se ejecuta:** Cuando creas un tag `v*.*.*`

```yaml
Proceso:
├── Compila versión de producción
├── Crea ZIP para Chrome Web Store
├── Crea ZIP para Firefox Add-ons
├── Genera código fuente comprimido
├── Crea Release en GitHub
└── Publica artifacts en el release
```

## 🎯 Flujo de Trabajo Típico

### Desarrollo de una Feature

```bash
# 1. Crea una rama desde main
git checkout -b feature/nueva-funcionalidad

# 2. Haz tus cambios
# ... edita archivos ...

# 3. Commit y push
git add .
git commit -m "feat: nueva funcionalidad increíble"
git push origin feature/nueva-funcionalidad

# 4. Crea Pull Request en GitHub
# → El CI/CD automáticamente construye la extensión

# 5. Descarga el artifact del PR para probar
# → Ve a Checks → Build Extension → Artifacts

# 6. Si todo está bien, merge el PR
```

### Crear un Release

```bash
# 1. Asegúrate de estar en main actualizado
git checkout main
git pull origin main

# 2. Actualiza la versión en package.json
npm version patch   # Para 1.4.0 → 1.4.1
# o
npm version minor   # Para 1.4.0 → 1.5.0
# o
npm version major   # Para 1.4.0 → 2.0.0

# 3. Push del tag
git push origin main --tags

# 4. El workflow automáticamente:
#    - Compila la extensión
#    - Crea el release en GitHub
#    - Sube los ZIPs para Chrome y Firefox
```

## 📦 Artifacts Disponibles

### En Pull Requests:

| Artifact | Descripción | Retención |
|----------|-------------|-----------|
| `nauta-connect-extension.zip` | Extensión completa lista para instalar | 30 días |
| `build-directory` | Carpeta de build sin comprimir | 7 días |

### En Releases:

| Archivo | Uso |
|---------|-----|
| `nauta-connect-chrome-vX.X.X.zip` | Publicar en Chrome Web Store |
| `nauta-connect-firefox-vX.X.X.zip` | Publicar en Firefox Add-ons |
| `nauta-connect-source-vX.X.X.zip` | Código fuente (requerido por algunas stores) |

## 🔧 Instalación Manual desde Artifacts

### Chrome / Edge

```bash
# 1. Descarga nauta-connect-extension.zip
# 2. Descomprime el archivo

# 3. En el navegador:
chrome://extensions/
# o
edge://extensions/

# 4. Activa "Modo de desarrollador" (toggle arriba a la derecha)
# 5. Click en "Cargar extensión sin empaquetar"
# 6. Selecciona la carpeta descomprimida
```

### Firefox

```bash
# 1. Descarga nauta-connect-extension.zip

# 2. En el navegador:
about:debugging#/runtime/this-firefox

# 3. Click en "Cargar complemento temporal"
# 4. Selecciona el archivo manifest.json de la carpeta descomprimida
```

## ✅ Checklist antes de Mergear un PR

- [ ] El workflow "Build Extension" pasó exitosamente ✅
- [ ] El workflow "Lint & Quality Checks" pasó ✅
- [ ] Descargaste y probaste el artifact localmente
- [ ] La extensión funciona en Chrome/Edge
- [ ] La extensión funciona en Firefox (si aplica)
- [ ] No hay errores en la consola del navegador
- [ ] Todas las funcionalidades principales funcionan:
  - [ ] Login/Logout
  - [ ] Guardado de usuarios
  - [ ] Notificaciones
  - [ ] Configuración de proxy
  - [ ] Prevent sleep

## 🔄 Actualizar los Workflows

Los archivos de workflow están en `.github/workflows/`:

```
.github/
├── workflows/
│   ├── build-extension.yml   # Build automático en PRs
│   ├── lint.yml               # Verificaciones de calidad
│   └── release.yml            # Creación de releases
├── PULL_REQUEST_TEMPLATE.md   # Template para PRs
├── CODEOWNERS                 # Reviewers automáticos
└── README.md                  # Documentación de workflows
```

Para modificar un workflow:
1. Edita el archivo `.yml` correspondiente
2. Haz commit y push
3. El nuevo workflow se aplicará en el siguiente PR/push

## 🚨 Troubleshooting

### El build falla con error de OpenSSL

**Solución:** Ya está configurado `NODE_OPTIONS: --openssl-legacy-provider` en los workflows.

### No encuentro los artifacts

**Ubicación:**
1. Ve al Pull Request
2. Pestaña "Checks"
3. Click en "Build Extension"
4. Scroll down hasta "Artifacts"

### El release no se crea automáticamente

**Verifica:**
- El tag debe seguir el formato `v*.*.*` (ejemplo: `v1.4.0`)
- El tag debe estar pusheado al repositorio: `git push --tags`
- Verifica los logs en Actions → Release Extension

### Quiero publicar automáticamente en Chrome Web Store

**Pasos:**
1. Obtén credenciales de Google Cloud Platform
2. Agrega los secrets en Settings → Secrets:
   - `CHROME_EXTENSION_ID`
   - `CHROME_CLIENT_ID`
   - `CHROME_CLIENT_SECRET`
   - `CHROME_REFRESH_TOKEN`
3. Habilita la sección comentada en `release.yml`

## 📊 Estado de los Workflows

Puedes ver el estado de todos los workflows en:
- **GitHub Actions:** `https://github.com/mmaciass/nauta-connect/actions`
- **Badge en README:** Puedes agregar badges de estado del build

## 🎓 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Chrome Web Store Publishing](https://developer.chrome.com/docs/webstore/publish/)
- [Firefox Add-ons Publishing](https://extensionworkshop.com/documentation/publish/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Creado:** Durante migración a Manifest V3
**Última actualización:** $(date +%Y-%m-%d)

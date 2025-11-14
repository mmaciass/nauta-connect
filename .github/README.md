# GitHub Workflows - Nauta Connect

Este directorio contiene los workflows de GitHub Actions para automatizar el build, testing y releases de la extensión.

## 🔄 Workflows Disponibles

### 1. Build Extension (`build-extension.yml`)

**Trigger:** Pull Requests y pushes a ramas principales

**Funcionalidad:**
- ✅ Instala dependencias
- ✅ Compila la extensión
- ✅ Genera archivo ZIP listo para instalar
- ✅ Sube artifacts que puedes descargar
- ✅ Comenta en el PR con instrucciones de descarga

**Cómo usar:**
1. Crea un PR
2. El workflow se ejecutará automáticamente
3. Ve a la pestaña "Checks" del PR
4. Descarga los artifacts generados
5. Instala la extensión en tu navegador

### 2. Lint & Quality Checks (`lint.yml`)

**Trigger:** Pull Requests y pushes

**Funcionalidad:**
- ✅ Verifica compatibilidad con Manifest V3
- ✅ Detecta uso de APIs deprecadas
- ✅ Ejecuta audit de seguridad
- ✅ Valida que el manifest.json sea v3

### 3. Release Extension (`release.yml`)

**Trigger:** Tags con formato `v*.*.*` (ejemplo: `v1.4.0`)

**Funcionalidad:**
- ✅ Crea build de producción
- ✅ Genera ZIP para Chrome Web Store
- ✅ Genera ZIP para Firefox Add-ons
- ✅ Crea GitHub Release con notas automáticas
- ✅ Adjunta todos los archivos necesarios

**Cómo crear un release:**
```bash
# Actualiza la versión en package.json
npm version patch  # o minor, o major

# Crea y sube el tag
git push origin main --tags

# El workflow creará automáticamente el release en GitHub
```

## 📦 Artifacts Generados

### En Pull Requests:
- **nauta-connect-extension.zip** - Extensión lista para instalar
- **build-directory/** - Directorio de build sin comprimir

### En Releases:
- **nauta-connect-chrome-vX.X.X.zip** - Para Chrome/Edge Web Store
- **nauta-connect-firefox-vX.X.X.zip** - Para Firefox Add-ons
- **nauta-connect-source-vX.X.X.zip** - Código fuente

## 🔐 Secrets Necesarios (opcional)

Para publicación automática en stores (actualmente deshabilitado):

### Chrome Web Store:
```
CHROME_EXTENSION_ID
CHROME_CLIENT_ID
CHROME_CLIENT_SECRET
CHROME_REFRESH_TOKEN
```

### Firefox Add-ons:
```
FIREFOX_EXTENSION_ID
FIREFOX_JWT_ISSUER
FIREFOX_JWT_SECRET
```

## 🎯 Próximos Pasos

1. **Habilitar publicación automática:** Configura los secrets y habilita la publicación en stores
2. **Agregar tests:** Integra tests unitarios en el workflow de lint
3. **Notificaciones:** Configura notificaciones de Slack/Discord cuando se creen releases
4. **Renovación de certificados:** Automatiza la renovación de certificados de firma

## 📝 Template de PR

Hemos incluido un template de PR en `.github/PULL_REQUEST_TEMPLATE.md` que incluye:
- Checklist de compatibilidad MV3
- Lista de navegadores para testing
- Sección de screenshots
- Referencias a issues

## 👥 Code Owners

El archivo `CODEOWNERS` define quién debe revisar cambios en archivos específicos.

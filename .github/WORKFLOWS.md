# GitHub Actions Workflows

Este documento explica cómo funcionan los workflows automatizados del proyecto.

## 📋 Workflows Disponibles

### 1. Build Workflow (`build.yml`)

**Propósito**: Compilar y validar el código automáticamente en cada push y PR.

**Cuándo se ejecuta**:
- ✅ En cada push a cualquier rama
- ✅ En cada pull request
- ✅ Manualmente desde la pestaña Actions

**Qué hace**:
1. **Setup**: Instala Node.js 20.x y las dependencias
2. **Type Check**: Valida que no haya errores de TypeScript
3. **Lint**: Ejecuta ESLint para verificar calidad de código
4. **Build**: Compila la extensión con Vite
5. **Package**: Crea un ZIP con la extensión lista para instalar
6. **Upload**: Sube los artefactos para descarga
7. **Comment**: (Solo en PRs) Comenta en el PR con instrucciones de descarga

**Artefactos generados**:
- `nauta-connect-extension` - Carpeta dist/ completa
- `nauta-connect-v2.0.zip` - ZIP listo para instalar

**Retención**: 30 días

---

### 2. Release Workflow (`release.yml`)

**Propósito**: Crear releases oficiales con la extensión empaquetada.

**Cuándo se ejecuta**:
- ✅ Al crear un tag tipo `v*.*.*` (ej: `v2.0.0`, `v2.1.0`)
- ✅ Manualmente desde la pestaña Actions

**Qué hace**:
1. **Setup**: Instala Node.js y dependencias
2. **Tests**: Ejecuta validaciones (type-check)
3. **Build**: Compila la extensión
4. **Package**: Crea ZIP de la extensión
5. **Release**: Crea GitHub Release con:
   - Tag de versión
   - Notas de release
   - Archivo ZIP adjunto

**Crear un release**:
```bash
# Crear y push de tag
git tag v2.0.0
git push origin v2.0.0

# El workflow se ejecuta automáticamente
# y crea la release en GitHub
```

---

## 🎯 Casos de Uso

### Para Desarrolladores

#### Validar código antes de PR
```bash
# El workflow se ejecuta automáticamente al hacer push
git add .
git commit -m "feat: nueva funcionalidad"
git push

# Ve a Actions para ver el resultado
```

#### Probar PR sin build local
1. Ir al PR en GitHub
2. El bot comentará con link a artefactos
3. Click en el link → Ve a "Artifacts"
4. Descarga `nauta-connect-v2.0.zip`
5. Descomprime e instala en Chrome

### Para Reviewers

#### Probar un PR
1. **Opción A - Desde el comentario del bot**:
   - Abre el PR
   - Lee el comentario automático del bot
   - Click en el link "Ver artefactos en Actions"
   - Descarga el ZIP

2. **Opción B - Desde Actions**:
   - Ve a la pestaña "Actions"
   - Busca el workflow run del PR
   - Scroll down a "Artifacts"
   - Descarga `nauta-connect-v2.0.zip`

3. **Instalar**:
   - Descomprime el ZIP
   - Abre `chrome://extensions/`
   - Activa "Developer mode"
   - "Load unpacked" → Selecciona carpeta

### Para Testers

#### Probar la última versión
1. Ve a [Actions](https://github.com/mmaciass/nauta-connect/actions)
2. Click en el workflow run más reciente con ✅
3. Scroll down a "Artifacts"
4. Descarga `nauta-connect-v2.0.zip`
5. Instala siguiendo las instrucciones

#### Probar un release
1. Ve a [Releases](https://github.com/mmaciass/nauta-connect/releases)
2. Selecciona la versión deseada
3. Descarga el archivo `nauta-connect-v2.0.zip`
4. Instala en Chrome

---

## 🔧 Configuración

### Permisos requeridos

Los workflows requieren estos permisos (ya configurados):
- `contents: write` - Para crear releases
- `pull-requests: write` - Para comentar en PRs
- `actions: read` - Para leer workflow runs

### Variables de entorno

No se requieren secrets o variables especiales. Todo funciona con los tokens por defecto de GitHub.

### Modificar workflows

Para modificar los workflows:

1. **Editar archivos**:
   ```bash
   .github/workflows/build.yml
   .github/workflows/release.yml
   ```

2. **Cambios comunes**:
   - Cambiar versión de Node: Editar `node-version`
   - Agregar más checks: Añadir steps antes de "Build extension"
   - Cambiar retención: Modificar `retention-days`
   - Cambiar nombre del ZIP: Editar paso "Create extension package"

3. **Probar cambios**:
   - Commit y push
   - Ve a Actions para ver el resultado
   - Usa `workflow_dispatch` para ejecutar manualmente

---

## 📊 Badges de Estado

Agregar estos badges al README para mostrar el estado de los workflows:

```markdown
[![Build Extension](https://github.com/mmaciass/nauta-connect/actions/workflows/build.yml/badge.svg)](https://github.com/mmaciass/nauta-connect/actions/workflows/build.yml)
[![Release Extension](https://github.com/mmaciass/nauta-connect/actions/workflows/release.yml/badge.svg)](https://github.com/mmaciass/nauta-connect/actions/workflows/release.yml)
```

---

## ❓ FAQ

### ¿Por qué el workflow falló?

Revisa los logs en Actions. Causas comunes:
- ❌ Errores de TypeScript
- ❌ Errores de ESLint
- ❌ Dependencias faltantes
- ❌ Error en el build de Vite

### ¿Cuánto tiempo toman?

Tiempos aproximados:
- Build workflow: ~2-3 minutos
- Release workflow: ~3-4 minutos

### ¿Los artefactos son públicos?

- **Artefactos de workflow**: Solo visibles para usuarios con acceso al repo
- **Releases**: Públicos si el repo es público

### ¿Cómo ejecutar manualmente?

1. Ve a "Actions"
2. Selecciona el workflow
3. Click "Run workflow"
4. Selecciona la rama
5. Click "Run workflow"

### ¿Cómo desactivar temporalmente?

Comenta el contenido de `on:` en el workflow YAML, o desactiva el workflow desde la UI de GitHub Actions.

---

## 🚀 Mejoras Futuras

Posibles mejoras a los workflows:

- [ ] Ejecutar tests unitarios (cuando se implementen)
- [ ] Ejecutar tests E2E con Playwright
- [ ] Subir a Chrome Web Store automáticamente
- [ ] Generar changelog automático
- [ ] Notificaciones a Slack/Discord
- [ ] Code coverage reports
- [ ] Performance benchmarks

---

**Última actualización**: 2025-11-15
**Versión**: v2.0.0

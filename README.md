# Nauta Connect v2.0 🚀

[![Build Extension](https://github.com/mmaciass/nauta-connect/actions/workflows/build.yml/badge.svg)](https://github.com/mmaciass/nauta-connect/actions/workflows/build.yml)
[![Release Extension](https://github.com/mmaciass/nauta-connect/actions/workflows/release.yml/badge.svg)](https://github.com/mmaciass/nauta-connect/actions/workflows/release.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Extensión moderna para conectarse a la red Nauta de ETECSA de forma rápida, fácil y segura.

## ✨ Características

- ✅ **Manifest V3** - Última versión del estándar de Chrome
- ✅ **TypeScript** - Type safety completo
- ✅ **React 19** - UI moderna y reactiva
- ✅ **Material UI 7** - Componentes de diseño profesional
- ✅ **Clean Architecture** - Código mantenible y escalable
- ✅ **SOLID Principles** - Mejores prácticas de desarrollo
- ✅ **Zero Technical Debt** - Código limpio desde día 1
- ✅ **Multi-Browser** - Chrome, Firefox, Edge, Brave, Opera

## 🚀 Inicio Rápido

### Opción 1: Descargar desde GitHub Actions (Recomendado para testers)

1. Ve a la pestaña [Actions](https://github.com/mmaciass/nauta-connect/actions)
2. Selecciona el workflow run más reciente con ✅
3. En la sección "Artifacts", descarga `nauta-connect-v2.0.zip`
4. Descomprime el archivo
5. Abre Chrome → `chrome://extensions/`
6. Activa "Developer mode"
7. Click "Load unpacked" y selecciona la carpeta descomprimida

### Opción 2: Build desde código fuente (Para desarrolladores)

\`\`\`bash
# Clonar repositorio
git clone https://github.com/mmaciass/nauta-connect.git
cd nauta-connect

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
\`\`\`

Después del build, carga la carpeta `dist/` en Chrome como extensión unpacked.

## 📦 Scripts

- \`npm run dev\` - Desarrollo con HMR
- \`npm run build\` - Build de producción
- \`npm run lint\` - Verificar código
- \`npm run format\` - Formatear código
- \`npm run test\` - Ejecutar tests

## 🏗️ Arquitectura

Clean Architecture con 4 capas: Domain, Infrastructure, Application, Presentation.

Ver [MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md) para detalles completos.

## 🔄 CI/CD

El proyecto usa GitHub Actions para automatizar el build y la distribución:

### Build Workflow
- **Trigger**: En cada push y pull request
- **Ejecuta**: TypeScript check, ESLint, Build
- **Genera**: Artefactos descargables (`nauta-connect-v2.0.zip`)
- **Comentario**: Automáticamente comenta en PRs con link a artefactos

### Release Workflow
- **Trigger**: Al crear un tag `v*.*.*`
- **Ejecuta**: Build completo + tests
- **Publica**: GitHub Release con la extensión empaquetada
- **Incluye**: Notas de la versión y archivo ZIP

Para probar un PR sin hacer build local, simplemente descarga el artefacto generado automáticamente.

## 📄 Licencia

MIT

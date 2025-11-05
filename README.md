# Catálogo de Planes Móviles - Versión Avanzada

Sistema completo de comparación de planes móviles para WordPress con funcionalidades avanzadas.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Catálogo dinámico** con carga desde JSON
- **Sistema de filtros avanzado** (operador, precio, datos, tipo)
- **Comparador** de hasta 3 planes simultáneamente
- **Calculadora de costos** con servicios adicionales y descuentos
- **Tema claro/oscuro** con transiciones suaves
- **Responsive design** optimizado para móvil, tablet y desktop
- **Animaciones fluidas** con respeto a preferencias de accesibilidad

### 🎨 Diseño y UX
- **Glassmorphism** y efectos modernos
- **Fondo tecnológico** con grid animado y partículas
- **Esquemas de colores** específicos por operador
- **Lazy loading** de imágenes
- **Skeleton loading** para mejor UX
- **Animaciones escalonadas** en grids

### 🛠️ Tecnologías
- **Vue.js 3** con Composition API
- **Tailwind CSS** para estilos
- **ES6 Modules** nativos
- **Axios** para HTTP requests
- **Sistema de cache** avanzado (memoria, localStorage, sessionStorage)
- **PWA ready** con service worker opcional

## 📁 Estructura del Proyecto

```
mobile-plans/
├── index.html                     # Página principal
├── css/
│   ├── components.css             # Estilos de componentes
│   ├── themes.css                 # Temas claro/oscuro
│   └── animations.css             # Animaciones y efectos
├── js/
│   ├── app.js                     # Aplicación principal
│   ├── components/
│   │   ├── ProductCard.js         # Tarjeta de producto
│   │   ├── FilterSystem.js        # Sistema de filtros
│   │   ├── Comparator.js          # Comparador de planes
│   │   └── Calculator.js          # Calculadora de costos
│   ├── stores/
│   │   ├── products.js            # Estado de productos
│   │   ├── filters.js             # Estado de filtros
│   │   └── comparison.js          # Estado de comparación
│   └── utils/
│       ├── api.js                 # Cliente API con reintentos
│       ├── cache.js               # Sistema de cache avanzado
│       └── animations.js          # Gestor de animaciones
├── config/
│   ├── operators.json             # Configuración de operadores
│   └── settings.json              # Configuración general
└── README.md                      # Este archivo
```

## 🔧 Instalación en WordPress

### Opción 1: Template Part (Recomendado)

1. **Copiar archivos**:
   ```bash
   # Copiar toda la carpeta mobile-plans/ a tu tema
   wp-content/themes/tu-tema/mobile-plans/
   ```

2. **Incluir en página/post**:
   ```php
   <?php get_template_part('mobile-plans/index'); ?>
   ```

### Opción 2: Shortcode

1. **Añadir a functions.php**:
   ```php
   function mobile_plans_shortcode($atts) {
       $atts = shortcode_atts([
           'theme' => 'light',
           'operators' => 'all',
           'max_comparisons' => 3
       ], $atts);
       
       ob_start();
       include get_template_directory() . '/mobile-plans/index.html';
       return ob_get_clean();
   }
   add_shortcode('mobile_plans', 'mobile_plans_shortcode');
   ```

2. **Usar en cualquier página**:
   ```
   [mobile_plans theme="light" operators="movistar,vodafone"]
   ```

### Opción 3: Gutenberg Block

1. **Registrar bloque**:
   ```javascript
   wp.blocks.registerBlockType('custom/mobile-plans', {
       title: 'Catálogo Planes Móviles',
       category: 'widgets',
       edit: () => wp.element.createElement('div', {}, 'Vista previa del catálogo'),
       save: () => wp.element.createElement('div', { id: 'mobile-plans-app' })
   });
   ```

## ⚙️ Configuración

### Operadores
Edita `config/operators.json` para personalizar:
- Colores de marca
- Logos
- Shortcodes de WordPress
- Características incluidas

### Configuración General
Edita `config/settings.json` para:
- URLs de API
- Configuración de cache
- Funcionalidades habilitadas
- Textos y traducciones

### Imágenes de Productos
Las imágenes se asignan automáticamente desde el banco configurado en `stores/products.js`. Para personalizar:

```javascript
const IMAGE_BANK = {
  individual: [
    'url-imagen-1.jpg',
    'url-imagen-2.jpg',
    // ... más imágenes
  ],
  familiar: [
    'url-imagen-familiar-1.jpg',
    // ... más imágenes
  ]
};
```

## 🎛️ Funcionalidades Avanzadas

### Sistema de Filtros
- **Por operador**: Movistar, Vodafone, Orange
- **Por precio**: Rango deslizante hasta 100€
- **Por datos**: Categorías (bajo, medio, alto, ilimitado)
- **Por tipo**: Individual vs Familiar
- **Búsqueda de texto** con debounce
- **Filtros especiales**: Solo ofertas, solo populares
- **Presets**: Económicos, familiares, populares, ofertas

### Comparador
- **Hasta 3 productos** simultáneamente
- **Tabla detallada** con todas las características
- **Resumen inteligente** con mejor valor
- **Exportación** en texto plano o CSV
- **Compartir** con URL generada automáticamente
- **Persistencia** en localStorage

### Calculadora
- **Cálculo anual** con descuentos por permanencia
- **Configuración familiar** con descuentos por línea adicional
- **Servicios adicionales**: Seguros, datos extra, etc.
- **Descuentos personalizados**: Estudiante, fidelización, packs
- **Perfil de uso** personalizado
- **Recomendaciones inteligentes** basadas en uso

### Sistema de Cache
- **Múltiples niveles**: Memoria, sessionStorage, localStorage
- **TTL configurable** por tipo de dato
- **Limpieza automática** de datos expirados
- **Modo offline** con datos en cache
- **Compresión** automática para optimizar espacio

## 🎨 Personalización

### Temas
El sistema incluye temas claro y oscuro. Para personalizar:

```css
:root {
  --color-movistar: #00579A;
  --color-vodafone: #E60000;
  --color-orange: #FF7900;
  /* Personalizar otros colores */
}
```

### Animaciones
Las animaciones respetan `prefers-reduced-motion`. Para personalizar:

```javascript
// Cambiar duración de animaciones
animationManager.setupStaggeredAnimation(container, {
  delay: 200, // ms entre elementos
  duration: 600 // ms por animación
});
```

### Responsive
Breakpoints configurables en `settings.json`:

```json
{
  "responsive": {
    "breakpoints": {
      "mobile": 768,
      "tablet": 1024,
      "desktop": 1200
    }
  }
}
```

## 🔌 API y Datos

### Formato JSON Esperado
```json
{
  "movistarPlans": [
    {
      "id": "unique-id",
      "data": "50GB",
      "price": 25.99,
      "description": "Plan con 50GB de datos"
    }
  ],
  "vodafoneIndividualPlans": [...],
  "vodafoneFamiliarPlans": [...],
  "orangeIndividualPlans": [...],
  "orangeFamiliarPlans": [...]
}
```

### Endpoints Configurables
```javascript
const API_CONFIG = {
  baseUrl: 'https://tu-dominio.com/api/',
  endpoints: {
    products: 'products.json',
    operators: 'operators.json'
  }
};
```

## 🚦 Rendimiento

### Optimizaciones Incluidas
- **Lazy loading** de imágenes
- **Debounce** en búsquedas (300ms)
- **Throttle** en scroll (100ms)
- **Cache inteligente** con TTL
- **Tree-shaking** automático con ES6 modules
- **Compresión** de datos en localStorage

### Métricas Recomendadas
- **LCP**: < 2.5s (conseguido con lazy loading)
- **FID**: < 100ms (Vue 3 optimizado)
- **CLS**: < 0.1 (skeleton loading)
- **Tamaño**: ~150KB total (comprimido)

## 🧪 Testing y Debug

### Modo Desarrollo
```javascript
// Activar debugging
window.mobilePlansApp.state.config.debug = true;

// Ver estado actual
console.log(window.mobilePlansApp.state);

// Limpiar cache
window.mobilePlansApp.methods.clearCache();
```

### Testing Responsivo
```javascript
// Simular diferentes conexiones
window.debugAnimations.toggleReducedMotion();

// Simular offline
window.dispatchEvent(new Event('offline'));
```

## 🔒 Seguridad

### Consideraciones
- **XSS Protection**: Todos los inputs están sanitizados
- **CSRF**: Tokens incluidos en requests
- **Rate Limiting**: Cliente API con límites
- **Validación**: Todos los datos se validan antes de usar

## 🌐 Accesibilidad

### Características WCAG 2.1
- **Navegación por teclado** completa
- **Screen reader** compatible
- **Alto contraste** disponible
- **Textos alternativos** en imágenes
- **Focus indicators** visibles
- **Respeto a `prefers-reduced-motion`**

### Testing de Accesibilidad
```bash
# Herramientas recomendadas
- axe-core DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit
```

## 📊 Analytics (Opcional)

### Google Analytics 4
```javascript
// Eventos automáticos incluidos
- view_catalog
- view_comparison
- add_to_comparison
- contract_click
- filter_apply
```

### Configuración
```javascript
// En settings.json
{
  "analytics": {
    "enabled": true,
    "trackClicks": true,
    "trackViews": true
  }
}
```

## 🆘 Solución de Problemas

### Problemas Comunes

1. **No cargan los productos**
   - Verificar URL de API en `settings.json`
   - Comprobar CORS en el servidor
   - Revisar formato JSON

2. **Imágenes no cargan**
   - Verificar URLs en `IMAGE_BANK`
   - Comprobar permisos de archivos
   - Usar imágenes optimizadas (WebP recomendado)

3. **Filtros no funcionan**
   - Limpiar localStorage: `localStorage.clear()`
   - Verificar estructura de datos
   - Comprobar consola por errores

4. **WordPress shortcodes no aparecen**
   - Verificar IDs de shortcodes en HTML
   - Comprobar que los plugins estén activos
   - Revisar configuración de operadores

### Debug Avanzado
```javascript
// Ver cache actual
console.log(window.cache.stats());

// Ver productos cargados
console.log(window.mobilePlansApp.state.products.state.all);

// Ver filtros activos
console.log(window.mobilePlansApp.state.filters.state);
```

## 🔄 Actualizaciones

### Versionado
- **Major**: Cambios que rompen compatibilidad
- **Minor**: Nuevas funcionalidades
- **Patch**: Correcciones de bugs

### Migración
1. Hacer backup de configuraciones
2. Reemplazar archivos
3. Revisar configuraciones en `config/`
4. Probar funcionalidades principales

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para soporte técnico:
- **Email**: soporte@ipv6-informatica.es
- **Web**: https://ipv6-informatica.es
- **Documentación**: https://docs.ipv6-informatica.es/mobile-plans

---

**Desarrollado con ❤️ por IPv6 Informática**
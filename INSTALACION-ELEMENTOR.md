# 🚀 GUÍA DE INSTALACIÓN - Mobile Plans en WordPress con Elementor

**Sistema completo de catálogo de planes móviles para WordPress + Elementor**

---

## 📋 **REQUISITOS PREVIOS**

- ✅ WordPress 5.0 o superior
- ✅ Elementor (versión gratuita o Pro)
- ✅ Tema compatible con Elementor
- ✅ PHP 7.4 o superior
- ✅ Acceso a archivos del servidor (FTP/cPanel)

---

## 🔧 **PASO 1: PREPARAR LOS ARCHIVOS**

### 1.1 Descargar la Estructura
Necesitas toda la carpeta `mobile-plans/` con esta estructura:

```
mobile-plans/
├── index.html                          # Página principal
├── css/
│   ├── components.css                  # Estilos de componentes
│   ├── themes.css                      # Temas claro/oscuro
│   └── animations.css                  # Animaciones
├── js/
│   ├── app.js                          # Aplicación principal
│   ├── components/
│   │   ├── ProductCard.js              # Tarjeta de producto
│   │   ├── FilterSystem.js             # Sistema de filtros
│   │   ├── Comparator.js               # Comparador
│   │   └── Calculator.js               # Calculadora
│   ├── stores/
│   │   ├── products.js                 # Estado de productos
│   │   ├── filters.js                  # Estado de filtros
│   │   └── comparison.js               # Estado de comparación
│   └── utils/
│       ├── api.js                      # Cliente API
│       ├── cache.js                    # Sistema de cache
│       └── animations.js               # Gestión de animaciones
├── config/
│   ├── operators.json                  # Configuración operadores
│   └── settings.json                   # Configuración general
├── elementor/
│   ├── mobile-plans-widget.php         # Widget de Elementor
│   ├── elementor-integration.php       # Sistema de integración
│   ├── elementor-handler.js            # JavaScript específico
│   └── elementor-styles.css            # Estilos para Elementor
├── functions-integration.php           # Integración WordPress
├── README.md                           # Documentación general
└── INSTALACION-ELEMENTOR.md           # Esta guía
```

### 1.2 Subir al Servidor
**Ubicación exacta:** `wp-content/themes/TU-TEMA-ACTIVO/mobile-plans/`

**Métodos de subida:**
- **FTP/SFTP**: Subir carpeta completa
- **cPanel File Manager**: Comprimir y descomprimir
- **WordPress File Manager Plugin**: Si tienes uno instalado

---

## 🔌 **PASO 2: ACTIVAR LA INTEGRACIÓN**

### Opción A: Integración Completa (RECOMENDADO)

1. **Abrir archivo `functions.php`** de tu tema activo
2. **Ir al final del archivo** (antes del `?>` si existe)
3. **Añadir este código:**

```php
// ===== MOBILE PLANS INTEGRATION =====
require_once get_template_directory() . '/mobile-plans/functions-integration.php';
```

### Opción B: Integración Mínima

Si prefieres menos código en functions.php:

```php
// ===== MOBILE PLANS - ELEMENTOR WIDGET =====
add_action('elementor/widgets/widgets_registered', function($widgets_manager) {
    if (file_exists(get_template_directory() . '/mobile-plans/elementor/mobile-plans-widget.php')) {
        require_once get_template_directory() . '/mobile-plans/elementor/mobile-plans-widget.php';
        require_once get_template_directory() . '/mobile-plans/elementor/elementor-integration.php';
        $widgets_manager->register_widget_type(new Mobile_Plans_Elementor_Widget());
    }
});
```

### Para Temas Hijo
Si usas un **tema hijo**, cambia:
```php
get_template_directory() 
// por:
get_stylesheet_directory()
```

---

## 🎯 **PASO 3: VERIFICAR LA INSTALACIÓN**

### 3.1 Comprobar Backend
1. **Ir a WordPress Admin**: `tu-sitio.com/wp-admin`
2. **Verificar menú**: Debe aparecer **"Mobile Plans"** en **Ajustes > Mobile Plans**
3. **Si aparece**: ✅ Integración correcta

### 3.2 Comprobar Elementor
1. **Ir a cualquier página** → **Editar con Elementor**
2. **Panel izquierdo** → **Buscar**: "Catálogo Planes Móviles"
3. **Si aparece el widget**: ✅ Todo correcto

### 3.3 Si NO aparece
- ❌ Verificar ruta de archivos
- ❌ Comprobar permisos (755 carpetas, 644 archivos)
- ❌ Revisar errores en funciones.php
- ❌ Desactivar/reactivar Elementor

---

## 📱 **PASO 4: USAR EL WIDGET EN ELEMENTOR**

### 4.1 Crear Nueva Página
1. **WordPress Admin** → **Páginas** → **Añadir nueva**
2. **Título**: "Planes Móviles" (o el que prefieras)
3. **Editar con Elementor**

### 4.2 Añadir Widget
1. **Buscar widget**: "Catálogo Planes Móviles"
2. **Arrastrar** al área deseada
3. **Aparecerá** vista previa del widget

### 4.3 Configurar Widget

#### 📋 CONTENIDO > Configuración General
- **Tema**: `Claro` / `Oscuro`
- **Vista por Defecto**: `Catálogo` / `Comparador` / `Calculadora`
- **Máximo Comparaciones**: `1-5` (recomendado: 3)

#### 🎯 CONTENIDO > Filtros
- **Operadores por Defecto**: Seleccionar operadores específicos o dejar vacío
- **Tipo de Plan**: `Todos` / `Individual` / `Familiar`
- **Precio Máximo**: Slider `0-100€`
- **Mostrar Filtros**: ✅ Activado

#### ✨ CONTENIDO > Funcionalidades
- **Habilitar Comparador**: ✅ Activado
- **Habilitar Calculadora**: ✅ Activado
- **Toggle Tema Oscuro**: ✅ Activado
- **Habilitar Búsqueda**: ✅ Activado

#### 🔗 CONTENIDO > Configuración API
- **URL de la API**: `https://ipv6-informatica.es/cart/data/`
- **Tiempo de Cache**: `5 minutos`

#### 🎨 ESTILO > Estilos
- **Fondo del Contenedor**: Color personalizable
- **Fondo de Tarjetas**: Color personalizable
- **Bordes**: Grosor, color, radio
- **Espaciado**: Margins y paddings

---

## ⚙️ **PASO 5: CONFIGURACIÓN GLOBAL**

### 5.1 Panel de Administración
**WordPress Admin** → **Ajustes** → **Mobile Plans**

**Configuraciones disponibles:**
- **URL de la API**: `https://ipv6-informatica.es/cart/data/`
- **Tiempo de Cache**: `300 segundos` (5 minutos)
- **Tema por defecto**: `light` / `dark`
- **Máximo comparaciones**: `3`
- **Habilitar Analytics**: `No` (opcional)

### 5.2 Shortcodes Disponibles

```php
// Catálogo completo con todas las funcionalidades
[mobile_plans]

// Solo catálogo (sin comparador ni calculadora)
[mobile_plans_catalog]

// Solo comparador de plans
[mobile_plans_comparison]

// Solo calculadora de costos
[mobile_plans_calculator]

// Ejemplos con parámetros personalizados
[mobile_plans theme="dark" operators="movistar,vodafone"]
[mobile_plans_catalog max_price="50" plan_type="individual"]
[mobile_plans theme="light" operators="orange" show_filters="false"]
```

**Parámetros disponibles:**
- `theme="light|dark"` - Tema visual
- `operators="movistar,vodafone,orange"` - Operadores específicos
- `plan_type="all|individual|familiar"` - Tipo de plan
- `max_price="50"` - Precio máximo por defecto
- `show_filters="true|false"` - Mostrar panel de filtros
- `enable_comparison="true|false"` - Habilitar comparador
- `enable_calculator="true|false"` - Habilitar calculadora

---

## 🎨 **PASO 6: PERSONALIZACIÓN VISUAL**

### 6.1 Desde Elementor
**En el Editor de Elementor:**

1. **Sección**: Fondo, espaciado, responsive
2. **Widget**: Panel de estilos específicos
3. **Configuración de página**: CSS global personalizado

### 6.2 CSS Personalizado
**Elementor** → **Configuración de página** → **CSS personalizado**:

```css
/* Personalizar colores de operadores */
.mobile-plans-container {
    --color-movistar: #00579A;
    --color-vodafone: #E60000;
    --color-orange: #FF7900;
}

/* Ajustar espaciado entre tarjetas */
.products-grid {
    gap: 2rem;
}

/* Personalizar tarjetas de productos */
.product-card {
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

/* Personalizar botones */
.btn-contract {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    padding: 15px 30px;
    font-weight: 600;
}

/* Responsive personalizado */
@media (max-width: 768px) {
    .products-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem;
    }
    
    .mobile-plans-header h1 {
        font-size: 1.5rem;
    }
}

/* Tema oscuro personalizado */
.theme-dark .product-card {
    background: rgba(31, 41, 55, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Animaciones personalizadas */
.product-card {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## 🎯 **CONFIGURACIONES RECOMENDADAS POR CASO DE USO**

### 📄 Página Principal de Planes
```
✅ Vista por Defecto: Catálogo
✅ Mostrar Filtros: Sí
✅ Habilitar Comparador: Sí
✅ Habilitar Calculadora: Sí
✅ Operadores: Todos
✅ Toggle Tema: Sí
```
**Ideal para:** Página principal del catálogo con todas las funcionalidades.

### 🎯 Landing Page Específica (ej: Solo Movistar)
```
✅ Vista por Defecto: Catálogo
❌ Mostrar Filtros: No
✅ Habilitar Comparador: Sí
❌ Habilitar Calculadora: No
✅ Operadores: Solo Movistar
❌ Toggle Tema: No
```
**Ideal para:** Campañas específicas de un operador.

### 📊 Página de Comparación
```
✅ Vista por Defecto: Comparador
❌ Mostrar Filtros: No
✅ Máximo Comparaciones: 3
❌ Habilitar Calculadora: No
✅ Operadores: Todos
```
**Ideal para:** Página dedicada solo a comparar planes.

### 🧮 Página de Calculadora
```
✅ Vista por Defecto: Calculadora
❌ Mostrar Filtros: No
❌ Habilitar Comparador: No
✅ Operadores: Todos
```
**Ideal para:** Herramienta de cálculo de costos independiente.

### 📱 Widget en Sidebar (Compacto)
```
✅ Vista por Defecto: Catálogo
❌ Mostrar Filtros: No
❌ Habilitar Comparador: No
❌ Habilitar Calculadora: No
✅ Operadores: Específico
```
**Ideal para:** Widget pequeño en sidebar o footer.

---

## ⚠️ **TROUBLESHOOTING - Solución de Problemas**

### ❌ **Widget no aparece en Elementor**

**Posibles causas y soluciones:**

1. **Archivo functions.php con errores**
   ```php
   // Verificar que el código esté antes del ?>
   // Comprobar sintaxis PHP
   ```

2. **Ruta de archivos incorrecta**
   ```php
   // Verificar que existe:
   wp-content/themes/TU-TEMA/mobile-plans/elementor/mobile-plans-widget.php
   ```

3. **Permisos de archivos**
   ```bash
   # Configurar permisos correctos:
   # Carpetas: 755
   # Archivos: 644
   ```

4. **Cache de Elementor**
   ```
   WordPress Admin → Elementor → Herramientas → Regenerar CSS
   WordPress Admin → Elementor → Herramientas → Sync Library
   ```

### ❌ **Error: "No se encontró el archivo"**

**Soluciones:**

1. **Verificar estructura exacta:**
   ```
   wp-content/themes/TU-TEMA-ACTIVO/mobile-plans/functions-integration.php
   ```

2. **Para temas hijo:**
   ```php
   // Cambiar en functions.php:
   get_template_directory() 
   // por:
   get_stylesheet_directory()
   ```

3. **Verificar nombre del tema:**
   ```php
   // WordPress Admin → Apariencia → Temas
   // Anotar el nombre exacto del tema activo
   ```

### ❌ **Estilos no se cargan correctamente**

**Soluciones:**

1. **Regenerar CSS de Elementor:**
   ```
   Elementor → Herramientas → Regenerar CSS y Datos
   ```

2. **Limpiar cache:**
   ```
   - Cache de WordPress (si tienes plugin)
   - Cache del navegador (Ctrl+F5)
   - Cache del hosting
   ```

3. **Verificar archivos CSS:**
   ```
   Comprobar que existen:
   /mobile-plans/css/components.css
   /mobile-plans/css/themes.css
   /mobile-plans/css/animations.css
   ```

### ❌ **JavaScript no funciona / Errores de consola**

**Diagnóstico:**

1. **Abrir consola del navegador (F12)**
2. **Buscar errores en rojo**

**Soluciones comunes:**

1. **Dependencias CDN no cargan:**
   ```javascript
   // Verificar conexión a internet
   // Comprobar que se cargan Vue.js y Axios
   ```

2. **Conflictos con otros plugins:**
   ```
   // Desactivar temporalmente otros plugins
   // Activar uno por uno para identificar conflicto
   ```

3. **Modo de compatibilidad jQuery:**
   ```php
   // Añadir a functions.php si es necesario:
   wp_deregister_script('jquery');
   wp_register_script('jquery', 'https://code.jquery.com/jquery-3.6.0.min.js');
   wp_enqueue_script('jquery');
   ```

### ❌ **No cargan los datos de productos**

**Verificaciones:**

1. **Conectividad:**
   ```
   Probar en navegador:
   https://ipv6-informatica.es/cart/data/products.json
   ```

2. **Configuración API:**
   ```
   WordPress Admin → Ajustes → Mobile Plans
   Verificar URL correcta
   ```

3. **Red/Firewall:**
   ```
   Comprobar que el hosting permite conexiones externas
   Verificar que no hay restricciones de CORS
   ```

### ❌ **Problemas de rendimiento**

**Optimizaciones:**

1. **Cache más agresivo:**
   ```
   Ajustes → Mobile Plans → Tiempo de Cache: 600 segundos
   ```

2. **Lazy loading:**
   ```css
   /* Ya incluido por defecto en el sistema */
   ```

3. **Reducir animaciones:**
   ```css
   @media (prefers-reduced-motion: reduce) {
       * { animation: none !important; }
   }
   ```

---

## 🔍 **TESTING Y VALIDACIÓN**

### Checklist de Funcionamiento

**✅ Backend (WordPress Admin):**
- [ ] Menú "Mobile Plans" en Ajustes
- [ ] Widget "Catálogo Planes Móviles" en Elementor
- [ ] Sin errores en functions.php

**✅ Frontend (Página pública):**
- [ ] Widget se muestra correctamente
- [ ] Datos de productos cargan
- [ ] Filtros funcionan
- [ ] Comparador funciona
- [ ] Calculadora funciona
- [ ] Responsive en móvil/tablet

**✅ Rendimiento:**
- [ ] Carga rápida (< 3 segundos)
- [ ] Sin errores en consola
- [ ] Estilos aplicados correctamente

### Comandos de Debug

**En consola del navegador (F12):**

```javascript
// Ver estado del sistema
mobilePlansElementorDebug();

// Ver widgets activos
window.MobilePlansElementor.getDebugInfo();

// Verificar Vue.js
console.log(typeof Vue !== 'undefined' ? 'Vue cargado' : 'Vue NO cargado');

// Verificar Axios
console.log(typeof axios !== 'undefined' ? 'Axios cargado' : 'Axios NO cargado');
```

**En WordPress (modo debug):**

```php
// Añadir a wp-config.php temporalmente:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Ver logs en: /wp-content/debug.log
```

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

### Archivos de Referencia
- **README.md**: Documentación técnica completa
- **config/operators.json**: Configuración de operadores
- **config/settings.json**: Configuración global del sistema

### Personalización Avanzada
- **Modificar operadores**: Editar `config/operators.json`
- **Cambiar API**: Configurar en Ajustes > Mobile Plans
- **Añadir funcionalidades**: Modificar archivos en `/js/components/`

### Soporte y Actualizaciones
- **Versión actual**: 2.0.0
- **Compatibilidad**: WordPress 5.0+, Elementor 3.0+
- **Actualizaciones**: Reemplazar archivos manteniendo configuración

---

## 📞 **SOPORTE TÉCNICO**

Si necesitas ayuda adicional:

1. **Verificar esta guía** completamente
2. **Comprobar logs de errores** (wp-content/debug.log)
3. **Probar en modo debug** (WP_DEBUG = true)
4. **Contactar con documentación** de cada error específico

**Información útil para soporte:**
- Versión de WordPress
- Versión de Elementor
- Nombre del tema activo
- Mensajes de error exactos
- Captura del problema

---

## 🎯 **SIGUIENTES PASOS RECOMENDADOS**

1. **✅ Completar instalación** siguiendo esta guía
2. **🎨 Personalizar estilos** según tu marca
3. **📊 Configurar analytics** (opcional)
4. **🔧 Optimizar rendimiento** según necesidades
5. **📱 Probar en dispositivos móviles**
6. **🚀 Publicar y promocionar**

---

**¡Listo! Tu sistema de catálogo de planes móviles debería estar funcionando perfectamente en WordPress + Elementor.**

Para cualquier consulta específica, revisa la sección de troubleshooting o consulta la documentación técnica completa en README.md.
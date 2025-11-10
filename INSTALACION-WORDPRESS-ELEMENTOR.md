# 📦 Instalación Mobile Plans en WordPress + Elementor

## 🎯 Guía Completa de Integración

Esta guía te mostrará cómo instalar la aplicación Mobile Plans Comparator como un widget de Elementor completamente funcional en tu WordPress.

---

## 🔧 **PASO 1: Preparar los Archivos**

### 📁 Estructura que necesitas copiar:

```
📂 mobile-plans/
├── 📁 config/
│   └── products-enhanced.json
├── 📁 css/
│   ├── comparison-enhanced.css
│   ├── additional-styles.css
│   ├── animations.css
│   ├── components.css
│   ├── filter-dropdowns.css
│   ├── neutral-theme.css
│   └── themes.css
├── 📁 js/
│   ├── app-new.js
│   └── 📁 components/
│       ├── Calculator.js
│       ├── Comparator.js
│       ├── FilterSystem.js
│       ├── FilterSystemNew.js
│       ├── NavigationMinimal.js
│       ├── ProductCard.js
│       └── ProductCardNew.js
├── 📁 elementor/
│   ├── elementor-handler.js
│   ├── elementor-integration.php
│   ├── elementor-styles.css
│   └── mobile-plans-widget.php
└── functions-mobile-plans-integration.php
```

### 🎯 **Copiar al tema activo:**

**Destino final:**
```
wp-content/themes/TU-TEMA-ACTIVO/mobile-plans/
```

**⚠️ Importante:** Asegúrate de copiar la carpeta completa `mobile-plans/` dentro de tu tema activo de WordPress.

---

## ⚙️ **PASO 2: Integrar con WordPress**

### 📝 **Opción A: Incluir archivo (Recomendado)**

1. **Abrir tu `functions.php`:**
   ```
   wp-content/themes/tu-tema/functions.php
   ```

2. **Agregar al final del archivo:**
   ```php
   // Mobile Plans Comparator - Integración
   require_once get_template_directory() . '/mobile-plans/functions-mobile-plans-integration.php';
   ```

3. **Guardar el archivo**

### 📋 **Opción B: Copiar contenido directamente**

1. Abrir `mobile-plans/functions-mobile-plans-integration.php`
2. Copiar TODO el contenido (ya viene sin `<?php`)
3. Pegar al final de tu `functions.php`
4. Guardar

---

## 🎨 **PASO 3: Verificar Instalación**

### ✅ **Comprobaciones inmediatas:**

1. **Acceder al admin de WordPress**
2. **Buscar avisos de instalación**
   - Si todo está bien: No habrá avisos de error
   - Si falta algo: Aparecerán avisos informativos

3. **Verificar que Elementor detecta el widget:**
   - Ir a editar una página con Elementor
   - Buscar "Mobile Plans" en el panel de widgets
   - Debería aparecer "Mobile Plans Comparator"

---

## 🎯 **PASO 4: Usar en Elementor**

### 📱 **Como Widget de Elementor:**

1. **Editar página con Elementor**
2. **Buscar "Mobile Plans Comparator"** en widgets
3. **Arrastrar a la página**
4. **Configurar opciones** en el panel lateral:

#### ⚙️ **Configuraciones Disponibles:**

**📊 Configuración General:**
- **Tema Visual:** neutral, dark, custom
- **Vista por Defecto:** grid, list
- **Máximo Comparaciones:** 2-5

**🔍 Filtros:**
- **Operadores por Defecto:** movistar, vodafone, orange
- **Tipo de Plan:** individual, familiar, empresarial
- **Precio Máximo:** deslizador hasta 100€
- **Mostrar/Ocultar Filtros:** on/off

**⭐ Planes Populares:**
- **Automático:** 3 primeros del catálogo
- **Selección Manual:** Elegir productos específicos
- **Más Baratos:** Automático por operador
- **Más Caros:** Automático por operador
- **Mejor Valor:** Relación calidad-precio

**🛠️ Funcionalidades:**
- **Habilitar Comparación:** on/off
- **Habilitar Búsqueda:** on/off
- **URL API:** configurar origen de datos
- **Tiempo de Caché:** minutos

5. **Publicar la página**

---

## 📝 **PASO 5: Usar como Shortcode (Opcional)**

### 🔗 **Uso básico:**
```
[mobile_plans]
```

### ⚙️ **Con parámetros:**
```
[mobile_plans theme="neutral" view="grid" max_comparisons="3" show_filters="yes" enable_comparison="yes"]
```

### 📋 **Parámetros disponibles:**
- `theme`: neutral, dark, custom
- `view`: grid, list
- `max_comparisons`: 2, 3, 4, 5
- `show_filters`: yes, no
- `enable_comparison`: yes, no
- `enable_search`: yes, no
- `featured_mode`: auto, manual, cheapest, most_expensive, best_value

---

## 🔧 **PASO 6: Configuración Avanzada**

### 📊 **Personalizar datos de productos:**

**Archivo de configuración:**
```
mobile-plans/config/products-enhanced.json
```

**Estructura de producto:**
```json
{
  "id": "plan-unico",
  "name": "Nombre del Plan",
  "operator": "movistar",
  "price": 25.99,
  "data": "30",
  "calls": "unlimited",
  "sms": "unlimited",
  "planType": "individual",
  "network": "5G",
  "description": "PROMOCION ESPECIAL 50% - Descripción completa del plan con todas las características incluidas."
}
```

### 🎨 **Personalizar estilos:**

**CSS personalizado:**
```css
/* En tu tema o CSS adicional */
.mobile-plans-wrapper {
    /* Tus estilos personalizados */
}

.product-card-new {
    /* Personalizar tarjetas */
}

.comparison-table {
    /* Personalizar tabla de comparación */
}
```

---

## 🚀 **PASO 7: Funcionalidades Principales**

### 📱 **Lo que incluye la aplicación:**

✅ **Página de Inicio:**
- Hero section con call-to-action
- 6 tarjetas flotantes con precios dinámicos (3 caros arriba, 3 baratos abajo)
- Sección de planes más valorados (configurables desde Elementor)

✅ **Página de Planes:**
- Sistema de filtros avanzado (operador, precio, tipo de plan, datos)
- Tarjetas de productos con imágenes de fondo por operador
- Descripciones dinámicas con formato especial para promociones
- Sistema de comparación (hasta 3 productos)

✅ **Página de Comparación:**
- Tabla responsive con columnas proporcionales
- Resaltado automático de valores más relevantes
- Botones de contratación integrados
- Detección inteligente de diferencias

✅ **Características Técnicas:**
- Carga de datos desde API externa con fallback local
- Sistema de caché inteligente
- Responsive design completo
- Integración completa con Elementor
- Shortcode para uso flexible

---

## 🛠️ **PASO 8: Resolución de Problemas**

### ❌ **Problemas Comunes:**

**"No aparece el widget en Elementor"**
- ✅ Verificar que Elementor esté activo
- ✅ Comprobar que la carpeta mobile-plans/ esté en el tema correcto
- ✅ Revisar que functions.php no tenga errores de sintaxis

**"Los estilos no se cargan correctamente"**
- ✅ Verificar permisos de archivos CSS
- ✅ Limpiar caché del sitio
- ✅ Comprobar que las rutas de archivos sean correctas

**"No cargan los productos"**
- ✅ Verificar conectividad a la API externa
- ✅ Comprobar que products-enhanced.json sea válido
- ✅ Revisar logs de errores de WordPress

**"El shortcode no funciona"**
- ✅ Verificar que el código esté en functions.php
- ✅ Comprobar sintaxis del shortcode
- ✅ Asegurar que no hay conflictos con otros plugins

### 🔍 **Logs de Debug:**

En la consola del navegador deberías ver:
```
✅ Productos cargados: 12
🚀 COMPARATOR MOUNTED - Vue funciona correctamente!
📊 Planes destacados cargados: auto, count: 3
```

---

## 📞 **PASO 9: Soporte y Mantenimiento**

### 🔄 **Actualizar la aplicación:**

1. **Hacer backup** de la carpeta mobile-plans/ actual
2. **Reemplazar archivos** con la nueva versión
3. **Mantener configuraciones** (se conservan automáticamente)
4. **Limpiar caché** del sitio

### 📊 **Monitoreo:**

- Los avisos admin te informarán de problemas
- La aplicación funciona offline con datos locales
- Sistema de fallback automático incluido

### 🎯 **Personalización futura:**

- Agregar nuevos productos en products-enhanced.json
- Personalizar estilos en CSS
- Configurar nuevos modos de planes populares
- Integrar con sistemas de analytics

---

## ✅ **¡INSTALACIÓN COMPLETADA!**

### 🎉 **Ya tienes disponible:**

- ✅ **Widget "Mobile Plans Comparator"** en Elementor
- ✅ **Shortcode `[mobile_plans]`** para uso libre
- ✅ **Sistema completo** de comparación de planes móviles
- ✅ **Gestión avanzada** desde el panel de Elementor
- ✅ **Diseño responsive** y profesional

### 🚀 **Próximos pasos recomendados:**

1. **Crear una página** con el widget de Elementor
2. **Configurar planes populares** según tu estrategia
3. **Personalizar colores** para que coincidan con tu marca
4. **Probar todas las funcionalidades** en diferentes dispositivos

---

**¿Necesitas ayuda adicional?** Todos los archivos incluyen documentación interna y comentarios explicativos para facilitar futuras modificaciones.
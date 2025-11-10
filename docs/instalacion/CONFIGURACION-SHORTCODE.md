# ⚙️ CONFIGURACIÓN DEL SHORTCODE - Mobile Plans

## 🎯 **Shortcodes Disponibles**

Mobile Plans ofrece shortcodes flexibles y configurables para diferentes casos de uso.

---

## 📱 **Shortcode Principal**

### **`[mobile_plans]` - Aplicación Completa**

**Uso básico:**
```
[mobile_plans]
```

**Resultado:**
- Iframe dinámico con altura automática
- Loading animado profesional
- Comunicación bidireccional
- Responsive automático

---

## ⚙️ **Parámetros del Shortcode**

### **`height` - Altura Inicial**
```
[mobile_plans height="800"]
```

**Valores:**
- **Por defecto:** `600` (píxeles)
- **Rango recomendado:** `400-1200`
- **Unidad:** Píxeles (px)

**Descripción:**
- Altura inicial del iframe antes del ajuste automático
- Se ajustará dinámicamente al contenido real
- Útil para evitar saltos visuales durante la carga

**Ejemplos:**
```
[mobile_plans height="500"]    ← Más compacto
[mobile_plans height="700"]    ← Estándar amplio  
[mobile_plans height="1000"]   ← Para contenido extenso
```

---

### **`min_height` - Altura Mínima**
```
[mobile_plans min_height="500"]
```

**Valores:**
- **Por defecto:** `400` (píxeles)
- **Rango recomendado:** `300-800`
- **Unidad:** Píxeles (px)

**Descripción:**
- Altura mínima garantizada del iframe
- Evita que el iframe sea demasiado pequeño
- Útil para mantener proporciones visuales

**Ejemplos:**
```
[mobile_plans min_height="300"]   ← Mínimo compacto
[mobile_plans min_height="500"]   ← Mínimo estándar
[mobile_plans min_height="600"]   ← Mínimo amplio
```

---

### **Combinación de Parámetros**
```
[mobile_plans height="700" min_height="400"]
```

**Comportamiento:**
1. Iframe inicia con `height` píxeles
2. Se ajusta dinámicamente al contenido
3. Nunca será menor a `min_height` píxeles

---

## 🎨 **Casos de Uso Específicos**

### **📰 Blog Posts / Artículos**
```
[mobile_plans height="600" min_height="400"]
```
- Altura moderada para integración en contenido
- Se ajusta al contenido sin dominar el artículo

### **🏠 Página Principal / Landing**
```
[mobile_plans height="800" min_height="600"]
```
- Mayor impacto visual
- Altura generosa para mostrar más contenido

### **📱 Dispositivos Móviles**
```
[mobile_plans height="500" min_height="350"]
```
- Optimizado para pantallas pequeñas
- Altura más compacta para mejor UX móvil

### **🎛️ Sidebar / Widget Areas**
```
[mobile_plans height="400" min_height="300"]
```
- Versión compacta para espacios reducidos
- Altura mínima para mantener usabilidad

---

## 🔧 **Shortcode de Debug**

### **`[mobile_plans_debug]` - Información del Sistema**

**Uso:**
```
[mobile_plans_debug]
```

**Solo visible para:** Administradores

**Información mostrada:**
- ✅ **Verificación de archivos:** Todos los archivos necesarios
- 🌐 **URLs de acceso:** Links directos para pruebas
- 🔧 **Funciones de debug:** Comandos disponibles en consola
- 📊 **Rutas del sistema:** Directorios y configuración

**Ejemplo de salida:**
```
📱 Mobile Plans - Información de Debug

📁 Directorio: /wp-content/themes/tu-tema/mobile-plans/
🌐 URL: https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/

✅ Verificación de Archivos:
✅ index-new.html
✅ js/app-new.js  
✅ js/iframe-auto-adjust.js
✅ css/comparison-enhanced.css
✅ config/ (directorio)

🔧 Funciones de Debug:
mobilePlansDebugIframe() - Solicitar reajuste de altura
mobilePlansResizeAll() - Reajustar todos los iframes  
console.log(window.mobilePlansIframes) - Ver todos los iframes

📊 URL de Prueba:
Abrir aplicación directamente
```

---

## 🎛️ **Personalización Avanzada**

### **CSS Custom Properties**
```css
/* En Personalizar → CSS Adicional: */

/* Personalizar contenedor */
.mobile-plans-container {
    margin: 30px auto !important;
    max-width: 1200px !important;
    border-radius: 15px !important;
}

/* Personalizar iframe */
.mobile-plans-container iframe {
    box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
    border-radius: 12px !important;
}

/* Personalizar loading */
.mobile-plans-loading {
    background: linear-gradient(135deg, #tu-color-1, #tu-color-2) !important;
}
```

### **Responsive Personalizado**
```css
/* Responsive específico para Mobile Plans */
@media (max-width: 1200px) {
    .mobile-plans-container {
        margin: 20px 15px !important;
    }
}

@media (max-width: 768px) {
    .mobile-plans-container {
        margin: 15px 10px !important;
    }
    
    .mobile-plans-container iframe {
        border-radius: 8px !important;
    }
}

@media (max-width: 480px) {
    .mobile-plans-container {
        margin: 10px 5px !important;
    }
}
```

### **Integración con Tema**
```php
// En functions.php - Personalización por tema:
function mi_tema_mobile_plans_styles() {
    $primary_color = get_theme_mod('primary_color', '#667eea');
    $secondary_color = get_theme_mod('secondary_color', '#764ba2');
    
    echo "<style>
        .mobile-plans-loading {
            background: linear-gradient(135deg, {$primary_color}, {$secondary_color}) !important;
        }
        
        .mobile-plans-container iframe {
            box-shadow: 0 10px 40px rgba(" . hex2rgb($primary_color) . ", 0.2) !important;
        }
    </style>";
}
add_action('wp_head', 'mi_tema_mobile_plans_styles');
```

---

## 📊 **Ejemplos de Implementación**

### **Página de Productos**
```html
<h1>Nuestros Planes Móviles</h1>
<p>Encuentra el plan perfecto para ti con nuestro comparador interactivo.</p>

[mobile_plans height="800" min_height="500"]

<h2>¿Necesitas ayuda?</h2>
<p>Contacta con nuestro equipo para asesoramiento personalizado.</p>
```

### **Landing Page**
```html
<div class="hero-section">
    <h1>Compara Planes Móviles</h1>
    <p>La herramienta más completa para encontrar tu plan ideal</p>
</div>

[mobile_plans height="900" min_height="600"]

<div class="cta-section">
    <h2>¿Listo para cambiar?</h2>
    <button>Contratar Ahora</button>
</div>
```

### **Página de Comparación**
```html
<h1>Comparador de Planes</h1>

[mobile_plans height="700" min_height="400"]

<div class="additional-info">
    <h3>Información Adicional</h3>
    <ul>
        <li>Todos los precios incluyen IVA</li>
        <li>Datos actualizados diariamente</li>
        <li>Comparación independiente</li>
    </ul>
</div>
```

---

## 🔍 **Debugging del Shortcode**

### **Verificación Rápida**
```html
<!-- Insertar en página de prueba: -->
<h2>Información del Sistema</h2>
[mobile_plans_debug]

<h2>Aplicación Principal</h2>  
[mobile_plans height="600" min_height="400"]
```

### **Logs en Consola**
```javascript
// Verificar que el shortcode funciona:
console.log('Mobile Plans Iframes:', window.mobilePlansIframes);

// Forzar reajuste:
mobilePlansResizeAll();

// Debug específico:
mobilePlansDebugIframe();
```

### **URLs de Verificación**
```bash
# Verificar acceso directo:
https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/index-new.html

# Verificar archivo de auto-ajuste:
https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/js/iframe-auto-adjust.js

# Verificar configuración:
https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/config/products-enhanced.json
```

---

## ⚡ **Optimización de Rendimiento**

### **Carga Condicional**
```php
// Solo cargar Mobile Plans en páginas específicas:
function mobile_plans_conditional_load() {
    global $post;
    
    // Solo en páginas que usen el shortcode
    if (is_a($post, 'WP_Post') && 
        (has_shortcode($post->post_content, 'mobile_plans') || 
         has_shortcode($post->post_content, 'mobile_plans_debug'))) {
        
        // Precargar recursos críticos
        echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
        echo '<link rel="preconnect" href="https://ipv6-informatica.es">';
    }
}
add_action('wp_head', 'mobile_plans_conditional_load');
```

### **Cache-Friendly**
```php
// Configuración cache-friendly:
function mobile_plans_cache_headers() {
    if (is_admin()) return;
    
    global $post;
    
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'mobile_plans')) {
        // Headers para cache
        header('Cache-Control: public, max-age=3600');
        header('Vary: User-Agent');
    }
}
add_action('send_headers', 'mobile_plans_cache_headers');
```

---

## 🎯 **Best Practices**

### **✅ Recomendaciones**
1. **Usar parámetros apropiados** para cada contexto
2. **Probar en múltiples dispositivos** después de configurar
3. **Verificar con `[mobile_plans_debug]`** antes del deployment
4. **Mantener heights razonables** (400-1000px)
5. **Considerar el contexto** (sidebar vs página completa)

### **❌ Evitar**
1. **Heights extremos** (< 300px o > 1500px)
2. **Múltiples instancias** en la misma página (no soportado aún)
3. **CSS conflictivo** que afecte el iframe
4. **JavaScript interference** con PostMessage

---

**🎯 Con esta configuración tendrás control total sobre cómo se muestra Mobile Plans en tu sitio.**

*Para problemas específicos, consultar [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)*
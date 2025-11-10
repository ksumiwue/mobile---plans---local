# 🔧 TROUBLESHOOTING - Mobile Plans WordPress

## 🎯 **Guía de Solución de Problemas**

Esta guía cubre los problemas más comunes y sus soluciones paso a paso.

---

## 🚨 **Problemas Críticos**

### **❌ Error: "Iframe vacío o no carga"**

**Síntomas:**
- El shortcode muestra un iframe vacío
- Loading permanece indefinidamente
- Error 404 en la consola

**Causas Comunes:**
1. Archivos no copiados correctamente
2. Ruta incorrecta en el tema
3. Permisos de archivo incorrectos

**Solución Paso a Paso:**
```bash
1. Verificar URL directa:
   https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/index-new.html
   
   ✅ Debe cargar la aplicación
   ❌ Si da 404, los archivos no están bien copiados

2. Verificar estructura:
   /wp-content/themes/tu-tema/mobile-plans/
   ├── index-new.html
   ├── js/
   ├── css/
   └── config/

3. Verificar permisos:
   - Archivos: 644
   - Directorios: 755

4. Usar shortcode debug:
   [mobile_plans_debug]
   
   Todos los archivos deben mostrar ✅
```

---

### **❌ Error: "Aparecen scrolls en el iframe"**

**Síntomas:**
- Barras de scroll horizontales o verticales
- Iframe no se ajusta al contenido
- Altura fija que no cambia

**Causas Comunes:**
1. Script `iframe-auto-adjust.js` no se carga
2. Comunicación PostMessage fallando
3. CSS conflictivo del tema WordPress

**Solución Paso a Paso:**
```bash
1. Verificar consola (F12):
   ✅ Debe aparecer: "📱 Mobile Plans: Detectado iframe, cargando auto-ajuste..."
   ❌ Si no aparece, el script no se carga

2. Verificar archivo iframe-auto-adjust.js:
   https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/js/iframe-auto-adjust.js
   ✅ Debe descargar el archivo
   ❌ Si da 404, copiar el archivo

3. Forzar comunicación en consola:
   mobilePlansDebugIframe()
   
   ✅ Debe mostrar: "🔧 Mobile Plans: Solicitando altura para debug..."

4. CSS override temporal:
   .mobile-plans-container iframe {
       height: auto !important;
       min-height: 600px !important;
   }
```

---

### **❌ Error: "No aparecen productos"**

**Síntomas:**
- La aplicación carga pero no muestra productos
- Secciones vacías
- Error en carga de datos

**Causas Comunes:**
1. API externa no accesible desde servidor
2. Archivos de configuración faltantes
3. JavaScript bloqueado

**Solución Paso a Paso:**
```bash
1. Verificar API externa:
   Abrir en navegador: https://ipv6-informatica.es/cart/data/products.json
   ✅ Debe mostrar JSON con productos
   ❌ Si falla, usar datos locales

2. Verificar archivo local:
   https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/config/products-enhanced.json
   ✅ Debe descargar JSON con productos

3. Verificar en consola del iframe:
   - Abrir iframe directamente
   - F12 → Console
   - Buscar errores de carga de datos

4. Solución temporal (datos demo):
   Modificar config/products-enhanced.json con datos de prueba
```

---

## ⚠️ **Problemas Comunes**

### **⚠️ Loading muy lento**

**Síntomas:**
- Loading dura más de 10 segundos
- Aplicación eventual carga pero muy lenta

**Soluciones:**
```bash
1. Optimizar imágenes y assets
2. Verificar plugins de caché
3. Aumentar timeout:
   
   En functions.php, cambiar:
   }, 5000); // de 5 segundos
   
   Por:
   }, 10000); // a 10 segundos

4. Verificar server response time:
   Developer Tools → Network → Reload
   Buscar archivos lentos
```

---

### **⚠️ No responsive en móviles**

**Síntomas:**
- Se ve mal en móviles
- Elementos cortados o muy pequeños

**Soluciones:**
```bash
1. Verificar viewport en index-new.html:
   <meta name="viewport" content="width=device-width, initial-scale=1.0">

2. Añadir CSS específico:
   @media (max-width: 768px) {
       .mobile-plans-container {
           margin: 10px 0;
       }
       
       .mobile-plans-container iframe {
           border-radius: 6px;
       }
   }

3. Forzar reajuste en móviles:
   En consola móvil: mobilePlansResizeAll()
```

---

### **⚠️ Conflictos con otros plugins**

**Síntomas:**
- Funciona solo a veces
- Errores JavaScript intermitentes
- Otros plugins dejan de funcionar

**Soluciones:**
```bash
1. Desactivar plugins uno a uno para identificar conflicto
2. Mover código Mobile Plans al final de functions.php
3. Usar namespace para evitar conflictos:
   
   Cambiar:
   function mobile_plans_dynamic_iframe_shortcode
   
   Por:
   function tu_tema_mobile_plans_dynamic_iframe_shortcode

4. Verificar jQuery conflicts:
   jQuery.noConflict();
```

---

## 🔍 **Herramientas de Debug**

### **🔧 Shortcode de Debug**
```bash
[mobile_plans_debug]

Información mostrada:
- Rutas de archivos
- Estado de archivos (✅/❌)
- URLs de prueba
- Funciones de debug disponibles
```

### **🔧 Consola JavaScript**
```javascript
// Funciones disponibles:
mobilePlansDebugIframe()          // Forzar reajuste
mobilePlansResizeAll()            // Reajustar todos
console.log(window.mobilePlansIframes) // Ver iframes activos

// Verificar comunicación:
window.addEventListener('mobilePlansResized', function(event) {
    console.log('Iframe resized:', event.detail);
});
```

### **🔧 Logs Detallados**
```javascript
// En la consola del iframe (aplicación):
📱 Mobile Plans: Ejecutándose standalone
📱 Mobile Plans: Detectado iframe, cargando auto-ajuste...
🚀 Mobile Plans: Inicializando ajuste automático de iframe...
✅ Mobile Plans: Estilos de iframe aplicados
📏 Mobile Plans: Altura enviada al padre: 850px

// En la consola de WordPress (página padre):
📱 Mobile Plans: Iframe cargado: mobile-plans-iframe-xxx
📡 Mobile Plans: Mensaje de resize recibido: 850
📏 Mobile Plans: Altura ajustada a 850px para mobile-plans-iframe-xxx
✅ Mobile Plans: Sistema de comunicación configurado
```

---

## 🛠️ **Soluciones Avanzadas**

### **🔧 Forzar Compatibilidad**
```php
// Añadir al final de functions.php si hay problemas:

// Forzar jQuery en footer
function mobile_plans_force_jquery_footer() {
    wp_script_add_data('jquery', 'group', 1);
}
add_action('wp_enqueue_scripts', 'mobile_plans_force_jquery_footer');

// Desactivar optimizaciones que pueden interferir
function mobile_plans_disable_optimizations() {
    // Desactivar defer en scripts Mobile Plans
    add_filter('script_loader_tag', function($tag, $handle) {
        if (strpos($handle, 'mobile-plans') !== false) {
            $tag = str_replace(' defer', '', $tag);
        }
        return $tag;
    }, 10, 2);
}
add_action('wp_enqueue_scripts', 'mobile_plans_disable_optimizations');
```

### **🔧 Cache Compatibility**
```php
// Compatibilidad con plugins de caché:

// Excluir de caché dinámico
function mobile_plans_cache_exceptions() {
    if (function_exists('rocket_exclude_defer_js')) {
        rocket_exclude_defer_js(['/mobile-plans/']);
    }
    
    if (function_exists('w3tc_pgcache_flush')) {
        // Configuración específica W3 Total Cache
    }
}
add_action('init', 'mobile_plans_cache_exceptions');
```

### **🔧 Modo Debug Avanzado**
```php
// Activar logs detallados:
function mobile_plans_enable_debug() {
    if (current_user_can('administrator') && isset($_GET['mobile_plans_debug'])) {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        
        // Log de errores específico
        ini_set('log_errors', 1);
        ini_set('error_log', get_template_directory() . '/mobile-plans-debug.log');
    }
}
add_action('init', 'mobile_plans_enable_debug');
```

---

## 🆘 **Soluciones de Emergencia**

### **🚨 Si nada funciona**

**Opción 1: Iframe Simple**
```php
// Reemplazar shortcode complejo por uno simple:
function mobile_plans_emergency_shortcode() {
    $url = get_template_directory_uri() . '/mobile-plans/index-new.html';
    return '<iframe src="' . $url . '" width="100%" height="800" frameborder="0" style="border-radius: 8px;"></iframe>';
}
add_shortcode('mobile_plans_emergency', 'mobile_plans_emergency_shortcode');

// Usar: [mobile_plans_emergency]
```

**Opción 2: Link Directo**
```php
// Si iframe no funciona, enlace directo:
function mobile_plans_link_shortcode() {
    $url = get_template_directory_uri() . '/mobile-plans/index-new.html';
    return '<div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
        <h3>Mobile Plans</h3>
        <p>Comparador de planes móviles</p>
        <a href="' . $url . '" target="_blank" class="button" style="background: #667eea; color: white; padding: 15px 30px; border-radius: 6px; text-decoration: none;">Abrir Mobile Plans</a>
    </div>';
}
add_shortcode('mobile_plans_link', 'mobile_plans_link_shortcode');

// Usar: [mobile_plans_link]
```

**Opción 3: Popup/Modal**
```php
// Abrir en popup/modal:
function mobile_plans_popup_shortcode() {
    $url = get_template_directory_uri() . '/mobile-plans/index-new.html';
    return '<button onclick="window.open(\'' . $url . '\', \'mobileplans\', \'width=1200,height=800,scrollbars=yes\')" 
            style="background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 6px; cursor: pointer;">
        Abrir Mobile Plans
    </button>';
}
add_shortcode('mobile_plans_popup', 'mobile_plans_popup_shortcode');

// Usar: [mobile_plans_popup]
```

---

## 📊 **Verificación Final**

### **Checklist de Diagnóstico**
```bash
□ URL directa funciona: /mobile-plans/index-new.html
□ [mobile_plans_debug] muestra todos ✅
□ Consola sin errores 404
□ iframe-auto-adjust.js se descarga
□ PostMessage funciona (logs de comunicación)
□ Altura se ajusta dinámicamente
□ Sin scrolls en iframe
□ Responsive en móviles
□ Productos aparecen correctamente
□ Navegación funciona
```

### **Información para Soporte**
```bash
Si necesitas soporte, incluir:

1. URL del sitio con problema
2. Versión de WordPress
3. Tema usado
4. Plugins activos
5. Mensajes de consola (F12)
6. Resultado de [mobile_plans_debug]
7. Screenshots del problema
8. Dispositivos donde falla/funciona
```

---

**🎯 Con estas soluciones deberías poder resolver cualquier problema de integración.**

*Si el problema persiste, considera usar las soluciones de emergencia mientras investigas la causa raíz.*
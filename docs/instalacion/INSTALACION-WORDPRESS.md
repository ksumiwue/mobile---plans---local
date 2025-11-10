# 🚀 INSTALACIÓN EN WORDPRESS - Mobile Plans

## 📋 **Requisitos Previos**

### **Entorno WordPress**
- ✅ WordPress 5.0 o superior
- ✅ PHP 5.6 o superior (recomendado 7.4+)
- ✅ Tema activo con acceso a `functions.php`
- ✅ Permisos de escritura en directorio del tema

### **Archivos Necesarios**
- ✅ Aplicación Mobile Plans completa y funcional
- ✅ Acceso FTP o File Manager de hosting
- ✅ Navegador web para pruebas

---

## 🎯 **Instalación Paso a Paso**

### **PASO 1: Preparar la Aplicación (5 minutos)**

#### **1.1 Verificar Aplicación Local**
```bash
# Tu aplicación debe funcionar correctamente en:
http://localhost/PROGRAMACION/GITHUB/Moviles/mobile-plans-local/index-new.html

✅ Debe cargar sin errores
✅ Debe mostrar productos reales
✅ Debe funcionar navegación
✅ Debe funcionar filtros
```

#### **1.2 Verificar Estructura de Archivos**
```bash
mobile-plans-local/
├── index-new.html                 ← Aplicación principal
├── index.html                     ← Aplicación alternativa (opcional)
├── js/
│   ├── app-new.js                 ← JavaScript principal
│   ├── iframe-auto-adjust.js      ← Auto-ajuste para iframe
│   └── components/                ← Componentes JS
├── css/                           ← Todos los estilos CSS
├── config/                        ← Configuración y datos
└── .gitattributes                 ← Configuración Git
```

---

### **PASO 2: Subir Archivos a WordPress (5 minutos)**

#### **2.1 Localizar Directorio del Tema**
```bash
# Estructura típica de WordPress:
/wp-content/themes/[nombre-del-tema]/

# Ejemplos comunes:
/wp-content/themes/twentytwentyfour/
/wp-content/themes/astra/
/wp-content/themes/hello-elementor/
/wp-content/themes/thegem-elementor/     ← Tu caso
```

#### **2.2 Crear Directorio Mobile Plans**
```bash
# Crear carpeta en tu tema:
/wp-content/themes/tu-tema/mobile-plans/

# Mediante:
# - FTP: Crear carpeta "mobile-plans"
# - File Manager: Nueva carpeta "mobile-plans"
# - SSH: mkdir mobile-plans
```

#### **2.3 Subir Todos los Archivos**
```bash
# Subir TODA tu aplicación a:
/wp-content/themes/tu-tema/mobile-plans/

# Resultado final:
/wp-content/themes/tu-tema/mobile-plans/
├── index-new.html
├── js/
├── css/
├── config/
└── .gitattributes
```

#### **2.4 Verificar Permisos**
```bash
# Archivos deben ser accesibles vía web:
https://tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/index-new.html

✅ Debe cargar tu aplicación normalmente
✅ Debe mostrar productos reales
✅ Sin errores 404
```

---

### **PASO 3: Integrar con WordPress (3 minutos)**

#### **3.1 Acceder a functions.php**

**Opción A: WordPress Admin (Recomendado)**
```bash
1. Panel de WordPress → Apariencia → Editor de Temas
2. Seleccionar "functions.php"
3. Scroll hasta el final del archivo
```

**Opción B: FTP/File Manager**
```bash
1. Navegar a /wp-content/themes/tu-tema/
2. Editar functions.php
3. Ir al final del archivo
```

#### **3.2 Añadir Código de Integración**
```php
<?php
// ===============================================
// MOBILE PLANS - INTEGRACIÓN WORDPRESS
// Versión: 4.0.0
// ===============================================

// Shortcode dinámico mejorado para Mobile Plans
function mobile_plans_dynamic_iframe_shortcode($atts) {
    $atts = shortcode_atts([
        'height' => '600',
        'min_height' => '400'
    ], $atts);
    
    $url = get_template_directory_uri() . '/mobile-plans/index-new.html';
    $iframe_id = 'mobile-plans-iframe-' . uniqid();
    
    ob_start();
    ?>
    <div class="mobile-plans-container" style="margin: 20px 0; width: 100%; position: relative;">
        <!-- Loading inicial -->
        <div id="<?php echo $iframe_id; ?>-loading" class="mobile-plans-loading" style="
            position: absolute; 
            top: 0; 
            left: 0; 
            right: 0; 
            height: <?php echo $atts['min_height']; ?>px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 12px;
            z-index: 2;
            color: white;
        ">
            <div style="text-align: center;">
                <div class="loading-spinner" style="
                    width: 40px; 
                    height: 40px; 
                    border: 4px solid rgba(255,255,255,0.3); 
                    border-top: 4px solid white; 
                    border-radius: 50%; 
                    animation: mobile-plans-spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <p style="margin: 0; font-weight: 500; font-size: 16px;">Cargando Mobile Plans...</p>
            </div>
        </div>
        
        <!-- Iframe dinámico -->
        <iframe 
            id="<?php echo $iframe_id; ?>"
            src="<?php echo $url; ?>" 
            width="100%" 
            height="<?php echo $atts['height']; ?>px"
            frameborder="0" 
            scrolling="no"
            style="
                border-radius: 12px; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.15); 
                transition: height 0.5s ease, opacity 0.3s ease; 
                overflow: hidden;
                opacity: 0;
                z-index: 1;
                position: relative;
                border: none;
                background: white;
            "
            onload="mobilePlansIframeLoaded('<?php echo $iframe_id; ?>')">
        </iframe>
    </div>
    
    <style>
    @keyframes mobile-plans-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .mobile-plans-container {
        background: transparent;
        border-radius: 12px;
        overflow: hidden;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .mobile-plans-container {
            margin: 15px 0;
        }
        
        #<?php echo $iframe_id; ?> {
            border-radius: 8px;
        }
        
        #<?php echo $iframe_id; ?>-loading {
            border-radius: 8px;
        }
    }
    
    @media (max-width: 480px) {
        .mobile-plans-container {
            margin: 10px 0;
        }
    }
    </style>
    
    <script>
    // Variables globales para este iframe específico
    window.mobilePlansIframes = window.mobilePlansIframes || {};
    
    // Función que se llama cuando el iframe carga
    function mobilePlansIframeLoaded(iframeId) {
        const iframe = document.getElementById(iframeId);
        const loading = document.getElementById(iframeId + '-loading');
        
        if (!iframe || !loading) return;
        
        console.log('📱 Mobile Plans: Iframe cargado:', iframeId);
        
        // Configurar comunicación con iframe
        setupMobilePlansIframe(iframeId, iframe, loading);
    }
    
    // Configurar comunicación bidireccional con iframe
    function setupMobilePlansIframe(iframeId, iframe, loading) {
        let lastHeight = 0;
        let isReady = false;
        
        // Función para ajustar altura
        function adjustIframeHeight(newHeight) {
            if (newHeight && newHeight > 100) {
                const adjustedHeight = Math.max(newHeight, <?php echo (int) $atts['min_height']; ?>);
                
                if (Math.abs(adjustedHeight - lastHeight) > 10) {
                    iframe.style.height = adjustedHeight + 'px';
                    lastHeight = adjustedHeight;
                    
                    console.log('📏 Mobile Plans: Altura ajustada a', adjustedHeight + 'px', 'para', iframeId);
                    
                    // Disparar evento personalizado
                    window.dispatchEvent(new CustomEvent('mobilePlansResized', {
                        detail: { 
                            iframeId: iframeId,
                            height: adjustedHeight, 
                            iframe: iframe 
                        }
                    }));
                }
            }
        }
        
        // Escuchar mensajes del iframe
        function handleIframeMessage(event) {
            // Verificar que el mensaje viene del iframe correcto
            if (event.source !== iframe.contentWindow) return;
            
            if (event.data && event.data.type === 'mobile-plans-resize') {
                console.log('📡 Mobile Plans: Mensaje de resize recibido:', event.data.height);
                adjustIframeHeight(event.data.height);
                
                // Mostrar iframe y ocultar loading la primera vez
                if (!isReady) {
                    isReady = true;
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.style.display = 'none';
                        iframe.style.opacity = '1';
                    }, 300);
                }
            }
        }
        
        // Registrar listener
        window.addEventListener('message', handleIframeMessage);
        
        // Solicitar altura inicial después de un delay
        setTimeout(() => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'mobile-plans-request-height'
                }, '*');
            }
        }, 1000);
        
        // Solicitar altura cada 2 segundos durante los primeros 10 segundos
        let attempts = 0;
        const heightRequester = setInterval(() => {
            attempts++;
            
            if (iframe.contentWindow && attempts < 5) {
                iframe.contentWindow.postMessage({
                    type: 'mobile-plans-request-height'
                }, '*');
            } else {
                clearInterval(heightRequester);
            }
        }, 2000);
        
        // Fallback: mostrar iframe después de 5 segundos aunque no haya comunicación
        setTimeout(() => {
            if (!isReady) {
                console.log('⚠️ Mobile Plans: Fallback - mostrando iframe sin comunicación');
                loading.style.display = 'none';
                iframe.style.opacity = '1';
                isReady = true;
            }
        }, 5000);
        
        // Ajuste cuando la ventana cambia de tamaño
        window.addEventListener('resize', function() {
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'mobile-plans-request-height'
                    }, '*');
                }
            }, 300);
        });
        
        // Almacenar referencia para debug
        window.mobilePlansIframes[iframeId] = {
            iframe: iframe,
            loading: loading,
            adjustHeight: adjustIframeHeight,
            requestHeight: () => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'mobile-plans-request-height'
                    }, '*');
                }
            }
        };
        
        console.log('✅ Mobile Plans: Sistema de comunicación configurado para', iframeId);
    }
    
    // Función global para debug
    window.mobilePlansDebugIframe = function(iframeId) {
        const iframeData = window.mobilePlansIframes[iframeId || Object.keys(window.mobilePlansIframes)[0]];
        if (iframeData) {
            console.log('🔧 Mobile Plans: Solicitando altura para debug...');
            iframeData.requestHeight();
        }
    };
    
    // Función global para forzar reajuste
    window.mobilePlansResizeAll = function() {
        Object.keys(window.mobilePlansIframes).forEach(id => {
            window.mobilePlansIframes[id].requestHeight();
        });
    };
    </script>
    <?php
    
    return ob_get_clean();
}

// Registrar shortcode
add_shortcode('mobile_plans', 'mobile_plans_dynamic_iframe_shortcode');

// Función para debug (solo administradores)
function mobile_plans_debug_shortcode() {
    if (!current_user_can('manage_options')) {
        return '<p>Solo administradores pueden ver información de debug.</p>';
    }
    
    $mobile_plans_path = get_template_directory() . '/mobile-plans/';
    $mobile_plans_url = get_template_directory_uri() . '/mobile-plans/';
    
    ob_start();
    ?>
    <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; font-family: monospace;">
        <h4 style="margin-top: 0; color: #495057;">📱 Mobile Plans - Información de Debug</h4>
        
        <p><strong>📁 Directorio:</strong> <?php echo $mobile_plans_path; ?></p>
        <p><strong>🌐 URL:</strong> <?php echo $mobile_plans_url; ?></p>
        
        <h5>✅ Verificación de Archivos:</h5>
        <ul style="list-style: none; padding: 0;">
            <li><?php echo file_exists($mobile_plans_path . 'index-new.html') ? '✅' : '❌'; ?> index-new.html</li>
            <li><?php echo file_exists($mobile_plans_path . 'js/app-new.js') ? '✅' : '❌'; ?> js/app-new.js</li>
            <li><?php echo file_exists($mobile_plans_path . 'js/iframe-auto-adjust.js') ? '✅' : '❌'; ?> js/iframe-auto-adjust.js</li>
            <li><?php echo file_exists($mobile_plans_path . 'css/comparison-enhanced.css') ? '✅' : '❌'; ?> css/comparison-enhanced.css</li>
            <li><?php echo is_dir($mobile_plans_path . 'config') ? '✅' : '❌'; ?> config/ (directorio)</li>
        </ul>
        
        <h5>🔧 Funciones de Debug:</h5>
        <p>En la consola del navegador puedes usar:</p>
        <ul>
            <li><code>mobilePlansDebugIframe()</code> - Solicitar reajuste de altura</li>
            <li><code>mobilePlansResizeAll()</code> - Reajustar todos los iframes</li>
            <li><code>console.log(window.mobilePlansIframes)</code> - Ver todos los iframes</li>
        </ul>
        
        <h5>📊 URL de Prueba:</h5>
        <p><a href="<?php echo $mobile_plans_url; ?>index-new.html" target="_blank">Abrir aplicación directamente</a></p>
    </div>
    <?php
    
    return ob_get_clean();
}
add_shortcode('mobile_plans_debug', 'mobile_plans_debug_shortcode');

// ===============================================
// FIN MOBILE PLANS INTEGRATION
// ===============================================
?>
```

#### **3.3 Guardar y Verificar**
```bash
1. Guardar functions.php
2. Verificar que no aparecen errores PHP
3. El sitio debe cargar normalmente
```

---

### **PASO 4: Probar la Instalación (3 minutos)**

#### **4.1 Verificar Sistema**
```bash
# Crear una página de prueba:
1. WordPress Admin → Páginas → Añadir nueva
2. Título: "Test Mobile Plans Debug"
3. Contenido: [mobile_plans_debug]
4. Publicar y visitar la página

✅ Debe mostrar información de debug
✅ Todos los archivos deben aparecer con ✅
✅ URL de prueba debe funcionar
```

#### **4.2 Crear Página de Prueba**
```bash
# Crear página principal:
1. WordPress Admin → Páginas → Añadir nueva
2. Título: "Mobile Plans"
3. Contenido: [mobile_plans]
4. Publicar y visitar la página
```

#### **4.3 Verificar Funcionamiento**
```bash
✅ ÉXITO - Debe verse:
- Loading animado inicial (gradiente azul-morado)
- Aplicación carga sin scrolls
- Altura se ajusta automáticamente
- Funciona navegación entre secciones
- Aparecen productos reales
- Funciona en móvil

❌ ERROR - Si ves:
- Iframe vacío o error 404
- Scrolls verticales u horizontales  
- Altura fija que no cambia
- No aparecen productos
- No funciona navegación
```

#### **4.4 Verificar Logs (Avanzado)**
```bash
# Abrir consola del navegador (F12):
✅ Logs correctos:
📱 Mobile Plans: Ejecutándose standalone
📱 Mobile Plans: Detectado iframe, cargando auto-ajuste...
🚀 Mobile Plans: Inicializando ajuste automático de iframe...
✅ Mobile Plans: Estilos de iframe aplicados
📏 Mobile Plans: Altura enviada al padre: 850px
📡 Mobile Plans: Mensaje de resize recibido: 850
📏 Mobile Plans: Altura ajustada a 850px para mobile-plans-iframe-xxx

❌ Logs de error:
404 errors para archivos JS/CSS
iframe-auto-adjust.js not found
CORS errors
```

---

## 🎨 **Personalización (Opcional)**

### **Shortcode con Parámetros**
```bash
# Altura personalizada:
[mobile_plans height="800"]

# Altura mínima personalizada:
[mobile_plans min_height="500"]

# Ambos parámetros:
[mobile_plans height="700" min_height="400"]
```

### **Estilos CSS Personalizados**
```css
/* En Personalizar → CSS Adicional: */
.mobile-plans-container {
    margin: 40px 0 !important;
    border-radius: 20px !important;
}

.mobile-plans-container iframe {
    box-shadow: 0 15px 50px rgba(0,0,0,0.2) !important;
}

.mobile-plans-loading {
    background: linear-gradient(135deg, #tu-color-1, #tu-color-2) !important;
}
```

---

## ✅ **Checklist de Instalación Exitosa**

- [ ] **Aplicación local funciona** correctamente
- [ ] **Archivos copiados** a `/wp-content/themes/tu-tema/mobile-plans/`
- [ ] **Código añadido** a `functions.php` sin errores
- [ ] **URL directa funciona:** `tu-sitio.com/wp-content/themes/tu-tema/mobile-plans/index-new.html`
- [ ] **Debug shortcode** muestra todos los archivos con ✅
- [ ] **Shortcode principal** `[mobile_plans]` muestra la aplicación
- [ ] **Sin scrolls** en el iframe
- [ ] **Altura dinámica** se ajusta automáticamente
- [ ] **Responsive** funciona en móviles
- [ ] **Datos reales** aparecen correctamente
- [ ] **Navegación** funciona entre secciones
- [ ] **Logs de consola** sin errores

---

## 🔄 **Próximos Pasos**

### **Una vez funcionando:**
1. **Crear páginas permanentes** con Mobile Plans
2. **Personalizar estilos** según tu marca
3. **Configurar caché** si usas plugins de caché
4. **Optimizar rendimiento** si es necesario
5. **Documentar para otros usuarios**

### **Para actualizaciones futuras:**
1. **Backup completo** antes de actualizar
2. **Actualizar solo archivos** en `/mobile-plans/`
3. **NO modificar** código en `functions.php`
4. **Probar en staging** antes de producción

---

**🎯 ¡Tu aplicación Mobile Plans ya está perfectamente integrada en WordPress!**

*Si encuentras problemas, consultar [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)*
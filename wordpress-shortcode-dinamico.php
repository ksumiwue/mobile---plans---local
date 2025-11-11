<?php
/**
 * Shortcode Mobile Plans con Iframe Dinámico Mejorado
 * 
 * INSTALACIÓN:
 * Copiar este código al final del functions.php de tu tema WordPress
 */

// Shortcode dinámico mejorado para Mobile Plans (ORIGINAL - usar mobile_plans_optimized)
function mobile_plans_dynamic_iframe_shortcode_original($atts) {
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

// Registrar shortcode original (deprecado)
add_shortcode('mobile_plans_original', 'mobile_plans_dynamic_iframe_shortcode_original');

// Función optimizada para Mobile Plans - USAR ESTA (versión simplificada)
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
        <iframe 
            id="<?php echo $iframe_id; ?>"
            src="<?php echo $url; ?>" 
            width="100%" 
            height="<?php echo $atts['height']; ?>px"
            frameborder="0" 
            scrolling="no"
            style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: none; background: white;">
        </iframe>
    </div>
    
    <script>
    (function() {
        const iframe = document.getElementById('<?php echo $iframe_id; ?>');
        let lastHeight = 0;
        let resizeCount = 0;
        const MAX_RESIZES = 5; // Límite de ajustes automáticos
        
        // Función simplificada de ajuste
        function adjustIframeHeight(newHeight) {
            if (newHeight && newHeight > 100 && Math.abs(newHeight - lastHeight) > 5) {
                iframe.style.height = newHeight + 'px';
                lastHeight = newHeight;
                resizeCount++;
                console.log('📱 Mobile Plans: Altura ajustada a', newHeight + 'px', '(ajuste #' + resizeCount + ')');
                return true;
            }
            return false;
        }
        
        // Escuchar mensajes del iframe
        window.addEventListener('message', function(event) {
            if (event.source === iframe.contentWindow && 
                event.data && 
                event.data.type === 'mobile-plans-resize') {
                
                const height = event.data.height;
                const isStable = event.data.stable;
                
                adjustIframeHeight(height);
                
                if (isStable) {
                    console.log('✅ Mobile Plans: Iframe estabilizado en', height + 'px');
                }
            }
        });
        
        // Solicitar altura inicial después de carga
        iframe.addEventListener('load', function() {
            setTimeout(function() {
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'mobile-plans-request-height'
                    }, '*');
                }
            }, 1000);
        });
        
        // Función global para debug
        window.mobilePlansDebugSimple = function() {
            console.log('📊 Estado iframe:', {
                altura: lastHeight,
                ajustes: resizeCount,
                iframe: iframe.id
            });
        };
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

// Registrar shortcode optimizado como principal
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

// Función optimizada para Mobile Plans iframe
function mobile_plans_optimized_iframe_shortcode($atts) {
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
                transition: height 0.3s ease, opacity 0.3s ease; 
                overflow: hidden;
                opacity: 0;
                z-index: 1;
                position: relative;
                border: none;
                background: white;
            "
            onload="mobilePlansOptimizedIframeLoaded('<?php echo $iframe_id; ?>')">
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
    }
    </style>
    
    <script>
    // Variables globales para este iframe específico
    window.mobilePlansIframes = window.mobilePlansIframes || {};
    
    // Función optimizada que se llama cuando el iframe carga
    function mobilePlansOptimizedIframeLoaded(iframeId) {
        const iframe = document.getElementById(iframeId);
        const loading = document.getElementById(iframeId + '-loading');
        
        if (!iframe || !loading) return;
        
        console.log('📱 Mobile Plans: Iframe cargado (optimizado):', iframeId);
        
        // Configurar comunicación optimizada con iframe
        setupOptimizedMobilePlansIframe(iframeId, iframe, loading);
    }
    
    // Configuración optimizada de comunicación bidireccional con iframe
    function setupOptimizedMobilePlansIframe(iframeId, iframe, loading) {
        let lastHeight = 0;
        let isReady = false;
        let isContentStable = false;
        let heightRequestCount = 0;
        let lastHeightRequest = 0;
        
        const MIN_HEIGHT = <?php echo (int) $atts['min_height']; ?>;
        const HEIGHT_TOLERANCE = 10;
        const MAX_HEIGHT_REQUESTS = 3; // Máximo número de solicitudes automáticas
        const REQUEST_COOLDOWN = 2000; // Cooldown entre solicitudes automáticas
        
        // Función optimizada para ajustar altura
        function adjustIframeHeight(newHeight, isStable = false) {
            if (!newHeight || newHeight < 100) return;
            
            const adjustedHeight = Math.max(newHeight, MIN_HEIGHT);
            const heightDifference = Math.abs(adjustedHeight - lastHeight);
            
            // Solo ajustar si hay cambio significativo o es estable
            if (heightDifference > HEIGHT_TOLERANCE || isStable) {
                iframe.style.height = adjustedHeight + 'px';
                lastHeight = adjustedHeight;
                
                console.log('📏 Mobile Plans: Altura ajustada a', adjustedHeight + 'px', 
                           `(estable: ${isStable}, diff: ${heightDifference}px)`);
                
                // Marcar como estable si viene del iframe
                if (isStable) {
                    isContentStable = true;
                }
                
                // Disparar evento personalizado
                window.dispatchEvent(new CustomEvent('mobilePlansResized', {
                    detail: { 
                        iframeId: iframeId,
                        height: adjustedHeight, 
                        iframe: iframe,
                        stable: isStable
                    }
                }));
                
                return true;
            }
            
            return false;
        }
        
        // Función para solicitar altura con control de frecuencia
        function requestHeight() {
            const now = Date.now();
            
            // Verificar cooldown y límite de solicitudes
            if (now - lastHeightRequest < REQUEST_COOLDOWN || 
                (heightRequestCount >= MAX_HEIGHT_REQUESTS && !isContentStable)) {
                return false;
            }
            
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'mobile-plans-request-height'
                }, '*');
                
                heightRequestCount++;
                lastHeightRequest = now;
                
                console.log('📡 Mobile Plans: Solicitud de altura enviada', 
                           `(#${heightRequestCount}/${MAX_HEIGHT_REQUESTS})`);
                return true;
            }
            
            return false;
        }
        
        // Escuchar mensajes optimizados del iframe
        function handleOptimizedIframeMessage(event) {
            // Verificar que el mensaje viene del iframe correcto
            if (event.source !== iframe.contentWindow) return;
            
            if (event.data && event.data.type === 'mobile-plans-resize') {
                const { height, stable = false } = event.data;
                
                console.log('📡 Mobile Plans: Mensaje de resize recibido:', 
                           `${height}px (estable: ${stable})`);
                
                const heightChanged = adjustIframeHeight(height, stable);
                
                // Mostrar iframe y ocultar loading la primera vez que hay cambio
                if (!isReady && heightChanged) {
                    isReady = true;
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.style.display = 'none';
                        iframe.style.opacity = '1';
                    }, 300);
                }
                
                // Si el contenido está estable, parar solicitudes automáticas
                if (stable) {
                    isContentStable = true;
                    console.log('✅ Mobile Plans: Contenido estable detectado');
                }
            }
        }
        
        // Registrar listener optimizado
        window.addEventListener('message', handleOptimizedIframeMessage);
        
        // Solicitud inicial con delay
        setTimeout(() => {
            requestHeight();
        }, 800);
        
        // Solicitudes adicionales solo si no está estable
        const heightChecker = setInterval(() => {
            if (isContentStable || heightRequestCount >= MAX_HEIGHT_REQUESTS) {
                clearInterval(heightChecker);
                console.log('🛑 Mobile Plans: Deteniendo solicitudes automáticas');
                return;
            }
            
            requestHeight();
        }, REQUEST_COOLDOWN);
        
        // Fallback: mostrar iframe después de tiempo límite
        setTimeout(() => {
            if (!isReady) {
                console.log('⚠️ Mobile Plans: Fallback - mostrando iframe sin comunicación');
                loading.style.display = 'none';
                iframe.style.opacity = '1';
                isReady = true;
            }
        }, 6000);
        
        // Listener de resize de ventana optimizado
        let windowResizeTimeout;
        window.addEventListener('resize', function() {
            // Solo solicitar si el contenido no está estable
            if (!isContentStable) {
                clearTimeout(windowResizeTimeout);
                windowResizeTimeout = setTimeout(() => {
                    console.log('📐 Mobile Plans: Resize de ventana - solicitando altura');
                    requestHeight();
                }, 500);
            }
        });
        
        // Almacenar referencia optimizada para debug
        window.mobilePlansIframes[iframeId] = {
            iframe: iframe,
            loading: loading,
            adjustHeight: adjustIframeHeight,
            requestHeight: requestHeight,
            isStable: () => isContentStable,
            stats: () => ({
                heightRequests: heightRequestCount,
                lastHeight: lastHeight,
                isReady: isReady,
                isStable: isContentStable
            })
        };
        
        console.log('✅ Mobile Plans: Sistema de comunicación optimizado configurado para', iframeId);
    }
    
    // Función global optimizada para debug
    window.mobilePlansDebugOptimized = function(iframeId) {
        const iframeData = window.mobilePlansIframes[iframeId || Object.keys(window.mobilePlansIframes)[0]];
        if (iframeData) {
            console.log('🔧 Mobile Plans: Estado actual:', iframeData.stats());
            console.log('🔧 Mobile Plans: Solicitando altura para debug...');
            iframeData.requestHeight();
        }
    };
    
    // Función global para forzar reajuste solo en casos necesarios
    window.mobilePlansForceResize = function() {
        Object.keys(window.mobilePlansIframes).forEach(id => {
            const iframeData = window.mobilePlansIframes[id];
            if (!iframeData.isStable()) {
                console.log('🔧 Mobile Plans: Forzando resize para iframe no estable:', id);
                iframeData.requestHeight();
            }
        });
    };
    </script>
    <?php
    
    return ob_get_clean();
}

?>
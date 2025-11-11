<?php
/**
 * Mobile Plans - WordPress Integration (Copia Exacta + Ejemplo Funcional)
 * Versión que mantiene el diseño original intacto
 */

// Shortcode para Mobile Plans - EXACTAMENTE como el ejemplo funcional
function mobile_plans_iframe_shortcode($atts) {
    $atts = shortcode_atts([
        'height' => '600',
        'width' => '100%'
    ], $atts);
    
    // URL de la aplicación - detectar automáticamente
    $possible_urls = [
        get_template_directory_uri() . '/mobile-plans-web/index.html',
        get_stylesheet_directory_uri() . '/mobile-plans-web/index.html',
        site_url() . '/wp-content/themes/' . get_template() . '/mobile-plans-web/index.html'
    ];
    
    $app_url = '';
    foreach ($possible_urls as $url) {
        $path = str_replace(site_url(), ABSPATH, $url);
        if (file_exists($path)) {
            $app_url = $url;
            break;
        }
    }
    
    if (empty($app_url)) {
        return '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 5px;">
                    <strong>Error:</strong> No se encontró la aplicación Mobile Plans. 
                    Verificar que la carpeta mobile-plans-web esté en la ubicación correcta.
                </div>';
    }
    
    // Generar ID único para el iframe
    $iframe_id = 'mobile-plans-iframe-' . uniqid();
    
    ob_start();
    ?>
    <!-- Contenedor aislado contra tema TheGem -->
    <div class="mobile-plans-isolated-wrapper" style="
        all: initial !important; 
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        width: 100% !important; 
        margin: 20px 0 !important; 
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
        isolation: isolate !important;
    ">
        <?php if (current_user_can('manage_options')): ?>
        <div id="debug-<?php echo $iframe_id; ?>" style="
            all: initial !important;
            font-family: monospace !important;
            background: #fffbf0 !important; 
            border: 2px solid #ff9800 !important; 
            border-radius: 5px !important; 
            padding: 10px !important; 
            margin-bottom: 10px !important; 
            font-size: 12px !important;
            display: block !important;
            color: #333 !important;
            line-height: 1.4 !important;
        ">
            <strong>🔧 Debug ANTI-TheGem:</strong><br>
            <strong>URL:</strong> <code><?php echo esc_html($app_url); ?></code><br>
            <strong>Estado:</strong> <span id="estado-<?php echo $iframe_id; ?>">Iniciando...</span><br>
            <strong>Altura:</strong> <span id="altura-<?php echo $iframe_id; ?>">-</span><br>
            <strong>⚠️ DETECTADO:</strong> Tema TheGem - Aplicando aislamiento total
        </div>
        <?php endif; ?>
        
        <iframe 
            id="<?php echo $iframe_id; ?>" 
            data-mobile-plans-iframe="true"
            class="mobile-plans-protected-iframe"
            style="
                all: initial !important;
                width: <?php echo $atts['width']; ?> !important; 
                height: <?php echo $atts['height']; ?>px !important; 
                border: none !important; 
                border-radius: 10px !important; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; 
                display: block !important; 
                max-height: none !important; 
                min-height: 0 !important;
                position: relative !important;
                z-index: 999 !important;
                background: white !important;
                overflow: hidden !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
            " 
            scrolling="no">
        </iframe>
    </div>

    <!-- CSS de protección total contra TheGem -->
    <style>
        /* Aislamiento total contra tema TheGem */
        .mobile-plans-isolated-wrapper {
            contain: layout style paint !important;
            isolation: isolate !important;
        }
        
        .mobile-plans-isolated-wrapper * {
            box-sizing: border-box !important;
            position: static !important;
        }
        
        /* Protección específica del iframe */
        .mobile-plans-protected-iframe {
            transition: height 0.3s ease !important;
            will-change: height !important;
        }
        
        /* Anular cualquier interferencia de TheGem */
        .mobile-plans-isolated-wrapper .mobile-plans-protected-iframe {
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
            left: auto !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* Proteger contra scripts de TheGem que buscan offsetHeight */
        [data-mobile-plans-iframe="true"] {
            /* Asegurar que offsetHeight funcione correctamente */
            box-sizing: border-box !important;
            overflow: hidden !important;
        }
    </style>

    <script>
    (function() {
        'use strict';
        
        // Namespace único para evitar conflictos con WordPress
        const MobilePlansIframe = {
            id: '<?php echo $iframe_id; ?>',
            url: '<?php echo $app_url; ?>',
            debug: <?php echo current_user_can('manage_options') ? 'true' : 'false'; ?>
        };
        
        console.log('📱 Mobile Plans: Inicializando iframe...');
        
        // ============ CÓDIGO EXACTO DEL EJEMPLO FUNCIONAL ============
        
        function obtenerParametrosURL() {
            return window.location.search;
        }

        // Contadores para debug
        let mensajesEnviados = 0;
        let mensajesRecibidos = 0;
        let ultimaAltura = 0;
        let iframeCargado = false;
        
        // Función para actualizar debug visual
        function actualizarDebug(estado, altura = null) {
            if (!MobilePlansIframe.debug) return;
            
            try {
                const estadoEl = document.getElementById('estado-' + MobilePlansIframe.id);
                const alturaEl = document.getElementById('altura-' + MobilePlansIframe.id);
                const mensajesEl = document.getElementById('mensajes-' + MobilePlansIframe.id);
                const respuestasEl = document.getElementById('respuestas-' + MobilePlansIframe.id);
                
                if (estadoEl) estadoEl.textContent = estado;
                if (altura && alturaEl) alturaEl.textContent = altura + 'px';
                if (mensajesEl) mensajesEl.textContent = mensajesEnviados;
                if (respuestasEl) respuestasEl.textContent = mensajesRecibidos;
            } catch (e) {
                console.log('ℹ️ Mobile Plans: Debug visual no disponible');
            }
        }

        function ajustarAltura(altura, esReduccion = false) {
            const iframe = document.getElementById(MobilePlansIframe.id);
            if (iframe && altura > 0) {
                const diferencia = Math.abs(altura - ultimaAltura);
                const esReduccionSignificativa = esReduccion && altura < ultimaAltura;
                
                // Ser más agresivo con reducciones - tolerancia menor para reducciones
                const tolerancia = esReduccionSignificativa ? 2 : 5;
                
                if (diferencia > tolerancia || ultimaAltura === 0 || esReduccionSignificativa) {
                    // Aplicar altura con fuerza total
                    iframe.style.setProperty('height', altura + 'px', 'important');
                    iframe.style.setProperty('max-height', 'none', 'important');
                    iframe.style.setProperty('min-height', '0', 'important');
                    
                    const tipoMovimiento = esReduccionSignificativa ? '📉 REDUCCIÓN' : 
                                         altura > ultimaAltura ? '📈 CRECIMIENTO' : '📏 AJUSTE';
                    
                    ultimaAltura = altura;
                    console.log('📏 Mobile Plans:', tipoMovimiento, 'Altura ajustada a', altura + 'px', '(cambio:', diferencia + 'px)');
                    actualizarDebug('✅ Funcionando ' + (esReduccionSignificativa ? '(reducido)' : ''), altura);
                } else {
                    console.log('📏 Mobile Plans: Altura estable, no ajustando:', altura + 'px', '(diferencia:', diferencia + 'px)');
                    actualizarDebug('📏 Altura estable', altura);
                }
            } else {
                console.error('❌ Mobile Plans: Error ajustando altura. iframe:', !!iframe, 'altura:', altura);
                actualizarDebug('❌ Error ajustando altura');
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const params = obtenerParametrosURL();
            const iframe = document.getElementById(MobilePlansIframe.id);
            
            actualizarDebug('🔄 Configurando iframe...');
            
            if (iframe) {
                iframe.src = MobilePlansIframe.url + params;
                console.log('📱 Mobile Plans: Iframe configurado con URL:', iframe.src);
                
                // Eventos de carga
                iframe.addEventListener('load', () => {
                    iframeCargado = true;
                    console.log('✅ Mobile Plans: Iframe cargado exitosamente');
                    actualizarDebug('✅ Iframe cargado, esperando comunicación...');
                    
                    // Solicitud inmediata al cargar
                    setTimeout(() => {
                        if (iframe.contentWindow) {
                            mensajesEnviados++;
                            iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                            console.log('📡 Mobile Plans: Solicitud inicial enviada');
                            actualizarDebug('📡 Comunicación iniciada');
                        }
                    }, 1000);
                });
                
                iframe.addEventListener('error', () => {
                    console.error('❌ Mobile Plans: Error cargando iframe');
                    actualizarDebug('❌ Error cargando iframe');
                });
            } else {
                console.error('❌ Mobile Plans: No se encontró iframe con ID:', MobilePlansIframe.id);
                actualizarDebug('❌ Iframe no encontrado');
            }
        });

        // Escuchar mensajes del iframe (EXACTO como ejemplo)
        window.addEventListener('message', function (e) {
            const iframe = document.getElementById(MobilePlansIframe.id);
            
            // Verificar origen y fuente
            if (iframe && e.source === iframe.contentWindow) {
                if (typeof e.data === 'object' && e.data.tipo === 'ajustarAltura') {
                    mensajesRecibidos++;
                    const esReduccion = e.data.esReduccion || false;
                    console.log('📡 Mobile Plans: Mensaje recibido del iframe. Altura:', e.data.altura, 
                               esReduccion ? '(REDUCCIÓN)' : '(CRECIMIENTO/INICIAL)');
                    ajustarAltura(e.data.altura, esReduccion);
                } else {
                    console.log('📡 Mobile Plans: Mensaje del iframe (otro tipo):', e.data);
                }
            }
        });

        // Solicitar altura cada 1 segundo (EXACTO como ejemplo funcional)
        const intervaloSolicitud = setInterval(() => {
            const iframe = document.getElementById(MobilePlansIframe.id);
            if (iframe && iframe.contentWindow && iframeCargado) {
                mensajesEnviados++;
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                // Solo log cada 5 solicitudes para no saturar consola
                if (mensajesEnviados % 5 === 0) {
                    console.log('📡 Mobile Plans: Solicitud #' + mensajesEnviados + ' enviada');
                }
                actualizarDebug('🔄 Solicitando altura...');
            } else if (!iframeCargado) {
                console.log('⏳ Mobile Plans: Esperando que iframe cargue...');
            }
        }, 1000);

        // También solicitar altura cuando la ventana cambie de tamaño
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const iframe = document.getElementById('<?php echo $iframe_id; ?>');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                }
            }, 300);
        });

        // También solicitar altura cuando la ventana cambie de tamaño
        let mobilePlansResizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(mobilePlansResizeTimeout);
            mobilePlansResizeTimeout = setTimeout(() => {
                const iframe = document.getElementById(MobilePlansIframe.id);
                if (iframe && iframe.contentWindow && iframeCargado) {
                    mensajesEnviados++;
                    iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                    console.log('📐 Mobile Plans: Solicitud por resize enviada');
                }
            }, 300);
        });

        // Función global para debug manual
        window.mobilePlansDebugIframe = function() {
            console.log('🔧 Mobile Plans Debug Estado:', {
                iframeCargado: iframeCargado,
                mensajesEnviados: mensajesEnviados,
                mensajesRecibidos: mensajesRecibidos,
                ultimaAltura: ultimaAltura,
                iframeId: '<?php echo $iframe_id; ?>',
                url: '<?php echo $app_url; ?>'
            });
            
            // Forzar solicitud manual
            const iframe = document.getElementById(MobilePlansIframe.id);
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                console.log('🔄 Solicitud manual enviada');
            }
        };

        console.log('✅ Mobile Plans: Sistema configurado con debug avanzado');
        console.log('💡 Usar mobilePlansDebugIframe() para debug manual');
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

// Registrar shortcode
add_shortcode('mobile_plans_web', 'mobile_plans_iframe_shortcode');

// Shortcode de debug
function mobile_plans_debug_shortcode() {
    if (!current_user_can('manage_options')) {
        return '<p>Solo administradores pueden ver información de debug.</p>';
    }
    
    ob_start();
    ?>
    <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; font-family: monospace;">
        <h4 style="margin-top: 0;">📱 Mobile Plans - Debug</h4>
        <p><strong>Shortcode:</strong> <code>[mobile_plans_web]</code></p>
        <p><strong>Patrón:</strong> Comunicación bidireccional como ejemplo funcional</p>
        <p><strong>Ubicaciones buscadas:</strong></p>
        <ol>
            <li><code><?php echo get_template_directory_uri(); ?>/mobile-plans-web/index.html</code></li>
            <li><code><?php echo get_stylesheet_directory_uri(); ?>/mobile-plans-web/index.html</code></li>
            <li><code><?php echo site_url(); ?>/wp-content/themes/<?php echo get_template(); ?>/mobile-plans-web/index.html</code></li>
        </ol>
    </div>
    <?php
    
    return ob_get_clean();
}

add_shortcode('mobile_plans_debug_web', 'mobile_plans_debug_shortcode');

// Shortcode de TEST SIMPLE para diagnosticar problemas
function mobile_plans_test_simple_shortcode($atts) {
    $atts = shortcode_atts([
        'height' => '400'
    ], $atts);
    
    // URL del archivo de test simple
    $test_url = get_template_directory_uri() . '/mobile-plans-web/test-simple.html';
    $iframe_id = 'test-simple-iframe-' . uniqid();
    
    ob_start();
    ?>
    <div style="background: #f0f8ff; border: 2px dashed #007cba; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #007cba;">🧪 Test Simple - Comunicación Iframe</h3>
        <p><strong>Propósito:</strong> Verificar si la comunicación iframe funciona sin la aplicación completa.</p>
        
        <div style="margin: 15px 0;">
            <strong>Estado:</strong> <span id="test-status-<?php echo $iframe_id; ?>">Iniciando...</span><br>
            <strong>Mensajes:</strong> <span id="test-messages-<?php echo $iframe_id; ?>">0 enviados, 0 recibidos</span><br>
            <strong>Altura:</strong> <span id="test-height-<?php echo $iframe_id; ?>">-</span>
        </div>
        
        <iframe 
            id="<?php echo $iframe_id; ?>" 
            src="<?php echo $test_url; ?>"
            style="width: 100% !important; height: <?php echo $atts['height']; ?>px !important; border: 1px solid #007cba; border-radius: 8px; background: white; display: block !important; max-height: none !important; min-height: 0 !important;" 
            scrolling="no">
        </iframe>
        
        <div style="margin-top: 15px;">
            <button onclick="testDebug<?php echo str_replace('-', '_', $iframe_id); ?>()" style="background: #007cba; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                🔧 Debug Manual
            </button>
            <button onclick="testForceRequest<?php echo str_replace('-', '_', $iframe_id); ?>()" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 5px;">
                📡 Solicitar Altura
            </button>
        </div>
    </div>

    <script>
    (function() {
        'use strict';
        
        const TestSimple = {
            id: '<?php echo $iframe_id; ?>',
            url: '<?php echo $test_url; ?>',
            mensajesEnviados: 0,
            mensajesRecibidos: 0,
            ultimaAltura: 0,
            crecimientosAnómalos: 0,
            detenido: false
        };
        
        function updateTestStatus(estado, altura = null) {
            const statusEl = document.getElementById('test-status-' + TestSimple.id);
            const messagesEl = document.getElementById('test-messages-' + TestSimple.id);
            const heightEl = document.getElementById('test-height-' + TestSimple.id);
            
            if (statusEl) statusEl.textContent = estado;
            if (messagesEl) messagesEl.textContent = TestSimple.mensajesEnviados + ' enviados, ' + TestSimple.mensajesRecibidos + ' recibidos';
            if (altura && heightEl) heightEl.textContent = altura + 'px';
        }
        
        function ajustarAlturaTest(altura) {
            const iframe = document.getElementById(TestSimple.id);
            if (iframe && altura > 0) {
                // Siempre ajustar durante el test para ver qué pasa
                const alturaAnterior = iframe.style.height;
                const offsetAnterior = iframe.offsetHeight;
                
                // Aplicar altura con fuerza total
                iframe.style.setProperty('height', altura + 'px', 'important');
                iframe.style.setProperty('max-height', 'none', 'important');
                iframe.style.setProperty('min-height', '0', 'important');
                
                // Verificar inmediatamente si se aplicó
                setTimeout(() => {
                    const nuevaOffset = iframe.offsetHeight;
                    const nuevaStyle = iframe.style.height;
                    
                    console.log('🔍 Test Simple: VERIFICACIÓN DE AJUSTE:', {
                        alturaDeseada: altura,
                        styleAnterior: alturaAnterior,
                        styleNuevo: nuevaStyle,
                        offsetAnterior: offsetAnterior,
                        offsetNuevo: nuevaOffset,
                        seAplicoCorrectamente: Math.abs(nuevaOffset - altura) < 10,
                        estilosComputados: window.getComputedStyle(iframe).height,
                        parentContainer: iframe.parentElement.tagName,
                        parentStyles: {
                            height: window.getComputedStyle(iframe.parentElement).height,
                            maxHeight: window.getComputedStyle(iframe.parentElement).maxHeight,
                            overflow: window.getComputedStyle(iframe.parentElement).overflow
                        }
                    });
                    
                    if (Math.abs(nuevaOffset - altura) > 10) {
                        console.warn('⚠️ PROBLEMA: El iframe no se ajustó a la altura deseada!', {
                            deseada: altura,
                            aplicada: nuevaOffset,
                            diferencia: Math.abs(nuevaOffset - altura)
                        });
                        updateTestStatus('⚠️ Iframe no se ajusta correctamente');
                    } else {
                        TestSimple.ultimaAltura = altura;
                        updateTestStatus('✅ Iframe ajustado correctamente');
                    }
                }, 50);
                
                console.log('✅ Test Simple: Intentando ajustar altura a', altura + 'px');
            }
        }
        
        // Escuchar mensajes del iframe de test
        window.addEventListener('message', function (e) {
            const iframe = document.getElementById(TestSimple.id);
            if (iframe && e.source === iframe.contentWindow) {
                if (typeof e.data === 'object' && e.data.tipo === 'ajustarAltura') {
                    TestSimple.mensajesRecibidos++;
                    
                    // Log detallado del mensaje recibido
                    console.log('📡 Test Simple: Mensaje DETALLADO recibido:', {
                        alturaRecibida: e.data.altura,
                        alturaActualIframe: iframe.offsetHeight,
                        alturaStyleIframe: iframe.style.height,
                        ultimaAltura: TestSimple.ultimaAltura,
                        diferencia: Math.abs(e.data.altura - TestSimple.ultimaAltura),
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    // Verificar crecimiento anómalo en WordPress también
                    if (e.data.altura > TestSimple.ultimaAltura + 30) {
                        TestSimple.crecimientosAnómalos++;
                        console.warn('🚨 WordPress Test: CRECIMIENTO ANÓMALO #' + TestSimple.crecimientosAnómalos + '!', {
                            anterior: TestSimple.ultimaAltura,
                            recibida: e.data.altura,
                            incremento: e.data.altura - TestSimple.ultimaAltura,
                            iframeActualHeight: iframe.offsetHeight,
                            iframeStyleHeight: iframe.style.height
                        });
                        
                        // Si hay muchos crecimientos anómalos, detener el proceso
                        if (TestSimple.crecimientosAnómalos >= 3) {
                            TestSimple.detenido = true;
                            console.error('🛑 WordPress Test: DETENIENDO PROCESO - Demasiados crecimientos anómalos');
                            updateTestStatus('🛑 DETENIDO - Crecimiento anómalo detectado');
                            return; // No ajustar más
                        }
                    }
                    
                    ajustarAlturaTest(e.data.altura);
                }
            }
        });
        
        // Configurar iframe al cargar
        window.addEventListener('DOMContentLoaded', () => {
            const iframe = document.getElementById(TestSimple.id);
            if (iframe) {
                iframe.addEventListener('load', () => {
                    console.log('✅ Test Simple: Iframe de test cargado');
                    updateTestStatus('📡 Iframe cargado, iniciando comunicación...');
                    
                    // Solicitud inicial
                    setTimeout(() => {
                        if (iframe.contentWindow) {
                            TestSimple.mensajesEnviados++;
                            iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                            updateTestStatus('📡 Comunicación iniciada');
                        }
                    }, 1000);
                });
                
                iframe.addEventListener('error', () => {
                    console.error('❌ Test Simple: Error cargando iframe');
                    updateTestStatus('❌ Error cargando iframe');
                });
            }
        });
        
        // Intervalo de solicitudes cada 2 segundos (con protección)
        const intervaloTest = setInterval(() => {
            if (TestSimple.detenido) {
                console.warn('🛑 Intervalo detenido debido a problemas detectados');
                clearInterval(intervaloTest);
                return;
            }
            
            const iframe = document.getElementById(TestSimple.id);
            if (iframe && iframe.contentWindow) {
                TestSimple.mensajesEnviados++;
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                updateTestStatus('🔄 Solicitando altura... (#' + TestSimple.mensajesEnviados + ')');
            }
        }, 2000);
        
        // Funciones globales para botones de debug
        window['testDebug' + TestSimple.id.replace(/-/g, '_')] = function() {
            console.log('🔧 Test Simple Debug:', {
                id: TestSimple.id,
                url: TestSimple.url,
                mensajesEnviados: TestSimple.mensajesEnviados,
                mensajesRecibidos: TestSimple.mensajesRecibidos,
                ultimaAltura: TestSimple.ultimaAltura
            });
            
            const iframe = document.getElementById(TestSimple.id);
            if (iframe) {
                console.log('📏 Altura actual del iframe:', iframe.style.height, 'offsetHeight:', iframe.offsetHeight);
            }
        };
        
        window['testForceRequest' + TestSimple.id.replace(/-/g, '_')] = function() {
            const iframe = document.getElementById(TestSimple.id);
            if (iframe && iframe.contentWindow) {
                TestSimple.mensajesEnviados++;
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
                updateTestStatus('🔧 Solicitud manual enviada');
                console.log('🔧 Test Simple: Solicitud manual enviada');
            }
        };
        
        console.log('✅ Test Simple: Sistema de prueba configurado');
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

add_shortcode('mobile_plans_test', 'mobile_plans_test_simple_shortcode');

?>
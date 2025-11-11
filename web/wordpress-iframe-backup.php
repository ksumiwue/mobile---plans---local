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
    <div class="mobile-plans-wrapper" style="width: 100%; margin: 20px 0;">
        <?php if (current_user_can('manage_options')): ?>
        <div style="background: #e7f3ff; border: 1px solid #bee5eb; border-radius: 5px; padding: 10px; margin-bottom: 10px; font-size: 12px;">
            <strong>🔧 Debug (admin):</strong> URL: <code><?php echo esc_html($app_url); ?></code>
        </div>
        <?php endif; ?>
        
        <iframe 
            id="<?php echo $iframe_id; ?>" 
            style="width: <?php echo $atts['width']; ?>; height: <?php echo $atts['height']; ?>px; border: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" 
            scrolling="no">
        </iframe>
    </div>

    <script>
    (function() {
        console.log('📱 Mobile Plans: Inicializando iframe...');
        
        // ============ CÓDIGO EXACTO DEL EJEMPLO FUNCIONAL ============
        
        function obtenerParametrosURL() {
            return window.location.search;
        }

        function ajustarAltura(altura) {
            const iframe = document.getElementById('<?php echo $iframe_id; ?>');
            if (iframe) {
                iframe.style.height = altura + 'px';
                console.log('📏 Mobile Plans: Altura ajustada a', altura + 'px');
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const params = obtenerParametrosURL();
            const iframe = document.getElementById('<?php echo $iframe_id; ?>');
            
            if (iframe) {
                iframe.src = '<?php echo $app_url; ?>' + params;
                console.log('📱 Mobile Plans: Iframe configurado con URL:', iframe.src);
                
                // Eventos de carga
                iframe.addEventListener('load', () => {
                    console.log('✅ Mobile Plans: Iframe cargado');
                });
                
                iframe.addEventListener('error', () => {
                    console.error('❌ Mobile Plans: Error cargando iframe');
                });
            }
        });

        // Escuchar mensajes del iframe (EXACTO como ejemplo)
        window.addEventListener('message', function (e) {
            const iframe = document.getElementById('<?php echo $iframe_id; ?>');
            if (iframe && e.source === iframe.contentWindow) {
                if (typeof e.data === 'object' && e.data.tipo === 'ajustarAltura') {
                    ajustarAltura(e.data.altura);
                }
            }
        });

        // Solicitar altura cada 2 segundos (EXACTO como ejemplo)
        setInterval(() => {
            const iframe = document.getElementById('<?php echo $iframe_id; ?>');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
            }
        }, 2000);

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

        console.log('✅ Mobile Plans: Sistema configurado');
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

?>
<?php
/**
 * WORDPRESS SHORTCODE SIMPLE - Basado en ejemplo_iframe.txt que SÍ funciona
 * Este método simple funciona perfectamente
 */

if (!defined('ABSPATH')) {
    exit;
}

// ===============================================
// SHORTCODE SIMPLE - [mobile_plans]
// ===============================================

function mobile_plans_shortcode_simple($atts) {
    $atts = shortcode_atts([
        'height' => '800',
        'width' => '100%'
    ], $atts);
    
    // Detectar URL de la aplicación
    $app_urls = [
        get_template_directory_uri() . '/mobile-plans-web/index-new.html',
        get_stylesheet_directory_uri() . '/mobile-plans-web/index-new.html',
        site_url() . '/wp-content/themes/' . get_template() . '/mobile-plans-web/index-new.html'
    ];
    
    $app_url = '';
    foreach ($app_urls as $url) {
        $path = str_replace(site_url(), ABSPATH, $url);
        if (file_exists($path)) {
            $app_url = $url;
            break;
        }
    }
    
    if (empty($app_url)) {
        return '<div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px; text-align: center;">
                    <h4>📱 Mobile Plans no encontrado</h4>
                    <p>Instalar la aplicación en: <code>/wp-content/themes/' . get_template() . '/mobile-plans-web/</code></p>
                </div>';
    }
    
    $iframe_id = 'mobile-plans-' . uniqid();
    
    ob_start();
    ?>
    <div class="mobile-plans-wrapper" id="wrapper-<?php echo $iframe_id; ?>">
        <!-- Debug panel para administradores -->
        <?php if (current_user_can('manage_options')): ?>
        <div style="background: #f0f8ff; border: 2px solid #007cba; padding: 15px; margin-bottom: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
            <strong>🔧 Debug Mobile Plans:</strong><br>
            <strong>URL:</strong> <?php echo $app_url; ?><br>
            <strong>Estado:</strong> <span id="debug-status-<?php echo $iframe_id; ?>">Cargando...</span>
        </div>
        <?php endif; ?>
        
        <iframe 
            id="<?php echo $iframe_id; ?>"
            src="<?php echo $app_url; ?>?wp_integration=1"
            style="
                width: <?php echo $atts['width']; ?>;
                height: <?php echo $atts['height']; ?>px;
                border: none;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                background: white;
                display: block;
                max-width: 100%;
            "
            frameborder="0"
            scrolling="no">
        </iframe>
    </div>

    <style>
        .mobile-plans-wrapper {
            margin: 20px 0;
            position: relative;
        }
        
        .mobile-plans-wrapper iframe {
            transition: height 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .mobile-plans-wrapper iframe {
                min-height: 600px;
            }
        }
    </style>

    <script>
    (function() {
        const iframe = document.getElementById('<?php echo $iframe_id; ?>');
        const debugStatus = document.getElementById('debug-status-<?php echo $iframe_id; ?>');
        
        // Función para ajustar altura - EXACTAMENTE como el ejemplo que funciona
        function ajustarAltura(altura) {
            iframe.style.height = altura + 'px';
            
            if (debugStatus) {
                debugStatus.textContent = `✅ ${altura}px (método simple)`;
            }
            
            console.log('📱 Mobile Plans: Altura ajustada a', altura + 'px');
        }
        
        // Escuchar mensajes - EXACTAMENTE como el ejemplo que funciona
        window.addEventListener('message', function(e) {
            if (e.source === iframe.contentWindow) {
                if (typeof e.data === 'object' && e.data.tipo === 'ajustarAltura') {
                    ajustarAltura(e.data.altura);
                }
            }
        });
        
        // Cargar iframe
        iframe.addEventListener('load', function() {
            if (debugStatus) {
                debugStatus.textContent = '✅ Iframe cargado';
            }
            console.log('📱 Mobile Plans: Iframe cargado');
        });
        
        // Solicitar altura cada segundo - EXACTAMENTE como el ejemplo que funciona
        const intervalo = setInterval(function() {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
            }
        }, 1000);
        
        // Limpiar interval
        window.addEventListener('beforeunload', function() {
            clearInterval(intervalo);
        });
        
        console.log('📱 Mobile Plans: WordPress integration simple loaded');
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

// Registrar shortcode
add_shortcode('mobile_plans', 'mobile_plans_shortcode_simple');

// ===============================================
// WIDGET ELEMENTOR SIMPLE
// ===============================================

add_action('elementor/widgets/widgets_registered', function() {
    if (class_exists('\\Elementor\\Widget_Base')) {
        
        class Mobile_Plans_Simple_Widget extends \Elementor\Widget_Base {
            
            public function get_name() {
                return 'mobile-plans-simple';
            }
            
            public function get_title() {
                return '📱 Mobile Plans (Simple)';
            }
            
            public function get_icon() {
                return 'eicon-posts-grid';
            }
            
            public function get_categories() {
                return ['general'];
            }
            
            protected function _register_controls() {
                $this->start_controls_section(
                    'simple_section',
                    [
                        'label' => '⚙️ Configuración Simple',
                        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
                    ]
                );
                
                $this->add_control(
                    'height',
                    [
                        'label' => 'Altura Inicial (se ajusta automáticamente)',
                        'type' => \Elementor\Controls_Manager::SLIDER,
                        'size_units' => ['px'],
                        'range' => [
                            'px' => [
                                'min' => 400,
                                'max' => 1200,
                                'step' => 50,
                            ],
                        ],
                        'default' => [
                            'unit' => 'px',
                            'size' => 800,
                        ]
                    ]
                );
                
                $this->end_controls_section();
            }
            
            protected function render() {
                $settings = $this->get_settings_for_display();
                
                echo mobile_plans_shortcode_simple([
                    'height' => $settings['height']['size'] ?? 800
                ]);
            }
        }
        
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type(new Mobile_Plans_Simple_Widget());
    }
});

?>

<!-- 
INSTRUCCIONES DE USO SIMPLE:

1. REEMPLAZAR el código anterior de functions.php con este código
2. Usar shortcode: [mobile_plans]
3. O usar widget de Elementor: "Mobile Plans (Simple)"
4. ¡FUNCIONA automáticamente sin configuraciones complicadas!

BASADO EN: ejemplo_iframe.txt que SÍ funciona
- iframe solicita altura cada segundo
- aplicación responde con altura real
- WordPress ajusta inmediatamente
- SIN restricciones complicadas
- SIN bucles infinitos
- SIN configuraciones complejas

¡MÉTODO SIMPLE QUE FUNCIONA! 🎉
-->
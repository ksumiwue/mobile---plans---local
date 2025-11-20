<?php
/**
 * WORDPRESS SHORTCODE SIMPLE - Con Boton Sticky
 * Basado en ejemplo_iframe.txt que SI funciona + Boton Sticky
 */

if (!defined('ABSPATH')) {
    exit;
}

function mobile_plans_shortcode_simple($atts) {
    $atts = shortcode_atts([
        'height' => '800',
        'width' => '100%'
    ], $atts);
    
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
                    <h4>Mobile Plans no encontrado</h4>
                    <p>Instalar la aplicacion en: <code>/wp-content/themes/' . get_template() . '/mobile-plans-web/</code></p>
                </div>';
    }
    
    $iframe_id = 'mobile-plans-' . uniqid();
    
    ob_start();
    ?>
    <div class="mobile-plans-wrapper" id="wrapper-<?php echo $iframe_id; ?>">
        <?php if (current_user_can('manage_options')): ?>
        <div style="background: #f0f8ff; border: 2px solid #007cba; padding: 15px; margin-bottom: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
            <strong>Debug Mobile Plans:</strong><br>
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
    console.log('=== WP: Script cargado ===');
    (function() {
        const iframe = document.getElementById('<?php echo $iframe_id; ?>');
        const debugStatus = document.getElementById('debug-status-<?php echo $iframe_id; ?>');
        let stickyButton = null;
        
        console.log('WP: Iframe encontrado:', !!iframe);
        
        function ajustarAltura(altura) {
            iframe.style.height = altura + 'px';
            if (debugStatus) {
                debugStatus.textContent = altura + 'px (metodo simple)';
            }
            console.log('WP: Altura ajustada a', altura + 'px');
        }
        
        function crearBotonSticky() {
            if (stickyButton) {
                console.log('WP: Boton ya existe');
                return stickyButton;
            }
            
            console.log('WP: CREANDO BOTON STICKY');
            
            stickyButton = document.createElement('div');
            stickyButton.innerHTML = 'Comparar (0)';
            stickyButton.style.cssText = 'position:fixed!important;top:50%!important;right:20px!important;transform:translateY(-50%)!important;background:linear-gradient(135deg,#4A90E2,#357ABD)!important;color:white!important;padding:0.8rem 1rem!important;border-radius:50px!important;box-shadow:0 6px 20px rgba(74,144,226,0.4)!important;cursor:pointer!important;font-weight:600!important;font-size:1rem!important;z-index:99999!important;transition:all 0.3s ease!important;border:2px solid rgba(255,255,255,0.2)!important;min-width:130px!important;text-align:center!important;display:none!important;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif!important;user-select:none!important;pointer-events:auto!important';
            
            stickyButton.addEventListener('click', function() {
                console.log('WP: Click en boton');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ tipo: 'navegarAComparacion' }, '*');
                }
            });
            
            stickyButton.addEventListener('mouseenter', function() {
                stickyButton.style.transform = 'translateY(-50%) translateX(-5px) scale(1.05)';
                stickyButton.style.boxShadow = '0 12px 35px rgba(74,144,226,0.6)';
            });
            
            stickyButton.addEventListener('mouseleave', function() {
                stickyButton.style.transform = 'translateY(-50%)';
                stickyButton.style.boxShadow = '0 8px 25px rgba(74,144,226,0.4)';
            });
            
            const mediaQuery = window.matchMedia('(max-width: 768px)');
            function handleMobileView(e) {
                if (e.matches) {
                    stickyButton.style.display = 'none !important';
                    stickyButton.style.visibility = 'hidden !important';
                } else {
                    stickyButton.style.visibility = 'visible';
                }
            }
            mediaQuery.addListener(handleMobileView);
            handleMobileView(mediaQuery);
            
            document.body.appendChild(stickyButton);
            console.log('WP: Boton anadido al body');
            console.log('WP: Boton en DOM:', document.body.contains(stickyButton));
            
            return stickyButton;
        }
        
        function actualizarBotonSticky(mostrar, contador) {
            console.log('WP: actualizarBotonSticky - mostrar:', mostrar, 'contador:', contador);
            
            const boton = crearBotonSticky();
            
            if (mostrar && contador > 0) {
                boton.style.display = 'block';
                boton.innerHTML = 'Comparar (' + contador + ')';
                console.log('WP: BOTON MOSTRADO con contador:', contador);
            } else {
                boton.style.display = 'none';
                console.log('WP: Boton ocultado');
            }
        }
        
        window.addEventListener('message', function(e) {
            console.log('WP: Mensaje recibido:', e.data);
            
            if (e.source === iframe.contentWindow) {
                console.log('WP: Mensaje del iframe correcto');
                
                if (typeof e.data === 'object' && e.data.tipo === 'ajustarAltura') {
                    console.log('WP: Ajustando altura');
                    ajustarAltura(e.data.altura);
                }
                
                if (typeof e.data === 'object' && e.data.tipo === 'updateStickyButton') {
                    console.log('WP: PROCESANDO updateStickyButton');
                    actualizarBotonSticky(e.data.mostrar, e.data.contador);
                }
            }
        });
        
        iframe.addEventListener('load', function() {
            if (debugStatus) {
                debugStatus.textContent = 'Iframe cargado';
            }
            console.log('WP: Iframe cargado');
            
            setTimeout(function() {
                console.log('WP: Enviando stickyButtonCreated');
                iframe.contentWindow.postMessage({ tipo: 'stickyButtonCreated' }, '*');
            }, 500);
        });
        
        const intervalo = setInterval(function() {
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
            }
        }, 1000);
        
        window.addEventListener('beforeunload', function() {
            clearInterval(intervalo);
            if (stickyButton && stickyButton.parentElement) {
                stickyButton.parentElement.removeChild(stickyButton);
            }
        });
        
        console.log('WP: Script configurado completamente');
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

add_shortcode('mobile_plans', 'mobile_plans_shortcode_simple');

add_action('elementor/widgets/widgets_registered', function() {
    if (class_exists('\\Elementor\\Widget_Base')) {
        
        class Mobile_Plans_Simple_Widget extends \Elementor\Widget_Base {
            
            public function get_name() {
                return 'mobile-plans-simple';
            }
            
            public function get_title() {
                return 'Mobile Plans (Simple)';
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
                        'label' => 'Configuracion Simple',
                        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
                    ]
                );
                
                $this->add_control(
                    'height',
                    [
                        'label' => 'Altura Inicial (se ajusta automaticamente)',
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

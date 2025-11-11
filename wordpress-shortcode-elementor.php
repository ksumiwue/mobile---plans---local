<?php
/**
 * PLUGIN WORDPRESS + ELEMENTOR WIDGET
 * Mobile Plans Comparator - Integración completa
 * 
 * Instrucciones de instalación:
 * 1. Subir esta aplicación a /wp-content/themes/tu-tema/mobile-plans-web/
 * 2. Copiar este archivo a /wp-content/themes/tu-tema/functions.php (al final)
 * 3. Usar shortcode [mobile_plans] en cualquier página
 * 4. O usar el widget de Elementor "Mobile Plans Comparator"
 */

if (!defined('ABSPATH')) {
    exit; // Seguridad WordPress
}

// ===============================================
// SHORTCODE BÁSICO - [mobile_plans]
// ===============================================

function mobile_plans_comparator_shortcode($atts) {
    $atts = shortcode_atts([
        'height' => '800',
        'featured_mode' => 'auto', // auto, manual, cheapest, most_expensive, best_value
        'featured_plans' => '', // "0,7,12" para modo manual
        'hide_navigation' => 'false',
        'theme' => 'default',
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
    
    // Configuración para JavaScript
    $config_json = json_encode([
        'featuredPlans' => [
            'mode' => $atts['featured_mode'],
            'manualPlans' => !empty($atts['featured_plans']) ? array_map('intval', explode(',', $atts['featured_plans'])) : [],
            'maxPlans' => 3
        ],
        'ui' => [
            'hideNavigation' => $atts['hide_navigation'] === 'true',
            'theme' => $atts['theme']
        ]
    ]);
    
    ob_start();
    ?>
    <div class="mobile-plans-wrapper" id="wrapper-<?php echo $iframe_id; ?>">
        <!-- Debug panel para administradores -->
        <?php if (current_user_can('manage_options')): ?>
        <div style="background: #f0f8ff; border: 2px solid #007cba; padding: 15px; margin-bottom: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
            <strong>🔧 Debug Mobile Plans:</strong><br>
            <strong>URL:</strong> <?php echo $app_url; ?><br>
            <strong>Modo destacados:</strong> <?php echo $atts['featured_mode']; ?><br>
            <?php if($atts['featured_mode'] === 'manual' && !empty($atts['featured_plans'])): ?>
            <strong>Planes seleccionados:</strong> [<?php echo $atts['featured_plans']; ?>]<br>
            <?php endif; ?>
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
            transition: height 0.4s ease;
        }
        
        @media (max-width: 768px) {
            .mobile-plans-wrapper iframe {
                height: auto !important;
                min-height: 600px;
            }
        }
    </style>

    <script>
    (function() {
        // Configuración específica para este iframe
        window.mobilePlansElementorConfig = <?php echo $config_json; ?>;
        
        const iframe = document.getElementById('<?php echo $iframe_id; ?>');
        const debugStatus = document.getElementById('debug-status-<?php echo $iframe_id; ?>');
        
        let lastHeight = 0;
        let isLoaded = false;
        
        // Configuración de alturas por página (AMPLIADA PARA GRIDS)
        const pageHeightConfigs = {
            'home': { min: 600, max: 1800, default: 1000 }, // Aumentado para featured plans
            'plans': { min: 800, max: 3000, default: 1800 }, // Aumentado para grid completo
            'compare': { min: 500, max: 1200, default: 600 }, // Aumentado ligeramente
            'about': { min: 400, max: 800, default: 500 }
        };
        
        let currentIframePage = 'home';
        let lastValidHeight = 800;
        let heightChangeTimeout;
        
        // Función de auto-ajuste MEJORADA
        function autoAdjustHeight() {
            if (!iframe || !iframe.contentWindow) return;
            
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (doc && doc.body) {
                    // Método inteligente: solo medir sección visible
                    const visibleSection = doc.querySelector('.page-section:not([style*="display: none"]):not([style*="display:none"])');
                    let calculatedHeight = 800; // default
                    
                    if (visibleSection) {
                        const sectionHeight = Math.max(
                            visibleSection.scrollHeight,
                            visibleSection.offsetHeight,
                            visibleSection.getBoundingClientRect().height
                        );
                        
                        // Añadir padding para header/footer
                        const headerHeight = doc.querySelector('header')?.offsetHeight || 0;
                        const footerHeight = doc.querySelector('footer')?.offsetHeight || 0;
                        calculatedHeight = sectionHeight + headerHeight + footerHeight + 100;
                        
                        console.log('🔍 Altura calculada:', {
                            seccion: visibleSection.id,
                            alturaSeccion: sectionHeight,
                            total: calculatedHeight
                        });
                    }
                    
                    // Aplicar límites inteligentes CON DETECCIÓN DE CONTENIDO
                    const config = pageHeightConfigs[currentIframePage] || pageHeightConfigs['home'];
                    
                    // Si la altura calculada sugiere contenido extenso, ser más permisivo
                    let dynamicMax = config.max;
                    if (calculatedHeight > config.max && calculatedHeight < config.max * 1.8) {
                        dynamicMax = calculatedHeight + 200; // Permitir altura natural + padding
                        console.log(`🔍 Contenido extenso detectado, límite ampliado a ${dynamicMax}px`);
                    }
                    
                    calculatedHeight = Math.max(config.min, Math.min(calculatedHeight, dynamicMax));
                    
                    if (calculatedHeight > 100 && Math.abs(calculatedHeight - lastHeight) > 20) {
                        iframe.style.height = calculatedHeight + 'px';
                        lastHeight = calculatedHeight;
                        lastValidHeight = calculatedHeight;
                        
                        if (debugStatus) {
                            debugStatus.textContent = `✅ ${calculatedHeight}px (${currentIframePage})`;
                        }
                        
                        // Solo log si es un cambio significativo
                        if (Math.abs(calculatedHeight - lastValidHeight) > 50) {
                            console.log(`📱 Mobile Plans: Altura ajustada ${lastValidHeight}px → ${calculatedHeight}px (${currentIframePage})`);
                        }
                    }
                }
            } catch (e) {
                console.log('🔒 CORS detectado, usando postMessage...');
                iframe.contentWindow.postMessage({type: 'getHeight'}, '*');
            }
        }
        
        // Escuchar mensajes del iframe MEJORADO
        window.addEventListener('message', function(e) {
            if (e.source !== iframe.contentWindow) return;
            
            const data = e.data;
            
            // Mensaje de resize estándar
            if (data.type === 'resize' && data.height) {
                clearTimeout(heightChangeTimeout);
                
                heightChangeTimeout = setTimeout(() => {
                    const newHeight = data.height;
                    const newPage = data.page || 'home';
                    
                    // Detectar cambio de página
                    if (newPage !== currentIframePage) {
                        console.log(`📄 Cambio de página detectado: ${currentIframePage} → ${newPage}`);
                        currentIframePage = newPage;
                    }
                    
                    // Aplicar límites por página
                    const config = pageHeightConfigs[currentIframePage] || pageHeightConfigs['home'];
                    const constrainedHeight = Math.max(config.min, Math.min(newHeight, config.max));
                    
                    // Solo actualizar si hay cambio REALMENTE significativo
                    if (Math.abs(constrainedHeight - lastHeight) > 25) { // Aumentado de 15 a 25px
                        iframe.style.height = constrainedHeight + 'px';
                        lastHeight = constrainedHeight;
                        lastValidHeight = constrainedHeight;
                        
                        if (debugStatus) {
                            debugStatus.textContent = `✅ ${constrainedHeight}px (${currentIframePage})`;
                        }
                        
                        // Solo log para cambios muy significativos
                        console.log(`📱 Mobile Plans: ${constrainedHeight}px (${currentIframePage})`);
                    } else {
                        // Actualizar debug sin log para cambios menores
                        if (debugStatus && Math.abs(constrainedHeight - lastHeight) > 5) {
                            debugStatus.textContent = `✅ ${constrainedHeight}px (${currentIframePage}, estable)`;
                        }
                    }
                }, 50); // debounce de 50ms
            }
            
            // Mensaje de cambio de altura específico
            if (data.type === 'mobile_plans_height_changed') {
                const newHeight = data.height;
                const config = pageHeightConfigs[currentIframePage] || pageHeightConfigs['home'];
                const constrainedHeight = Math.max(config.min, Math.min(newHeight, config.max));
                
                iframe.style.height = constrainedHeight + 'px';
                lastHeight = constrainedHeight;
                
                if (debugStatus) {
                    debugStatus.textContent = `✅ Mobile Plans: ${constrainedHeight}px`;
                }
            }
        });
        
        // Eventos del iframe
        iframe.addEventListener('load', function() {
            isLoaded = true;
            if (debugStatus) debugStatus.textContent = '✅ Iframe cargado';
            
            // Intentar auto-ajuste inmediato
            setTimeout(autoAdjustHeight, 500);
            setTimeout(autoAdjustHeight, 1500);
            setTimeout(autoAdjustHeight, 3000);
        });
        
        // NO MÁS AUTO-AJUSTE PERIÓDICO
        // El iframe ahora se auto-gestiona completamente
        
        // Auto-ajuste en resize
        window.addEventListener('resize', function() {
            if (isLoaded) {
                setTimeout(autoAdjustHeight, 100);
            }
        });
        
        console.log('📱 Mobile Plans: WordPress integration loaded');
    })();
    </script>
    <?php
    
    return ob_get_clean();
}

// Registrar shortcode
add_shortcode('mobile_plans', 'mobile_plans_comparator_shortcode');

// ===============================================
// WIDGET ELEMENTOR
// ===============================================

// Verificar si Elementor está activo
add_action('elementor/widgets/widgets_registered', function() {
    if (class_exists('\\Elementor\\Widget_Base')) {
        
        class Mobile_Plans_Elementor_Widget extends \Elementor\Widget_Base {
            
            public function get_name() {
                return 'mobile-plans-comparator';
            }
            
            public function get_title() {
                return '📱 Mobile Plans Comparator';
            }
            
            public function get_icon() {
                return 'eicon-posts-grid';
            }
            
            public function get_categories() {
                return ['general'];
            }
            
            protected function _register_controls() {
                
                // SECCIÓN: CONFIGURACIÓN GENERAL
                $this->start_controls_section(
                    'general_section',
                    [
                        'label' => '⚙️ Configuración General',
                        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
                    ]
                );
                
                $this->add_control(
                    'height',
                    [
                        'label' => 'Altura del Widget',
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
                
                $this->add_control(
                    'theme',
                    [
                        'label' => 'Tema Visual',
                        'type' => \Elementor\Controls_Manager::SELECT,
                        'default' => 'default',
                        'options' => [
                            'default' => 'Predeterminado',
                            'dark' => 'Oscuro',
                            'minimal' => 'Minimalista',
                            'colorful' => 'Colorido'
                        ]
                    ]
                );
                
                $this->end_controls_section();
                
                // SECCIÓN: PLANES DESTACADOS
                $this->start_controls_section(
                    'featured_section',
                    [
                        'label' => '⭐ Planes Destacados',
                        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
                    ]
                );
                
                $this->add_control(
                    'featured_mode',
                    [
                        'label' => 'Modo de Selección',
                        'type' => \Elementor\Controls_Manager::SELECT,
                        'default' => 'auto',
                        'options' => [
                            'auto' => '🤖 Automático (primeros 3)',
                            'manual' => '✋ Manual (seleccionar específicos)',
                            'cheapest' => '💰 Más baratos (1 por operador)',
                            'most_expensive' => '💎 Más caros (1 por operador)',
                            'best_value' => '⚖️ Mejor relación calidad/precio'
                        ],
                        'description' => 'Cómo seleccionar los 3 planes que aparecen en "Planes Más Populares"'
                    ]
                );
                
                $this->add_control(
                    'manual_plans',
                    [
                        'label' => 'Planes Específicos',
                        'type' => \Elementor\Controls_Manager::TEXT,
                        'placeholder' => 'Ej: 2,7,12',
                        'description' => 'Índices de planes separados por comas (0=primer plan). Consulta la documentación para ver los índices.',
                        'condition' => [
                            'featured_mode' => 'manual'
                        ]
                    ]
                );
                
                $this->add_control(
                    'manual_help',
                    [
                        'type' => \Elementor\Controls_Manager::RAW_HTML,
                        'raw' => '<div style="background:#f8f9fa;padding:10px;border-radius:5px;font-size:12px;">
                                    <strong>📚 Guía de Índices:</strong><br>
                                    <strong>Movistar:</strong> 0-5 (0=5GB más barato, 2=30GB popular)<br>
                                    <strong>Vodafone:</strong> 6-11 (7=Yu 25GB popular, 6=Yu 8GB barato)<br>
                                    <strong>Orange:</strong> 12-17 (12=10GB barato, 13=25GB popular)<br>
                                    <strong>Recomendado:</strong> 2,7,12 (mix atractivo)
                                 </div>',
                        'condition' => [
                            'featured_mode' => 'manual'
                        ]
                    ]
                );
                
                $this->end_controls_section();
                
                // SECCIÓN: INTERFAZ
                $this->start_controls_section(
                    'ui_section',
                    [
                        'label' => '🎨 Interfaz de Usuario',
                        'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
                    ]
                );
                
                $this->add_control(
                    'hide_navigation',
                    [
                        'label' => 'Ocultar Navegación Superior',
                        'type' => \Elementor\Controls_Manager::SWITCHER,
                        'label_on' => 'Sí',
                        'label_off' => 'No',
                        'return_value' => 'yes',
                        'default' => '',
                        'description' => 'Ocultar la barra de navegación superior para integración más limpia'
                    ]
                );
                
                $this->end_controls_section();
            }
            
            protected function render() {
                $settings = $this->get_settings_for_display();
                
                // Convertir configuración de Elementor a shortcode
                $shortcode_atts = [
                    'height' => $settings['height']['size'] ?? 800,
                    'featured_mode' => $settings['featured_mode'] ?? 'auto',
                    'theme' => $settings['theme'] ?? 'default',
                    'hide_navigation' => $settings['hide_navigation'] === 'yes' ? 'true' : 'false'
                ];
                
                if (!empty($settings['manual_plans']) && $settings['featured_mode'] === 'manual') {
                    $shortcode_atts['featured_plans'] = $settings['manual_plans'];
                }
                
                // Renderizar usando la función del shortcode
                echo mobile_plans_comparator_shortcode($shortcode_atts);
            }
        }
        
        // Registrar widget
        \Elementor\Plugin::instance()->widgets_manager->register_widget_type(new Mobile_Plans_Elementor_Widget());
    }
});

// ===============================================
// FUNCIONES DE UTILIDAD
// ===============================================

// Añadir estilos globales para mejor integración
add_action('wp_head', function() {
    ?>
    <style>
        /* Estilos globales para Mobile Plans */
        .mobile-plans-wrapper {
            clear: both;
            margin: 30px 0;
        }
        
        .mobile-plans-wrapper iframe {
            max-width: 100%;
            width: 100%;
            display: block;
        }
        
        /* Fix para temas que interfieren */
        .mobile-plans-wrapper * {
            box-sizing: border-box;
        }
        
        /* Responsive mejorado */
        @media (max-width: 768px) {
            .mobile-plans-wrapper {
                margin: 20px -15px; /* Sangrado en móvil */
            }
        }
    </style>
    <?php
});

// Función para verificar instalación
function mobile_plans_check_installation() {
    $theme_dir = get_template_directory();
    $required_files = [
        $theme_dir . '/mobile-plans-web/index-new.html',
        $theme_dir . '/mobile-plans-web/js/app-new.js'
    ];
    
    foreach ($required_files as $file) {
        if (!file_exists($file)) {
            return false;
        }
    }
    
    return true;
}

// Aviso de administrador si no está instalado
add_action('admin_notices', function() {
    if (!mobile_plans_check_installation() && current_user_can('manage_options')) {
        ?>
        <div class="notice notice-warning">
            <p><strong>📱 Mobile Plans:</strong> La aplicación no está instalada correctamente. 
               Subir archivos a: <code><?php echo get_template_directory(); ?>/mobile-plans-web/</code></p>
        </div>
        <?php
    }
});

?>

<!-- 
=====================================================
INSTRUCCIONES DE USO:
=====================================================

1. INSTALACIÓN:
   - Subir la carpeta mobile-plans-web completa a:
     /wp-content/themes/tu-tema/mobile-plans-web/
   
   - Copiar este código al archivo functions.php del tema:
     /wp-content/themes/tu-tema/functions.php

2. USO CON SHORTCODE:
   [mobile_plans] - Básico
   [mobile_plans featured_mode="manual" featured_plans="2,7,12"] - Con planes específicos
   [mobile_plans height="600" theme="minimal"] - Personalizado

3. USO CON ELEMENTOR:
   - Buscar widget "Mobile Plans Comparator" 
   - Arrastrar a la página
   - Configurar opciones en el panel lateral

4. PERSONALIZACIÓN PLANES DESTACADOS:
   - Automático: Primeros 3 planes
   - Manual: Seleccionar índices específicos (0,1,2,etc.)
   - Más baratos: 1 más barato de cada operador
   - Más caros: 1 más caro de cada operador
   - Mejor valor: Mejor relación datos/precio

5. ÍNDICES DE PLANES ACTUALES:
   Movistar: 0-5   | Vodafone: 6-11   | Orange: 12-17
   Popular mix: 2,7,12 | Económico: 0,6,12 | Premium: 3,9,15

-->
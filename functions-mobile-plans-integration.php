/**
 * Mobile Plans Comparator - Integración WordPress + Elementor
 * 
 * Para incluir este archivo: require_once get_template_directory() . '/mobile-plans/functions-mobile-plans-integration.php';
 * O copiar todo este contenido (SIN las etiquetas <?php) al final del archivo functions.php de tu tema activo
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Cargar integración de Mobile Plans con Elementor
 */
function mobile_plans_init_elementor() {
    // Verificar que Elementor esté activo
    if (!did_action('elementor/loaded')) {
        return;
    }
    
    // Cargar la integración
    require_once get_template_directory() . '/mobile-plans/elementor/elementor-integration.php';
}
add_action('plugins_loaded', 'mobile_plans_init_elementor');

/**
 * Registrar y cargar estilos y scripts de Mobile Plans
 */
function mobile_plans_enqueue_assets() {
    $mobile_plans_path = get_template_directory_uri() . '/mobile-plans/';
    $version = '2.1.0'; // Cambiar cuando actualices los archivos
    
    // CSS Principal
    wp_enqueue_style(
        'mobile-plans-main',
        $mobile_plans_path . 'css/comparison-enhanced.css',
        [],
        $version
    );
    
    // CSS Adicional
    wp_enqueue_style(
        'mobile-plans-additional',
        $mobile_plans_path . 'css/additional-styles.css',
        ['mobile-plans-main'],
        $version
    );
    
    // CSS Animaciones
    wp_enqueue_style(
        'mobile-plans-animations',
        $mobile_plans_path . 'css/animations.css',
        ['mobile-plans-main'],
        $version
    );
    
    // CSS Componentes
    wp_enqueue_style(
        'mobile-plans-components',
        $mobile_plans_path . 'css/components.css',
        ['mobile-plans-main'],
        $version
    );
    
    // CSS Filtros
    wp_enqueue_style(
        'mobile-plans-filters',
        $mobile_plans_path . 'css/filter-dropdowns.css',
        ['mobile-plans-main'],
        $version
    );
    
    // CSS Temas
    wp_enqueue_style(
        'mobile-plans-themes',
        $mobile_plans_path . 'css/neutral-theme.css',
        ['mobile-plans-main'],
        $version
    );
    
    // JavaScript Principal
    wp_enqueue_script(
        'mobile-plans-app',
        $mobile_plans_path . 'js/app-new.js',
        ['jquery'],
        $version,
        true
    );
    
    // Pasar datos a JavaScript
    wp_localize_script('mobile-plans-app', 'mobilePlansWP', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mobile_plans_nonce'),
        'themePath' => $mobile_plans_path,
        'apiUrl' => 'https://ipv6-informatica.es/cart/data/products.json',
        'localPath' => $mobile_plans_path . 'config/products-enhanced.json'
    ]);
}

/**
 * Shortcode para mostrar la aplicación Mobile Plans
 * Uso: [mobile_plans theme="neutral" view="grid" max_comparisons="3"]
 */
function mobile_plans_shortcode($atts) {
    // Cargar assets
    mobile_plans_enqueue_assets();
    
    // Atributos por defecto
    $atts = shortcode_atts([
        'theme' => 'neutral',
        'view' => 'grid',
        'max_comparisons' => 3,
        'show_filters' => 'yes',
        'enable_comparison' => 'yes',
        'enable_search' => 'yes',
        'featured_mode' => 'auto',
        'default_operators' => '',
        'default_plan_type' => '',
        'max_price' => 100
    ], $atts);
    
    // Generar HTML
    ob_start();
    ?>
    <div id="mobile-plans-app" 
         class="mobile-plans-wrapper"
         data-theme="<?php echo esc_attr($atts['theme']); ?>"
         data-view="<?php echo esc_attr($atts['view']); ?>"
         data-max-comparisons="<?php echo esc_attr($atts['max_comparisons']); ?>"
         data-show-filters="<?php echo esc_attr($atts['show_filters']); ?>"
         data-enable-comparison="<?php echo esc_attr($atts['enable_comparison']); ?>"
         data-enable-search="<?php echo esc_attr($atts['enable_search']); ?>">
        
        <!-- Navegación -->
        <div id="navigation-container"></div>
        
        <!-- Página de inicio -->
        <section id="home-section" class="page-section">
            <!-- Hero section con tarjetas flotantes -->
            <div class="hero-section">
                <div class="hero-content">
                    <h1>Encuentra el Plan Móvil Perfecto</h1>
                    <p style="font-size: 0.925rem; color: var(--neutral-600); margin: 0;">Compara hasta 3 planes</p>
                    <div class="hero-actions">
                        <button class="cta-primary" onclick="window.navigation.navigateTo('plans')">
                            Ver Todos los Planes
                        </button>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="floating-cards">
                        <!-- Tarjetas flotantes - precios se actualizan dinámicamente -->
                        <div class="floating-card floating-expensive" style="--delay: 0s;">
                            <div class="mini-operator-logo movistar"></div>
                            <div class="mini-price">45,99€</div>
                        </div>
                        <div class="floating-card floating-expensive" style="--delay: 0.5s;">
                            <div class="mini-operator-logo vodafone"></div>
                            <div class="mini-price">39,99€</div>
                        </div>
                        <div class="floating-card floating-expensive" style="--delay: 1s;">
                            <div class="mini-operator-logo orange"></div>
                            <div class="mini-price">42,99€</div>
                        </div>
                        <div class="floating-card floating-cheap" style="--delay: 1.5s;">
                            <div class="mini-operator-logo movistar"></div>
                            <div class="mini-price">12,99€</div>
                        </div>
                        <div class="floating-card floating-cheap" style="--delay: 2s;">
                            <div class="mini-operator-logo vodafone"></div>
                            <div class="mini-price">19,99€</div>
                        </div>
                        <div class="floating-card floating-cheap" style="--delay: 2.5s;">
                            <div class="mini-operator-logo orange"></div>
                            <div class="mini-price">15,99€</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Productos destacados -->
            <div class="featured-section">
                <h2>Planes Más Valorados</h2>
                <div id="featured-plans-container"></div>
            </div>
        </section>
        
        <!-- Página de planes -->
        <section id="plans-section" class="page-section" style="display: none;">
            <div class="plans-header">
                <h1>Todos los Planes Móviles</h1>
                <p>Encuentra y compara todos nuestros planes disponibles</p>
            </div>
            <div id="filters-container"></div>
            <div id="products-container"></div>
            <div id="pagination-controls"></div>
        </section>
        
        <!-- Página de comparación -->
        <section id="compare-section" class="page-section" style="display: none;">
            <div class="comparison-header">
                <h1>Comparación de Planes</h1>
                <p style="font-size: 0.925rem; color: var(--neutral-600); margin: 0;">Compara hasta 3 planes</p>
            </div>
            <div id="comparison-container" style="width: fit-content; max-width: none; margin: 0 auto; padding: 0;"></div>
        </section>
        
        <!-- Loading overlay -->
        <div id="loading-overlay" class="loading-overlay" style="display: none;">
            <div class="loading-spinner"></div>
            <p>Cargando planes...</p>
        </div>
    </div>
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar aplicación Mobile Plans
        if (typeof MobilePlansApp !== 'undefined') {
            window.mobilePlansApp = new MobilePlansApp();
            window.mobilePlansApp.init();
        }
        
        // Configuración global para Elementor (si está disponible)
        if (typeof mobilePlansElementorConfig === 'undefined') {
            window.mobilePlansElementorConfig = {
                theme: '<?php echo esc_js($atts['theme']); ?>',
                defaultView: '<?php echo esc_js($atts['view']); ?>',
                maxComparisons: <?php echo intval($atts['max_comparisons']); ?>,
                showFilters: <?php echo $atts['show_filters'] === 'yes' ? 'true' : 'false'; ?>,
                enableComparison: <?php echo $atts['enable_comparison'] === 'yes' ? 'true' : 'false'; ?>,
                enableSearch: <?php echo $atts['enable_search'] === 'yes' ? 'true' : 'false'; ?>,
                featuredPlans: {
                    mode: '<?php echo esc_js($atts['featured_mode']); ?>',
                    manualPlans: []
                }
            };
        }
    });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('mobile_plans', 'mobile_plans_shortcode');

/**
 * Función auxiliar para cargar assets solo cuando se necesiten
 */
function mobile_plans_conditional_enqueue() {
    global $post;
    
    // Cargar en páginas que usen el shortcode
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'mobile_plans')) {
        mobile_plans_enqueue_assets();
    }
    
    // Cargar en páginas de Elementor que usen el widget
    if (class_exists('\Elementor\Plugin') && \Elementor\Plugin::$instance->editor->is_edit_mode()) {
        mobile_plans_enqueue_assets();
    }
}
add_action('wp_enqueue_scripts', 'mobile_plans_conditional_enqueue');

/**
 * Agregar soporte para AJAX (si necesitas funcionalidades adicionales)
 */
function mobile_plans_ajax_handler() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'], 'mobile_plans_nonce')) {
        wp_die('Security check failed');
    }
    
    $action = sanitize_text_field($_POST['mobile_action']);
    
    switch ($action) {
        case 'get_products':
            // Lógica para obtener productos
            wp_send_json_success(['products' => []]);
            break;
            
        case 'save_comparison':
            // Lógica para guardar comparación
            wp_send_json_success(['saved' => true]);
            break;
            
        default:
            wp_send_json_error('Invalid action');
    }
}
add_action('wp_ajax_mobile_plans', 'mobile_plans_ajax_handler');
add_action('wp_ajax_nopriv_mobile_plans', 'mobile_plans_ajax_handler');

/**
 * Agregar estilos admin (opcional)
 */
function mobile_plans_admin_styles() {
    ?>
    <style>
    .mobile-plans-admin-notice {
        border-left: 4px solid #007cba;
        padding: 12px;
        background: #f0f8ff;
        margin: 15px 0;
    }
    </style>
    <?php
}
add_action('admin_head', 'mobile_plans_admin_styles');

/**
 * Función para verificar requisitos
 */
function mobile_plans_check_requirements() {
    $mobile_plans_dir = get_template_directory() . '/mobile-plans/';
    
    if (!file_exists($mobile_plans_dir . 'js/app-new.js')) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-error mobile-plans-admin-notice">';
            echo '<p><strong>Mobile Plans:</strong> Los archivos de la aplicación no se encontraron en <code>/mobile-plans/</code>. Por favor, copia la carpeta completa a tu tema activo.</p>';
            echo '</div>';
        });
    }
    
    if (!class_exists('\Elementor\Plugin')) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-warning mobile-plans-admin-notice">';
            echo '<p><strong>Mobile Plans:</strong> Elementor no está activo. El widget de Elementor no estará disponible, pero puedes usar el shortcode <code>[mobile_plans]</code>.</p>';
            echo '</div>';
        });
    }
}
add_action('admin_init', 'mobile_plans_check_requirements');

/**
 * Hook para limpiar caché cuando se actualicen los productos (opcional)
 */
function mobile_plans_clear_cache() {
    // Implementar lógica de limpieza de caché si usas algún plugin de caché
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
    }
}
// add_action('mobile_plans_products_updated', 'mobile_plans_clear_cache');
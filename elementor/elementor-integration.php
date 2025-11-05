<?php
/**
 * Integración de Mobile Plans con Elementor
 * 
 * Este archivo registra el widget personalizado y maneja la integración completa
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Mobile_Plans_Elementor_Integration {

    private static $_instance = null;

    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct() {
        add_action('elementor/widgets/widgets_registered', [$this, 'register_widgets']);
        add_action('elementor/elements/categories_registered', [$this, 'register_widget_categories']);
        add_action('elementor/frontend/after_register_scripts', [$this, 'register_frontend_scripts']);
        add_action('elementor/preview/enqueue_styles', [$this, 'enqueue_preview_styles']);
        add_action('elementor/editor/before_enqueue_scripts', [$this, 'enqueue_editor_scripts']);
        
        // Hook para cuando Elementor está listo
        add_action('elementor/init', [$this, 'elementor_init']);
    }

    /**
     * Inicialización cuando Elementor está listo
     */
    public function elementor_init() {
        // Registrar iconos personalizados si es necesario
        $this->register_custom_icons();
    }

    /**
     * Registrar categoría personalizada para nuestros widgets
     */
    public function register_widget_categories($elements_manager) {
        $elements_manager->add_category(
            'mobile-plans',
            [
                'title' => __('Mobile Plans', 'mobile-plans'),
                'icon' => 'eicon-device-mobile',
            ]
        );
    }

    /**
     * Registrar widgets de Mobile Plans
     */
    public function register_widgets($widgets_manager) {
        // Incluir el archivo del widget
        require_once(__DIR__ . '/mobile-plans-widget.php');
        
        // Registrar el widget principal
        $widgets_manager->register_widget_type(new Mobile_Plans_Elementor_Widget());
        
        // Registrar widgets adicionales si los hay
        $this->register_additional_widgets($widgets_manager);
    }

    /**
     * Registrar widgets adicionales (comparador, calculadora por separado)
     */
    private function register_additional_widgets($widgets_manager) {
        // Widget solo comparador
        if (class_exists('Mobile_Plans_Comparator_Widget')) {
            $widgets_manager->register_widget_type(new Mobile_Plans_Comparator_Widget());
        }
        
        // Widget solo calculadora
        if (class_exists('Mobile_Plans_Calculator_Widget')) {
            $widgets_manager->register_widget_type(new Mobile_Plans_Calculator_Widget());
        }
    }

    /**
     * Registrar scripts para el frontend
     */
    public function register_frontend_scripts() {
        // CSS
        wp_register_style(
            'mobile-plans-elementor',
            get_template_directory_uri() . '/mobile-plans/elementor/elementor-styles.css',
            [],
            '2.0.0'
        );

        // JavaScript
        wp_register_script(
            'mobile-plans-elementor',
            get_template_directory_uri() . '/mobile-plans/elementor/elementor-handler.js',
            ['elementor-frontend'],
            '2.0.0',
            true
        );

        // Localizar script con datos de WordPress
        wp_localize_script('mobile-plans-elementor', 'mobilePlansElementor', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('mobile_plans_nonce'),
            'themeUrl' => get_template_directory_uri(),
            'apiUrl' => $this->get_api_url(),
            'settings' => $this->get_global_settings()
        ]);
    }

    /**
     * Estilos para el preview del editor
     */
    public function enqueue_preview_styles() {
        wp_enqueue_style('mobile-plans-elementor');
        wp_enqueue_style('mobile-plans-components', get_template_directory_uri() . '/mobile-plans/css/components.css');
        wp_enqueue_style('mobile-plans-themes', get_template_directory_uri() . '/mobile-plans/css/themes.css');
    }

    /**
     * Scripts para el editor de Elementor
     */
    public function enqueue_editor_scripts() {
        wp_enqueue_script(
            'mobile-plans-editor',
            get_template_directory_uri() . '/mobile-plans/elementor/editor-script.js',
            ['elementor-editor'],
            '2.0.0',
            true
        );
    }

    /**
     * Registrar iconos personalizados
     */
    private function register_custom_icons() {
        // Añadir iconos personalizados para el widget
        add_filter('elementor/icons_manager/additional_tabs', function($tabs) {
            $tabs['mobile-plans-icons'] = [
                'name' => 'mobile-plans-icons',
                'label' => __('Mobile Plans Icons', 'mobile-plans'),
                'url' => get_template_directory_uri() . '/mobile-plans/elementor/icons/mobile-plans-icons.css',
                'enqueue' => [get_template_directory_uri() . '/mobile-plans/elementor/icons/mobile-plans-icons.css'],
                'prefix' => 'mp-icon-',
                'displayPrefix' => 'mp',
                'labelIcon' => 'mp-icon-mobile',
                'ver' => '1.0.0',
                'fetchJson' => get_template_directory_uri() . '/mobile-plans/elementor/icons/mobile-plans-icons.json',
            ];
            return $tabs;
        });
    }

    /**
     * Obtener URL de la API
     */
    private function get_api_url() {
        return apply_filters('mobile_plans_api_url', 'https://ipv6-informatica.es/cart/data/');
    }

    /**
     * Obtener configuraciones globales
     */
    private function get_global_settings() {
        return apply_filters('mobile_plans_global_settings', [
            'maxComparisons' => 3,
            'cacheTime' => 300000,
            'enableAnalytics' => false,
            'theme' => 'light'
        ]);
    }
}

// Inicializar la integración
Mobile_Plans_Elementor_Integration::instance();

/**
 * Hook para añadir funcionalidades desde functions.php
 */
function mobile_plans_elementor_init() {
    // Permitir personalización desde el tema
    do_action('mobile_plans_elementor_loaded');
}
add_action('init', 'mobile_plans_elementor_init');

/**
 * Función helper para verificar si Elementor está activo
 */
function mobile_plans_is_elementor_active() {
    return did_action('elementor/loaded');
}

/**
 * Shortcode alternativo que funciona dentro de Elementor
 */
function mobile_plans_elementor_shortcode($atts) {
    $atts = shortcode_atts([
        'theme' => 'light',
        'operators' => '',
        'plan_type' => 'all',
        'max_price' => 100,
        'view' => 'catalog',
        'show_filters' => 'yes',
        'enable_comparison' => 'yes',
        'enable_calculator' => 'yes'
    ], $atts);

    // Generar ID único
    $widget_id = 'mobile-plans-sc-' . wp_generate_uuid4();
    
    ob_start();
    ?>
    <div class="mobile-plans-shortcode-wrapper" data-widget-id="<?php echo esc_attr($widget_id); ?>">
        <div id="<?php echo esc_attr($widget_id); ?>" class="mobile-plans-app-container">
            <div class="mobile-plans-loading">
                <div class="spinner-dual"></div>
                <p>Cargando catálogo...</p>
            </div>
        </div>
    </div>
    
    <script type="application/json" class="mobile-plans-shortcode-config" data-target="<?php echo esc_attr($widget_id); ?>">
        <?php echo wp_json_encode($atts); ?>
    </script>
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const config = <?php echo wp_json_encode($atts); ?>;
        if (typeof initMobilePlansApp === 'function') {
            initMobilePlansApp('<?php echo esc_js($widget_id); ?>', config);
        }
    });
    </script>
    <?php
    
    return ob_get_clean();
}
add_shortcode('mobile_plans_elementor', 'mobile_plans_elementor_shortcode');

/**
 * AJAX handler para cargar datos dinámicamente
 */
function mobile_plans_ajax_load_products() {
    check_ajax_referer('mobile_plans_nonce', 'nonce');
    
    $api_url = get_option('mobile_plans_api_url', 'https://ipv6-informatica.es/cart/data/products.json');
    
    $response = wp_remote_get($api_url, [
        'timeout' => 10,
        'headers' => [
            'User-Agent' => 'WordPress Mobile Plans Widget'
        ]
    ]);
    
    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'Error de conexión']);
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        wp_send_json_error(['message' => 'Error al procesar datos']);
    }
    
    wp_send_json_success($data);
}
add_action('wp_ajax_mobile_plans_load_products', 'mobile_plans_ajax_load_products');
add_action('wp_ajax_nopriv_mobile_plans_load_products', 'mobile_plans_ajax_load_products');

/**
 * Función para enqueue de assets desde cualquier parte
 */
function mobile_plans_enqueue_assets() {
    if (!wp_script_is('mobile-plans-app', 'enqueued')) {
        // CSS
        wp_enqueue_style('mobile-plans-components', get_template_directory_uri() . '/mobile-plans/css/components.css', [], '2.0.0');
        wp_enqueue_style('mobile-plans-themes', get_template_directory_uri() . '/mobile-plans/css/themes.css', [], '2.0.0');
        wp_enqueue_style('mobile-plans-animations', get_template_directory_uri() . '/mobile-plans/css/animations.css', [], '2.0.0');
        
        // JS Dependencies
        wp_enqueue_script('vue3', 'https://unpkg.com/vue@3/dist/vue.global.js', [], '3.0.0', true);
        wp_enqueue_script('axios', 'https://unpkg.com/axios/dist/axios.min.js', [], '1.0.0', true);
        wp_enqueue_script('tailwindcss', 'https://cdn.tailwindcss.com', [], '3.0.0', false);
        
        // Main App
        wp_enqueue_script('mobile-plans-app', get_template_directory_uri() . '/mobile-plans/js/app.js', ['vue3', 'axios'], '2.0.0', true);
    }
}

/**
 * Auto-enqueue cuando se detecta el widget en la página
 */
function mobile_plans_auto_enqueue() {
    global $post;
    
    if (is_object($post) && has_shortcode($post->post_content, 'mobile_plans_elementor')) {
        mobile_plans_enqueue_assets();
    }
    
    // También verificar en widgets de Elementor
    if (mobile_plans_is_elementor_active() && is_singular()) {
        $elementor_data = get_post_meta($post->ID, '_elementor_data', true);
        if (!empty($elementor_data) && strpos($elementor_data, 'mobile_plans_catalog') !== false) {
            mobile_plans_enqueue_assets();
        }
    }
}
add_action('wp_enqueue_scripts', 'mobile_plans_auto_enqueue');
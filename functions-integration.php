<?php
/**
 * Integración con functions.php - Mobile Plans
 * 
 * INSTRUCCIONES:
 * Añade este código a tu functions.php o inclúyelo como archivo separado
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Clase principal para la integración de Mobile Plans
 */
class Mobile_Plans_WordPress_Integration {
    
    private static $_instance = null;
    
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
    
    public function __construct() {
        add_action('init', [$this, 'init']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_head', [$this, 'add_meta_tags']);
        
        // Integración con Elementor
        $this->load_elementor_integration();
        
        // Shortcodes
        $this->register_shortcodes();
        
        // AJAX handlers
        $this->register_ajax_handlers();
        
        // Admin hooks
        if (is_admin()) {
            $this->admin_hooks();
        }
    }
    
    /**
     * Inicialización principal
     */
    public function init() {
        // Cargar textdomain para traducciones
        load_theme_textdomain('mobile-plans', get_template_directory() . '/mobile-plans/languages');
        
        // Configurar opciones por defecto
        $this->setup_default_options();
    }
    
    /**
     * Cargar integración con Elementor
     */
    private function load_elementor_integration() {
        // Verificar si Elementor está activo
        if (did_action('elementor/loaded')) {
            require_once get_template_directory() . '/mobile-plans/elementor/elementor-integration.php';
        } else {
            // Hook para cargar cuando Elementor esté disponible
            add_action('elementor/loaded', function() {
                require_once get_template_directory() . '/mobile-plans/elementor/elementor-integration.php';
            });
        }
    }
    
    /**
     * Registrar shortcodes
     */
    private function register_shortcodes() {
        add_shortcode('mobile_plans', [$this, 'mobile_plans_shortcode']);
        add_shortcode('mobile_plans_catalog', [$this, 'mobile_plans_catalog_shortcode']);
        add_shortcode('mobile_plans_comparison', [$this, 'mobile_plans_comparison_shortcode']);
        add_shortcode('mobile_plans_calculator', [$this, 'mobile_plans_calculator_shortcode']);
    }
    
    /**
     * Registrar handlers AJAX
     */
    private function register_ajax_handlers() {
        // Para usuarios logueados y no logueados
        add_action('wp_ajax_mobile_plans_get_products', [$this, 'ajax_get_products']);
        add_action('wp_ajax_nopriv_mobile_plans_get_products', [$this, 'ajax_get_products']);
        
        add_action('wp_ajax_mobile_plans_save_comparison', [$this, 'ajax_save_comparison']);
        add_action('wp_ajax_nopriv_mobile_plans_save_comparison', [$this, 'ajax_save_comparison']);
    }
    
    /**
     * Hooks de administración
     */
    private function admin_hooks() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }
    
    /**
     * Enqueue de assets principales
     */
    public function enqueue_assets() {
        // Solo cargar en páginas que lo necesiten
        if (!$this->should_load_assets()) {
            return;
        }
        
        $version = $this->get_version();
        $theme_url = get_template_directory_uri() . '/mobile-plans';
        
        // CSS
        wp_enqueue_style(
            'mobile-plans-components',
            $theme_url . '/css/components.css',
            [],
            $version
        );
        
        wp_enqueue_style(
            'mobile-plans-themes',
            $theme_url . '/css/themes.css',
            [],
            $version
        );
        
        wp_enqueue_style(
            'mobile-plans-animations',
            $theme_url . '/css/animations.css',
            [],
            $version
        );
        
        // JavaScript CDN dependencies
        wp_enqueue_script(
            'vue3',
            'https://unpkg.com/vue@3/dist/vue.global.prod.js',
            [],
            '3.4.0',
            true
        );
        
        wp_enqueue_script(
            'axios',
            'https://unpkg.com/axios/dist/axios.min.js',
            [],
            '1.6.0',
            true
        );
        
        // Tailwind CSS removido - usando CSS personalizado
        // wp_enqueue_script(
        //     'tailwindcss',
        //     'https://cdn.tailwindcss.com',
        //     [],
        //     '3.3.0',
        //     false
        // );
        
        // JavaScript principal
        wp_enqueue_script(
            'mobile-plans-app',
            $theme_url . '/js/app.js',
            ['vue3', 'axios'],
            $version,
            true
        );
        
        // Añadir atributo type="module" al script
        add_filter('script_loader_tag', function($tag, $handle) {
            if ('mobile-plans-app' === $handle) {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 2);
        
        // Localización
        wp_localize_script('mobile-plans-app', 'mobilePlansWP', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('mobile_plans_nonce'),
            'apiUrl' => $this->get_api_url(),
            'themeUrl' => $theme_url,
            'settings' => $this->get_global_settings(),
            'strings' => $this->get_localized_strings()
        ]);
    }
    
    /**
     * Verificar si debe cargar los assets
     */
    private function should_load_assets() {
        global $post;
        
        // Siempre cargar en admin
        if (is_admin()) {
            return true;
        }
        
        // Cargar si hay shortcodes en el contenido
        if (is_a($post, 'WP_Post')) {
            $shortcodes = ['mobile_plans', 'mobile_plans_catalog', 'mobile_plans_comparison', 'mobile_plans_calculator'];
            foreach ($shortcodes as $shortcode) {
                if (has_shortcode($post->post_content, $shortcode)) {
                    return true;
                }
            }
            
            // Verificar en metaboxes de Elementor
            if ($this->has_elementor_mobile_plans_widget($post->ID)) {
                return true;
            }
        }
        
        // Cargar en páginas específicas configuradas
        $load_pages = get_option('mobile_plans_load_pages', []);
        if (is_page($load_pages)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Verificar si la página tiene widgets de Mobile Plans en Elementor
     */
    private function has_elementor_mobile_plans_widget($post_id) {
        if (!class_exists('\Elementor\Plugin')) {
            return false;
        }
        
        $elementor_data = get_post_meta($post_id, '_elementor_data', true);
        
        if (empty($elementor_data)) {
            return false;
        }
        
        return strpos($elementor_data, 'mobile_plans_catalog') !== false;
    }
    
    /**
     * Shortcode principal
     */
    public function mobile_plans_shortcode($atts, $content = null) {
        $atts = shortcode_atts([
            'theme' => 'light',
            'view' => 'catalog',
            'operators' => '',
            'plan_type' => 'all',
            'max_price' => 100,
            'show_filters' => 'true',
            'enable_comparison' => 'true',
            'enable_calculator' => 'true',
            'max_comparisons' => 3
        ], $atts, 'mobile_plans');
        
        // Asegurar que los assets estén cargados
        $this->enqueue_assets();
        
        $widget_id = 'mobile-plans-' . wp_generate_uuid4();
        
        ob_start();
        ?>
        <div class="mobile-plans-shortcode-wrapper" data-widget-id="<?php echo esc_attr($widget_id); ?>">
            <div id="<?php echo esc_attr($widget_id); ?>" class="mobile-plans-app-container">
                <div class="mobile-plans-loading">
                    <div class="spinner-dual"></div>
                    <p><?php _e('Cargando catálogo de planes móviles...', 'mobile-plans'); ?></p>
                </div>
            </div>
        </div>
        
        <script type="application/json" class="mobile-plans-config" data-target="<?php echo esc_attr($widget_id); ?>">
            <?php echo wp_json_encode($this->process_shortcode_atts($atts)); ?>
        </script>
        <?php
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode solo catálogo
     */
    public function mobile_plans_catalog_shortcode($atts) {
        $atts['view'] = 'catalog';
        $atts['enable_comparison'] = 'false';
        $atts['enable_calculator'] = 'false';
        return $this->mobile_plans_shortcode($atts);
    }
    
    /**
     * Shortcode solo comparador
     */
    public function mobile_plans_comparison_shortcode($atts) {
        $atts['view'] = 'comparison';
        $atts['show_filters'] = 'false';
        return $this->mobile_plans_shortcode($atts);
    }
    
    /**
     * Shortcode solo calculadora
     */
    public function mobile_plans_calculator_shortcode($atts) {
        $atts['view'] = 'calculator';
        $atts['show_filters'] = 'false';
        $atts['enable_comparison'] = 'false';
        return $this->mobile_plans_shortcode($atts);
    }
    
    /**
     * Procesar atributos del shortcode
     */
    private function process_shortcode_atts($atts) {
        // Convertir strings a arrays donde sea necesario
        if (!empty($atts['operators'])) {
            $atts['operators'] = array_map('trim', explode(',', $atts['operators']));
        } else {
            $atts['operators'] = [];
        }
        
        // Convertir strings de boolean
        $boolean_fields = ['show_filters', 'enable_comparison', 'enable_calculator'];
        foreach ($boolean_fields as $field) {
            $atts[$field] = filter_var($atts[$field], FILTER_VALIDATE_BOOLEAN);
        }
        
        // Convertir números
        $atts['max_price'] = intval($atts['max_price']);
        $atts['max_comparisons'] = intval($atts['max_comparisons']);
        
        return $atts;
    }
    
    /**
     * AJAX: Obtener productos
     */
    public function ajax_get_products() {
        check_ajax_referer('mobile_plans_nonce', 'nonce');
        
        $api_url = $this->get_api_url() . 'products.json';
        
        $response = wp_remote_get($api_url, [
            'timeout' => 15,
            'headers' => [
                'User-Agent' => 'WordPress Mobile Plans/' . $this->get_version()
            ]
        ]);
        
        if (is_wp_error($response)) {
            wp_send_json_error([
                'message' => __('Error de conexión con el servidor', 'mobile-plans'),
                'code' => 'connection_error'
            ]);
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error([
                'message' => __('Error al procesar los datos', 'mobile-plans'),
                'code' => 'json_error'
            ]);
        }
        
        // Aplicar filtros para permitir modificaciones
        $data = apply_filters('mobile_plans_products_data', $data);
        
        wp_send_json_success($data);
    }
    
    /**
     * AJAX: Guardar comparación
     */
    public function ajax_save_comparison() {
        check_ajax_referer('mobile_plans_nonce', 'nonce');
        
        $comparison_data = json_decode(stripslashes($_POST['comparison_data']), true);
        
        if (empty($comparison_data)) {
            wp_send_json_error(['message' => __('Datos de comparación inválidos', 'mobile-plans')]);
        }
        
        // Generar ID único para la comparación
        $comparison_id = wp_generate_uuid4();
        
        // Guardar en transient (24 horas)
        set_transient('mobile_plans_comparison_' . $comparison_id, $comparison_data, DAY_IN_SECONDS);
        
        wp_send_json_success([
            'comparison_id' => $comparison_id,
            'share_url' => home_url('?mobile_plans_comparison=' . $comparison_id)
        ]);
    }
    
    /**
     * Configurar opciones por defecto
     */
    private function setup_default_options() {
        $defaults = [
            'mobile_plans_api_url' => 'https://ipv6-informatica.es/cart/data/',
            'mobile_plans_cache_time' => 300,
            'mobile_plans_theme' => 'light',
            'mobile_plans_max_comparisons' => 3,
            'mobile_plans_enable_analytics' => false,
            'mobile_plans_load_pages' => []
        ];
        
        foreach ($defaults as $option => $value) {
            if (get_option($option) === false) {
                add_option($option, $value);
            }
        }
    }
    
    /**
     * Obtener URL de la API
     */
    private function get_api_url() {
        return get_option('mobile_plans_api_url', 'https://ipv6-informatica.es/cart/data/');
    }
    
    /**
     * Obtener configuraciones globales
     */
    private function get_global_settings() {
        return [
            'maxComparisons' => get_option('mobile_plans_max_comparisons', 3),
            'cacheTime' => get_option('mobile_plans_cache_time', 300) * 1000,
            'enableAnalytics' => get_option('mobile_plans_enable_analytics', false),
            'theme' => get_option('mobile_plans_theme', 'light')
        ];
    }
    
    /**
     * Obtener strings localizados
     */
    private function get_localized_strings() {
        return [
            'loading' => __('Cargando...', 'mobile-plans'),
            'error' => __('Error al cargar datos', 'mobile-plans'),
            'noResults' => __('No se encontraron resultados', 'mobile-plans'),
            'compare' => __('Comparar', 'mobile-plans'),
            'contract' => __('Contratar', 'mobile-plans'),
            'monthly' => __('€/mes', 'mobile-plans'),
            'clearFilters' => __('Limpiar filtros', 'mobile-plans')
        ];
    }
    
    /**
     * Obtener versión
     */
    private function get_version() {
        return get_option('mobile_plans_version', '2.0.0');
    }
    
    /**
     * Añadir meta tags
     */
    public function add_meta_tags() {
        if ($this->should_load_assets()) {
            echo '<meta name="mobile-plans-version" content="' . esc_attr($this->get_version()) . '">' . "\n";
            echo '<meta name="mobile-plans-api" content="' . esc_url($this->get_api_url()) . '">' . "\n";
        }
    }
    
    /**
     * Añadir menú de administración
     */
    public function add_admin_menu() {
        add_options_page(
            __('Mobile Plans', 'mobile-plans'),
            __('Mobile Plans', 'mobile-plans'),
            'manage_options',
            'mobile-plans-settings',
            [$this, 'admin_page']
        );
    }
    
    /**
     * Registrar configuraciones
     */
    public function register_settings() {
        register_setting('mobile_plans_settings', 'mobile_plans_api_url');
        register_setting('mobile_plans_settings', 'mobile_plans_cache_time');
        register_setting('mobile_plans_settings', 'mobile_plans_theme');
        register_setting('mobile_plans_settings', 'mobile_plans_max_comparisons');
        register_setting('mobile_plans_settings', 'mobile_plans_enable_analytics');
        register_setting('mobile_plans_settings', 'mobile_plans_load_pages');
    }
    
    /**
     * Página de administración
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Configuración Mobile Plans', 'mobile-plans'); ?></h1>
            
            <form method="post" action="options.php">
                <?php settings_fields('mobile_plans_settings'); ?>
                <?php do_settings_sections('mobile_plans_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('URL de la API', 'mobile-plans'); ?></th>
                        <td>
                            <input type="url" name="mobile_plans_api_url" value="<?php echo esc_attr(get_option('mobile_plans_api_url')); ?>" class="regular-text" />
                            <p class="description"><?php _e('URL base para cargar los datos de productos', 'mobile-plans'); ?></p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Tiempo de Cache (segundos)', 'mobile-plans'); ?></th>
                        <td>
                            <input type="number" name="mobile_plans_cache_time" value="<?php echo esc_attr(get_option('mobile_plans_cache_time')); ?>" min="60" max="3600" />
                            <p class="description"><?php _e('Tiempo que se mantienen los datos en cache', 'mobile-plans'); ?></p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Tema por defecto', 'mobile-plans'); ?></th>
                        <td>
                            <select name="mobile_plans_theme">
                                <option value="light" <?php selected(get_option('mobile_plans_theme'), 'light'); ?>><?php _e('Claro', 'mobile-plans'); ?></option>
                                <option value="dark" <?php selected(get_option('mobile_plans_theme'), 'dark'); ?>><?php _e('Oscuro', 'mobile-plans'); ?></option>
                            </select>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Máximo comparaciones', 'mobile-plans'); ?></th>
                        <td>
                            <input type="number" name="mobile_plans_max_comparisons" value="<?php echo esc_attr(get_option('mobile_plans_max_comparisons')); ?>" min="1" max="5" />
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row"><?php _e('Habilitar Analytics', 'mobile-plans'); ?></th>
                        <td>
                            <input type="checkbox" name="mobile_plans_enable_analytics" value="1" <?php checked(get_option('mobile_plans_enable_analytics')); ?> />
                            <p class="description"><?php _e('Enviar eventos a Google Analytics', 'mobile-plans'); ?></p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <hr>
            
            <h2><?php _e('Shortcodes Disponibles', 'mobile-plans'); ?></h2>
            <p><strong>[mobile_plans]</strong> - <?php _e('Catálogo completo con todas las funcionalidades', 'mobile-plans'); ?></p>
            <p><strong>[mobile_plans_catalog]</strong> - <?php _e('Solo el catálogo de productos', 'mobile-plans'); ?></p>
            <p><strong>[mobile_plans_comparison]</strong> - <?php _e('Solo el comparador', 'mobile-plans'); ?></p>
            <p><strong>[mobile_plans_calculator]</strong> - <?php _e('Solo la calculadora', 'mobile-plans'); ?></p>
            
            <h3><?php _e('Parámetros disponibles:', 'mobile-plans'); ?></h3>
            <ul>
                <li><code>theme="light|dark"</code> - <?php _e('Tema visual', 'mobile-plans'); ?></li>
                <li><code>operators="movistar,vodafone,orange"</code> - <?php _e('Operadores a mostrar', 'mobile-plans'); ?></li>
                <li><code>plan_type="all|individual|familiar"</code> - <?php _e('Tipo de plan por defecto', 'mobile-plans'); ?></li>
                <li><code>max_price="50"</code> - <?php _e('Precio máximo por defecto', 'mobile-plans'); ?></li>
                <li><code>show_filters="true|false"</code> - <?php _e('Mostrar filtros', 'mobile-plans'); ?></li>
            </ul>
        </div>
        <?php
    }
    
    /**
     * Enqueue assets de administración
     */
    public function enqueue_admin_assets($hook) {
        if ('settings_page_mobile-plans-settings' !== $hook) {
            return;
        }
        
        wp_enqueue_style('mobile-plans-admin', get_template_directory_uri() . '/mobile-plans/admin/admin.css');
        wp_enqueue_script('mobile-plans-admin', get_template_directory_uri() . '/mobile-plans/admin/admin.js', ['jquery']);
    }
}

// Inicializar
Mobile_Plans_WordPress_Integration::instance();

/**
 * Funciones helper disponibles globalmente
 */

/**
 * Renderizar Mobile Plans programáticamente
 */
function render_mobile_plans($args = []) {
    $integration = Mobile_Plans_WordPress_Integration::instance();
    return $integration->mobile_plans_shortcode($args);
}

/**
 * Verificar si Mobile Plans está cargado en la página actual
 */
function is_mobile_plans_loaded() {
    return wp_script_is('mobile-plans-app', 'enqueued');
}

/**
 * Obtener configuración de Mobile Plans
 */
function get_mobile_plans_config() {
    $integration = Mobile_Plans_WordPress_Integration::instance();
    return $integration->get_global_settings();
}

/**
 * Hook de activación para configurar opciones iniciales
 */
register_activation_hook(__FILE__, function() {
    Mobile_Plans_WordPress_Integration::instance();
    flush_rewrite_rules();
});

/**
 * Hook de desactivación para limpiar
 */
register_deactivation_hook(__FILE__, function() {
    // Limpiar transients
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_mobile_plans_%'");
    flush_rewrite_rules();
});
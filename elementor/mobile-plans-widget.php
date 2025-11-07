<?php
/**
 * Widget de Catálogo de Planes Móviles para Elementor
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Mobile_Plans_Elementor_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'mobile_plans_catalog';
    }

    public function get_title() {
        return __('Catálogo Planes Móviles', 'mobile-plans');
    }

    public function get_icon() {
        return 'eicon-device-mobile';
    }

    public function get_categories() {
        return ['general'];
    }

    public function get_keywords() {
        return ['mobile', 'plans', 'telefonia', 'comparador', 'movil'];
    }

    private function get_available_plans() {
        // Cargar productos desde el JSON
        $products_file = get_template_directory() . '/mobile-plans/config/products-enhanced.json';
        
        if (!file_exists($products_file)) {
            return ['none' => __('No hay productos disponibles', 'mobile-plans')];
        }
        
        $products_json = file_get_contents($products_file);
        $products_data = json_decode($products_json, true);
        
        if (!$products_data || !isset($products_data['products'])) {
            return ['none' => __('Error al cargar productos', 'mobile-plans')];
        }
        
        $options = ['' => __('Seleccionar plan...', 'mobile-plans')];
        
        foreach ($products_data['products'] as $index => $product) {
            $operator_name = ucfirst($product['operator']);
            $plan_name = $product['name'];
            $price = number_format($product['price'], 2, ',', '.') . '€';
            
            $options[$index] = "{$operator_name} - {$plan_name} ({$price})";
        }
        
        return $options;
    }

    protected function register_controls() {
        
        // Sección General
        $this->start_controls_section(
            'general_section',
            [
                'label' => __('Configuración General', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'theme',
            [
                'label' => __('Tema', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'light',
                'options' => [
                    'light' => __('Claro', 'mobile-plans'),
                    'dark' => __('Oscuro', 'mobile-plans'),
                ],
            ]
        );

        $this->add_control(
            'default_view',
            [
                'label' => __('Vista por Defecto', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'catalog',
                'options' => [
                    'catalog' => __('Catálogo', 'mobile-plans'),
                    'comparison' => __('Comparador', 'mobile-plans'),
                    'calculator' => __('Calculadora', 'mobile-plans'),
                ],
            ]
        );

        $this->add_control(
            'max_comparisons',
            [
                'label' => __('Máximo Comparaciones', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'min' => 1,
                'max' => 5,
                'step' => 1,
                'default' => 3,
            ]
        );

        $this->end_controls_section();

        // Sección Filtros
        $this->start_controls_section(
            'filters_section',
            [
                'label' => __('Filtros', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'default_operators',
            [
                'label' => __('Operadores por Defecto', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT2,
                'multiple' => true,
                'options' => [
                    'movistar' => __('Movistar', 'mobile-plans'),
                    'vodafone' => __('Vodafone', 'mobile-plans'),
                    'orange' => __('Orange', 'mobile-plans'),
                ],
                'default' => [],
            ]
        );

        $this->add_control(
            'default_plan_type',
            [
                'label' => __('Tipo de Plan por Defecto', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'all',
                'options' => [
                    'all' => __('Todos', 'mobile-plans'),
                    'individual' => __('Individual', 'mobile-plans'),
                    'familiar' => __('Familiar', 'mobile-plans'),
                ],
            ]
        );

        $this->add_control(
            'max_price',
            [
                'label' => __('Precio Máximo por Defecto', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['€'],
                'range' => [
                    '€' => [
                        'min' => 0,
                        'max' => 100,
                        'step' => 5,
                    ],
                ],
                'default' => [
                    'unit' => '€',
                    'size' => 100,
                ],
            ]
        );

        $this->add_control(
            'show_filters',
            [
                'label' => __('Mostrar Filtros', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => __('Sí', 'mobile-plans'),
                'label_off' => __('No', 'mobile-plans'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->end_controls_section();

        // Sección Planes Populares
        $this->start_controls_section(
            'featured_plans_section',
            [
                'label' => __('Planes Populares', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'featured_plans_mode',
            [
                'label' => __('Modo de Selección', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'auto',
                'options' => [
                    'auto' => __('Automático (3 primeros)', 'mobile-plans'),
                    'manual' => __('Selección Manual', 'mobile-plans'),
                    'cheapest' => __('Más Baratos por Operador', 'mobile-plans'),
                    'most_expensive' => __('Más Caros por Operador', 'mobile-plans'),
                    'best_value' => __('Mejor Relación Calidad-Precio', 'mobile-plans'),
                ],
            ]
        );

        $this->add_control(
            'manual_plan_1',
            [
                'label' => __('Plan Popular 1', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '',
                'options' => $this->get_available_plans(),
                'condition' => [
                    'featured_plans_mode' => 'manual',
                ],
            ]
        );

        $this->add_control(
            'manual_plan_2',
            [
                'label' => __('Plan Popular 2', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '',
                'options' => $this->get_available_plans(),
                'condition' => [
                    'featured_plans_mode' => 'manual',
                ],
            ]
        );

        $this->add_control(
            'manual_plan_3',
            [
                'label' => __('Plan Popular 3', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => '',
                'options' => $this->get_available_plans(),
                'condition' => [
                    'featured_plans_mode' => 'manual',
                ],
            ]
        );

        $this->add_control(
            'featured_plans_note',
            [
                'type' => \Elementor\Controls_Manager::RAW_HTML,
                'raw' => __('<p><strong>Modos de selección:</strong></p>
                <ul>
                    <li><strong>Automático:</strong> Selecciona los 3 primeros planes del catálogo</li>
                    <li><strong>Selección Manual:</strong> Elige exactamente qué planes mostrar</li>
                    <li><strong>Más Baratos:</strong> Selecciona automáticamente el plan más barato de cada operador</li>
                    <li><strong>Más Caros:</strong> Selecciona automáticamente el plan más caro de cada operador</li>
                    <li><strong>Mejor Valor:</strong> Selecciona planes con mejor relación datos/precio</li>
                </ul>', 'mobile-plans'),
            ]
        );

        $this->end_controls_section();

        // Sección Funcionalidades
        $this->start_controls_section(
            'features_section',
            [
                'label' => __('Funcionalidades', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'enable_comparison',
            [
                'label' => __('Habilitar Comparador', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => __('Sí', 'mobile-plans'),
                'label_off' => __('No', 'mobile-plans'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'enable_calculator',
            [
                'label' => __('Habilitar Calculadora', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => __('Sí', 'mobile-plans'),
                'label_off' => __('No', 'mobile-plans'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'enable_dark_mode_toggle',
            [
                'label' => __('Toggle Tema Oscuro', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => __('Sí', 'mobile-plans'),
                'label_off' => __('No', 'mobile-plans'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'enable_search',
            [
                'label' => __('Habilitar Búsqueda', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => __('Sí', 'mobile-plans'),
                'label_off' => __('No', 'mobile-plans'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->end_controls_section();

        // Sección API
        $this->start_controls_section(
            'api_section',
            [
                'label' => __('Configuración API', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'api_url',
            [
                'label' => __('URL de la API', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::URL,
                'placeholder' => __('https://tu-dominio.com/api/', 'mobile-plans'),
                'default' => [
                    'url' => 'https://ipv6-informatica.es/cart/data/',
                ],
                'show_external' => false,
            ]
        );

        $this->add_control(
            'cache_time',
            [
                'label' => __('Tiempo de Cache (minutos)', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::NUMBER,
                'min' => 1,
                'max' => 60,
                'step' => 1,
                'default' => 5,
            ]
        );

        $this->end_controls_section();

        // Sección Estilos
        $this->start_controls_section(
            'style_section',
            [
                'label' => __('Estilos', 'mobile-plans'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'container_background',
            [
                'label' => __('Fondo del Contenedor', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .mobile-plans-container' => 'background-color: {{VALUE}}',
                ],
            ]
        );

        $this->add_control(
            'card_background',
            [
                'label' => __('Fondo de Tarjetas', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .product-card' => 'background-color: {{VALUE}}',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Border::get_type(),
            [
                'name' => 'card_border',
                'label' => __('Borde de Tarjetas', 'mobile-plans'),
                'selector' => '{{WRAPPER}} .product-card',
            ]
        );

        $this->add_control(
            'card_border_radius',
            [
                'label' => __('Radio del Borde', 'mobile-plans'),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%'],
                'selectors' => [
                    '{{WRAPPER}} .product-card' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        
        // Configurar datos para JavaScript
        $widget_config = [
            'theme' => $settings['theme'],
            'defaultView' => $settings['default_view'],
            'maxComparisons' => $settings['max_comparisons'],
            'defaultOperators' => $settings['default_operators'],
            'defaultPlanType' => $settings['default_plan_type'],
            'maxPrice' => $settings['max_price']['size'],
            'showFilters' => $settings['show_filters'] === 'yes',
            'enableComparison' => $settings['enable_comparison'] === 'yes',
            'enableCalculator' => $settings['enable_calculator'] === 'yes',
            'enableDarkModeToggle' => $settings['enable_dark_mode_toggle'] === 'yes',
            'enableSearch' => $settings['enable_search'] === 'yes',
            'apiUrl' => $settings['api_url']['url'],
            'cacheTime' => $settings['cache_time'] * 60000, // Convertir a ms
            'featuredPlans' => [
                'mode' => $settings['featured_plans_mode'],
                'manualPlans' => [
                    $settings['manual_plan_1'],
                    $settings['manual_plan_2'],
                    $settings['manual_plan_3']
                ]
            ],
        ];
        
        // Cargar directamente el index.html
        $index_file = get_template_directory() . '/mobile-plans/index.html';
        
        if (file_exists($index_file)) {
            // Leer el contenido del archivo
            $html_content = file_get_contents($index_file);
            
            // Aplicar configuraciones específicas del widget
            $html_content = str_replace(
                'id="mobile-plans-app"',
                'id="mobile-plans-app" class="theme-' . esc_attr($settings['theme']) . '"',
                $html_content
            );
            
            // Mostrar el contenido
            echo $html_content;
        } else {
            // Fallback si no existe el archivo
            ?>
            <div class="mobile-plans-error">
                <h3>Error: Archivo no encontrado</h3>
                <p>No se pudo encontrar: <?php echo esc_html($index_file); ?></p>
                <p>Verifica que la carpeta mobile-plans esté en la ubicación correcta.</p>
            </div>
            <?php
        }
        
        // Pasar configuración a JavaScript
        wp_add_inline_script(
            'mobile-plans-app',
            'window.mobilePlansElementorConfig = ' . wp_json_encode($widget_config) . ';',
            'before'
        );
        
        // Enqueue scripts y styles
        $this->enqueue_widget_assets();
    }

    private function enqueue_widget_assets() {
        // CSS
        wp_enqueue_style(
            'mobile-plans-components',
            get_template_directory_uri() . '/mobile-plans/css/components.css',
            [],
            '2.0.0'
        );
        
        wp_enqueue_style(
            'mobile-plans-themes',
            get_template_directory_uri() . '/mobile-plans/css/themes.css',
            [],
            '2.0.0'
        );
        
        wp_enqueue_style(
            'mobile-plans-animations',
            get_template_directory_uri() . '/mobile-plans/css/animations.css',
            [],
            '2.0.0'
        );
        
        // JavaScript dependencies (CDN)
        wp_enqueue_script(
            'vue3',
            'https://unpkg.com/vue@3/dist/vue.global.prod.js',
            [],
            '3.0.0',
            true
        );
        
        wp_enqueue_script(
            'axios',
            'https://unpkg.com/axios/dist/axios.min.js',
            [],
            '1.0.0',
            true
        );
        
        // Tailwind CSS removido - usando CSS personalizado
        // wp_enqueue_script(
        //     'tailwindcss',
        //     'https://cdn.tailwindcss.com',
        //     [],
        //     '3.0.0',
        //     false
        // );
        
        // JavaScript principal
        wp_enqueue_script(
            'mobile-plans-app',
            get_template_directory_uri() . '/mobile-plans/js/app-new.js',
            ['vue3', 'axios'],
            '2.0.0',
            true
        );
        
        // Añadir atributo type="module" al script
        add_filter('script_loader_tag', function($tag, $handle) {
            if ('mobile-plans-app' === $handle) {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 2);
        
        // Script de inicialización para Elementor (más seguro)
        wp_add_inline_script(
            'mobile-plans-app',
            $this->get_elementor_init_script_safe(),
            'after'
        );
    }

    private function get_elementor_init_script_safe() {
        return "
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar si ya existe el inicializador global
            if (typeof window.initMobilePlansWidgets !== 'undefined') {
                return; // Ya existe, no duplicar
            }
            
            // Crear función global de inicialización
            window.initMobilePlansWidgets = function() {
                const widgets = document.querySelectorAll('.mobile-plans-elementor-widget');
                
                widgets.forEach(function(widget) {
                    const widgetId = widget.dataset.widgetId;
                    const configScript = widget.querySelector('.mobile-plans-config[data-target=\"' + widgetId + '\"]');
                    
                    if (configScript && !widget.classList.contains('mobile-plans-initialized')) {
                        try {
                            const config = JSON.parse(configScript.textContent);
                            widget.classList.add('mobile-plans-initialized');
                            initMobilePlansWidget(widgetId, config);
                        } catch (e) {
                            console.error('Error parsing Mobile Plans config:', e);
                        }
                    }
                });
            };
            
            function initMobilePlansWidget(containerId, config) {
                const container = document.getElementById(containerId);
                if (!container) return;
                
                // Verificar Vue
                if (typeof Vue === 'undefined') {
                    setTimeout(() => initMobilePlansWidget(containerId, config), 100);
                    return;
                }
                
                // Mostrar mensaje de carga
                container.innerHTML = '<div class=\"mobile-plans-loading\"><div class=\"spinner-dual\"></div><p>Inicializando catálogo...</p></div>';
                
                // Cargar la aplicación principal
                try {
                    // Usar la función global de inicialización si existe
                    if (typeof window.initMobilePlansApp === 'function') {
                        window.initMobilePlansApp(containerId, config);
                    } else {
                        // Fallback: cargar el HTML básico del catálogo
                        loadMobilePlansHTML(containerId, config);
                    }
                } catch (error) {
                    console.error('Error loading Mobile Plans app:', error);
                    container.innerHTML = '<div class=\"mobile-plans-error\"><h3>Error de Carga</h3><p>' + error.message + '</p></div>';
                }
            }
            
            function loadMobilePlansHTML(containerId, config) {
                const container = document.getElementById(containerId);
                if (!container) return;
                
                // Cargar el HTML completo desde el archivo index.html
                fetch('" . get_template_directory_uri() . "/mobile-plans/index.html')
                    .then(response => response.text())
                    .then(html => {
                        // Extraer solo el contenido del body
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const appContainer = doc.getElementById('mobile-plans-app');
                        
                        if (appContainer) {
                            container.innerHTML = appContainer.innerHTML;
                            // Aplicar configuración
                            if (config.theme) {
                                container.classList.add('theme-' + config.theme);
                            }
                        } else {
                            // Fallback si no se puede cargar
                            container.innerHTML = '<div class=\"mobile-plans-container\"><div class=\"mobile-plans-error\"><h3>Error de Carga</h3><p>No se pudo cargar el catálogo</p></div></div>';
                        }
                    })
                    .catch(error => {
                        console.error('Error loading Mobile Plans HTML:', error);
                        container.innerHTML = '<div class=\"mobile-plans-container\"><div class=\"mobile-plans-error\"><h3>Error de Carga</h3><p>No se pudo conectar con el servidor</p></div></div>';
                    });
            }
            
            // Inicializar inmediatamente
            window.initMobilePlansWidgets();
            
            // Configurar hooks de Elementor de forma segura
            function setupElementorHooks() {
                if (typeof elementorFrontend !== 'undefined' && elementorFrontend.hooks) {
                    try {
                        elementorFrontend.hooks.addAction('frontend/element_ready/widget', function(\$scope) {
                            if (\$scope && \$scope.find && \$scope.find('.mobile-plans-elementor-widget').length) {
                                setTimeout(window.initMobilePlansWidgets, 100);
                            }
                        });
                    } catch (error) {
                        console.warn('No se pudieron configurar hooks de Elementor:', error);
                    }
                } else {
                    // Reintentar en 1 segundo si Elementor no está listo
                    setTimeout(setupElementorHooks, 1000);
                }
            }
            
            // Configurar hooks con delay
            setTimeout(setupElementorHooks, 500);
        });
        ";
    }

    protected function content_template() {
        ?>
        <div class="mobile-plans-elementor-widget">
            <div class="mobile-plans-preview">
                <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📱</div>
                    <h3 style="margin: 0 0 8px 0; color: #333;">Catálogo de Planes Móviles</h3>
                    <p style="margin: 0; color: #666;">Vista previa en el frontend</p>
                </div>
            </div>
        </div>
        <?php
    }
}
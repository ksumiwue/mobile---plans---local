/**
 * Handler JavaScript para Elementor - Mobile Plans
 * Maneja la inicialización y configuración de widgets en Elementor
 */

(function($) {
    'use strict';

    // Configuración global
    const MobilePlansElementor = {
        initialized: false,
        widgets: new Map(),
        config: window.mobilePlansElementor || {},
        
        // Inicializar el sistema
        init() {
            if (this.initialized) return;
            
            console.log('🚀 Inicializando Mobile Plans para Elementor');
            
            this.setupEventListeners();
            this.initializeExistingWidgets();
            this.initialized = true;
        },

        // Configurar event listeners
        setupEventListeners() {
            // Cuando Elementor está listo
            $(window).on('elementor/frontend/init', () => {
                this.handleElementorReady();
            });

            // Para widgets dinámicos (AJAX, popups, etc.)
            $(document).on('DOMNodeInserted', (e) => {
                if ($(e.target).find('.mobile-plans-elementor-widget').length) {
                    this.initializeWidget($(e.target).find('.mobile-plans-elementor-widget'));
                }
            });

            // Resize handler
            $(window).on('resize', this.debounce(() => {
                this.handleResize();
            }, 250));
        },

        // Manejar cuando Elementor está listo
        handleElementorReady() {
            // Frontend con verificación robusta
            if (typeof elementorFrontend !== 'undefined' && elementorFrontend.hooks) {
                try {
                    elementorFrontend.hooks.addAction('frontend/element_ready/widget', ($scope) => {
                        this.handleElementReady($scope);
                    });
                } catch (error) {
                    console.warn('Error configurando hooks de Elementor Frontend:', error);
                }
            } else {
                // Reintentar en 500ms si no está disponible
                setTimeout(() => {
                    this.handleElementorReady();
                }, 500);
            }

            // Editor con verificación robusta
            if (typeof elementor !== 'undefined' && elementor.hooks) {
                try {
                    elementor.hooks.addAction('panel/open_editor/widget', (panel, model, view) => {
                        this.handleEditorWidget(panel, model, view);
                    });
                } catch (error) {
                    console.warn('Error configurando hooks de Elementor Editor:', error);
                }
            }
        },

        // Manejar elemento listo en frontend
        handleElementReady($scope) {
            const $widgets = $scope.find('.mobile-plans-elementor-widget');
            if ($widgets.length) {
                $widgets.each((index, widget) => {
                    this.initializeWidget($(widget));
                });
            }
        },

        // Manejar widget en editor
        handleEditorWidget(panel, model, view) {
            if (model.get('widgetType') === 'mobile_plans_catalog') {
                // Configuraciones específicas para el editor
                this.setupEditorPreview(view);
            }
        },

        // Inicializar widgets existentes
        initializeExistingWidgets() {
            $('.mobile-plans-elementor-widget').each((index, widget) => {
                this.initializeWidget($(widget));
            });
        },

        // Inicializar un widget específico
        async initializeWidget($widget) {
            const widgetId = $widget.data('widget-id');
            
            if (!widgetId || this.widgets.has(widgetId)) {
                return; // Ya inicializado
            }

            console.log(`📱 Inicializando widget: ${widgetId}`);

            try {
                // Obtener configuración del widget
                const config = this.getWidgetConfig($widget);
                
                // Verificar dependencias
                await this.ensureDependencies();
                
                // Crear instancia del widget
                const instance = await this.createWidgetInstance(widgetId, config);
                
                // Guardar referencia
                this.widgets.set(widgetId, {
                    element: $widget,
                    instance: instance,
                    config: config
                });

                console.log(`✅ Widget ${widgetId} inicializado correctamente`);

            } catch (error) {
                console.error(`❌ Error inicializando widget ${widgetId}:`, error);
                this.showError($widget, error);
            }
        },

        // Obtener configuración del widget
        getWidgetConfig($widget) {
            const widgetId = $widget.data('widget-id');
            const $configScript = $widget.find(`.mobile-plans-config[data-target="${widgetId}"]`);
            
            let config = {
                theme: 'light',
                defaultView: 'catalog',
                maxComparisons: 3,
                apiUrl: this.config.apiUrl || 'https://ipv6-informatica.es/cart/data/',
                ...this.config.settings
            };

            if ($configScript.length) {
                try {
                    const widgetConfig = JSON.parse($configScript.text());
                    config = { ...config, ...widgetConfig };
                } catch (e) {
                    console.warn('Error parseando configuración del widget:', e);
                }
            }

            return config;
        },

        // Asegurar que las dependencias estén cargadas
        async ensureDependencies() {
            const dependencies = [
                { name: 'Vue', global: 'Vue', url: 'https://unpkg.com/vue@3/dist/vue.global.prod.js' },
                { name: 'Axios', global: 'axios', url: 'https://unpkg.com/axios/dist/axios.min.js' }
            ];

            for (const dep of dependencies) {
                if (!window[dep.global]) {
                    console.log(`📦 Cargando dependencia: ${dep.name}`);
                    await this.loadScript(dep.url);
                    
                    // Verificar carga
                    let attempts = 0;
                    while (!window[dep.global] && attempts < 50) {
                        await this.sleep(100);
                        attempts++;
                    }
                    
                    if (!window[dep.global]) {
                        throw new Error(`No se pudo cargar ${dep.name}`);
                    }
                }
            }

            // Tailwind CSS removido - usando CSS personalizado
            // if (!document.querySelector('script[src*="tailwindcss"]')) {
            //     this.loadScript('https://cdn.tailwindcss.com');
            // }
        },

        // Crear instancia del widget
        async createWidgetInstance(containerId, config) {
            const { Vue } = window;
            
            // Importar componentes y stores
            const modules = await this.importMobilePlansModules();
            
            // Configurar la aplicación Vue
            const app = Vue.createApp({
                data() {
                    return {
                        widgetId: containerId,
                        widgetConfig: config,
                        ...modules.createStores()
                    };
                },
                
                components: {
                    ...modules.components
                },
                
                mounted() {
                    this.initializeApp(config);
                },
                
                methods: {
                    ...modules.methods,
                    
                    initializeApp(config) {
                        // Aplicar configuración inicial
                        this.applyWidgetConfig(config);
                        
                        // Cargar datos
                        this.loadInitialData();
                        
                        // Configurar tema
                        this.$el.classList.add(`theme-${config.theme}`);
                    },
                    
                    applyWidgetConfig(config) {
                        // Aplicar filtros por defecto
                        if (config.defaultOperators && config.defaultOperators.length) {
                            this.filters.operators = config.defaultOperators;
                        }
                        
                        if (config.defaultPlanType !== 'all') {
                            this.filters.planType = config.defaultPlanType;
                        }
                        
                        if (config.maxPrice < 100) {
                            this.filters.maxPrice = config.maxPrice;
                        }
                        
                        // Configurar vista inicial
                        this.ui.activeView = config.defaultView || 'catalog';
                        
                        // Configurar funcionalidades
                        this.ui.showFilters = config.showFilters !== false;
                        this.ui.enableComparison = config.enableComparison !== false;
                        this.ui.enableCalculator = config.enableCalculator !== false;
                    },
                    
                    async loadInitialData() {
                        try {
                            this.ui.loading = true;
                            
                            // Usar AJAX de WordPress si está disponible
                            if (this.widgetConfig.ajaxUrl) {
                                await this.loadDataViaWordPress();
                            } else {
                                await this.loadDataDirectly();
                            }
                            
                        } catch (error) {
                            console.error('Error cargando datos:', error);
                            this.ui.error = 'Error al cargar los datos del servidor';
                        } finally {
                            this.ui.loading = false;
                        }
                    },
                    
                    async loadDataViaWordPress() {
                        const response = await fetch(this.widgetConfig.ajaxUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: new URLSearchParams({
                                action: 'mobile_plans_load_products',
                                nonce: this.widgetConfig.nonce
                            })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            this.processProductData(result.data);
                        } else {
                            throw new Error(result.data.message || 'Error desconocido');
                        }
                    },
                    
                    async loadDataDirectly() {
                        const response = await axios.get(this.widgetConfig.apiUrl + 'products.json');
                        this.processProductData(response.data);
                    },
                    
                    processProductData(data) {
                        // Procesar datos igual que en la versión original
                        this.products.loadFromData(data);
                    }
                },
                
                template: modules.template
            });
            
            // Montar la aplicación
            const instance = app.mount(`#${containerId}`);
            
            return instance;
        },

        // Importar módulos de Mobile Plans
        async importMobilePlansModules() {
            // Esta función cargaría dinámicamente los módulos
            // Por simplicidad, asumimos que están disponibles globalmente
            
            return {
                components: window.MobilePlansComponents || {},
                createStores: window.createMobilePlansStores || (() => ({})),
                methods: window.MobilePlansMethods || {},
                template: this.getDefaultTemplate()
            };
        },

        // Template por defecto
        getDefaultTemplate() {
            return `
                <div class="mobile-plans-container" :class="'theme-' + widgetConfig.theme">
                    <div v-if="ui.loading" class="loading-state">
                        <div class="spinner-dual"></div>
                        <p>Cargando planes móviles...</p>
                    </div>
                    
                    <div v-else-if="ui.error" class="error-state">
                        <div class="error-icon">⚠️</div>
                        <h3>Error al cargar</h3>
                        <p>{{ ui.error }}</p>
                    </div>
                    
                    <div v-else class="mobile-plans-content">
                        <!-- El contenido se renderizará aquí -->
                        <div class="placeholder-content">
                            <h2>Catálogo de Planes Móviles</h2>
                            <p>Widget cargado correctamente</p>
                        </div>
                    </div>
                </div>
            `;
        },

        // Configurar preview en editor
        setupEditorPreview(view) {
            // Cuando se modifiquen settings en el editor
            view.model.on('change', () => {
                const widgetId = view.$el.find('.mobile-plans-elementor-widget').data('widget-id');
                if (widgetId && this.widgets.has(widgetId)) {
                    this.updateWidgetConfig(widgetId, view.model.toJSON());
                }
            });
        },

        // Actualizar configuración de widget
        updateWidgetConfig(widgetId, newSettings) {
            const widget = this.widgets.get(widgetId);
            if (widget && widget.instance) {
                // Actualizar configuración reactivamente
                Object.assign(widget.instance.widgetConfig, newSettings);
                widget.instance.applyWidgetConfig(newSettings);
            }
        },

        // Manejar resize
        handleResize() {
            this.widgets.forEach((widget) => {
                if (widget.instance && widget.instance.handleResize) {
                    widget.instance.handleResize();
                }
            });
        },

        // Mostrar error en el widget
        showError($widget, error) {
            const errorHtml = `
                <div class="mobile-plans-error">
                    <div class="error-content">
                        <h3>❌ Error de Carga</h3>
                        <p>${error.message || 'Error desconocido'}</p>
                        <button onclick="location.reload()" class="retry-button">
                            🔄 Intentar de nuevo
                        </button>
                    </div>
                </div>
            `;
            
            $widget.find('.mobile-plans-app-container').html(errorHtml);
        },

        // Utilities
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        // API pública para debugging
        getDebugInfo() {
            return {
                initialized: this.initialized,
                widgets: Array.from(this.widgets.keys()),
                config: this.config
            };
        },

        // Destruir widget
        destroyWidget(widgetId) {
            const widget = this.widgets.get(widgetId);
            if (widget) {
                if (widget.instance && widget.instance.$destroy) {
                    widget.instance.$destroy();
                }
                this.widgets.delete(widgetId);
                console.log(`🗑️ Widget ${widgetId} destruido`);
            }
        },

        // Destruir todos los widgets
        destroyAll() {
            this.widgets.forEach((widget, widgetId) => {
                this.destroyWidget(widgetId);
            });
            this.initialized = false;
        }
    };

    // Función global para inicialización manual
    window.initMobilePlansApp = function(containerId, config) {
        const $widget = $(`[data-widget-id="${containerId}"]`);
        if ($widget.length) {
            MobilePlansElementor.initializeWidget($widget);
        }
    };

    // Función global para debugging
    window.mobilePlansElementorDebug = function() {
        return MobilePlansElementor.getDebugInfo();
    };

    // Auto-inicialización con verificación de jQuery
    function initWhenReady() {
        if (typeof $ !== 'undefined' && typeof jQuery !== 'undefined') {
            $(document).ready(function() {
                MobilePlansElementor.init();
            });
        } else {
            // Reintentar si jQuery no está disponible
            setTimeout(initWhenReady, 100);
        }
    }
    
    initWhenReady();

    // Limpiar al cerrar la página
    $(window).on('beforeunload', function() {
        MobilePlansElementor.destroyAll();
    });

    // Exportar para uso externo
    window.MobilePlansElementor = MobilePlansElementor;

})(jQuery);
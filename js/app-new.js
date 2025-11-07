// APLICACIÓN PRINCIPAL - NUEVA VERSIÓN MINIMALISTA

class MobilePlansApp {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.isLoading = false;
        
        // Componentes
        this.navigation = null;
        this.filterSystem = null;
        this.productCardRenderer = null;
        
        // Estados
        this.comparisonStore = new Set();
        this.favoritesStore = new Set();
        
        // Configuración
        this.config = {
            animationDuration: 600,
            loadingDelay: 800,
            enableAnimations: true
        };
    }

    // Inicializar aplicación
    async initialize() {
        try {
            this.showLoading();
            
            // Inicializar componentes
            await this.initializeComponents();
            
            // Cargar datos
            await this.loadInitialData();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Configurar stores globales
            this.setupGlobalStores();
            
            this.hideLoading();
            
            console.log('✅ Aplicación inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando aplicación:', error);
            this.showError('Error cargando la aplicación');
        }
    }

    // Inicializar componentes
    async initializeComponents() {
        // Navegación
        this.navigation = new NavigationMinimal();
        const navContainer = document.getElementById('navigation-container');
        this.navigation.initialize(navContainer);

        // Sistema de filtros
        this.filterSystem = new FilterSystemNew();
        this.filterSystem.setOnFilterChange((filteredProducts) => {
            this.handleFilterChange(filteredProducts);
        });

        // Renderizador de tarjetas
        this.productCardRenderer = new ProductCardNew();

        // Configurar navegación inicial
        await this.setupInitialNavigation();
    }

    // Cargar datos iniciales
    async loadInitialData() {
        // Simular carga de API (reemplazar con llamada real)
        this.products = await this.loadProductsFromAPI();
        
        // Configurar filtros con productos
        const filtersContainer = document.getElementById('filters-container');
        this.filterSystem.initialize(filtersContainer, this.products);
        
        // Aplicar filtros iniciales
        this.filteredProducts = [...this.products];
        
        // Renderizar productos iniciales
        this.renderProducts();
        
        // Cargar planes destacados
        this.loadFeaturedPlans();
        
        // Actualizar tarjetas flotantes con precios dinámicos
        this.updateFloatingCards();
    }

    // Cargar productos desde API real
    async loadProductsFromAPI() {
        try {
            console.log('🔄 Cargando productos desde API...');
            
            const response = await fetch('https://ipv6-informatica.es/cart/data/products.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Datos de API recibidos:', data);

            // Transformar datos de la API al formato de la aplicación
            return this.transformAPIData(data);

        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            
            // Fallback a datos expandidos para demostración
            console.log('🔄 Usando datos expandidos de demostración...');
            return this.getExpandedFallbackProducts();
        }
    }

    // Transformar datos de la API al formato interno
    transformAPIData(apiData) {
        console.log('🔍 Estructura de datos recibida:', apiData);
        
        let allProducts = [];
        
        // Mapeo específico de las familias de planes móviles
        const mobilePlanFamilies = {
            'movistarPlans': { operator: 'movistar', planType: 'individual' },
            'vodafoneIndividualPlans': { operator: 'vodafone', planType: 'individual' },
            'vodafoneFamiliarPlans': { operator: 'vodafone', planType: 'familiar' },
            'orangeIndividualPlans': { operator: 'orange', planType: 'individual' },
            'orangeFamiliarPlans': { operator: 'orange', planType: 'familiar' }
        };
        
        // Procesar cada familia específica de planes móviles
        Object.keys(mobilePlanFamilies).forEach(familyKey => {
            if (apiData[familyKey]) {
                const familyData = apiData[familyKey];
                const { operator, planType } = mobilePlanFamilies[familyKey];
                
                console.log(`📱 Procesando ${familyKey}: ${operator} ${planType}`, familyData);
                
                if (Array.isArray(familyData)) {
                    // Es un array de productos
                    familyData.forEach((product, index) => {
                        const normalizedProduct = this.normalizeProduct(product, operator, planType, `${familyKey}-${index}`);
                        allProducts.push(normalizedProduct);
                    });
                } else if (familyData && typeof familyData === 'object') {
                    // Es un objeto con productos
                    Object.keys(familyData).forEach(productKey => {
                        const product = familyData[productKey];
                        if (product && typeof product === 'object') {
                            const normalizedProduct = this.normalizeProduct(product, operator, planType, `${familyKey}-${productKey}`);
                            allProducts.push(normalizedProduct);
                        }
                    });
                }
            } else {
                console.log(`⚠️ No se encontró la familia: ${familyKey}`);
            }
        });
        
        console.log(`✅ Total productos procesados: ${allProducts.length}`, allProducts);
        
        if (allProducts.length === 0) {
            console.warn('⚠️ No se encontraron planes móviles en las familias especificadas');
            return this.getFallbackProducts();
        }
        
        // Actualizar contador en hero section
        this.updateHeroStats(allProducts.length);
        
        return allProducts;
    }

    // Normalizar producto individual al formato interno
    normalizeProduct(product, operatorKey = null, familyKey = null, productKey = null) {
        // Generar ID único basado en la estructura
        const productId = product.id || 
                         product.sku || 
                         productKey ||
                         `${operatorKey}-${familyKey}-${Date.now()}-${Math.random()}`;
        
        // Detectar operador desde la estructura o producto
        let detectedOperator = operatorKey || this.detectOperator(product);
        
        // Normalizar nombre de operador
        if (detectedOperator) {
            detectedOperator = detectedOperator.toLowerCase().replace(/[^a-z]/g, '');
        }
        
        // Detectar tipo de plan desde la familia
        let detectedPlanType = familyKey || product.planType || product.type || 'individual';
        detectedPlanType = this.normalizePlanType(detectedPlanType);
        
        // Si es empresarial, lo omitimos en el filtro posterior
        const normalized = {
            id: productId,
            name: product.name || product.title || product.nombre || `Plan ${operatorKey} ${familyKey}`,
            operator: detectedOperator,
            price: this.parsePrice(product.price || product.precio || product.cost || 0),
            originalPrice: this.parsePrice(product.originalPrice || product.precioOriginal || product.old_price),
            data: this.normalizeData(product.data || product.gb || product.datos || product.gigas),
            calls: 'unlimited', // Todos tienen llamadas ilimitadas
            sms: this.detectOperatorSMS(detectedOperator), // SMS según operador
            planType: detectedPlanType,
            network: '5G', // Todos tienen 5G
            contractType: product.contractType || product.contract || product.tipo || 'contrato',
            permanencia: product.permanencia || product.commitment || product.duracion || 0,
            featured: Boolean(product.featured || product.destacado || product.popular),
            popular: Boolean(product.popular || product.recomendado || product.bestseller),
            features: this.normalizeFeatures(product.features || product.caracteristicas || product.extras || []),
            benefits: this.normalizeFeatures(product.benefits || product.beneficios || product.ventajas || []),
            restrictions: this.normalizeFeatures(product.restrictions || product.restricciones || product.limitaciones || [])
        };
        
        console.log(`🔄 Producto normalizado:`, normalized);
        return normalized;
    }

    // Detectar SMS según operador
    detectOperatorSMS(operator) {
        if (!operator) return '0';
        const operatorLower = operator.toLowerCase();
        
        if (operatorLower.includes('vodafone')) {
            return '100'; // Vodafone tiene 100 SMS
        }
        
        return '0'; // Movistar y Orange no tienen SMS
    }

    // Detectar operador desde el producto
    detectOperator(product) {
        const name = (product.name || '').toLowerCase();
        const operator = (product.operator || product.operador || '').toLowerCase();
        
        if (operator.includes('movistar') || name.includes('movistar')) return 'movistar';
        if (operator.includes('vodafone') || name.includes('vodafone')) return 'vodafone';
        if (operator.includes('orange') || name.includes('orange')) return 'orange';
        
        // Fallback basado en otros indicadores
        if (name.includes('fusion') || name.includes('fusión')) return 'movistar';
        if (name.includes('yu') || name.includes('bit')) return 'vodafone';
        if (name.includes('love') || name.includes('mundo')) return 'orange';
        
        return 'unknown';
    }

    // Parsear precio
    parsePrice(price) {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            const numericPrice = parseFloat(price.replace(/[€,\s]/g, '').replace(',', '.'));
            return isNaN(numericPrice) ? 0 : numericPrice;
        }
        return 0;
    }

    // Normalizar datos (GB)
    normalizeData(data) {
        if (!data) return '0';
        if (typeof data === 'string') {
            if (data.toLowerCase().includes('ilimitado') || data.toLowerCase().includes('unlimited')) {
                return 'unlimited';
            }
            return data.replace(/[^\d]/g, '') || '0';
        }
        if (typeof data === 'number') return data.toString();
        return '0';
    }

    // Normalizar llamadas
    normalizeCalls(calls) {
        if (!calls) return '0';
        if (typeof calls === 'string') {
            if (calls.toLowerCase().includes('ilimitado') || calls.toLowerCase().includes('unlimited')) {
                return 'unlimited';
            }
            return calls.replace(/[^\d]/g, '') || '0';
        }
        if (typeof calls === 'number') return calls.toString();
        return '0';
    }

    // Normalizar SMS
    normalizeSMS(sms) {
        if (!sms) return '0';
        if (typeof sms === 'string') {
            if (sms.toLowerCase().includes('ilimitado') || sms.toLowerCase().includes('unlimited')) {
                return '0'; // Cambiar unlimited a 0 porque no hay SMS ilimitados
            }
            return sms.replace(/[^\d]/g, '') || '0';
        }
        if (typeof sms === 'number') return sms.toString();
        return '0';
    }

    // Normalizar tipo de plan
    normalizePlanType(type) {
        if (!type) return 'individual';
        const typeStr = type.toLowerCase();
        
        if (typeStr.includes('famil')) return 'familiar';
        if (typeStr.includes('empres')) return 'empresarial';
        if (typeStr.includes('prepa')) return 'individual'; // Prepago se considera individual
        
        return 'individual';
    }

    // Normalizar red
    normalizeNetwork(network) {
        if (!network) return '4G';
        const networkStr = network.toString().toUpperCase();
        
        if (networkStr.includes('5G')) return '5G';
        if (networkStr.includes('4G')) return '4G';
        if (networkStr.includes('3G')) return '3G';
        
        return '4G';
    }

    // Normalizar características
    normalizeFeatures(features) {
        if (!features) return [];
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') {
            return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
        }
        return [];
    }

    // Datos de fallback si falla la API
    getFallbackProducts() {
        console.log('📦 Usando productos de fallback...');
        return [
            {
                id: 'fallback-movistar-1',
                name: 'Movistar Fusión Essential',
                operator: 'movistar',
                price: 24.99,
                data: '30',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                features: ['Fibra incluida', 'Netflix gratis', 'Roaming EU']
            },
            {
                id: 'fallback-vodafone-1',
                name: 'Vodafone Yu',
                operator: 'vodafone',
                price: 19.99,
                data: '25',
                calls: 'unlimited',
                sms: 'unlimited',
                planType: 'individual',
                network: '4G',
                features: ['Llamadas ilimitadas', 'SMS gratis', 'App exclusiva']
            },
            {
                id: 'fallback-orange-1',
                name: 'Orange Love',
                operator: 'orange',
                price: 29.99,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '0',
                planType: 'familiar',
                network: '5G',
                features: ['Datos ilimitados', 'Familia incluida', 'Amazon Prime']
            }
        ];
    }

    // Datos expandidos de demostración (hasta que la API tenga móviles)
    getExpandedFallbackProducts() {
        console.log('📦 Usando catálogo expandido de planes móviles...');
        
        // Datos corregidos: Todos con llamadas ilimitadas, Red 5G, Roaming UE
        // SMS: Vodafone = 100, Movistar/Orange = 0
        return [
            // MOVISTAR - Individual
            {
                id: 'movistar-individual-1',
                name: 'Movistar Fusión Selección 5GB',
                operator: 'movistar',
                price: 20.90,
                originalPrice: 25.90,
                data: '5',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: true,
                popular: false,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido']
            },
            {
                id: 'movistar-individual-2',
                name: 'Movistar Fusión Selección 15GB',
                operator: 'movistar',
                price: 25.90,
                originalPrice: 30.90,
                data: '15',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', '5G premium', 'Netflix básico']
            },
            {
                id: 'movistar-individual-3',
                name: 'Movistar Fusión Selección 30GB',
                operator: 'movistar',
                price: 30.90,
                originalPrice: 35.90,
                data: '30',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Netflix estándar']
            },
            {
                id: 'movistar-individual-4',
                name: 'Movistar Fusión Ilimitada',
                operator: 'movistar',
                price: 39.90,
                originalPrice: 44.90,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: false,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Datos ilimitados']
            },

            // MOVISTAR - Familiar  
            {
                id: 'movistar-familiar-1',
                name: 'Movistar Fusión Familia 50GB',
                operator: 'movistar',
                price: 45.90,
                originalPrice: 52.90,
                data: '50',
                calls: 'unlimited',
                sms: '0',
                planType: 'familiar',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Hasta 4 líneas']
            },
            {
                id: 'movistar-familiar-2',
                name: 'Movistar Fusión Familia Ilimitada',
                operator: 'movistar',
                price: 65.90,
                originalPrice: 75.90,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '0',
                planType: 'familiar',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Hasta 5 líneas']
            },

            // VODAFONE - Individual
            {
                id: 'vodafone-individual-1',
                name: 'Vodafone Yu 8GB',
                operator: 'vodafone',
                price: 17.99,
                originalPrice: 22.99,
                data: '8',
                calls: 'unlimited',
                sms: '100',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', '100 SMS/mes', 'Red 5G', 'Roaming UE incluido', 'Solo para jóvenes']
            },
            {
                id: 'vodafone-individual-2',
                name: 'Vodafone Yu 25GB',
                operator: 'vodafone',
                price: 22.99,
                originalPrice: 27.99,
                data: '25',
                calls: 'unlimited',
                sms: '100',
                planType: 'individual',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', '100 SMS/mes', 'Red 5G', 'Roaming UE incluido', 'Spotify Premium']
            },
            {
                id: 'vodafone-individual-3',
                name: 'Vodafone One 40GB',
                operator: 'vodafone',
                price: 35.99,
                originalPrice: 40.99,
                data: '40',
                calls: 'unlimited',
                sms: '100',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: false,
                features: ['Llamadas ilimitadas', '100 SMS/mes', 'Red 5G', 'Roaming UE incluido', 'TV Vodafone']
            },
            {
                id: 'vodafone-individual-4',
                name: 'Vodafone One Ilimitada',
                operator: 'vodafone',
                price: 49.99,
                originalPrice: 54.99,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '100',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: false,
                features: ['Llamadas ilimitadas', '100 SMS/mes', 'Red 5G', 'Roaming UE incluido', 'Datos ilimitados']
            },

            // VODAFONE - Familiar
            {
                id: 'vodafone-familiar-1',
                name: 'Vodafone One Familia 60GB',
                operator: 'vodafone',
                price: 52.99,
                originalPrice: 62.99,
                data: '60',
                calls: 'unlimited',
                sms: '100',
                planType: 'familiar',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', '100 SMS/mes por línea', 'Red 5G', 'Roaming UE incluido', 'Hasta 4 líneas']
            },
            {
                id: 'vodafone-familiar-2',
                name: 'Vodafone One Familia Ilimitada',
                operator: 'vodafone',
                price: 72.99,
                originalPrice: 82.99,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '100',
                planType: 'familiar',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', '100 SMS/mes por línea', 'Red 5G', 'Roaming UE incluido', 'Hasta 5 líneas']
            },

            // ORANGE - Individual
            {
                id: 'orange-individual-1',
                name: 'Orange Go Walk 10GB',
                operator: 'orange',
                price: 15.95,
                originalPrice: 19.95,
                data: '10',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Sin permanencia']
            },
            {
                id: 'orange-individual-2',
                name: 'Orange Go Walk 25GB',
                operator: 'orange',
                price: 20.95,
                originalPrice: 25.95,
                data: '25',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Música ilimitada']
            },
            {
                id: 'orange-individual-3',
                name: 'Orange Go Walk 50GB',
                operator: 'orange',
                price: 27.95,
                originalPrice: 32.95,
                data: '50',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: false,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Prime Video']
            },
            {
                id: 'orange-individual-4',
                name: 'Orange Love Ilimitada',
                operator: 'orange',
                price: 39.95,
                originalPrice: 44.95,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '0',
                planType: 'individual',
                network: '5G',
                featured: false,
                popular: false,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Datos ilimitados']
            },

            // ORANGE - Familiar
            {
                id: 'orange-familiar-1',
                name: 'Orange Love Familia 80GB',
                operator: 'orange',
                price: 49.95,
                originalPrice: 59.95,
                data: '80',
                calls: 'unlimited',
                sms: '0',
                planType: 'familiar',
                network: '5G',
                featured: false,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Hasta 4 líneas']
            },
            {
                id: 'orange-familiar-2',
                name: 'Orange Love Familia Ilimitada',
                operator: 'orange',
                price: 69.95,
                originalPrice: 79.95,
                data: 'unlimited',
                calls: 'unlimited',
                sms: '0',
                planType: 'familiar',
                network: '5G',
                featured: true,
                popular: true,
                features: ['Llamadas ilimitadas', 'Sin SMS', 'Red 5G', 'Roaming UE incluido', 'Hasta 5 líneas']
            }
        ];
    }

    // Configurar navegación inicial
    async setupInitialNavigation() {
        // Manejar cambios de navegación
        document.addEventListener('navigation:change', (e) => {
            const { page } = e.detail;
            this.handlePageChange(page);
        });

        // Inicializar en página de inicio
        this.navigation.navigateTo('home');
    }

    // Manejar cambio de página
    handlePageChange(page) {
        console.log(`📄 Navegando a: ${page}`, 'Productos en comparación:', this.comparisonStore.size);
        
        switch (page) {
            case 'plans':
                this.initializePlansPage();
                break;
            case 'compare':
                this.initializeComparePage();
                break;
        }
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Inicializar página de planes
    initializePlansPage() {
        // Renderizar productos si no están ya renderizados
        if (!document.querySelector('.products-grid-new')) {
            this.renderProducts();
        }
        
        // Configurar ordenamiento
        this.setupSortControls();
    }

    // Configurar controles de ordenamiento
    setupSortControls() {
        const sortSelect = document.getElementById('sort-select');
        const itemsSelect = document.getElementById('items-select');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
        
        if (itemsSelect) {
            itemsSelect.addEventListener('change', (e) => {
                this.handleItemsPerPage(e.target.value);
            });
        }
    }

    // Manejar cambio de elementos por página
    handleItemsPerPage(itemsCount) {
        if (itemsCount === 'all') {
            this.productsPerPage = this.filteredProducts.length;
        } else {
            this.productsPerPage = parseInt(itemsCount);
        }
        
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCounter();
    }

    // Manejar ordenamiento
    handleSort(sortType) {
        const [field, order] = sortType.split('-');
        this.filteredProducts = this.productCardRenderer.sortProducts(
            this.filteredProducts, 
            field, 
            order
        );
        this.renderProducts();
    }

    // Manejar cambio de filtros
    handleFilterChange(filteredProducts) {
        this.filteredProducts = filteredProducts;
        console.log(`🔄 Filtros aplicados: ${filteredProducts.length} productos encontrados`);
        this.renderProducts();
        this.updateResultsCounter();
    }

    // Renderizar productos
    renderProducts() {
        const container = document.getElementById('products-container');
        if (container && this.productCardRenderer) {
            // Aplicar paginación
            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = this.productsPerPage === this.filteredProducts.length ? 
                this.filteredProducts.length : 
                startIndex + this.productsPerPage;
            
            const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
            
            this.productCardRenderer.renderProductGrid(productsToShow, container);
            
            // Actualizar paginación
            this.updatePagination();
        }
    }

    // Actualizar controles de paginación
    updatePagination() {
        const totalProducts = this.filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        const showPagination = totalProducts > this.productsPerPage;
        
        const paginationControls = document.getElementById('pagination-controls');
        const showingFrom = document.getElementById('showing-from');
        const showingTo = document.getElementById('showing-to');
        const totalProductsSpan = document.getElementById('total-products');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const paginationPages = document.getElementById('pagination-pages');
        
        if (!paginationControls) return;
        
        // Mostrar/ocultar paginación
        paginationControls.style.display = showPagination ? 'flex' : 'none';
        
        if (showPagination) {
            // Actualizar información
            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = Math.min(startIndex + this.productsPerPage, totalProducts);
            
            showingFrom.textContent = startIndex + 1;
            showingTo.textContent = endIndex;
            totalProductsSpan.textContent = totalProducts;
            
            // Actualizar botones
            prevBtn.disabled = this.currentPage === 1;
            nextBtn.disabled = this.currentPage === totalPages;
            
            // Generar números de página
            this.generatePageNumbers(totalPages);
        }
    }

    // Generar números de página
    generatePageNumbers(totalPages) {
        const paginationPages = document.getElementById('pagination-pages');
        if (!paginationPages) return;
        
        let pagesHTML = '';
        
        // Mostrar páginas (máximo 5)
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            pagesHTML += `
                <span class="page-number ${isActive ? 'active' : ''}" 
                      onclick="window.app.goToPage(${i})">
                    ${i}
                </span>
            `;
        }
        
        paginationPages.innerHTML = pagesHTML;
    }

    // Navegar a página específica
    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
    }

    // Página anterior
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderProducts();
        }
    }

    // Página siguiente
    nextPage() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderProducts();
        }
    }

    // Cargar planes destacados
    loadFeaturedPlans() {
        const featuredContainer = document.getElementById('featured-plans-container');
        if (featuredContainer && this.productCardRenderer) {
            let featuredProducts = [];
            
            // Obtener configuración desde Elementor si existe
            const elementorConfig = window.mobilePlansElementorConfig;
            const mode = elementorConfig?.featuredPlans?.mode || 'auto';
            
            switch(mode) {
                case 'manual':
                    featuredProducts = this.getManualSelectedPlans(elementorConfig.featuredPlans.manualPlans);
                    break;
                case 'cheapest':
                    featuredProducts = this.getCheapestPlansByOperator();
                    break;
                case 'most_expensive':
                    featuredProducts = this.getMostExpensivePlansByOperator();
                    break;
                case 'best_value':
                    featuredProducts = this.getBestValuePlans();
                    break;
                case 'auto':
                default:
                    featuredProducts = this.products.slice(0, 3);
                    break;
            }
            
            // Asegurar que tenemos máximo 3 planes
            featuredProducts = featuredProducts.slice(0, 3);
            
            console.log('📋 Planes destacados cargados:', { mode, count: featuredProducts.length });
            this.productCardRenderer.renderProductGrid(featuredProducts, featuredContainer);
        }
    }

    // Obtener precios dinámicos para tarjetas flotantes
    getFloatingCardPrices() {
        const operators = ['movistar', 'vodafone', 'orange'];
        const prices = {};
        
        operators.forEach(operator => {
            const operatorProducts = this.products.filter(p => p.operator === operator);
            if (operatorProducts.length > 0) {
                const sortedPrices = operatorProducts.map(p => p.price).sort((a, b) => a - b);
                prices[operator] = {
                    min: sortedPrices[0],
                    max: sortedPrices[sortedPrices.length - 1]
                };
            } else {
                // Valores por defecto si no hay productos del operador
                prices[operator] = { min: 15.99, max: 39.99 };
            }
        });
        
        return prices;
    }

    // Actualizar tarjetas flotantes con precios dinámicos
    updateFloatingCards() {
        const prices = this.getFloatingCardPrices();
        
        // Actualizar tarjetas caras (arriba)
        const expensiveCards = document.querySelectorAll('.floating-expensive .mini-price');
        if (expensiveCards.length >= 3) {
            expensiveCards[0].textContent = `${prices.movistar.max.toFixed(2)}€`;
            expensiveCards[1].textContent = `${prices.vodafone.max.toFixed(2)}€`;
            expensiveCards[2].textContent = `${prices.orange.max.toFixed(2)}€`;
        }
        
        // Actualizar tarjetas baratas (abajo)
        const cheapCards = document.querySelectorAll('.floating-cheap .mini-price');
        if (cheapCards.length >= 3) {
            cheapCards[0].textContent = `${prices.movistar.min.toFixed(2)}€`;
            cheapCards[1].textContent = `${prices.vodafone.min.toFixed(2)}€`;
            cheapCards[2].textContent = `${prices.orange.min.toFixed(2)}€`;
        }
        
        console.log('✅ Tarjetas flotantes actualizadas con precios dinámicos:', prices);
    }

    // Obtener planes seleccionados manualmente
    getManualSelectedPlans(manualPlans) {
        const selectedPlans = [];
        
        if (Array.isArray(manualPlans)) {
            manualPlans.forEach(planIndex => {
                if (planIndex !== '' && planIndex !== null && this.products[planIndex]) {
                    selectedPlans.push(this.products[planIndex]);
                }
            });
        }
        
        return selectedPlans;
    }

    // Obtener el plan más barato de cada operador
    getCheapestPlansByOperator() {
        const operators = ['movistar', 'vodafone', 'orange'];
        const cheapestPlans = [];
        
        operators.forEach(operator => {
            const operatorPlans = this.products.filter(p => p.operator === operator);
            if (operatorPlans.length > 0) {
                const cheapest = operatorPlans.reduce((prev, current) => 
                    prev.price < current.price ? prev : current
                );
                cheapestPlans.push(cheapest);
            }
        });
        
        return cheapestPlans;
    }

    // Obtener el plan más caro de cada operador
    getMostExpensivePlansByOperator() {
        const operators = ['movistar', 'vodafone', 'orange'];
        const expensivePlans = [];
        
        operators.forEach(operator => {
            const operatorPlans = this.products.filter(p => p.operator === operator);
            if (operatorPlans.length > 0) {
                const mostExpensive = operatorPlans.reduce((prev, current) => 
                    prev.price > current.price ? prev : current
                );
                expensivePlans.push(mostExpensive);
            }
        });
        
        return expensivePlans;
    }

    // Obtener planes con mejor relación calidad-precio
    getBestValuePlans() {
        // Calcular valor = datos / precio (más datos por euro es mejor)
        const plansWithValue = this.products.map(plan => {
            const dataGB = this.parseDataToGB(plan.data);
            const value = dataGB > 0 ? dataGB / plan.price : 0;
            return { ...plan, value };
        });
        
        // Ordenar por valor descendente y tomar los 3 mejores
        return plansWithValue
            .sort((a, b) => b.value - a.value)
            .slice(0, 3);
    }

    // Convertir datos a GB para comparación
    parseDataToGB(dataString) {
        if (!dataString || typeof dataString !== 'string') return 0;
        
        const lowerData = dataString.toLowerCase();
        
        if (lowerData.includes('ilimitad') || lowerData.includes('unlimited')) {
            return 1000; // Valor alto para datos ilimitados
        }
        
        const numMatch = dataString.match(/(\d+(?:,\d+)?)/);
        if (!numMatch) return 0;
        
        const num = parseFloat(numMatch[1].replace(',', '.'));
        
        if (lowerData.includes('tb')) {
            return num * 1024;
        } else if (lowerData.includes('gb')) {
            return num;
        } else if (lowerData.includes('mb')) {
            return num / 1024;
        }
        
        return num; // Asumir GB por defecto
    }

    // Actualizar contador de resultados
    updateResultsCounter() {
        const counter = document.querySelector('.results-counter');
        if (counter) {
            const count = this.filteredProducts.length;
            counter.textContent = `${count} plan${count !== 1 ? 'es' : ''} encontrado${count !== 1 ? 's' : ''}`;
        }
    }

    // Inicializar página de comparación
    initializeComparePage() {
        console.log(`🔄 Inicializando página de comparación. Productos: ${this.comparisonStore.size}`);
        console.log(`📋 IDs en comparación:`, Array.from(this.comparisonStore));
        
        const container = document.getElementById('comparison-container');
        if (container) {
            this.renderComparisonTable();
        } else {
            console.error('❌ Container de comparación no encontrado');
        }
    }

    // Renderizar tabla de comparación
    renderComparisonTable() {
        console.log(`🔄 Renderizando tabla de comparación...`);
        console.log(`📋 IDs a comparar:`, Array.from(this.comparisonStore));
        console.log(`📦 Total productos disponibles:`, this.products.length);
        
        const comparedProducts = Array.from(this.comparisonStore)
            .map(id => {
                const product = this.products.find(p => p.id === id);
                console.log(`🔍 Buscando producto ${id}:`, product ? '✅ Encontrado' : '❌ No encontrado');
                if (product) {
                    console.log(`📦 Datos del producto:`, {
                        id: product.id,
                        name: product.name,
                        operator: product.operator,
                        price: product.price,
                        data: product.data
                    });
                }
                return product;
            })
            .filter(Boolean);

        console.log(`✅ Productos encontrados para comparar:`, comparedProducts.length);

        const container = document.getElementById('comparison-container');
        
        if (!container) {
            console.error('❌ Container de comparación no encontrado');
            return;
        }
        
        if (comparedProducts.length === 0) {
            console.log('📝 Mostrando comparación vacía');
            container.innerHTML = this.getEmptyComparisonHTML();
            return;
        }

        console.log('🎨 Renderizando tabla de comparación con productos:', comparedProducts);
        container.innerHTML = this.getComparisonTableHTML(comparedProducts);
    }

    // HTML para comparación vacía
    getEmptyComparisonHTML() {
        return `
            <div class="empty-comparison">
                <div class="empty-icon">
                    <svg class="icon-minimal" viewBox="0 0 24 24" style="width: 64px; height: 64px;">
                        <path stroke="currentColor" fill="none" stroke-width="1.5" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                    </svg>
                </div>
                <h2>No hay planes para comparar</h2>
                <p>Marca los productos que quieres comparar desde la sección de planes.</p>
                <button class="cta-primary" onclick="window.app.navigation.navigateTo('plans')">
                    Ver Planes
                </button>
            </div>
        `;
    }

    // HTML para tabla de comparación
    getComparisonTableHTML(products) {
        const headers = products.map(product => `
            <th class="comparison-header">
                <div class="product-summary">
                    <div class="operator-badge ${product.operator}">
                        ${product.operator.charAt(0).toUpperCase() + product.operator.slice(1)}
                    </div>
                    <h3>${product.name}</h3>
                    <div class="price-comparison">
                        ${this.productCardRenderer.formatPrice(product.price)}
                    </div>
                </div>
            </th>
        `).join('');

        const features = ['data', 'calls', 'sms', 'network', 'planType'];
        const rows = features.map(feature => {
            const cells = products.map(product => `
                <td class="comparison-cell">
                    ${this.getFeatureValue(product, feature)}
                </td>
            `).join('');
            
            return `
                <tr>
                    <td class="feature-label">${this.getFeatureLabel(feature)}</td>
                    ${cells}
                </tr>
            `;
        }).join('');

        const actionCells = products.map(product => `
            <td class="comparison-cell">
                <button class="cta-minimal" onclick="window.selectPlan('${product.id}')">
                    Contratar
                </button>
            </td>
        `).join('');

        return `
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th></th>
                            ${headers}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr>
                            <td class="feature-label">Contratar</td>
                            ${actionCells}
                        </tr>
                    </tbody>
                </table>
                
                <button class="clear-comparison-btn" onclick="window.app.clearComparison()">
                    Limpiar Comparación
                </button>
            </div>
        `;
    }

    // Obtener valor de característica para comparación
    getFeatureValue(product, feature) {
        switch (feature) {
            case 'data':
                return product.data === 'unlimited' ? 'Ilimitados' : `${product.data}GB`;
            case 'calls':
                return product.calls === 'unlimited' ? 'Ilimitadas' : `${product.calls} min`;
            case 'sms':
                return product.sms === 'unlimited' ? 'Ilimitados' : `${product.sms} SMS`;
            case 'network':
                return `Red ${product.network}`;
            case 'planType':
                return product.planType.charAt(0).toUpperCase() + product.planType.slice(1);
            default:
                return product[feature] || '-';
        }
    }

    // Obtener etiqueta de característica
    getFeatureLabel(feature) {
        const labels = {
            data: 'Datos',
            calls: 'Llamadas',
            sms: 'SMS',
            network: 'Red',
            planType: 'Tipo de Plan'
        };
        return labels[feature] || feature;
    }

    // Inicializar calculadora
    initializeCalculatorPage() {
        this.setupCalculatorControls();
    }

    // Configurar controles de calculadora
    setupCalculatorControls() {
        // Slider de datos
        const dataSlider = document.getElementById('data-slider');
        const dataValue = document.getElementById('data-value');
        
        if (dataSlider && dataValue) {
            dataSlider.addEventListener('input', (e) => {
                dataValue.textContent = e.target.value;
            });
        }

        // Slider de presupuesto
        const budgetSlider = document.getElementById('budget-slider');
        const budgetValue = document.getElementById('budget-value');
        
        if (budgetSlider && budgetValue) {
            budgetSlider.addEventListener('input', (e) => {
                budgetValue.textContent = e.target.value;
            });
        }

        // Función global para calcular mejor plan
        window.calculateBestPlan = () => {
            this.calculateBestPlan();
        };
    }

    // Calcular mejor plan
    calculateBestPlan() {
        const dataNeeded = parseInt(document.getElementById('data-slider').value);
        const budget = parseInt(document.getElementById('budget-slider').value);
        const callsNeed = document.querySelector('input[name="calls"]:checked').value;

        // Filtrar productos según criterios
        let suitableProducts = this.products.filter(product => {
            // Filtro de presupuesto
            if (product.price > budget) return false;

            // Filtro de datos
            if (product.data !== 'unlimited' && parseInt(product.data) < dataNeeded) return false;

            // Filtro de llamadas
            if (callsNeed === 'many' && product.calls !== 'unlimited') return false;

            return true;
        });

        // Ordenar por mejor relación calidad-precio
        suitableProducts.sort((a, b) => {
            const scoreA = this.calculatePlanScore(a, dataNeeded, callsNeed);
            const scoreB = this.calculatePlanScore(b, dataNeeded, callsNeed);
            return scoreB - scoreA;
        });

        this.showCalculatorResults(suitableProducts.slice(0, 3));
    }

    // Calcular puntuación del plan
    calculatePlanScore(product, dataNeeded, callsNeed) {
        let score = 100;

        // Puntuación por precio (más bajo es mejor)
        score -= (product.price / 100) * 30;

        // Puntuación por datos
        if (product.data === 'unlimited') {
            score += 20;
        } else {
            const dataAmount = parseInt(product.data);
            if (dataAmount >= dataNeeded) {
                score += 15;
            }
        }

        // Puntuación por llamadas
        if (product.calls === 'unlimited') {
            score += callsNeed === 'many' ? 15 : 5;
        }

        // Puntuación por red
        if (product.network === '5G') {
            score += 10;
        }

        return score;
    }

    // Mostrar resultados de calculadora
    showCalculatorResults(recommendedProducts) {
        const resultsContainer = document.getElementById('calculator-results');
        
        if (recommendedProducts.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No encontramos planes que se ajusten a tus criterios</h3>
                    <p>Intenta ajustar tu presupuesto o necesidades de datos.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <div class="calculator-results-content">
                    <h3>Planes Recomendados Para Ti</h3>
                    <div class="recommended-plans">
                        ${recommendedProducts.map((product, index) => `
                            <div class="recommended-plan ${index === 0 ? 'best-match' : ''}">
                                ${index === 0 ? '<div class="best-badge">Mejor Opción</div>' : ''}
                                ${this.productCardRenderer.createCard(product)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Inicializar página de ayuda
    initializeHelpPage() {
        this.setupFAQInteractions();
    }

    // Configurar interacciones FAQ
    setupFAQInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('faq-question')) {
                const answer = e.target.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                
                // Cerrar todas las respuestas
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.style.display = 'none';
                });
                
                // Abrir la seleccionada si no estaba abierta
                if (!isOpen) {
                    answer.style.display = 'block';
                }
            }
        });
    }

    // Configurar eventos globales
    setupGlobalEvents() {
        // Funciones globales
        window.selectPlan = (planId) => this.selectPlan(planId);
        window.addToComparison = (planId) => this.addToComparison(planId);
        window.removeFromComparison = (planId) => this.removeFromComparison(planId);
        window.toggleComparison = (planId) => this.toggleComparison(planId);
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModals();
            }
        });

        // Actualizar comparación en cambios
        document.addEventListener('comparison:updated', () => {
            this.updateComparisonUI();
        });
    }

    // Actualizar estado de checkboxes de comparación
    updateComparisonCheckboxes() {
        console.log('🔄 Actualizando checkboxes de comparación...');
        const checkboxes = document.querySelectorAll('.compare-checkbox');
        
        checkboxes.forEach(checkbox => {
            const productId = checkbox.dataset.productId;
            const shouldBeChecked = this.comparisonStore.has(productId);
            
            if (checkbox.checked !== shouldBeChecked) {
                checkbox.checked = shouldBeChecked;
                console.log(`✅ Checkbox ${productId}: ${shouldBeChecked}`);
            }
        });
    }

    // Actualizar estado de checkboxes de comparación
    updateComparisonCheckboxes() {
        console.log('🔄 Actualizando checkboxes de comparación...');
        const checkboxes = document.querySelectorAll('.compare-checkbox');
        
        checkboxes.forEach(checkbox => {
            const productId = checkbox.dataset.productId;
            const shouldBeChecked = this.comparisonStore.has(productId);
            
            if (checkbox.checked !== shouldBeChecked) {
                checkbox.checked = shouldBeChecked;
                console.log(`✅ Checkbox ${productId}: ${shouldBeChecked}`);
            }
        });
    }

    // Actualizar estado de checkboxes de comparación
    updateComparisonCheckboxes() {
        console.log('🔄 Actualizando checkboxes de comparación...');
        const checkboxes = document.querySelectorAll('.compare-checkbox');
        
        checkboxes.forEach(checkbox => {
            const productId = checkbox.dataset.productId;
            const shouldBeChecked = this.comparisonStore.has(productId);
            
            if (checkbox.checked !== shouldBeChecked) {
                checkbox.checked = shouldBeChecked;
                console.log(`✅ Checkbox ${productId}: ${shouldBeChecked}`);
            }
        });
    }

    // Configurar stores globales
    setupGlobalStores() {
        window.comparisonStore = this.comparisonStore;
        window.favoritesStore = this.favoritesStore;
        window.app = this;
    }

    // Seleccionar plan
    selectPlan(planId) {
        const product = this.products.find(p => p.id === planId);
        if (product) {
            // Redirigir a página del operador
            const operatorUrls = {
                movistar: 'https://www.movistar.es',
                vodafone: 'https://www.vodafone.es',
                orange: 'https://www.orange.es'
            };
            
            const url = operatorUrls[product.operator];
            if (url) {
                window.open(url, '_blank');
            }
        }
    }

    // Agregar a comparación
    addToComparison(planId) {
        if (this.comparisonStore.size >= 3) {
            alert('Máximo 3 planes para comparar');
            return;
        }

        this.comparisonStore.add(planId);
        this.updateComparisonUI();
        
        document.dispatchEvent(new CustomEvent('comparison:updated'));
    }

    // Remover de comparación
    removeFromComparison(planId) {
        this.comparisonStore.delete(planId);
        this.updateComparisonUI();
        
        document.dispatchEvent(new CustomEvent('comparison:updated'));
    }

    // Toggle comparación (nuevo método)
    toggleComparison(productId) {
        console.log(`🔄 Toggle comparación para producto: ${productId}`);
        console.log(`📊 Estado ANTES del toggle:`, Array.from(this.comparisonStore), `Size: ${this.comparisonStore.size}`);
        
        const checkbox = document.getElementById(`compare-${productId}`);
        
        if (checkbox) {
            console.log(`📋 Checkbox encontrado. Marcado: ${checkbox.checked}`);
            
            // Usar el estado del store para determinar la acción, no el checkbox
            const estaEnStore = this.comparisonStore.has(productId);
            console.log(`🔍 ¿Producto está en store?: ${estaEnStore}`);
            console.log(`🔍 ¿Checkbox marcado?: ${checkbox.checked}`);
            
            if (checkbox.checked && !estaEnStore) {
                console.log(`➕ AÑADIENDO producto ${productId} (checked=true, no está en store)`);
                if (this.comparisonStore.size >= 3) {
                    alert('Máximo 3 productos para comparar');
                    checkbox.checked = false;
                    return;
                }
                
                this.comparisonStore.add(productId);
                console.log(`✅ Producto ${productId} añadido. Size después: ${this.comparisonStore.size}`);
                
            } else if (!checkbox.checked && estaEnStore) {
                console.log(`➖ ELIMINANDO producto ${productId} (checked=false, está en store)`);
                this.comparisonStore.delete(productId);
                console.log(`❌ Producto ${productId} eliminado. Size después: ${this.comparisonStore.size}`);
                
            } else if (checkbox.checked && estaEnStore) {
                console.log(`⚠️ Producto ${productId} ya está en store y checkbox está marcado - no hacer nada`);
                
            } else {
                console.log(`⚠️ Producto ${productId} no está en store y checkbox no marcado - no hacer nada`);
            }
        } else {
            console.error(`❌ Checkbox no encontrado para producto: ${productId}`);
        }

        console.log(`📊 Estado FINAL del store:`, Array.from(this.comparisonStore), `Size: ${this.comparisonStore.size}`);
        
        this.updateComparisonUI();
        document.dispatchEvent(new CustomEvent('comparison:updated'));
    }

    // Método directo para comparación (evita problemas de timing)
    toggleComparisonDirect(productId, shouldAdd) {
        console.log(`🔄 Toggle DIRECTO para producto: ${productId}, acción: ${shouldAdd ? 'AÑADIR' : 'ELIMINAR'}`);
        console.log(`📊 Estado ANTES:`, Array.from(this.comparisonStore), `Size: ${this.comparisonStore.size}`);
        
        if (shouldAdd) {
            if (this.comparisonStore.size >= 3) {
                alert('Máximo 3 productos para comparar');
                // Desmarcar checkbox
                const checkbox = document.getElementById(`compare-${productId}`);
                if (checkbox) checkbox.checked = false;
                return;
            }
            
            this.comparisonStore.add(productId);
            console.log(`✅ Producto ${productId} añadido. Size después: ${this.comparisonStore.size}`);
        } else {
            this.comparisonStore.delete(productId);
            console.log(`❌ Producto ${productId} eliminado. Size después: ${this.comparisonStore.size}`);
        }
        
        console.log(`📊 Estado FINAL:`, Array.from(this.comparisonStore), `Size: ${this.comparisonStore.size}`);
        
        this.updateComparisonUI();
        document.dispatchEvent(new CustomEvent('comparison:updated'));
    }

    // Limpiar comparación
    clearComparison() {
        console.log('🧹 Limpiando comparación...');
        this.comparisonStore.clear();
        
        // Actualizar checkboxes de productos
        this.updateComparisonCheckboxes();
        
        // Actualizar UI de comparación
        this.updateComparisonUI();
        
        console.log('✅ Comparación limpiada completamente');
        
        // Si estamos en página de comparación, re-renderizar
        if (this.navigation.getCurrentPage() === 'compare') {
            this.renderComparisonTable();
        }
        
        document.dispatchEvent(new CustomEvent('comparison:updated'));
    }

    // Actualizar UI de comparación
    updateComparisonUI() {
        // Forzar un pequeño delay para asegurar que el store esté actualizado
        setTimeout(() => {
            const count = this.comparisonStore.size;
            console.log(`🔄 Actualizando UI de comparación. Productos: ${count}`);
            console.log(`📋 Productos en store:`, Array.from(this.comparisonStore));
            
            // Actualizar botón flotante
            const floatingBtn = document.querySelector('.compare-floating-btn');
            if (floatingBtn) {
                floatingBtn.textContent = `Comparar (${count})`;
                floatingBtn.style.display = count > 0 ? 'block' : 'none';
                console.log(`📱 Botón flotante actualizado: ${floatingBtn.textContent}, visible: ${count > 0}`);
            } else {
                console.error(`❌ Botón flotante no encontrado`);
            }

            // Actualizar navegación con badge
            const compareNavItem = document.querySelector('[data-page="compare"]');
            if (compareNavItem) {
                // Remover badge existente
                const existingBadge = compareNavItem.querySelector('.nav-badge');
                if (existingBadge) {
                    existingBadge.remove();
                    console.log(`🗑️ Badge anterior removido`);
                }
                
                // Añadir nuevo badge si hay productos
                if (count > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'nav-badge';
                    badge.textContent = count;
                    compareNavItem.appendChild(badge);
                    console.log(`🏷️ Badge añadido al menú: ${count}`);
                } else {
                    console.log(`🚫 No se añade badge porque count = ${count}`);
                }
            } else {
                console.error(`❌ Elemento de navegación 'compare' no encontrado`);
            }
        }, 10);
    }

    // Mostrar loading
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    // Ocultar loading
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.display = 'none';
            }, this.config.animationDuration);
        }
    }

    // Mostrar error
    showError(message) {
        console.error(message);
        // Implementar modal de error si es necesario
    }

    // Ocultar modales
    hideModals() {
        // Implementar si hay modales
    }

    // Obtener productos
    getProducts() {
        return this.products;
    }

    // Obtener productos filtrados
    getFilteredProducts() {
        return this.filteredProducts;
    }

    // Actualizar estadísticas del hero
    updateHeroStats(totalProducts) {
        const plansCountElement = document.getElementById('plans-count');
        if (plansCountElement) {
            // Calcular decena inmediatamente menor
            const lowerDecade = Math.floor(totalProducts / 10) * 10;
            plansCountElement.textContent = `${lowerDecade}+`;
            console.log(`📊 Actualizando estadísticas: ${totalProducts} planes → ${lowerDecade}+`);
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando aplicación...');
    
    window.app = new MobilePlansApp();
    await window.app.initialize();
});


// SISTEMA DE FILTROS MEJORADO - MINIMALISTA Y FUNCIONAL

class FilterSystemNew {
    constructor() {
        this.filters = {
            operator: 'all',
            planType: 'all',
            priceRange: 'all',
            dataRange: 'all',
            features: []
        };
        
        this.products = [];
        this.filteredProducts = [];
        this.onFilterChange = null;
        this.iconSet = this.initializeIconSet();
    }

    // Iconos para filtros
    initializeIconSet() {
        return {
            operator: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>`,
            
            price: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>`,
            
            data: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
            </svg>`,
            
            planType: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
            </svg>`,
            
            features: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>`,
            
            filter: `<svg class="filter-option-icon" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
            </svg>`
        };
    }

    // Crear el HTML del sistema de filtros
    createFilterHTML() {
        return `
            <div class="filter-container">
                <div class="filter-title">
                    ${this.iconSet.filter}
                    Filtrar Planes
                </div>
                
                <div class="filter-groups">
                    <!-- Operadores -->
                    <div class="filter-group">
                        <div class="filter-group-title">Operador</div>
                        <div class="filter-option active" data-filter="operator" data-value="all">
                            ${this.iconSet.operator}
                            <span class="filter-option-text">Todos</span>
                        </div>
                        <div class="filter-option" data-filter="operator" data-value="movistar">
                            ${this.iconSet.operator}
                            <span class="filter-option-text">Movistar</span>
                        </div>
                        <div class="filter-option" data-filter="operator" data-value="vodafone">
                            ${this.iconSet.operator}
                            <span class="filter-option-text">Vodafone</span>
                        </div>
                        <div class="filter-option" data-filter="operator" data-value="orange">
                            ${this.iconSet.operator}
                            <span class="filter-option-text">Orange</span>
                        </div>
                    </div>

                    <!-- Tipo de Plan -->
                    <div class="filter-group">
                        <div class="filter-group-title">Tipo de Plan</div>
                        <div class="filter-option active" data-filter="planType" data-value="all">
                            ${this.iconSet.planType}
                            <span class="filter-option-text">Todos</span>
                        </div>
                        <div class="filter-option" data-filter="planType" data-value="individual">
                            ${this.iconSet.planType}
                            <span class="filter-option-text">Individual</span>
                        </div>
                        <div class="filter-option" data-filter="planType" data-value="familiar">
                            ${this.iconSet.planType}
                            <span class="filter-option-text">Familiar</span>
                        </div>
                    </div>

                    <!-- Rango de Precio -->
                    <div class="filter-group">
                        <div class="filter-group-title">Precio</div>
                        <div class="price-slider-container">
                            <div class="slider-values">
                                <span id="price-min-value">0</span>€ - <span id="price-max-value">100</span>€
                            </div>
                            <div class="double-slider">
                                <input type="range" id="price-min" class="slider-range" min="0" max="100" value="0" step="1">
                                <input type="range" id="price-max" class="slider-range" min="0" max="100" value="100" step="1">
                                <div class="slider-track"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Datos -->
                    <div class="filter-group">
                        <div class="filter-group-title">Datos</div>
                        <div class="data-slider-container">
                            <div class="slider-values">
                                <span id="data-min-value">0</span>GB - <span id="data-max-value">100</span>GB
                            </div>
                            <div class="double-slider">
                                <input type="range" id="data-min" class="slider-range" min="0" max="100" value="0" step="1">
                                <input type="range" id="data-max" class="slider-range" min="0" max="100" value="100" step="1">
                                <div class="slider-track"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="filter-actions" style="margin-top: 1rem; display: flex; justify-content: center;">
                    <button class="filter-clear-btn" onclick="window.filterSystem.clearFilters()">
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        `;
    }

    // Inicializar el sistema de filtros
    initialize(container, products = []) {
        this.products = products;
        this.filteredProducts = [...products];
        
        // Calcular rangos de precio y datos
        this.calculateRanges();
        
        if (container) {
            container.innerHTML = this.createFilterHTML();
            this.attachEvents();
            this.initializeSliders();
        }
    }

    // Calcular rangos dinámicos
    calculateRanges() {
        if (this.products.length === 0) return;
        
        // Rango de precios
        const prices = this.products.map(p => p.price).filter(p => p > 0);
        this.priceRange = {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
        
        // Rango de datos (convertir unlimited a número alto)
        const dataAmounts = this.products.map(p => {
            if (p.data === 'unlimited' || p.data === 'ilimitado') return 999;
            return parseInt(p.data) || 0;
        }).filter(d => d > 0);
        
        this.dataRange = {
            min: Math.min(...dataAmounts),
            max: Math.max(...dataAmounts.filter(d => d < 999)) // Excluir unlimited
        };
        
        console.log('📊 Rangos calculados:', { 
            precio: this.priceRange, 
            datos: this.dataRange 
        });
    }

    // Inicializar sliders dobles
    initializeSliders() {
        // Configurar sliders de precio
        this.setupPriceSliders();
        this.setupDataSliders();
    }

    // Configurar sliders de precio
    setupPriceSliders() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinValue = document.getElementById('price-min-value');
        const priceMaxValue = document.getElementById('price-max-value');
        
        if (priceMin && priceMax && this.priceRange) {
            // Configurar rangos
            priceMin.min = priceMax.min = this.priceRange.min;
            priceMin.max = priceMax.max = this.priceRange.max;
            priceMin.value = this.priceRange.min;
            priceMax.value = this.priceRange.max;
            
            // Actualizar valores mostrados
            priceMinValue.textContent = this.priceRange.min;
            priceMaxValue.textContent = this.priceRange.max;
            
            // Eventos
            priceMin.addEventListener('input', () => this.updatePriceSlider());
            priceMax.addEventListener('input', () => this.updatePriceSlider());
        }
    }

    // Configurar sliders de datos
    setupDataSliders() {
        const dataMin = document.getElementById('data-min');
        const dataMax = document.getElementById('data-max');
        const dataMinValue = document.getElementById('data-min-value');
        const dataMaxValue = document.getElementById('data-max-value');
        
        if (dataMin && dataMax && this.dataRange) {
            // Configurar rangos
            dataMin.min = dataMax.min = this.dataRange.min;
            dataMin.max = dataMax.max = this.dataRange.max;
            dataMin.value = this.dataRange.min;
            dataMax.value = this.dataRange.max;
            
            // Actualizar valores mostrados
            dataMinValue.textContent = this.dataRange.min;
            dataMaxValue.textContent = this.dataRange.max;
            
            // Eventos
            dataMin.addEventListener('input', () => this.updateDataSlider());
            dataMax.addEventListener('input', () => this.updateDataSlider());
        }
    }

    // Actualizar slider de precio
    updatePriceSlider() {
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinValue = document.getElementById('price-min-value');
        const priceMaxValue = document.getElementById('price-max-value');
        
        let minVal = parseInt(priceMin.value);
        let maxVal = parseInt(priceMax.value);
        
        // Evitar que se crucen
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            priceMin.value = minVal;
            priceMax.value = maxVal;
        }
        
        // Actualizar valores mostrados
        priceMinValue.textContent = minVal;
        priceMaxValue.textContent = maxVal;
        
        // Aplicar filtros
        this.filters.priceMin = minVal;
        this.filters.priceMax = maxVal;
        this.applyFilters();
    }

    // Actualizar slider de datos
    updateDataSlider() {
        const dataMin = document.getElementById('data-min');
        const dataMax = document.getElementById('data-max');
        const dataMinValue = document.getElementById('data-min-value');
        const dataMaxValue = document.getElementById('data-max-value');
        
        let minVal = parseInt(dataMin.value);
        let maxVal = parseInt(dataMax.value);
        
        // Evitar que se crucen
        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            dataMin.value = minVal;
            dataMax.value = maxVal;
        }
        
        // Actualizar valores mostrados
        dataMinValue.textContent = minVal;
        dataMaxValue.textContent = maxVal;
        
        // Aplicar filtros
        this.filters.dataMin = minVal;
        this.filters.dataMax = maxVal;
        this.applyFilters();
    }

    // Adjuntar eventos
    attachEvents() {
        // Eventos para opciones de filtro
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-option')) {
                this.handleFilterOptionClick(e.target.closest('.filter-option'));
            }
        });

        // Búsqueda en tiempo real
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    // Manejar clic en opción de filtro
    handleFilterOptionClick(option) {
        const filterType = option.dataset.filter;
        const filterValue = option.dataset.value;
        
        // Quitar active de otros elementos del mismo grupo
        const group = option.closest('.filter-group');
        group.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Activar la opción seleccionada
        option.classList.add('active');
        
        // Actualizar filtros
        this.filters[filterType] = filterValue;
        
        // Aplicar filtros automáticamente
        this.applyFilters();
    }

    // Aplicar filtros
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            return this.matchesFilters(product);
        });

        // Notificar cambio
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredProducts);
        }

        // Actualizar contador
        this.updateResultsCounter();
    }

    // Verificar si un producto coincide con los filtros
    matchesFilters(product) {
        // Filtro de operador
        if (this.filters.operator !== 'all' && product.operator !== this.filters.operator) {
            return false;
        }

        // Filtro de tipo de plan
        if (this.filters.planType !== 'all' && product.planType !== this.filters.planType) {
            return false;
        }

        // Filtro de precio por slider
        if (product.price < this.filters.priceMin || product.price > this.filters.priceMax) {
            return false;
        }

        // Filtro de datos por slider
        const productData = this.getNumericData(product.data);
        if (productData < this.filters.dataMin || productData > this.filters.dataMax) {
            return false;
        }

        return true;
    }

    // Convertir datos a número para comparación
    getNumericData(data) {
        if (data === 'unlimited' || data === 'ilimitado') {
            return 999; // Valor alto para unlimited
        }
        return parseInt(data) || 0;
    }

    // Verificar rango de precio
    matchesPriceRange(price, range) {
        switch (range) {
            case '0-20': return price < 20;
            case '20-40': return price >= 20 && price <= 40;
            case '40-60': return price >= 40 && price <= 60;
            case '60+': return price > 60;
            default: return true;
        }
    }

    // Verificar rango de datos
    matchesDataRange(data, range) {
        if (data === 'unlimited' || data === 'ilimitado') {
            return range === 'unlimited';
        }

        const dataAmount = parseInt(data);
        switch (range) {
            case '0-5': return dataAmount <= 5;
            case '5-20': return dataAmount > 5 && dataAmount <= 20;
            case '20-50': return dataAmount > 20 && dataAmount <= 50;
            case 'unlimited': return false;
            default: return true;
        }
    }

    // Búsqueda de texto
    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.applyFilters();
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredProducts = this.filteredProducts.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.operator.toLowerCase().includes(term) ||
            (product.features && product.features.some(feature => 
                feature.toLowerCase().includes(term)
            ))
        );

        if (this.onFilterChange) {
            this.onFilterChange(this.filteredProducts);
        }

        this.updateResultsCounter();
    }

    // Limpiar filtros
    clearFilters() {
        this.filters = {
            operator: 'all',
            planType: 'all',
            priceMin: this.priceRange ? this.priceRange.min : 0,
            priceMax: this.priceRange ? this.priceRange.max : 100,
            dataMin: this.dataRange ? this.dataRange.min : 0,
            dataMax: this.dataRange ? this.dataRange.max : 100,
            features: []
        };

        // Resetear UI de opciones
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });

        document.querySelectorAll('.filter-option[data-value="all"]').forEach(option => {
            option.classList.add('active');
        });

        // Resetear sliders
        this.resetSliders();

        // Limpiar búsqueda
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        this.applyFilters();
    }

    // Resetear sliders a valores iniciales
    resetSliders() {
        // Resetear sliders de precio
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceMinValue = document.getElementById('price-min-value');
        const priceMaxValue = document.getElementById('price-max-value');
        
        if (priceMin && priceMax && this.priceRange) {
            priceMin.value = this.priceRange.min;
            priceMax.value = this.priceRange.max;
            priceMinValue.textContent = this.priceRange.min;
            priceMaxValue.textContent = this.priceRange.max;
        }

        // Resetear sliders de datos
        const dataMin = document.getElementById('data-min');
        const dataMax = document.getElementById('data-max');
        const dataMinValue = document.getElementById('data-min-value');
        const dataMaxValue = document.getElementById('data-max-value');
        
        if (dataMin && dataMax && this.dataRange) {
            dataMin.value = this.dataRange.min;
            dataMax.value = this.dataRange.max;
            dataMinValue.textContent = this.dataRange.min;
            dataMaxValue.textContent = this.dataRange.max;
        }
    }

    // Actualizar contador de resultados
    updateResultsCounter() {
        const counter = document.querySelector('.results-counter');
        if (counter) {
            const count = this.filteredProducts.length;
            counter.textContent = `${count} plan${count !== 1 ? 'es' : ''} encontrado${count !== 1 ? 's' : ''}`;
        }
    }

    // Obtener productos filtrados
    getFilteredProducts() {
        return this.filteredProducts;
    }

    // Establecer callback para cambios
    setOnFilterChange(callback) {
        this.onFilterChange = callback;
    }

    // Actualizar productos
    updateProducts(products) {
        this.products = products;
        this.applyFilters();
    }

    // Obtener filtros activos
    getActiveFilters() {
        return { ...this.filters };
    }

    // Establecer filtros programáticamente
    setFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.updateFilterUI();
        this.applyFilters();
    }

    // Actualizar UI de filtros
    updateFilterUI() {
        Object.entries(this.filters).forEach(([filterType, value]) => {
            // Resetear grupo
            const group = document.querySelector(`[data-filter="${filterType}"]`)?.closest('.filter-group');
            if (group) {
                group.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });

                // Activar opción seleccionada
                const option = group.querySelector(`[data-value="${value}"]`);
                if (option) {
                    option.classList.add('active');
                }
            }
        });
    }
}

// Exportar para uso global
window.FilterSystemNew = FilterSystemNew;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.filterSystem = new FilterSystemNew();
});
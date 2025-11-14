// ===== STORE DE FILTROS =====

export function createFilterStore() {
  const { reactive, computed, watch } = Vue;
  
  const state = reactive({
    operators: [],
    maxPrice: 100,
    dataType: 'all',
    planType: 'all',
    searchQuery: '',
    sortBy: 'price',
    sortOrder: 'asc',
    showOnlyOffers: false,
    showOnlyPopular: false,
    activeFiltersCount: 0
  });

  // Configuración de filtros
  const config = {
    priceRange: { min: 0, max: 100, step: 5 },
    dataTypes: [
      { value: 'all', label: 'Todos', icon: '📱' },
      { value: 'low', label: 'Hasta 20GB', icon: '📱' },
      { value: 'medium', label: '20-50GB', icon: '📲' },
      { value: 'high', label: 'Más de 50GB', icon: '🚀' },
      { value: 'unlimited', label: 'Ilimitados', icon: '♾️' }
    ],
    planTypes: [
      { value: 'all', label: 'Todos', icon: '📋' },
      { value: 'individual', label: 'Individual', icon: '👤' },
      { value: 'familiar', label: 'Familiar', icon: '👨‍👩‍👧‍👦' }
    ],
    operators: [
      { value: 'movistar', label: 'Movistar', color: '#00579A' },
      { value: 'vodafone', label: 'Vodafone', color: '#E60000' },
      { value: 'orange', label: 'Orange', color: '#FF7900' }
    ],
    sortOptions: [
      { value: 'price', label: 'Precio', icon: '💰' },
      { value: 'data', label: 'Datos', icon: '📊' },
      { value: 'name', label: 'Nombre', icon: '🔤' },
      { value: 'popularity', label: 'Popularidad', icon: '⭐' }
    ]
  };

  // Computed para contar filtros activos
  const activeFiltersCount = computed(() => {
    let count = 0;
    
    if (state.operators.length > 0) count++;
    if (state.maxPrice < 100) count++;
    if (state.dataType !== 'all') count++;
    if (state.planType !== 'all') count++;
    if (state.searchQuery.trim()) count++;
    if (state.showOnlyOffers) count++;
    if (state.showOnlyPopular) count++;
    
    return count;
  });

  // Computed para obtener filtros como query string
  const asQueryString = computed(() => {
    const params = new URLSearchParams();
    
    if (state.operators.length > 0) {
      params.set('operators', state.operators.join(','));
    }
    if (state.maxPrice < 100) {
      params.set('maxPrice', state.maxPrice.toString());
    }
    if (state.dataType !== 'all') {
      params.set('dataType', state.dataType);
    }
    if (state.planType !== 'all') {
      params.set('planType', state.planType);
    }
    if (state.searchQuery.trim()) {
      params.set('search', state.searchQuery.trim());
    }
    if (state.sortBy !== 'price') {
      params.set('sortBy', state.sortBy);
    }
    if (state.sortOrder !== 'asc') {
      params.set('sortOrder', state.sortOrder);
    }
    if (state.showOnlyOffers) {
      params.set('offers', 'true');
    }
    if (state.showOnlyPopular) {
      params.set('popular', 'true');
    }
    
    return params.toString();
  });

  // Computed para el estado de filtros
  const summary = computed(() => {
    const activeTags = [];
    
    if (state.operators.length > 0) {
      state.operators.forEach(op => {
        const operator = config.operators.find(o => o.value === op);
        if (operator) {
          activeTags.push({
            type: 'operator',
            value: op,
            label: operator.label,
            color: operator.color
          });
        }
      });
    }
    
    if (state.maxPrice < 100) {
      activeTags.push({
        type: 'price',
        value: state.maxPrice,
        label: `Hasta ${state.maxPrice}€`,
        color: '#6b7280'
      });
    }
    
    if (state.dataType !== 'all') {
      const dataType = config.dataTypes.find(d => d.value === state.dataType);
      if (dataType) {
        activeTags.push({
          type: 'dataType',
          value: state.dataType,
          label: dataType.label,
          color: '#059669'
        });
      }
    }
    
    if (state.planType !== 'all') {
      const planType = config.planTypes.find(p => p.value === state.planType);
      if (planType) {
        activeTags.push({
          type: 'planType',
          value: state.planType,
          label: planType.label,
          color: '#7c3aed'
        });
      }
    }
    
    if (state.searchQuery.trim()) {
      activeTags.push({
        type: 'search',
        value: state.searchQuery,
        label: `"${state.searchQuery}"`,
        color: '#dc2626'
      });
    }
    
    if (state.showOnlyOffers) {
      activeTags.push({
        type: 'offers',
        value: true,
        label: 'Solo ofertas',
        color: '#ea580c'
      });
    }
    
    if (state.showOnlyPopular) {
      activeTags.push({
        type: 'popular',
        value: true,
        label: 'Solo populares',
        color: '#fbbf24'
      });
    }
    
    return {
      count: activeTags.length,
      tags: activeTags,
      hasFilters: activeTags.length > 0
    };
  });

  // Función para aplicar filtros a una lista de productos
  function applyFilters(products) {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = [...products];
    
    // Filtro por operadores
    if (state.operators.length > 0) {
      filtered = filtered.filter(product => 
        state.operators.includes(product.operator)
      );
    }
    
    // Filtro por precio
    if (state.maxPrice < 100) {
      filtered = filtered.filter(product => {
        const priceWithTax = product.price * 1.21;
        return priceWithTax <= state.maxPrice;
      });
    }
    
    // Filtro por tipo de datos
    if (state.dataType !== 'all') {
      filtered = filtered.filter(product => {
        const dataText = product.data.toLowerCase();
        
        switch (state.dataType) {
          case 'unlimited':
            return dataText.includes('ilimitado');
          case 'high':
            return !dataText.includes('ilimitado') && 
                   (dataText.includes('gb') && parseInt(dataText) > 50);
          case 'medium':
            return dataText.includes('gb') && 
                   parseInt(dataText) >= 20 && parseInt(dataText) <= 50;
          case 'low':
            return dataText.includes('gb') && parseInt(dataText) < 20;
          default:
            return true;
        }
      });
    }
    
    // Filtro por tipo de plan
    if (state.planType !== 'all') {
      filtered = filtered.filter(product => product.type === state.planType);
    }
    
    // Filtro por búsqueda
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.data.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.operator.toLowerCase().includes(query)
      );
    }
    
    // Filtro solo ofertas
    if (state.showOnlyOffers) {
      filtered = filtered.filter(product => product.hasOffer);
    }
    
    // Filtro solo populares
    if (state.showOnlyPopular) {
      filtered = filtered.filter(product => product.isPopular);
    }
    
    // **APLICAR ORDENAMIENTO SIEMPRE POR PRECIO ASCENDENTE**
    filtered.sort((a, b) => {
      // Forzar ordenación por precio de menor a mayor
      return a.price - b.price;
    });
    
    return filtered;
  }

  // Acciones
  function setOperators(operators) {
    state.operators = Array.isArray(operators) ? operators : [operators];
  }

  function toggleOperator(operator) {
    const index = state.operators.indexOf(operator);
    if (index > -1) {
      state.operators.splice(index, 1);
    } else {
      state.operators.push(operator);
    }
  }

  function setMaxPrice(price) {
    state.maxPrice = Math.max(0, Math.min(100, price));
  }

  function setDataType(type) {
    state.dataType = type;
  }

  function setPlanType(type) {
    state.planType = type;
  }

  function setSearchQuery(query) {
    state.searchQuery = query || '';
  }

  function setSorting(sortBy, sortOrder = 'asc') {
    state.sortBy = sortBy;
    state.sortOrder = sortOrder;
  }

  function toggleOffers() {
    state.showOnlyOffers = !state.showOnlyOffers;
  }

  function togglePopular() {
    state.showOnlyPopular = !state.showOnlyPopular;
  }

  function removeFilter(filterType, value = null) {
    switch (filterType) {
      case 'operator':
        if (value) {
          toggleOperator(value);
        } else {
          state.operators = [];
        }
        break;
      case 'price':
        state.maxPrice = 100;
        break;
      case 'dataType':
        state.dataType = 'all';
        break;
      case 'planType':
        state.planType = 'all';
        break;
      case 'search':
        state.searchQuery = '';
        break;
      case 'offers':
        state.showOnlyOffers = false;
        break;
      case 'popular':
        state.showOnlyPopular = false;
        break;
    }
  }

  function clearAllFilters() {
    state.operators = [];
    state.maxPrice = 100;
    state.dataType = 'all';
    state.planType = 'all';
    state.searchQuery = '';
    state.showOnlyOffers = false;
    state.showOnlyPopular = false;
  }

  function loadFromQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    
    // Cargar operadores
    const operators = params.get('operators');
    if (operators) {
      state.operators = operators.split(',').filter(op => 
        config.operators.some(o => o.value === op)
      );
    }
    
    // Cargar precio máximo
    const maxPrice = params.get('maxPrice');
    if (maxPrice) {
      state.maxPrice = Math.max(0, Math.min(100, parseInt(maxPrice) || 100));
    }
    
    // Cargar tipo de datos
    const dataType = params.get('dataType');
    if (dataType && config.dataTypes.some(d => d.value === dataType)) {
      state.dataType = dataType;
    }
    
    // Cargar tipo de plan
    const planType = params.get('planType');
    if (planType && config.planTypes.some(p => p.value === planType)) {
      state.planType = planType;
    }
    
    // Cargar búsqueda
    const search = params.get('search');
    if (search) {
      state.searchQuery = search;
    }
    
    // Cargar ordenamiento
    const sortBy = params.get('sortBy');
    if (sortBy && config.sortOptions.some(s => s.value === sortBy)) {
      state.sortBy = sortBy;
    }
    
    const sortOrder = params.get('sortOrder');
    if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
      state.sortOrder = sortOrder;
    }
    
    // Cargar flags
    state.showOnlyOffers = params.get('offers') === 'true';
    state.showOnlyPopular = params.get('popular') === 'true';
  }

  function saveToLocalStorage() {
    try {
      const filtersData = {
        operators: state.operators,
        maxPrice: state.maxPrice,
        dataType: state.dataType,
        planType: state.planType,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        showOnlyOffers: state.showOnlyOffers,
        showOnlyPopular: state.showOnlyPopular
      };
      
      localStorage.setItem('mobile-plans-filters', JSON.stringify(filtersData));
    } catch (error) {
      console.warn('No se pudieron guardar los filtros:', error);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('mobile-plans-filters');
      if (saved) {
        const filtersData = JSON.parse(saved);
        
        if (Array.isArray(filtersData.operators)) {
          state.operators = filtersData.operators;
        }
        if (typeof filtersData.maxPrice === 'number') {
          state.maxPrice = filtersData.maxPrice;
        }
        if (typeof filtersData.dataType === 'string') {
          state.dataType = filtersData.dataType;
        }
        if (typeof filtersData.planType === 'string') {
          state.planType = filtersData.planType;
        }
        if (typeof filtersData.sortBy === 'string') {
          state.sortBy = filtersData.sortBy;
        }
        if (typeof filtersData.sortOrder === 'string') {
          state.sortOrder = filtersData.sortOrder;
        }
        if (typeof filtersData.showOnlyOffers === 'boolean') {
          state.showOnlyOffers = filtersData.showOnlyOffers;
        }
        if (typeof filtersData.showOnlyPopular === 'boolean') {
          state.showOnlyPopular = filtersData.showOnlyPopular;
        }
      }
    } catch (error) {
      console.warn('No se pudieron cargar los filtros guardados:', error);
    }
  }

  function getPresets() {
    return {
      economicos: {
        name: 'Planes Económicos',
        description: 'Los planes más baratos',
        filters: {
          maxPrice: 30,
          sortBy: 'price',
          sortOrder: 'asc'
        }
      },
      familiares: {
        name: 'Para Familias',
        description: 'Planes familiares con muchos datos',
        filters: {
          planType: 'familiar',
          dataType: 'high',
          sortBy: 'data',
          sortOrder: 'desc'
        }
      },
      populares: {
        name: 'Más Populares',
        description: 'Los planes más elegidos',
        filters: {
          showOnlyPopular: true,
          sortBy: 'popularity',
          sortOrder: 'desc'
        }
      },
      ofertas: {
        name: 'Ofertas Especiales',
        description: 'Planes con descuentos',
        filters: {
          showOnlyOffers: true,
          sortBy: 'price',
          sortOrder: 'asc'
        }
      }
    };
  }

  function applyPreset(presetName) {
    const presets = getPresets();
    const preset = presets[presetName];
    
    if (!preset) return false;
    
    // Limpiar filtros actuales
    clearAllFilters();
    
    // Aplicar filtros del preset
    const filters = preset.filters;
    
    if (filters.operators) state.operators = filters.operators;
    if (filters.maxPrice) state.maxPrice = filters.maxPrice;
    if (filters.dataType) state.dataType = filters.dataType;
    if (filters.planType) state.planType = filters.planType;
    if (filters.sortBy) state.sortBy = filters.sortBy;
    if (filters.sortOrder) state.sortOrder = filters.sortOrder;
    if (filters.showOnlyOffers) state.showOnlyOffers = filters.showOnlyOffers;
    if (filters.showOnlyPopular) state.showOnlyPopular = filters.showOnlyPopular;
    
    return true;
  }

  // Watcher para guardar automáticamente
  watch(() => ({ ...state }), () => {
    saveToLocalStorage();
  }, { deep: true });

  // Retornar API pública
  return {
    // Estado
    state,
    config,
    
    // Computed
    activeFiltersCount,
    asQueryString,
    summary,
    
    // Acciones
    applyFilters,
    setOperators,
    toggleOperator,
    setMaxPrice,
    setDataType,
    setPlanType,
    setSearchQuery,
    setSorting,
    toggleOffers,
    togglePopular,
    removeFilter,
    clearAllFilters,
    loadFromQueryString,
    saveToLocalStorage,
    loadFromLocalStorage,
    getPresets,
    applyPreset
  };
}
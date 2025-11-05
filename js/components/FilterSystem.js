// ===== COMPONENTE SISTEMA DE FILTROS =====

export default {
  name: 'FilterSystem',
  props: {
    filters: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      default: () => []
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:filters', 'clear-filters', 'apply-preset'],
  
  data() {
    return {
      localFilters: { ...this.filters },
      showPresets: false,
      isExpanded: !this.isCollapsed,
      searchDebounceTimer: null
    };
  },
  
  computed: {
    operatorOptions() {
      return [
        { value: 'movistar', label: 'Movistar', color: '#00579A' },
        { value: 'vodafone', label: 'Vodafone', color: '#E60000' },
        { value: 'orange', label: 'Orange', color: '#FF7900' }
      ];
    },
    
    dataTypeOptions() {
      return [
        { value: 'all', label: 'Todos los datos', icon: '📱' },
        { value: 'low', label: 'Hasta 20GB', icon: '📱' },
        { value: 'medium', label: '20GB - 50GB', icon: '📲' },
        { value: 'high', label: 'Más de 50GB', icon: '🚀' },
        { value: 'unlimited', label: 'Ilimitados', icon: '♾️' }
      ];
    },
    
    planTypeOptions() {
      return [
        { value: 'all', label: 'Todos los tipos', icon: '📋' },
        { value: 'individual', label: 'Individual', icon: '👤' },
        { value: 'familiar', label: 'Familiar', icon: '👨‍👩‍👧‍👦' }
      ];
    },
    
    sortOptions() {
      return [
        { value: 'price', label: 'Precio', icon: '💰' },
        { value: 'data', label: 'Cantidad de datos', icon: '📊' },
        { value: 'name', label: 'Nombre del plan', icon: '🔤' },
        { value: 'popularity', label: 'Popularidad', icon: '⭐' }
      ];
    },
    
    activeFiltersCount() {
      let count = 0;
      
      if (this.localFilters.operators && this.localFilters.operators.length > 0) count++;
      if (this.localFilters.maxPrice < 100) count++;
      if (this.localFilters.dataType !== 'all') count++;
      if (this.localFilters.planType !== 'all') count++;
      if (this.localFilters.searchQuery && this.localFilters.searchQuery.trim()) count++;
      if (this.localFilters.showOnlyOffers) count++;
      if (this.localFilters.showOnlyPopular) count++;
      
      return count;
    },
    
    filteredProductsCount() {
      // Esto sería calculado por el componente padre
      return this.products.length;
    },
    
    priceRange() {
      if (this.products.length === 0) return { min: 0, max: 100 };
      
      const prices = this.products.map(p => p.price * 1.21);
      return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
      };
    },
    
    filterPresets() {
      return {
        economicos: {
          name: 'Planes Económicos',
          description: 'Los más baratos',
          icon: '💰',
          filters: {
            maxPrice: 30,
            sortBy: 'price',
            sortOrder: 'asc'
          }
        },
        familiares: {
          name: 'Para Familias',
          description: 'Planes familiares con muchos datos',
          icon: '👨‍👩‍👧‍👦',
          filters: {
            planType: 'familiar',
            dataType: 'high',
            sortBy: 'data',
            sortOrder: 'desc'
          }
        },
        populares: {
          name: 'Más Populares',
          description: 'Los más elegidos',
          icon: '⭐',
          filters: {
            showOnlyPopular: true,
            sortBy: 'popularity',
            sortOrder: 'desc'
          }
        },
        ofertas: {
          name: 'Ofertas Especiales',
          description: 'Con descuentos',
          icon: '🎯',
          filters: {
            showOnlyOffers: true,
            sortBy: 'price',
            sortOrder: 'asc'
          }
        }
      };
    }
  },
  
  methods: {
    updateFilters() {
      this.$emit('update:filters', { ...this.localFilters });
    },
    
    toggleOperator(operator) {
      if (!this.localFilters.operators) {
        this.localFilters.operators = [];
      }
      
      const index = this.localFilters.operators.indexOf(operator);
      if (index > -1) {
        this.localFilters.operators.splice(index, 1);
      } else {
        this.localFilters.operators.push(operator);
      }
      
      this.updateFilters();
    },
    
    setPriceRange(value) {
      this.localFilters.maxPrice = parseInt(value);
      this.updateFilters();
    },
    
    setDataType(type) {
      this.localFilters.dataType = type;
      this.updateFilters();
    },
    
    setPlanType(type) {
      this.localFilters.planType = type;
      this.updateFilters();
    },
    
    setSorting(sortBy) {
      if (this.localFilters.sortBy === sortBy) {
        // Cambiar orden si es el mismo campo
        this.localFilters.sortOrder = this.localFilters.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.localFilters.sortBy = sortBy;
        this.localFilters.sortOrder = 'asc';
      }
      
      this.updateFilters();
    },
    
    toggleOffers() {
      this.localFilters.showOnlyOffers = !this.localFilters.showOnlyOffers;
      this.updateFilters();
    },
    
    togglePopular() {
      this.localFilters.showOnlyPopular = !this.localFilters.showOnlyPopular;
      this.updateFilters();
    },
    
    handleSearchInput(event) {
      const query = event.target.value;
      
      // Debounce la búsqueda
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
        this.localFilters.searchQuery = query;
        this.updateFilters();
      }, 300);
    },
    
    clearAllFilters() {
      this.localFilters = {
        operators: [],
        maxPrice: 100,
        dataType: 'all',
        planType: 'all',
        searchQuery: '',
        sortBy: 'price',
        sortOrder: 'asc',
        showOnlyOffers: false,
        showOnlyPopular: false
      };
      
      // Limpiar el input de búsqueda
      if (this.$refs.searchInput) {
        this.$refs.searchInput.value = '';
      }
      
      this.updateFilters();
      this.$emit('clear-filters');
    },
    
    applyPreset(presetName) {
      const preset = this.filterPresets[presetName];
      if (!preset) return;
      
      // Limpiar filtros actuales
      this.clearAllFilters();
      
      // Aplicar filtros del preset
      Object.assign(this.localFilters, preset.filters);
      
      this.updateFilters();
      this.$emit('apply-preset', presetName);
      this.showPresets = false;
    },
    
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    
    togglePresets() {
      this.showPresets = !this.showPresets;
    }
  },
  
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters };
      },
      deep: true
    }
  },
  
  template: `
    <div class="filter-system">
      <!-- Header -->
      <div class="filter-header">
        <div class="flex items-center gap-3">
          <h3>Filtros</h3>
          <span v-if="activeFiltersCount > 0" class="active-filters-badge">
            {{ activeFiltersCount }}
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Botón de presets -->
          <button 
            @click="togglePresets"
            class="btn-presets"
            :class="{ active: showPresets }"
          >
            🎯 Presets
          </button>
          
          <!-- Botón de limpiar -->
          <button 
            @click="clearAllFilters"
            class="btn-reset"
            :disabled="activeFiltersCount === 0"
          >
            Limpiar
          </button>
          
          <!-- Botón de colapsar/expandir -->
          <button 
            @click="toggleExpanded"
            class="btn-toggle"
          >
            {{ isExpanded ? '⬆️' : '⬇️' }}
          </button>
        </div>
      </div>
      
      <!-- Presets -->
      <div v-if="showPresets" class="presets-section">
        <div class="presets-grid">
          <button 
            v-for="(preset, key) in filterPresets"
            :key="key"
            @click="applyPreset(key)"
            class="preset-card"
          >
            <span class="preset-icon">{{ preset.icon }}</span>
            <div class="preset-info">
              <h4>{{ preset.name }}</h4>
              <p>{{ preset.description }}</p>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Filtros principales -->
      <div v-if="isExpanded" class="filters-content">
        <!-- Búsqueda -->
        <div class="filter-group">
          <label>🔍 Búsqueda</label>
          <input 
            ref="searchInput"
            type="text"
            placeholder="Buscar planes..."
            @input="handleSearchInput"
            class="search-input"
          >
        </div>
        
        <!-- Grid de filtros -->
        <div class="filters-grid">
          <!-- Operadores -->
          <div class="filter-group">
            <label>📡 Operador</label>
            <div class="operator-filters">
              <button 
                v-for="operator in operatorOptions"
                :key="operator.value"
                @click="toggleOperator(operator.value)"
                class="operator-button"
                :class="{ 
                  active: localFilters.operators && localFilters.operators.includes(operator.value) 
                }"
                :style="{ 
                  borderColor: operator.color,
                  backgroundColor: localFilters.operators && localFilters.operators.includes(operator.value) 
                    ? operator.color 
                    : 'transparent',
                  color: localFilters.operators && localFilters.operators.includes(operator.value) 
                    ? 'white' 
                    : operator.color
                }"
              >
                {{ operator.label }}
              </button>
            </div>
          </div>
          
          <!-- Precio -->
          <div class="filter-group">
            <label>💰 Precio máximo</label>
            <div class="range-container">
              <input 
                type="range" 
                :min="priceRange.min" 
                :max="priceRange.max"
                :value="localFilters.maxPrice"
                @input="setPriceRange($event.target.value)"
                class="range-input"
              >
              <div class="range-labels">
                <span>{{ priceRange.min }}€</span>
                <span class="current-value">{{ localFilters.maxPrice }}€</span>
                <span>{{ priceRange.max }}€</span>
              </div>
            </div>
          </div>
          
          <!-- Tipo de datos -->
          <div class="filter-group">
            <label>📊 Datos incluidos</label>
            <select 
              :value="localFilters.dataType" 
              @change="setDataType($event.target.value)"
              class="select-input"
            >
              <option 
                v-for="option in dataTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.icon }} {{ option.label }}
              </option>
            </select>
          </div>
          
          <!-- Tipo de plan -->
          <div class="filter-group">
            <label>👥 Tipo de plan</label>
            <div class="radio-group">
              <label 
                v-for="option in planTypeOptions"
                :key="option.value"
                class="radio-option"
              >
                <input 
                  type="radio"
                  :value="option.value"
                  :checked="localFilters.planType === option.value"
                  @change="setPlanType(option.value)"
                >
                <span>{{ option.icon }} {{ option.label }}</span>
              </label>
            </div>
          </div>
          
          <!-- Ordenamiento -->
          <div class="filter-group">
            <label>🔄 Ordenar por</label>
            <div class="sort-buttons">
              <button 
                v-for="option in sortOptions"
                :key="option.value"
                @click="setSorting(option.value)"
                class="sort-button"
                :class="{ 
                  active: localFilters.sortBy === option.value,
                  desc: localFilters.sortBy === option.value && localFilters.sortOrder === 'desc'
                }"
              >
                {{ option.icon }} {{ option.label }}
                <span v-if="localFilters.sortBy === option.value" class="sort-indicator">
                  {{ localFilters.sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </button>
            </div>
          </div>
          
          <!-- Filtros especiales -->
          <div class="filter-group">
            <label>✨ Especiales</label>
            <div class="toggle-filters">
              <label class="toggle-option">
                <input 
                  type="checkbox"
                  :checked="localFilters.showOnlyOffers"
                  @change="toggleOffers"
                >
                <span>🎯 Solo ofertas</span>
              </label>
              
              <label class="toggle-option">
                <input 
                  type="checkbox"
                  :checked="localFilters.showOnlyPopular"
                  @change="togglePopular"
                >
                <span>⭐ Solo populares</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resultados -->
      <div class="filter-results">
        <span class="results-count">
          {{ filteredProductsCount }} planes encontrados
        </span>
        
        <!-- Tags de filtros activos -->
        <div v-if="activeFiltersCount > 0" class="active-filters-tags">
          <span 
            v-for="operator in (localFilters.operators || [])"
            :key="'op-' + operator"
            class="filter-tag operator-tag"
            @click="toggleOperator(operator)"
          >
            {{ operatorOptions.find(o => o.value === operator)?.label }}
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.maxPrice < 100"
            class="filter-tag price-tag"
            @click="localFilters.maxPrice = 100; updateFilters()"
          >
            Hasta {{ localFilters.maxPrice }}€
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.dataType !== 'all'"
            class="filter-tag data-tag"
            @click="setDataType('all')"
          >
            {{ dataTypeOptions.find(d => d.value === localFilters.dataType)?.label }}
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.planType !== 'all'"
            class="filter-tag plan-tag"
            @click="setPlanType('all')"
          >
            {{ planTypeOptions.find(p => p.value === localFilters.planType)?.label }}
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.searchQuery && localFilters.searchQuery.trim()"
            class="filter-tag search-tag"
            @click="localFilters.searchQuery = ''; $refs.searchInput.value = ''; updateFilters()"
          >
            "{{ localFilters.searchQuery }}"
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.showOnlyOffers"
            class="filter-tag offers-tag"
            @click="toggleOffers"
          >
            Solo ofertas
            <span class="remove-tag">×</span>
          </span>
          
          <span 
            v-if="localFilters.showOnlyPopular"
            class="filter-tag popular-tag"
            @click="togglePopular"
          >
            Solo populares
            <span class="remove-tag">×</span>
          </span>
        </div>
      </div>
    </div>
  `
};
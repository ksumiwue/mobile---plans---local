// ===== APLICACIÓN PRINCIPAL =====

import ProductCard from './components/ProductCard.js';
import FilterSystem from './components/FilterSystem.js';
import Comparator from './components/Comparator.js';
import Calculator from './components/Calculator.js';

import { createProductStore } from './stores/products.js';
import { createFilterStore } from './stores/filters.js';
import { createComparisonStore } from './stores/comparison.js';

import { apiClient, loadProducts } from './utils/api.js';
import { cacheManager } from './utils/cache.js';
import { animationManager } from './utils/animations.js';

const { createApp, reactive, computed, onMounted, onUnmounted, watch } = Vue;

// Estado global de la aplicación
const globalState = reactive({
  // Stores
  products: createProductStore(),
  filters: createFilterStore(),
  comparison: createComparisonStore(),
  
  // Estado de la UI
  ui: {
    theme: 'light',
    loading: false,
    error: null,
    activeView: 'catalog', // catalog, comparison, calculator
    showNotifications: true,
    isOnline: navigator.onLine
  },
  
  // Configuración
  config: {
    maxComparisons: 3,
    autoSave: true,
    analytics: false
  }
});

// Componente principal
const MobilePlansApp = {
  components: {
    ProductCard,
    FilterSystem,
    Comparator,
    Calculator
  },
  
  setup() {
    // Computed properties
    const filteredProducts = computed(() => {
      return globalState.filters.applyFilters(globalState.products.state.all);
    });
    
    const isLoading = computed(() => {
      return globalState.products.state.loading || globalState.ui.loading;
    });
    
    const hasError = computed(() => {
      return globalState.products.state.error || globalState.ui.error;
    });
    
    const themeClass = computed(() => {
      return `theme-${globalState.ui.theme}`;
    });
    
    const canShowComparison = computed(() => {
      return globalState.comparison.state.items.length > 0;
    });
    
    // Métodos principales
    const initializeApp = async () => {
      try {
        globalState.ui.loading = true;
        globalState.ui.error = null;
        
        // Cargar configuración desde localStorage
        loadSettings();
        
        // Cargar productos
        await globalState.products.loadProducts();
        
        // Cargar filtros guardados
        globalState.filters.loadFromLocalStorage();
        
        // Cargar comparación guardada
        globalState.comparison.loadFromLocalStorage();
        
        // Aplicar tema guardado
        const savedTheme = localStorage.getItem('mobile-plans-theme');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          globalState.ui.theme = savedTheme;
        }
        
        // Configurar animaciones
        setupAnimations();
        
        // Configurar partículas de fondo
        createTechBackground();
        
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        globalState.ui.error = 'Error al cargar la aplicación. Por favor, recarga la página.';
      } finally {
        globalState.ui.loading = false;
      }
    };
    
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('mobile-plans-settings');
        if (saved) {
          const settings = JSON.parse(saved);
          Object.assign(globalState.config, settings);
        }
      } catch (error) {
        console.warn('No se pudieron cargar las configuraciones:', error);
      }
    };
    
    const saveSettings = () => {
      try {
        localStorage.setItem('mobile-plans-settings', JSON.stringify(globalState.config));
      } catch (error) {
        console.warn('No se pudieron guardar las configuraciones:', error);
      }
    };
    
    const setupAnimations = () => {
      // Configurar animaciones escalonadas para la grid de productos
      const productsGrid = document.querySelector('.products-grid');
      if (productsGrid) {
        animationManager.setupStaggeredAnimation(productsGrid, {
          selector: '.product-card',
          delay: 100,
          className: 'animate-fade-in'
        });
      }
    };
    
    const createTechBackground = () => {
      // Crear fondo tecnológico con partículas
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'tech-particles';
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
      }
      
      document.body.appendChild(particlesContainer);
    };
    
    // Gestión de vistas
    const setActiveView = (view) => {
      globalState.ui.activeView = view;
      
      // Analytics
      if (globalState.config.analytics && window.gtag) {
        window.gtag('event', 'view_change', {
          view_name: view
        });
      }
    };
    
    const toggleTheme = () => {
      globalState.ui.theme = globalState.ui.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('mobile-plans-theme', globalState.ui.theme);
      
      // Aplicar clase al body para transiciones suaves
      document.body.classList.add('theme-transitioning');
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    };
    
    // Gestión de productos
    const addToComparison = (product) => {
      const success = globalState.comparison.add(product);
      if (success && window.animations) {
        // Encontrar la tarjeta y aplicar animación de éxito
        const card = document.querySelector(`[data-product-id="${product.id}"]`);
        if (card) {
          window.animations.success(card);
        }
      }
    };
    
    const removeFromComparison = (product) => {
      globalState.comparison.remove(product.id);
    };
    
    const clearComparison = () => {
      globalState.comparison.clear();
    };
    
    const handleContractClick = (product) => {
      // Crear efecto de partículas en el botón
      if (window.animations) {
        const button = event.target;
        window.animations.particles(button, {
          particleCount: 15,
          colors: [globalState.products.getProductImage(product.id, product.type, product.operator)]
        });
      }
    };
    
    // Gestión de filtros
    const updateFilters = (newFilters) => {
      Object.assign(globalState.filters.state, newFilters);
    };
    
    const clearFilters = () => {
      globalState.filters.clearAllFilters();
    };
    
    const applyFilterPreset = (presetName) => {
      globalState.filters.applyPreset(presetName);
    };
    
    // Gestión de shortcodes de WordPress
    const updateShortcodeZone = () => {
      const allZones = document.querySelectorAll('.mobile-plans-shortcode-zone');
      allZones.forEach(zone => zone.style.display = 'none');
      
      // Determinar qué zona mostrar basándose en los filtros activos
      const activeOperators = globalState.filters.state.operators;
      const activePlanType = globalState.filters.state.planType;
      
      if (activeOperators.length === 1) {
        const operator = activeOperators[0];
        let zoneId = `mobile-plans-shortcode-${operator}`;
        
        if ((operator === 'vodafone' || operator === 'orange') && activePlanType !== 'all') {
          zoneId += `-${activePlanType === 'individual' ? 'individuales' : 'familiares'}`;
        }
        
        const zone = document.getElementById(zoneId);
        if (zone) {
          zone.style.display = 'block';
        }
      }
    };
    
    // Gestión de errores
    const handleError = (error, context = '') => {
      console.error(`Error en ${context}:`, error);
      globalState.ui.error = `Error: ${error.message || 'Algo salió mal'}`;
      
      // Auto-limpiar error después de 5 segundos
      setTimeout(() => {
        if (globalState.ui.error === `Error: ${error.message || 'Algo salió mal'}`) {
          globalState.ui.error = null;
        }
      }, 5000);
    };
    
    // Gestión de estado online/offline
    const handleConnectionChange = () => {
      globalState.ui.isOnline = navigator.onLine;
      
      if (globalState.ui.isOnline) {
        // Recargar productos si volvemos online
        globalState.products.loadProducts(true);
      }
    };
    
    // Exportar comparación
    const exportComparison = (format) => {
      globalState.comparison.downloadComparison(format);
    };
    
    // Compartir comparación
    const shareComparison = () => {
      globalState.comparison.shareComparison();
    };
    
    // Lifecycle hooks
    onMounted(() => {
      initializeApp();
      
      // Event listeners
      window.addEventListener('online', handleConnectionChange);
      window.addEventListener('offline', handleConnectionChange);
      
      // Escuchar cambios en los filtros para actualizar shortcodes
      watch(() => globalState.filters.state, updateShortcodeZone, { deep: true });
      
      // Auto-guardar configuración
      watch(() => globalState.config, saveSettings, { deep: true });
    });
    
    onUnmounted(() => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      
      // Limpiar animaciones
      animationManager.cleanup();
    });
    
    // Exponer API global para debugging
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost'))) {
      window.mobilePlansApp = {
        state: globalState,
        methods: {
          toggleTheme,
          setActiveView,
          addToComparison,
          clearComparison,
          updateFilters,
          clearFilters
        }
      };
    }
    
    return {
      // Estado
      state: globalState,
      
      // Computed
      filteredProducts,
      isLoading,
      hasError,
      themeClass,
      canShowComparison,
      
      // Métodos
      toggleTheme,
      setActiveView,
      addToComparison,
      removeFromComparison,
      clearComparison,
      handleContractClick,
      updateFilters,
      clearFilters,
      applyFilterPreset,
      exportComparison,
      shareComparison,
      handleError
    };
  },
  
  template: `
    <div class="mobile-plans-container" :class="themeClass">
      <!-- Header -->
      <header class="mobile-plans-header">
        <div class="header-content">
          <h1>
            <span class="mobile-plans-h1-bold">LÍNEAS</span> MÓVILES
          </h1>
          <p class="mobile-plans-subtitle">
            Encuentra el plan perfecto con la mejor tecnología
          </p>
        </div>
        
        <div class="header-controls">
          <!-- Indicador de conexión -->
          <div class="connection-status" :class="{ offline: !state.ui.isOnline }">
            <span class="status-indicator" :class="state.ui.isOnline ? 'online' : 'offline'"></span>
            {{ state.ui.isOnline ? 'En línea' : 'Sin conexión' }}
          </div>
          
          <!-- Toggle tema -->
          <button @click="toggleTheme" class="theme-toggle" :title="'Cambiar a tema ' + (state.ui.theme === 'light' ? 'oscuro' : 'claro')">
            {{ state.ui.theme === 'light' ? '🌙' : '☀️' }}
          </button>
          
          <!-- Navegación de vistas -->
          <div class="view-navigation">
            <button 
              @click="setActiveView('catalog')"
              class="view-toggle"
              :class="{ active: state.ui.activeView === 'catalog' }"
            >
              📱 Catálogo
            </button>
            
            <button 
              @click="setActiveView('comparison')"
              class="view-toggle"
              :class="{ active: state.ui.activeView === 'comparison' }"
              :disabled="!canShowComparison"
            >
              ⚖️ Comparar ({{ state.comparison.state.items.length }})
            </button>
            
            <button 
              @click="setActiveView('calculator')"
              class="view-toggle"
              :class="{ active: state.ui.activeView === 'calculator' }"
            >
              🧮 Calculadora
            </button>
          </div>
        </div>
      </header>
      
      <!-- Error global -->
      <div v-if="hasError" class="error-banner">
        <span>⚠️ {{ state.products.state.error || state.ui.error }}</span>
        <button @click="state.ui.error = null; state.products.state.error = null">×</button>
      </div>
      
      <!-- Loading global -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner-dual"></div>
          <p>Cargando planes móviles...</p>
        </div>
      </div>
      
      <!-- Contenido principal -->
      <main class="mobile-plans-main" v-else>
        <!-- Vista del catálogo -->
        <div v-if="state.ui.activeView === 'catalog'" class="catalog-view">
          <!-- Sistema de filtros -->
          <FilterSystem 
            :filters="state.filters.state"
            :products="state.products.state.all"
            @update:filters="updateFilters"
            @clear-filters="clearFilters"
            @apply-preset="applyFilterPreset"
          />
          
          <!-- Grid de productos -->
          <div v-if="filteredProducts.length > 0" class="products-section">
            <div class="products-grid animate-stagger">
              <ProductCard
                v-for="(product, index) in filteredProducts"
                :key="product.id"
                :product="product"
                :theme="state.ui.theme"
                :is-in-comparison="state.comparison.isInComparison(product.id)"
                :animation-delay="index * 100"
                :data-product-id="product.id"
                @add-to-comparison="addToComparison"
                @remove-from-comparison="removeFromComparison"
                @contract-click="handleContractClick"
              />
            </div>
          </div>
          
          <!-- Estado vacío -->
          <div v-else class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron planes</h3>
            <p>Intenta ajustar los filtros para ver más resultados</p>
            <button @click="clearFilters" class="btn-clear-filters">
              Limpiar filtros
            </button>
          </div>
        </div>
        
        <!-- Vista de comparación -->
        <div v-else-if="state.ui.activeView === 'comparison'" class="comparison-view">
          <Comparator
            :products="state.comparison.state.items"
            :theme="state.ui.theme"
            @remove-product="removeFromComparison"
            @clear-all="clearComparison"
            @export-comparison="exportComparison"
            @share-comparison="shareComparison"
          />
        </div>
        
        <!-- Vista de calculadora -->
        <div v-else-if="state.ui.activeView === 'calculator'" class="calculator-view">
          <Calculator
            :products="state.products.state.all"
            :theme="state.ui.theme"
          />
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="mobile-plans-footer">
        <div class="footer-content">
          <p class="footer-text">
            Precios con IVA incluido • Llamadas ilimitadas a fijos y móviles nacionales
          </p>
          <div class="footer-links">
            <small>Powered by IPv6 Informática</small>
          </div>
        </div>
      </footer>
      
      <!-- Notificaciones -->
      <div class="notifications-container">
        <div 
          v-for="notification in state.comparison.state.notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <span>{{ notification.message }}</span>
          <button @click="state.comparison.removeNotification(notification.id)">×</button>
        </div>
      </div>
    </div>
  `
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(MobilePlansApp);
  
  // Configurar Vue para desarrollo
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost'))) {
    app.config.performance = true;
    app.config.devtools = true;
  }
  
  // Montar la aplicación
  app.mount('#mobile-plans-app');
});

// Exportar para uso externo
export default MobilePlansApp;
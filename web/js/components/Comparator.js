// ===== COMPONENTE COMPARADOR =====

export default {
  name: 'Comparator',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    maxProducts: {
      type: Number,
      default: 3
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  
  emits: ['remove-product', 'clear-all', 'export-comparison', 'share-comparison'],
  
  data() {
    return {
      isVisible: true,
      exportFormat: 'text',
      showShareMenu: false,
      animatingRemoval: null
    };
  },
  
  computed: {
    hasProducts() {
      return this.products.length > 0;
    },
    
    isFull() {
      return this.products.length >= this.maxProducts;
    },
    
    comparisonTable() {
      if (this.products.length === 0) return [];
      
      const features = [
        {
          key: 'image',
          label: 'Imagen',
          type: 'image',
          getValue: (product) => product.image
        },
        {
          key: 'name',
          label: 'Plan',
          type: 'text',
          getValue: (product) => product.data,
          highlight: true
        },
        {
          key: 'operator',
          label: 'Operador',
          type: 'operator',
          getValue: (product) => product.operator
        },
        {
          key: 'price',
          label: 'Precio mensual',
          type: 'price',
          getValue: (product) => (product.price * 1.21).toFixed(2),
          sortable: true,
          compare: true
        },
        {
          key: 'priceAnnual',
          label: 'Precio anual',
          type: 'price',
          getValue: (product) => ((product.price * 1.21) * 12).toFixed(2),
          sortable: true,
          compare: true
        },
        {
          key: 'data',
          label: 'Datos incluidos',
          type: 'data',
          getValue: (product) => product.data,
          compare: true
        },
        {
          key: 'type',
          label: 'Tipo de plan',
          type: 'planType',
          getValue: (product) => product.type === 'individual' ? 'Individual' : 'Familiar'
        },
        {
          key: 'calls',
          label: 'Llamadas',
          type: 'feature',
          getValue: () => 'Ilimitadas',
          icon: '📞'
        },
        {
          key: 'sms',
          label: 'SMS',
          type: 'feature',
          getValue: () => 'Ilimitados',
          icon: '💬'
        },
        {
          key: '5g',
          label: 'Tecnología 5G',
          type: 'boolean',
          getValue: () => true,
          icon: '⚡'
        },
        {
          key: 'roaming',
          label: 'Roaming UE',
          type: 'boolean',
          getValue: () => true,
          icon: '🌍'
        },
        {
          key: 'coverage',
          label: 'Cobertura',
          type: 'feature',
          getValue: () => 'Nacional',
          icon: '📡'
        }
      ];
      
      return features.map(feature => ({
        ...feature,
        values: this.products.map(product => ({
          value: feature.getValue(product),
          product: product
        }))
      }));
    },
    
    priceComparison() {
      if (this.products.length < 2) return null;
      
      const prices = this.products.map(p => p.price * 1.21);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      
      return {
        cheapest: this.products[prices.indexOf(min)],
        mostExpensive: this.products[prices.indexOf(max)],
        difference: max - min,
        savings: max - min
      };
    },
    
    dataComparison() {
      if (this.products.length < 2) return null;
      
      const dataAmounts = this.products.map(product => {
        const dataText = product.data.toLowerCase();
        if (dataText.includes('ilimitado')) return Infinity;
        const match = dataText.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      
      const finiteData = dataAmounts.filter(d => d !== Infinity);
      const hasUnlimited = dataAmounts.includes(Infinity);
      
      if (finiteData.length === 0) return null;
      
      const min = Math.min(...finiteData);
      const max = Math.max(...finiteData);
      
      return {
        hasUnlimited,
        lowest: hasUnlimited ? null : this.products[dataAmounts.indexOf(min)],
        highest: this.products[dataAmounts.indexOf(max)],
        difference: max - min
      };
    },
    
    operatorColors() {
      return {
        movistar: '#00579A',
        vodafone: '#E60000',
        orange: '#FF7900'
      };
    }
  },
  
  methods: {
    removeProduct(productId) {
      this.animatingRemoval = productId;
      
      setTimeout(() => {
        this.$emit('remove-product', productId);
        this.animatingRemoval = null;
      }, 300);
    },
    
    clearAll() {
      this.$emit('clear-all');
    },
    
    exportComparison() {
      this.$emit('export-comparison', this.exportFormat);
    },
    
    shareComparison() {
      this.$emit('share-comparison');
      this.showShareMenu = false;
    },
    
    toggleShareMenu() {
      this.showShareMenu = !this.showShareMenu;
    },
    
    formatPrice(value) {
      return `${value}€`;
    },
    
    formatOperator(operator) {
      return operator.charAt(0).toUpperCase() + operator.slice(1);
    },
    
    getOperatorColor(operator) {
      return this.operatorColors[operator] || '#6b7280';
    },
    
    getBestValue(feature) {
      if (!feature.compare || feature.values.length < 2) return null;
      
      if (feature.key === 'price' || feature.key === 'priceAnnual') {
        // Para precios, el menor es mejor
        const minValue = Math.min(...feature.values.map(v => parseFloat(v.value)));
        return feature.values.find(v => parseFloat(v.value) === minValue);
      }
      
      if (feature.key === 'data') {
        // Para datos, el mayor es mejor (o ilimitado)
        const hasUnlimited = feature.values.some(v => v.value.toLowerCase().includes('ilimitado'));
        if (hasUnlimited) {
          return feature.values.find(v => v.value.toLowerCase().includes('ilimitado'));
        }
        
        const amounts = feature.values.map(v => {
          const match = v.value.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        const maxAmount = Math.max(...amounts);
        return feature.values.find(v => {
          const match = v.value.match(/(\d+)/);
          return match && parseInt(match[1]) === maxAmount;
        });
      }
      
      return null;
    },
    
    isBestValue(feature, valueObj) {
      const best = this.getBestValue(feature);
      return best && best.product.id === valueObj.product.id;
    },
    
    contractProduct(product) {
      const url = `https://ipv6-informatica.es/configurador?products=${encodeURIComponent(product.id)}`;
      window.open(url, '_blank');
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'contract_from_comparison', {
          product_id: product.id,
          product_name: product.data,
          operator: product.operator
        });
      }
    },
    
    // Nuevo método para obtener clases CSS dinámicas
    getProductColumnClass(product) {
      const index = this.products.findIndex(p => p.id === product.id);
      const classes = {
        'product-column': true,
        'column-alternate': index % 2 === 0, // Columnas 1ª y 3ª
        'removing': this.animatingRemoval === product.id
      };
      console.log('🔵 getProductColumnClass:', { productId: product.id, index, classes });
      return classes;
    },
    
    getValueCellClass(feature, valueObj) {
      const index = this.products.findIndex(p => p.id === valueObj.product.id);
      const isDifferent = this.isDifferentValue(feature, valueObj);
      const classes = {
        'value-cell': true,
        'column-alternate': index % 2 === 0, // Columnas 1ª y 3ª
        'best-value': this.isBestValue(feature, valueObj),
        'different-value': isDifferent,
        'removing': this.animatingRemoval === valueObj.product.id
      };
      if (isDifferent) {
        console.log('🟡 Valor diferente detectado:', { 
          feature: feature.key, 
          value: valueObj.value, 
          productId: valueObj.product.id,
          classes 
        });
      }
      return classes;
    },

    // Método para detectar si un valor es diferente al resto
    isDifferentValue(feature, valueObj) {
      if (this.products.length <= 1) {
        console.log('🔍 isDifferentValue: Solo 1 producto, no hay diferencias');
        return false;
      }
      
      const currentValue = this.normalizeValueForComparison(valueObj.value);
      console.log(`🔍 isDifferentValue para ${feature.key}: valor actual = "${currentValue}"`);
      
      const allValues = this.products.map(product => {
        const productFeature = this.features.find(f => f.key === feature.key);
        if (productFeature) {
          const productValue = this.getFeatureValue(product, productFeature);
          const normalized = this.normalizeValueForComparison(productValue);
          console.log(`   📦 Producto ${product.id}: "${productValue}" → "${normalized}"`);
          return normalized;
        }
        return null;
      }).filter(v => v !== null);

      console.log(`🔍 Todos los valores para ${feature.key}:`, allValues);

      // Si hay más de un valor único, marcar las diferencias
      const uniqueValues = [...new Set(allValues)];
      console.log(`🔍 Valores únicos para ${feature.key}:`, uniqueValues);
      
      if (uniqueValues.length > 1) {
        // Contar cuántas veces aparece este valor
        const valueCount = allValues.filter(v => v === currentValue).length;
        const isDifferent = valueCount < this.products.length;
        console.log(`🔍 Valor "${currentValue}" aparece ${valueCount}/${this.products.length} veces → diferente: ${isDifferent}`);
        return isDifferent;
      }
      
      console.log(`🔍 Todos los valores son iguales para ${feature.key}`);
      return false;
    },

    // Normalizar valores para comparación
    normalizeValueForComparison(value) {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'string') {
        return value.toLowerCase().trim();
      }
      return String(value);
    },

    // Clase para celdas de contratación
    getContractCellClass(product) {
      const index = this.products.findIndex(p => p.id === product.id);
      return {
        'value-cell': true,
        'column-alternate': index % 2 === 0,
        'removing': this.animatingRemoval === product.id
      };
    }
  },
  
  mounted() {
    console.log('🚀 COMPARATOR MOUNTED - Vue funciona correctamente!');
    console.log('📊 Productos para comparar:', this.products.length);
    setTimeout(() => {
      const cells = document.querySelectorAll('.value-cell');
      console.log('🔍 Celdas .value-cell encontradas:', cells.length);
      const alternates = document.querySelectorAll('.column-alternate');
      console.log('🔍 Elementos .column-alternate encontrados:', alternates.length);
      const different = document.querySelectorAll('.different-value');
      console.log('🔍 Elementos .different-value encontrados:', different.length);
      
      // Debug específico de clases aplicadas
      cells.forEach((cell, index) => {
        console.log(`Celda ${index}:`, {
          classes: cell.classList.toString(),
          hasColumnAlternate: cell.classList.contains('column-alternate'),
          hasDifferentValue: cell.classList.contains('different-value')
        });
      });
    }, 2000);
  },
  
  template: `
    <div class="comparator-container" :class="{ 'theme-dark': theme === 'dark' }">
      <!-- Header -->
      <div class="comparator-header">
        <h2>Comparación de Planes</h2>
        <p v-if="hasProducts">Comparando {{ products.length }} de {{ maxProducts }} planes</p>
        <p v-else>No hay productos en comparación</p>
        
        <div v-if="hasProducts" class="header-actions">
          <!-- Exportar -->
          <div class="export-dropdown">
            <select v-model="exportFormat" class="export-select">
              <option value="text">Texto</option>
              <option value="csv">CSV</option>
            </select>
            <button @click="exportComparison" class="btn-export">
              📥 Exportar
            </button>
          </div>
          
          <!-- Compartir -->
          <div class="share-dropdown" :class="{ open: showShareMenu }">
            <button @click="toggleShareMenu" class="btn-share">
              🔗 Compartir
            </button>
            <div v-if="showShareMenu" class="share-menu">
              <button @click="shareComparison" class="share-option">
                📋 Copiar enlace
              </button>
            </div>
          </div>
          
          <!-- Limpiar todo -->
          <button @click="clearAll" class="btn-clear">
            🗑️ Limpiar todo
          </button>
        </div>
      </div>
      
      <!-- Contenido principal -->
      <div v-if="!hasProducts" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No hay productos para comparar</h3>
        <p>Añade productos usando el botón "Comparar" en las tarjetas de planes</p>
      </div>
      
      <div v-else class="comparison-content">
        <!-- Resumen de comparación -->
        <div v-if="priceComparison" class="comparison-summary">
          <div class="summary-card price-summary">
            <h4>💰 Comparación de Precios</h4>
            <div class="summary-content">
              <div class="best-option">
                <span class="label">Más económico:</span>
                <span class="value">{{ priceComparison.cheapest.data }} - {{ this.formatPrice(priceComparison.cheapest.price * 1.21) }}/mes</span>
              </div>
              <div v-if="priceComparison.difference > 0" class="savings">
                <span class="label">Ahorro máximo:</span>
                <span class="value savings-amount">{{ this.formatPrice(priceComparison.difference) }}/mes</span>
              </div>
            </div>
          </div>
          
          <div v-if="dataComparison" class="summary-card data-summary">
            <h4>📊 Comparación de Datos</h4>
            <div class="summary-content">
              <div v-if="dataComparison.hasUnlimited" class="best-option">
                <span class="label">Mejor opción:</span>
                <span class="value">Datos ilimitados</span>
              </div>
              <div v-else-if="dataComparison.highest" class="best-option">
                <span class="label">Más datos:</span>
                <span class="value">{{ dataComparison.highest.data }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabla de comparación -->
        <div class="comparison-table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="feature-column">Característica</th>
                <th 
                  v-for="(product, index) in products" 
                  :key="product.id"
                  :class="['product-column', { 'column-alternate': index % 2 === 0, 'removing': animatingRemoval === product.id }]"
                >
                  <div class="product-header">
                    <button 
                      @click="removeProduct(product.id)"
                      class="remove-product"
                      :title="'Eliminar ' + product.data"
                    >
                      ×
                    </button>
                    <div 
                      class="operator-badge"
                      :style="{ backgroundColor: getOperatorColor(product.operator) }"
                    >
                      {{ formatOperator(product.operator) }}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(feature, index) in comparisonTable" 
                :key="feature.key"
                class="comparison-row"
                :class="{ 'highlight-row': feature.highlight }"
                :style="{ '--row-index': index }"
              >
                <td class="feature-cell">
                  <div class="feature-label">
                    <span v-if="feature.icon">{{ feature.icon }}</span>
                    {{ feature.label }}
                  </div>
                </td>
                <td 
                  v-for="(valueObj, index) in feature.values"
                  :key="valueObj.product.id"
                  :class="['value-cell', { 
                    'column-alternate': index % 2 === 0, 
                    'different-value': this.isDifferentValue(feature, valueObj),
                    'best-value': this.isBestValue(feature, valueObj),
                    'removing': animatingRemoval === valueObj.product.id 
                  }]"
                >
                  <!-- Imagen -->
                  <div v-if="feature.type === 'image'" class="product-image">
                    <img 
                      :src="valueObj.value" 
                      :alt="valueObj.product.data"
                      class="comparison-image"
                    >
                  </div>
                  
                  <!-- Precio -->
                  <div v-else-if="feature.type === 'price'" class="price-value">
                    {{ this.formatPrice(valueObj.value) }}
                    <span v-if="feature.key === 'price'">/mes</span>
                    <span v-else-if="feature.key === 'priceAnnual'">/año</span>
                  </div>
                  
                  <!-- Operador -->
                  <div v-else-if="feature.type === 'operator'" class="operator-value">
                    <span 
                      class="operator-name"
                      :style="{ color: getOperatorColor(valueObj.value) }"
                    >
                      {{ formatOperator(valueObj.value) }}
                    </span>
                  </div>
                  
                  <!-- Datos -->
                  <div v-else-if="feature.type === 'data'" class="data-value">
                    <span class="data-amount">{{ valueObj.value }}</span>
                  </div>
                  
                  <!-- Tipo de plan -->
                  <div v-else-if="feature.type === 'planType'" class="plan-type-value">
                    <span class="plan-icon">
                      {{ valueObj.value === 'Individual' ? '👤' : '👨‍👩‍👧‍👦' }}
                    </span>
                    {{ valueObj.value }}
                  </div>
                  
                  <!-- Boolean -->
                  <div v-else-if="feature.type === 'boolean'" class="boolean-value">
                    <span class="check-icon">{{ valueObj.value ? '✅' : '❌' }}</span>
                  </div>
                  
                  <!-- Texto por defecto -->
                  <div v-else class="text-value">
                    {{ valueObj.value }}
                  </div>
                </td>
              </tr>
              
              <!-- Fila de acciones -->
              <tr class="actions-row">
                <td class="feature-cell">
                  <strong>Acción</strong>
                </td>
                <td 
                  v-for="(product, index) in products" 
                  :key="'action-' + product.id"
                  :class="['value-cell', { 'column-alternate': index % 2 === 0, 'removing': animatingRemoval === product.id }]"
                >
                  <button 
                    @click="contractProduct(product)"
                    class="btn-contract-comparison"
                    :style="{ 
                      backgroundColor: getOperatorColor(product.operator),
                      borderColor: getOperatorColor(product.operator)
                    }"
                  >
                    Contratar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Información adicional -->
        <div class="comparison-footer">
          <div class="footer-info">
            <p><strong>Nota:</strong> Precios incluyen IVA. Las características pueden variar según la zona geográfica.</p>
            <p>Comparación generada el {{ new Date().toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>
  `
};
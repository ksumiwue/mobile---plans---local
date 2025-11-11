// ===== COMPONENTE CALCULADORA =====

export default {
  name: 'Calculator',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  
  data() {
    return {
      selectedProduct: null,
      calculationType: 'annual', // annual, family, usage
      familyMembers: 2,
      contractPeriod: 12, // meses
      additionalServices: {
        insurance: false,
        extraData: false,
        internationalCalls: false,
        deviceFinancing: false
      },
      usageProfile: {
        calls: 'medium', // low, medium, high
        data: 'medium',
        messaging: 'medium'
      },
      customDiscounts: {
        studentDiscount: false,
        loyaltyDiscount: false,
        bundleDiscount: false
      },
      results: null,
      isCalculating: false
    };
  },
  
  computed: {
    productOptions() {
      return this.products.map(product => ({
        value: product.id,
        label: `${product.data} - ${product.operator}`,
        product: product
      }));
    },
    
    selectedProductData() {
      if (!this.selectedProduct) return null;
      return this.products.find(p => p.id === this.selectedProduct);
    },
    
    basePrice() {
      if (!this.selectedProductData) return 0;
      return this.selectedProductData.price * 1.21; // Con IVA
    },
    
    additionalServicesCosts() {
      const costs = {
        insurance: 3.99,
        extraData: 5.00,
        internationalCalls: 2.50,
        deviceFinancing: 25.00
      };
      
      let total = 0;
      Object.keys(this.additionalServices).forEach(service => {
        if (this.additionalServices[service]) {
          total += costs[service];
        }
      });
      
      return total;
    },
    
    discountAmount() {
      let discount = 0;
      
      if (this.customDiscounts.studentDiscount) discount += this.basePrice * 0.1; // 10%
      if (this.customDiscounts.loyaltyDiscount) discount += this.basePrice * 0.05; // 5%
      if (this.customDiscounts.bundleDiscount) discount += 5; // €5 fijo
      
      // Descuento por familia
      if (this.calculationType === 'family' && this.familyMembers > 1) {
        discount += (this.familyMembers - 1) * 2; // €2 por línea adicional
      }
      
      // Descuento por permanencia
      if (this.contractPeriod >= 24) {
        discount += this.basePrice * 0.15; // 15% por 24 meses
      } else if (this.contractPeriod >= 18) {
        discount += this.basePrice * 0.1; // 10% por 18 meses
      }
      
      return discount;
    },
    
    monthlyTotal() {
      return Math.max(0, this.basePrice + this.additionalServicesCosts - this.discountAmount);
    },
    
    usageRecommendations() {
      if (!this.selectedProductData) return [];
      
      const recommendations = [];
      const dataText = this.selectedProductData.data.toLowerCase();
      
      // Análisis de datos
      const isUnlimited = dataText.includes('ilimitado');
      const dataAmount = isUnlimited ? Infinity : (parseInt(dataText.match(/(\d+)/)?.[1]) || 0);
      
      if (this.usageProfile.data === 'high' && !isUnlimited && dataAmount < 50) {
        recommendations.push({
          type: 'warning',
          title: 'Posible exceso de datos',
          message: 'Tu perfil de uso alto podría superar los datos incluidos. Considera un plan con más datos.',
          suggestion: 'Buscar planes con más GB o datos ilimitados'
        });
      }
      
      if (this.usageProfile.data === 'low' && (isUnlimited || dataAmount > 30)) {
        recommendations.push({
          type: 'info',
          title: 'Plan sobredimensionado',
          message: 'Tienes más datos de los que necesitas. Podrías ahorrar con un plan más básico.',
          suggestion: 'Considera un plan con menos datos para ahorrar'
        });
      }
      
      // Análisis de servicios adicionales
      if (this.additionalServices.extraData && isUnlimited) {
        recommendations.push({
          type: 'warning',
          title: 'Servicio innecesario',
          message: 'Ya tienes datos ilimitados, no necesitas datos extra.',
          suggestion: 'Desactiva los datos extra para ahorrar €5/mes'
        });
      }
      
      return recommendations;
    }
  },
  
  methods: {
    selectProduct(productId) {
      this.selectedProduct = productId;
      this.calculateResults();
    },
    
    updateCalculationType(type) {
      this.calculationType = type;
      this.calculateResults();
    },
    
    updateFamilyMembers(count) {
      this.familyMembers = Math.max(1, Math.min(5, count));
      this.calculateResults();
    },
    
    updateContractPeriod(months) {
      this.contractPeriod = months;
      this.calculateResults();
    },
    
    toggleAdditionalService(service) {
      this.additionalServices[service] = !this.additionalServices[service];
      this.calculateResults();
    },
    
    toggleDiscount(discount) {
      this.customDiscounts[discount] = !this.customDiscounts[discount];
      this.calculateResults();
    },
    
    updateUsageProfile(category, level) {
      this.usageProfile[category] = level;
      this.calculateResults();
    },
    
    calculateResults() {
      if (!this.selectedProductData) {
        this.results = null;
        return;
      }
      
      this.isCalculating = true;
      
      // Simular tiempo de cálculo
      setTimeout(() => {
        const monthly = this.monthlyTotal;
        const annual = monthly * 12;
        const totalContract = monthly * this.contractPeriod;
        
        let familyTotal = monthly;
        if (this.calculationType === 'family') {
          familyTotal = monthly * this.familyMembers;
        }
        
        this.results = {
          monthly: monthly,
          annual: annual,
          totalContract: totalContract,
          familyTotal: this.calculationType === 'family' ? familyTotal : null,
          savings: this.discountAmount * 12, // Ahorro anual
          breakdown: {
            basePlan: this.basePrice,
            additionalServices: this.additionalServicesCosts,
            discounts: -this.discountAmount,
            total: monthly
          }
        };
        
        this.isCalculating = false;
      }, 500);
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(amount);
    },
    
    getUsageLabel(level) {
      const labels = {
        low: 'Bajo',
        medium: 'Medio',
        high: 'Alto'
      };
      return labels[level] || level;
    },
    
    getUsageDescription(category, level) {
      const descriptions = {
        calls: {
          low: 'Pocas llamadas (< 100 min/mes)',
          medium: 'Uso normal (100-500 min/mes)',
          high: 'Muchas llamadas (> 500 min/mes)'
        },
        data: {
          low: 'Navegación básica (< 5GB/mes)',
          medium: 'Uso moderado (5-20GB/mes)',
          high: 'Uso intensivo (> 20GB/mes)'
        },
        messaging: {
          low: 'Pocos mensajes',
          medium: 'Uso normal',
          high: 'Mensajería intensa'
        }
      };
      
      return descriptions[category]?.[level] || '';
    },
    
    resetCalculator() {
      this.selectedProduct = null;
      this.calculationType = 'annual';
      this.familyMembers = 2;
      this.contractPeriod = 12;
      this.additionalServices = {
        insurance: false,
        extraData: false,
        internationalCalls: false,
        deviceFinancing: false
      };
      this.usageProfile = {
        calls: 'medium',
        data: 'medium',
        messaging: 'medium'
      };
      this.customDiscounts = {
        studentDiscount: false,
        loyaltyDiscount: false,
        bundleDiscount: false
      };
      this.results = null;
    },
    
    exportResults() {
      if (!this.results || !this.selectedProductData) return;
      
      const data = {
        plan: this.selectedProductData.data,
        operator: this.selectedProductData.operator,
        calculationType: this.calculationType,
        monthlyTotal: this.results.monthly,
        annualTotal: this.results.annual,
        savings: this.results.savings,
        date: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calculo-plan-${this.selectedProductData.operator}-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  },
  
  template: `
    <div class="calculator-container" :class="{ 'theme-dark': theme === 'dark' }">
      <!-- Header -->
      <div class="calculator-header">
        <h2>🧮 Calculadora de Costos</h2>
        <p>Calcula el costo real de tu plan móvil con todos los extras y descuentos</p>
        
        <div class="header-actions">
          <button @click="resetCalculator" class="btn-reset">
            🔄 Reiniciar
          </button>
          <button 
            v-if="results" 
            @click="exportResults" 
            class="btn-export"
          >
            📥 Exportar
          </button>
        </div>
      </div>
      
      <!-- Configuración -->
      <div class="calculator-config">
        <!-- Selección de producto -->
        <div class="config-section">
          <h3>📱 Selecciona un Plan</h3>
          <select 
            v-model="selectedProduct" 
            @change="calculateResults"
            class="product-select"
          >
            <option value="">Elige un plan...</option>
            <option 
              v-for="option in productOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }} - {{ formatCurrency(option.product.price * 1.21) }}/mes
            </option>
          </select>
        </div>
        
        <!-- Tipo de cálculo -->
        <div v-if="selectedProduct" class="config-section">
          <h3>📊 Tipo de Cálculo</h3>
          <div class="calculation-types">
            <label class="calc-type-option">
              <input 
                type="radio" 
                value="annual" 
                v-model="calculationType"
                @change="calculateResults"
              >
              <span class="calc-type-content">
                <strong>📅 Anual</strong>
                <small>Costo total por año</small>
              </span>
            </label>
            
            <label class="calc-type-option">
              <input 
                type="radio" 
                value="family" 
                v-model="calculationType"
                @change="calculateResults"
              >
              <span class="calc-type-content">
                <strong>👨‍👩‍👧‍👦 Familiar</strong>
                <small>Múltiples líneas</small>
              </span>
            </label>
            
            <label class="calc-type-option">
              <input 
                type="radio" 
                value="usage" 
                v-model="calculationType"
                @change="calculateResults"
              >
              <span class="calc-type-content">
                <strong>📈 Por Uso</strong>
                <small>Basado en tu perfil</small>
              </span>
            </label>
          </div>
        </div>
        
        <!-- Configuración específica -->
        <div v-if="selectedProduct" class="config-sections">
          <!-- Configuración familiar -->
          <div v-if="calculationType === 'family'" class="config-section">
            <h3>👥 Configuración Familiar</h3>
            <div class="family-config">
              <label>Número de líneas:</label>
              <div class="number-input">
                <button @click="updateFamilyMembers(familyMembers - 1)">-</button>
                <span>{{ familyMembers }}</span>
                <button @click="updateFamilyMembers(familyMembers + 1)">+</button>
              </div>
            </div>
          </div>
          
          <!-- Perfil de uso -->
          <div v-if="calculationType === 'usage'" class="config-section">
            <h3>📈 Perfil de Uso</h3>
            <div class="usage-profiles">
              <div v-for="(category, key) in usageProfile" :key="key" class="usage-category">
                <label>{{ key === 'calls' ? '📞 Llamadas' : key === 'data' ? '📡 Datos' : '💬 Mensajes' }}:</label>
                <select 
                  :value="category" 
                  @change="updateUsageProfile(key, $event.target.value)"
                >
                  <option value="low">{{ getUsageLabel('low') }}</option>
                  <option value="medium">{{ getUsageLabel('medium') }}</option>
                  <option value="high">{{ getUsageLabel('high') }}</option>
                </select>
                <small>{{ getUsageDescription(key, category) }}</small>
              </div>
            </div>
          </div>
          
          <!-- Período de contrato -->
          <div class="config-section">
            <h3>⏱️ Período de Contrato</h3>
            <div class="contract-periods">
              <label v-for="period in [12, 18, 24]" :key="period" class="period-option">
                <input 
                  type="radio" 
                  :value="period" 
                  v-model="contractPeriod"
                  @change="calculateResults"
                >
                <span>{{ period }} meses</span>
                <small v-if="period >= 18">📉 Con descuento</small>
              </label>
            </div>
          </div>
          
          <!-- Servicios adicionales -->
          <div class="config-section">
            <h3>➕ Servicios Adicionales</h3>
            <div class="additional-services">
              <label v-for="(active, service) in additionalServices" :key="service" class="service-option">
                <input 
                  type="checkbox" 
                  :checked="active"
                  @change="toggleAdditionalService(service)"
                >
                <span class="service-content">
                  <strong>{{ {
                    insurance: '🛡️ Seguro móvil',
                    extraData: '📊 Datos extra',
                    internationalCalls: '🌍 Llamadas internacionales',
                    deviceFinancing: '📱 Financiación de móvil'
                  }[service] }}</strong>
                  <small>{{ {
                    insurance: '+€3.99/mes',
                    extraData: '+€5.00/mes',
                    internationalCalls: '+€2.50/mes',
                    deviceFinancing: '+€25.00/mes'
                  }[service] }}</small>
                </span>
              </label>
            </div>
          </div>
          
          <!-- Descuentos -->
          <div class="config-section">
            <h3>💰 Descuentos Disponibles</h3>
            <div class="discounts">
              <label v-for="(active, discount) in customDiscounts" :key="discount" class="discount-option">
                <input 
                  type="checkbox" 
                  :checked="active"
                  @change="toggleDiscount(discount)"
                >
                <span class="discount-content">
                  <strong>{{ {
                    studentDiscount: '🎓 Descuento estudiante',
                    loyaltyDiscount: '⭐ Cliente fiel',
                    bundleDiscount: '📦 Pack ahorro'
                  }[discount] }}</strong>
                  <small>{{ {
                    studentDiscount: '10% descuento',
                    loyaltyDiscount: '5% descuento',
                    bundleDiscount: '€5 descuento'
                  }[discount] }}</small>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resultados -->
      <div v-if="selectedProduct" class="calculator-results">
        <div v-if="isCalculating" class="calculating">
          <div class="spinner"></div>
          <p>Calculando...</p>
        </div>
        
        <div v-else-if="results" class="results-content">
          <!-- Resumen principal -->
          <div class="results-summary">
            <div class="main-result">
              <h3>💳 Costo Total</h3>
              <div class="cost-display">
                <span class="main-cost">{{ formatCurrency(results.monthly) }}</span>
                <span class="cost-period">/mes</span>
              </div>
            </div>
            
            <div class="secondary-results">
              <div class="result-item">
                <span class="label">📅 Anual:</span>
                <span class="value">{{ formatCurrency(results.annual) }}</span>
              </div>
              
              <div class="result-item">
                <span class="label">📝 Total contrato:</span>
                <span class="value">{{ formatCurrency(results.totalContract) }}</span>
              </div>
              
              <div v-if="results.familyTotal" class="result-item">
                <span class="label">👨‍👩‍👧‍👦 Familia ({{ familyMembers }} líneas):</span>
                <span class="value">{{ formatCurrency(results.familyTotal) }}/mes</span>
              </div>
              
              <div v-if="results.savings > 0" class="result-item savings">
                <span class="label">💰 Ahorro anual:</span>
                <span class="value">{{ formatCurrency(results.savings) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Desglose detallado -->
          <div class="results-breakdown">
            <h4>📋 Desglose de Costos</h4>
            <div class="breakdown-items">
              <div class="breakdown-item">
                <span class="item-label">Plan base:</span>
                <span class="item-value">{{ formatCurrency(results.breakdown.basePlan) }}</span>
              </div>
              
              <div v-if="results.breakdown.additionalServices > 0" class="breakdown-item">
                <span class="item-label">Servicios adicionales:</span>
                <span class="item-value">{{ formatCurrency(results.breakdown.additionalServices) }}</span>
              </div>
              
              <div v-if="results.breakdown.discounts < 0" class="breakdown-item discount">
                <span class="item-label">Descuentos aplicados:</span>
                <span class="item-value">{{ formatCurrency(results.breakdown.discounts) }}</span>
              </div>
              
              <div class="breakdown-item total">
                <span class="item-label"><strong>Total mensual:</strong></span>
                <span class="item-value"><strong>{{ formatCurrency(results.breakdown.total) }}</strong></span>
              </div>
            </div>
          </div>
          
          <!-- Recomendaciones -->
          <div v-if="usageRecommendations.length > 0" class="recommendations">
            <h4>💡 Recomendaciones</h4>
            <div class="recommendation-list">
              <div 
                v-for="(rec, index) in usageRecommendations"
                :key="index"
                class="recommendation-item"
                :class="rec.type"
              >
                <div class="recommendation-header">
                  <span class="rec-icon">{{ rec.type === 'warning' ? '⚠️' : 'ℹ️' }}</span>
                  <strong>{{ rec.title }}</strong>
                </div>
                <p>{{ rec.message }}</p>
                <small class="suggestion">💡 {{ rec.suggestion }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
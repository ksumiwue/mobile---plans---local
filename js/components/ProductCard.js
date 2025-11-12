// ===== COMPONENTE TARJETA DE PRODUCTO =====

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: 'light'
    },
    showComparison: {
      type: Boolean,
      default: true
    },
    isInComparison: {
      type: Boolean,
      default: false
    },
    animationDelay: {
      type: Number,
      default: 0
    }
  },
  
  emits: ['add-to-comparison', 'remove-from-comparison', 'contract-click'],
  
  data() {
    return {
      imageLoaded: false,
      imageError: false,
      isHovered: false,
      isAnimating: false
    };
  },
  
  computed: {
    cardClasses() {
      return [
        'product-card',
        `theme-${this.theme}`,
        `operator-${this.product.operator}`,
        {
          'popular': this.product.isPopular,
          'has-offer': this.product.hasOffer,
          'in-comparison': this.isInComparison,
          'is-hovered': this.isHovered,
          'image-loaded': this.imageLoaded
        }
      ];
    },
    
    operatorColor() {
      const colors = {
        movistar: '#00579A',
        vodafone: '#E60000',
        orange: '#FF7900'
      };
      return colors[this.product.operator] || '#6b7280';
    },
    
    formattedPrice() {
      const price = (this.product.price * 1.21).toFixed(2);
      const [euros, cents] = price.split('.');
      return { euros, cents };
    },
    
    planTypeInfo() {
      return {
        individual: {
          icon: '👤',
          label: 'Plan Individual',
          description: 'Perfecto para uso personal'
        },
        familiar: {
          icon: '👨‍👩‍👧‍👦',
          label: 'Plan Familiar',
          description: 'Ideal para familias'
        }
      }[this.product.type] || {};
    },
    
    dataCategory() {
      const dataText = this.product.data.toLowerCase();
      if (dataText.includes('ilimitado')) return 'unlimited';
      
      const match = dataText.match(/(\d+)/);
      if (match) {
        const amount = parseInt(match[1]);
        if (amount >= 50) return 'high';
        if (amount >= 20) return 'medium';
        return 'low';
      }
      return 'unknown';
    },
    
    contractUrl() {
      return `https://ipv6-informatica.es/configurador/?products=${encodeURIComponent(this.product.id)}`;
    },
    
    imageUrl() {
      return this.product.image || 'https://via.placeholder.com/300x375/cccccc/666666?text=Cargando...';
    },
    
    fallbackImageUrl() {
      return 'https://via.placeholder.com/300x375/cccccc/666666?text=Sin+Imagen';
    }
  },
  
  methods: {
    handleImageLoad() {
      this.imageLoaded = true;
      this.imageError = false;
    },
    
    handleImageError() {
      this.imageError = true;
      this.$refs.productImage.src = this.fallbackImageUrl;
    },
    
    toggleComparison() {
      if (this.isInComparison) {
        this.$emit('remove-from-comparison', this.product);
      } else {
        this.$emit('add-to-comparison', this.product);
      }
    },
    
    handleContractClick() {
      this.$emit('contract-click', this.product);
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'contract_click', {
          product_id: this.product.id,
          product_name: this.product.data,
          operator: this.product.operator,
          price: this.product.price
        });
      }
    },
    
    handleMouseEnter() {
      this.isHovered = true;
    },
    
    handleMouseLeave() {
      this.isHovered = false;
    },
    
    formatFeature(feature) {
      return feature.charAt(0).toUpperCase() + feature.slice(1);
    },
    
    animateSuccess() {
      this.isAnimating = true;
      
      // Usar la utilidad de animaciones
      if (window.animations) {
        window.animations.success(this.$el);
      }
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    }
  },
  
  mounted() {
    // Aplicar delay de animación si se especifica
    if (this.animationDelay > 0) {
      this.$el.style.animationDelay = `${this.animationDelay}ms`;
    }
    
    // Observer para animaciones de entrada
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      observer.observe(this.$el);
    }
  },
  
  template: `
    <div 
      :class="cardClasses"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Barra superior de color -->
      <div 
        class="h-1"
        :style="{ background: \`linear-gradient(90deg, \${operatorColor}, \${operatorColor}AA)\` }"
      ></div>
      
      <!-- Badges -->
      <div class="product-badges">
        <span v-if="product.isPopular" class="badge badge-popular">
          ⭐ Popular
        </span>
        <span v-if="product.hasOffer" class="badge badge-offer">
          🎯 Oferta
        </span>
      </div>
      
      <!-- Contenido principal -->
      <div class="p-6 md:p-8 flex-1 flex flex-col">
        <!-- Imagen del producto -->
        <div class="product-image-container">
          <img 
            ref="productImage"
            :src="imageUrl"
            :alt="product.data"
            class="product-image"
            loading="lazy"
            @load="handleImageLoad"
            @error="handleImageError"
          >
          <div 
            class="image-overlay"
            :style="{ background: \`linear-gradient(180deg, \${operatorColor}15 0%, transparent 50%, \${operatorColor}25 100%)\` }"
          ></div>
          
          <!-- Loading skeleton -->
          <div v-if="!imageLoaded && !imageError" class="skeleton skeleton-image"></div>
        </div>
        
        <!-- Tipo de plan -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-2xl">{{ planTypeInfo.icon }}</span>
          <span 
            class="mobile-plans-type-badge"
            :style="{ color: operatorColor }"
          >
            {{ planTypeInfo.label }}
          </span>
        </div>
        
        <!-- Título del plan -->
        <h3 class="product-title">{{ product.data }}</h3>
        
        <!-- Precio -->
        <div class="product-price">
          <div class="flex items-start justify-center">
            <span 
              class="price-amount"
              :style="{ color: operatorColor }"
            >
              {{ formattedPrice.euros }}
            </span>
            <sup class="text-lg ml-1 mt-2">
              ,{{ formattedPrice.cents }}
            </sup>
            <span class="price-suffix">€/mes</span>
          </div>
        </div>
        
        <!-- Separador -->
        <div 
          class="h-1 mb-5 rounded-full"
          :style="{ background: \`linear-gradient(90deg, transparent, \${operatorColor}, transparent)\` }"
        ></div>
        
        <!-- Descripción -->
        <p class="product-description">{{ product.description }}</p>
        
        <!-- Características -->
        <div class="product-features">
          <div class="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Incluye
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">📞</span>
            <span>Llamadas ilimitadas</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <span>SMS ilimitados</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">📡</span>
            <span>{{ product.data }} de datos</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <span>5G incluido</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">🌍</span>
            <span>Roaming UE</span>
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="product-actions">
          <!-- Botón de comparación -->
          <button 
            v-if="showComparison"
            @click="toggleComparison"
            :disabled="isAnimating"
            class="btn-compare"
            :class="{ 'in-comparison': isInComparison }"
          >
            <span v-if="isInComparison">✓ En comparación</span>
            <span v-else>{{ isInComparison ? 'Quitar' : 'Comparar' }}</span>
          </button>
          
          <!-- Botón de contratación -->
          <a 
            :href="contractUrl"
            @click="handleContractClick"
            target="_top"
            class="btn-contract"
            :style="{ 
              background: \`linear-gradient(135deg, \${operatorColor}, \${operatorColor}CC)\`,
              boxShadow: \`0 10px 30px \${operatorColor}40\`
            }"
          >
            <span>Contratar ahora</span>
          </a>
        </div>
      </div>
      
      <!-- Efecto de hover -->
      <div v-if="isHovered" class="hover-overlay"></div>
    </div>
  `,
  
  style: `
    .product-card {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .product-card.animate-fade-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .product-card.is-hovered {
      transform: translateY(-10px) scale(1.02);
    }
    
    .skeleton-image {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
    
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .hover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      pointer-events: none;
      animation: shimmer 0.6s ease-out;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .btn-compare.in-comparison {
      background: var(--operatorColor, #10b981);
      color: white;
      border-color: var(--operatorColor, #10b981);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .product-card {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      
      .skeleton-image {
        animation: none !important;
      }
      
      .hover-overlay {
        display: none !important;
      }
    }
  `
};
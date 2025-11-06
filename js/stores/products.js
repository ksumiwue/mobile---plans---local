// ===== STORE DE PRODUCTOS =====

export function createProductStore() {
  const { reactive, computed } = Vue;
  
  const state = reactive({
    all: [],
    loading: false,
    error: null,
    lastUpdated: null,
    imageAssignments: {},
    cache: new Map()
  });

  // Banco de imágenes
  const IMAGE_BANK = {
    individual: [
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_1.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_2.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_5.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_1.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_2.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_3.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_4.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_5.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_6.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_3.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_5.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_7.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_12.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_14.jpg?w=300&h=375&fit=crop'
    ],
    familiar: [
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_fam_1.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_fam_3.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_8.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_1.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_2.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_4.jpg?w=300&h=375&fit=crop',
      'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_6.jpg?w=300&h=375&fit=crop'
    ]
  };

  // Computed properties
  const byOperator = computed(() => {
    return {
      movistar: state.all.filter(p => p.operator === 'movistar'),
      vodafone: state.all.filter(p => p.operator === 'vodafone'),
      orange: state.all.filter(p => p.operator === 'orange')
    };
  });

  const byType = computed(() => {
    return {
      individual: state.all.filter(p => p.type === 'individual'),
      familiar: state.all.filter(p => p.type === 'familiar')
    };
  });

  const popular = computed(() => {
    return state.all.filter(p => p.isPopular).slice(0, 3);
  });

  const priceRange = computed(() => {
    const prices = state.all.map(p => p.price * 1.21);
    return {
      min: Math.min(...prices) || 0,
      max: Math.max(...prices) || 100
    };
  });

  // Utilidades
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function assignImagesToProducts(products, type, operator) {
    const availableImages = shuffleArray(IMAGE_BANK[type] || IMAGE_BANK.individual);
    const key = `${operator}_${type}`;

    if (!state.imageAssignments[key]) {
      state.imageAssignments[key] = {};
    }

    products.forEach((product, index) => {
      if (!state.imageAssignments[key][product.id]) {
        const imageIndex = index % availableImages.length;
        state.imageAssignments[key][product.id] = availableImages[imageIndex];
      }
    });
  }

  function getProductImage(productId, type, operator) {
    const key = `${operator}_${type}`;
    return state.imageAssignments[key]?.[productId] || IMAGE_BANK[type]?.[0] || IMAGE_BANK.individual[0];
  }

  function enrichProduct(product, operator, type) {
    return {
      ...product,
      operator,
      type,
      image: getProductImage(product.id, type, operator),
      priceWithTax: (product.price * 1.21).toFixed(2),
      isPopular: Math.random() > 0.7, // Simulación de popularidad
      hasOffer: Math.random() > 0.8,  // Simulación de ofertas
      features: [
        'Llamadas ilimitadas',
        'SMS ilimitados',
        `${product.data} de datos`,
        '5G incluido',
        'Roaming UE'
      ],
      contractUrl: `https://ipv6-informatica.es/configurador?products=${encodeURIComponent(product.id)}`
    };
  }

  function processApiData(data) {
    const processedProducts = [];

    // Procesar datos de cada operador
    const operatorData = {
      movistar: {
        individual: data.movistarPlans || [],
        familiar: []
      },
      vodafone: {
        individual: data.vodafoneIndividualPlans || [],
        familiar: data.vodafoneFamiliarPlans || []
      },
      orange: {
        individual: data.orangeIndividualPlans || [],
        familiar: data.orangeFamiliarPlans || []
      }
    };

    // Procesar cada operador y tipo
    Object.entries(operatorData).forEach(([operator, types]) => {
      Object.entries(types).forEach(([type, products]) => {
        if (products.length > 0) {
          // Asignar imágenes
          assignImagesToProducts(products, type, operator);
          
          // Enriquecer productos
          const enrichedProducts = products.map(product => 
            enrichProduct(product, operator, type)
          );
          
          processedProducts.push(...enrichedProducts);
        }
      });
    });

    return processedProducts;
  }

  // Acciones
  async function loadProducts(forceReload = false) {
    const cacheKey = 'products';
    const cacheTime = 5 * 60 * 1000; // 5 minutos
    
    // Verificar cache
    if (!forceReload && state.cache.has(cacheKey)) {
      const cached = state.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTime) {
        state.all = cached.data;
        state.lastUpdated = cached.timestamp;
        return;
      }
    }

    state.loading = true;
    state.error = null;

    try {
      let response;
      
      // Si estamos en localhost, usar datos embebidos para evitar problemas de CORS
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Entorno local detectado - usando datos embebidos');
        
        // Datos de ejemplo embebidos
        const localData = {
          "movistarPlans": [
            {
              "id": "mov_ind_1",
              "data": "20 GB",
              "price": 25.00,
              "description": "Plan Individual 20GB"
            },
            {
              "id": "mov_ind_2", 
              "data": "50 GB",
              "price": 35.00,
              "description": "Plan Individual 50GB"
            },
            {
              "id": "mov_ind_3",
              "data": "Ilimitado",
              "price": 45.00,
              "description": "Plan Individual Ilimitado"
            }
          ],
          "vodafoneIndividualPlans": [
            {
              "id": "vod_ind_1",
              "data": "15 GB", 
              "price": 22.00,
              "description": "Plan Individual 15GB"
            },
            {
              "id": "vod_ind_2",
              "data": "40 GB",
              "price": 32.00,
              "description": "Plan Individual 40GB"
            },
            {
              "id": "vod_ind_3",
              "data": "Ilimitado",
              "price": 42.00,
              "description": "Plan Individual Ilimitado"
            }
          ],
          "vodafoneFamiliarPlans": [
            {
              "id": "vod_fam_1",
              "data": "60 GB",
              "price": 55.00,
              "description": "Plan Familiar 60GB"
            },
            {
              "id": "vod_fam_2",
              "data": "100 GB",
              "price": 65.00,
              "description": "Plan Familiar 100GB"
            }
          ],
          "orangeIndividualPlans": [
            {
              "id": "ora_ind_1",
              "data": "25 GB",
              "price": 28.00,
              "description": "Plan Individual 25GB"
            },
            {
              "id": "ora_ind_2",
              "data": "60 GB",
              "price": 38.00,
              "description": "Plan Individual 60GB"
            }
          ],
          "orangeFamiliarPlans": [
            {
              "id": "ora_fam_1",
              "data": "80 GB",
              "price": 58.00,
              "description": "Plan Familiar 80GB"
            }
          ]
        };
        
        // Simular respuesta de axios
        response = { data: localData };
        
      } else {
        // En producción, usar la API real
        response = await axios.get('https://ipv6-informatica.es/cart/data/products.json', {
          timeout: 10000,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
      }

      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }

      const processedProducts = processApiData(response.data);
      state.all = processedProducts;
      state.lastUpdated = Date.now();

      // Guardar en cache
      state.cache.set(cacheKey, {
        data: processedProducts,
        timestamp: state.lastUpdated
      });

      // Guardar en localStorage
      try {
        localStorage.setItem('mobile-plans-products', JSON.stringify({
          data: processedProducts,
          timestamp: state.lastUpdated
        }));
      } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
      }

    } catch (error) {
      console.error('Error cargando productos:', error);
      state.error = error.message || 'Error de conexión';
      
      // Intentar cargar desde localStorage como fallback
      try {
        const cached = localStorage.getItem('mobile-plans-products');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          state.all = data;
          state.lastUpdated = timestamp;
          state.error = 'Mostrando datos en caché - Sin conexión';
        }
      } catch (e) {
        console.warn('No se pudo cargar desde localStorage:', e);
      }
    } finally {
      state.loading = false;
    }
  }

  function findById(id) {
    return state.all.find(product => product.id === id);
  }

  function findByOperator(operator) {
    return state.all.filter(product => product.operator === operator);
  }

  function findByType(type) {
    return state.all.filter(product => product.type === type);
  }

  function search(query) {
    if (!query) return state.all;
    
    const normalizedQuery = query.toLowerCase().trim();
    return state.all.filter(product => 
      product.data.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.operator.toLowerCase().includes(normalizedQuery)
    );
  }

  function filterByPrice(minPrice, maxPrice) {
    return state.all.filter(product => {
      const price = product.price * 1.21;
      return price >= minPrice && price <= maxPrice;
    });
  }

  function filterByData(category) {
    if (category === 'all') return state.all;
    
    return state.all.filter(product => {
      const dataText = product.data.toLowerCase();
      
      switch (category) {
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

  function sortBy(criteria, order = 'asc') {
    const sorted = [...state.all].sort((a, b) => {
      let aValue, bValue;
      
      switch (criteria) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'data':
          aValue = parseInt(a.data) || 0;
          bValue = parseInt(b.data) || 0;
          break;
        case 'name':
          aValue = a.data;
          bValue = b.data;
          break;
        case 'popularity':
          aValue = a.isPopular ? 1 : 0;
          bValue = b.isPopular ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });
    
    return sorted;
  }

  function clearCache() {
    state.cache.clear();
    localStorage.removeItem('mobile-plans-products');
  }

  function getStats() {
    return {
      total: state.all.length,
      byOperator: {
        movistar: byOperator.value.movistar.length,
        vodafone: byOperator.value.vodafone.length,
        orange: byOperator.value.orange.length
      },
      byType: {
        individual: byType.value.individual.length,
        familiar: byType.value.familiar.length
      },
      priceRange: priceRange.value,
      lastUpdated: state.lastUpdated
    };
  }

  // Retornar API pública
  return {
    // Estado
    state,
    
    // Computed
    byOperator,
    byType,
    popular,
    priceRange,
    
    // Acciones
    loadProducts,
    findById,
    findByOperator,
    findByType,
    search,
    filterByPrice,
    filterByData,
    sortBy,
    clearCache,
    getStats,
    getProductImage
  };
}
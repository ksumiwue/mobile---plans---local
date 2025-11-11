// ===== STORE DE COMPARACIÓN =====

export function createComparisonStore() {
  const { reactive, computed, watch } = Vue;
  
  const state = reactive({
    items: [],
    maxItems: 3,
    isVisible: false,
    lastAdded: null,
    notifications: []
  });

  // Computed para verificar si se puede añadir más productos
  const canAdd = computed(() => state.items.length < state.maxItems);
  
  // Computed para obtener el número de productos en comparación
  const count = computed(() => state.items.length);
  
  // Computed para verificar si hay productos para comparar
  const hasItems = computed(() => state.items.length > 0);
  
  // Computed para verificar si la comparación está llena
  const isFull = computed(() => state.items.length >= state.maxItems);
  
  // Computed para obtener estadísticas de comparación
  const stats = computed(() => {
    if (state.items.length === 0) return null;
    
    const prices = state.items.map(item => item.price * 1.21);
    const dataAmounts = state.items.map(item => {
      const dataText = item.data.toLowerCase();
      if (dataText.includes('ilimitado')) return Infinity;
      const match = dataText.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    return {
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((a, b) => a + b, 0) / prices.length
      },
      dataRange: {
        min: Math.min(...dataAmounts.filter(d => d !== Infinity)),
        max: Math.max(...dataAmounts.filter(d => d !== Infinity)),
        hasUnlimited: dataAmounts.includes(Infinity)
      },
      operators: [...new Set(state.items.map(item => item.operator))],
      types: [...new Set(state.items.map(item => item.type))]
    };
  });
  
  // Computed para la tabla de comparación
  const comparisonTable = computed(() => {
    if (state.items.length === 0) return [];
    
    const features = [
      {
        key: 'name',
        label: 'Plan',
        type: 'text',
        getValue: (item) => item.data
      },
      {
        key: 'operator',
        label: 'Operador',
        type: 'operator',
        getValue: (item) => item.operator
      },
      {
        key: 'price',
        label: 'Precio',
        type: 'price',
        getValue: (item) => (item.price * 1.21).toFixed(2) + '€/mes'
      },
      {
        key: 'data',
        label: 'Datos',
        type: 'data',
        getValue: (item) => item.data
      },
      {
        key: 'calls',
        label: 'Llamadas',
        type: 'feature',
        getValue: () => 'Ilimitadas'
      },
      {
        key: 'sms',
        label: 'SMS',
        type: 'feature',
        getValue: () => 'Ilimitados'
      },
      {
        key: '5g',
        label: '5G',
        type: 'boolean',
        getValue: () => true
      },
      {
        key: 'roaming',
        label: 'Roaming UE',
        type: 'boolean',
        getValue: () => true
      },
      {
        key: 'type',
        label: 'Tipo',
        type: 'text',
        getValue: (item) => item.type === 'individual' ? 'Individual' : 'Familiar'
      }
    ];
    
    return features.map(feature => ({
      ...feature,
      values: state.items.map(item => feature.getValue(item))
    }));
  });

  // Utilidades
  function isInComparison(productId) {
    return state.items.some(item => item.id === productId);
  }

  function findInComparison(productId) {
    return state.items.find(item => item.id === productId);
  }

  function addNotification(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: Date.now()
    };
    
    state.notifications.push(notification);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
      removeNotification(notification.id);
    }, duration);
    
    return notification.id;
  }

  function removeNotification(id) {
    const index = state.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      state.notifications.splice(index, 1);
    }
  }

  // Acciones principales
  function add(product) {
    // Verificar si ya está en comparación
    if (isInComparison(product.id)) {
      addNotification(`${product.data} ya está en comparación`, 'warning');
      return false;
    }
    
    // Verificar si se puede añadir más
    if (!canAdd.value) {
      addNotification(`Máximo ${state.maxItems} productos en comparación`, 'error');
      return false;
    }
    
    // Añadir producto
    state.items.push({
      ...product,
      addedAt: Date.now()
    });
    
    state.lastAdded = product.id;
    addNotification(`${product.data} añadido a comparación`, 'success');
    
    // Analytics (si está habilitado)
    if (window.gtag) {
      window.gtag('event', 'add_to_comparison', {
        product_id: product.id,
        product_name: product.data,
        operator: product.operator
      });
    }
    
    return true;
  }

  function remove(productId) {
    const index = state.items.findIndex(item => item.id === productId);
    if (index === -1) return false;
    
    const removedProduct = state.items[index];
    state.items.splice(index, 1);
    
    addNotification(`${removedProduct.data} eliminado de comparación`, 'info');
    
    // Si era el último añadido, limpiar referencia
    if (state.lastAdded === productId) {
      state.lastAdded = null;
    }
    
    // Analytics (si está habilitado)
    if (window.gtag) {
      window.gtag('event', 'remove_from_comparison', {
        product_id: productId,
        product_name: removedProduct.data,
        operator: removedProduct.operator
      });
    }
    
    return true;
  }

  function clear() {
    const count = state.items.length;
    state.items = [];
    state.lastAdded = null;
    
    if (count > 0) {
      addNotification(`${count} productos eliminados de comparación`, 'info');
    }
    
    // Analytics (si está habilitado)
    if (window.gtag) {
      window.gtag('event', 'clear_comparison', {
        products_count: count
      });
    }
  }

  function toggle(product) {
    if (isInComparison(product.id)) {
      return remove(product.id);
    } else {
      return add(product);
    }
  }

  function show() {
    state.isVisible = true;
    
    // Analytics (si está habilitado)
    if (window.gtag) {
      window.gtag('event', 'view_comparison', {
        products_count: state.items.length
      });
    }
  }

  function hide() {
    state.isVisible = false;
  }

  function toggleVisibility() {
    state.isVisible = !state.isVisible;
  }

  // Funciones de persistencia
  function saveToLocalStorage() {
    try {
      const dataToSave = {
        items: state.items,
        timestamp: Date.now()
      };
      localStorage.setItem('mobile-plans-comparison', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('No se pudo guardar la comparación:', error);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('mobile-plans-comparison');
      if (saved) {
        const { items, timestamp } = JSON.parse(saved);
        
        // Verificar que no sea muy antiguo (24 horas)
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < maxAge && Array.isArray(items)) {
          state.items = items;
          if (items.length > 0) {
            addNotification(`${items.length} productos restaurados en comparación`, 'info');
          }
        } else {
          // Limpiar datos antiguos
          localStorage.removeItem('mobile-plans-comparison');
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar la comparación guardada:', error);
      localStorage.removeItem('mobile-plans-comparison');
    }
  }

  // Funciones de exportación
  function exportAsText() {
    if (state.items.length === 0) return '';
    
    let text = 'COMPARACIÓN DE PLANES MÓVILES\n';
    text += '='.repeat(40) + '\n\n';
    
    state.items.forEach((item, index) => {
      text += `${index + 1}. ${item.data}\n`;
      text += `   Operador: ${item.operator.charAt(0).toUpperCase() + item.operator.slice(1)}\n`;
      text += `   Precio: ${(item.price * 1.21).toFixed(2)}€/mes\n`;
      text += `   Tipo: ${item.type === 'individual' ? 'Individual' : 'Familiar'}\n`;
      text += `   Descripción: ${item.description}\n\n`;
    });
    
    text += `Generado el ${new Date().toLocaleString()}\n`;
    text += 'IPv6 Informática - https://ipv6-informatica.es\n';
    
    return text;
  }

  function exportAsCSV() {
    if (state.items.length === 0) return '';
    
    const headers = ['Plan', 'Operador', 'Precio (€/mes)', 'Datos', 'Tipo', 'Descripción'];
    const rows = state.items.map(item => [
      item.data,
      item.operator.charAt(0).toUpperCase() + item.operator.slice(1),
      (item.price * 1.21).toFixed(2),
      item.data,
      item.type === 'individual' ? 'Individual' : 'Familiar',
      item.description.replace(/,/g, ';') // Escapar comas
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  function downloadComparison(format = 'text') {
    let content, filename, mimeType;
    
    switch (format) {
      case 'csv':
        content = exportAsCSV();
        filename = 'comparacion-planes-moviles.csv';
        mimeType = 'text/csv';
        break;
      case 'text':
      default:
        content = exportAsText();
        filename = 'comparacion-planes-moviles.txt';
        mimeType = 'text/plain';
        break;
    }
    
    if (!content) {
      addNotification('No hay productos para exportar', 'warning');
      return;
    }
    
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    addNotification(`Comparación descargada como ${filename}`, 'success');
  }

  // Funciones de compartir
  function generateShareUrl() {
    if (state.items.length === 0) return '';
    
    const productIds = state.items.map(item => item.id);
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('compare', productIds.join(','));
    
    return `${baseUrl}?${params.toString()}`;
  }

  function shareComparison() {
    const url = generateShareUrl();
    
    if (navigator.share) {
      // Usar API nativa de compartir si está disponible
      navigator.share({
        title: 'Comparación de Planes Móviles',
        text: `Compara ${state.items.length} planes móviles`,
        url: url
      }).catch(error => {
        console.log('Error compartiendo:', error);
        copyToClipboard(url);
      });
    } else {
      // Fallback: copiar al portapapeles
      copyToClipboard(url);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        addNotification('Enlace copiado al portapapeles', 'success');
      }).catch(() => {
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      addNotification('Enlace copiado al portapapeles', 'success');
    } catch (error) {
      addNotification('No se pudo copiar el enlace', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  function loadFromShareUrl() {
    const params = new URLSearchParams(window.location.search);
    const compareParam = params.get('compare');
    
    if (compareParam) {
      const productIds = compareParam.split(',');
      // Esta función necesitaría acceso al store de productos
      // Se implementaría en el componente principal
      return productIds;
    }
    
    return [];
  }

  // Watcher para guardar automáticamente
  watch(() => state.items, () => {
    saveToLocalStorage();
  }, { deep: true });

  // Retornar API pública
  return {
    // Estado
    state,
    
    // Computed
    canAdd,
    count,
    hasItems,
    isFull,
    stats,
    comparisonTable,
    
    // Verificaciones
    isInComparison,
    findInComparison,
    
    // Acciones principales
    add,
    remove,
    clear,
    toggle,
    show,
    hide,
    toggleVisibility,
    
    // Persistencia
    saveToLocalStorage,
    loadFromLocalStorage,
    
    // Exportación
    exportAsText,
    exportAsCSV,
    downloadComparison,
    
    // Compartir
    generateShareUrl,
    shareComparison,
    copyToClipboard,
    loadFromShareUrl,
    
    // Notificaciones
    addNotification,
    removeNotification
  };
}
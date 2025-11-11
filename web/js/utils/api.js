// ===== UTILIDADES DE API =====

export class ApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://ipv6-informatica.es/cart/data/';
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
    this.cache = new Map();
    this.cacheTime = config.cacheTime || 300000; // 5 minutos
    
    // Interceptores de request
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    
    // Estado de la conexión
    this.isOnline = navigator.onLine;
    this.setupConnectionListeners();
  }

  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onConnectionChange(true);
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onConnectionChange(false);
    });
  }

  onConnectionChange(isOnline) {
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('api:connection', {
      detail: { isOnline }
    }));
  }

  // Gestión de interceptores
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Aplicar interceptores de request
  applyRequestInterceptors(config) {
    return this.requestInterceptors.reduce((config, interceptor) => {
      return interceptor(config) || config;
    }, config);
  }

  // Aplicar interceptores de response
  applyResponseInterceptors(response) {
    return this.responseInterceptors.reduce((response, interceptor) => {
      return interceptor(response) || response;
    }, response);
  }

  // Generar clave de cache
  getCacheKey(url, params = {}) {
    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams.toString()}`;
  }

  // Verificar si está en cache y es válido
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < this.cacheTime;
  }

  // Obtener de cache
  getFromCache(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cacheKey)) {
      return cached.data;
    }
    return null;
  }

  // Guardar en cache
  setCache(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  // Limpiar cache expirado
  cleanExpiredCache() {
    for (const [key, value] of this.cache.entries()) {
      if (Date.now() - value.timestamp >= this.cacheTime) {
        this.cache.delete(key);
      }
    }
  }

  // Request con reintentos
  async requestWithRetry(url, options = {}, retryCount = 0) {
    try {
      const response = await this.makeRequest(url, options);
      return response;
    } catch (error) {
      if (retryCount < this.retries && this.shouldRetry(error)) {
        const delay = this.getRetryDelay(retryCount);
        await this.sleep(delay);
        return this.requestWithRetry(url, options, retryCount + 1);
      }
      throw error;
    }
  }

  // Verificar si se debe reintentar
  shouldRetry(error) {
    // Reintentar en errores de red o timeouts
    return error.name === 'TypeError' || 
           error.name === 'AbortError' ||
           (error.status && error.status >= 500);
  }

  // Calcular delay para reintento (exponential backoff)
  getRetryDelay(retryCount) {
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }

  // Utilidad para sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Hacer request básico
  async makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal,
        ...options
      };

      // Aplicar interceptores de request
      const finalConfig = this.applyRequestInterceptors(config);

      const response = await fetch(url, finalConfig);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText, response);
      }

      const data = await response.json();
      
      // Aplicar interceptores de response
      const finalResponse = this.applyResponseInterceptors({
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      return finalResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout');
      }
      
      throw error;
    }
  }

  // GET con cache
  async get(endpoint, params = {}, options = {}) {
    const url = new URL(endpoint, this.baseUrl).toString();
    const cacheKey = this.getCacheKey(url, params);

    // Verificar cache primero
    if (!options.skipCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { data: cached, fromCache: true };
      }
    }

    // Si no hay conexión, intentar obtener de cache aunque esté expirado
    if (!this.isOnline) {
      const expired = this.cache.get(cacheKey);
      if (expired) {
        return { data: expired.data, fromCache: true, expired: true };
      }
      throw new ApiError(0, 'Sin conexión y sin datos en cache');
    }

    try {
      // Añadir parámetros a la URL
      const urlWithParams = new URL(url);
      Object.keys(params).forEach(key => {
        urlWithParams.searchParams.append(key, params[key]);
      });

      const response = await this.requestWithRetry(urlWithParams.toString(), {
        method: 'GET',
        ...options
      });

      // Guardar en cache
      if (!options.skipCache) {
        this.setCache(cacheKey, response.data);
      }

      return { data: response.data, fromCache: false };
    } catch (error) {
      // En caso de error, intentar obtener de cache aunque esté expirado
      const expired = this.cache.get(cacheKey);
      if (expired) {
        return { data: expired.data, fromCache: true, expired: true, error };
      }
      throw error;
    }
  }

  // POST
  async post(endpoint, data = {}, options = {}) {
    const url = new URL(endpoint, this.baseUrl).toString();
    
    const response = await this.requestWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });

    return { data: response.data };
  }

  // PUT
  async put(endpoint, data = {}, options = {}) {
    const url = new URL(endpoint, this.baseUrl).toString();
    
    const response = await this.requestWithRetry(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });

    return { data: response.data };
  }

  // DELETE
  async delete(endpoint, options = {}) {
    const url = new URL(endpoint, this.baseUrl).toString();
    
    const response = await this.requestWithRetry(url, {
      method: 'DELETE',
      ...options
    });

    return { data: response.data };
  }

  // Limpiar cache
  clearCache() {
    this.cache.clear();
  }

  // Obtener estadísticas de cache
  getCacheStats() {
    let totalSize = 0;
    let validItems = 0;
    let expiredItems = 0;

    for (const [key, value] of this.cache.entries()) {
      totalSize += JSON.stringify(value).length;
      if (this.isCacheValid(key)) {
        validItems++;
      } else {
        expiredItems++;
      }
    }

    return {
      totalItems: this.cache.size,
      validItems,
      expiredItems,
      totalSize,
      cacheTime: this.cacheTime
    };
  }
}

// Clase de error personalizada
export class ApiError extends Error {
  constructor(status, message, response = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Instancia global del cliente API
const apiConfig = {
  baseUrl: 'https://ipv6-informatica.es/cart/data/',
  timeout: 10000,
  retries: 3,
  cacheTime: 300000
};

export const apiClient = new ApiClient(apiConfig);

// Interceptores predeterminados
apiClient.addRequestInterceptor((config) => {
  // Añadir timestamp para evitar cache del navegador
  if (config.method === 'GET') {
    const url = new URL(config.url || '');
    url.searchParams.append('_t', Date.now().toString());
    config.url = url.toString();
  }
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // Log de respuestas en desarrollo
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost'))) {
    console.log('API Response:', response);
  }
  return response;
});

// Funciones de conveniencia
export async function loadProducts(forceReload = false) {
  try {
    const response = await apiClient.get('products.json', {}, {
      skipCache: forceReload
    });
    
    return {
      success: true,
      data: response.data,
      fromCache: response.fromCache,
      expired: response.expired
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.status
    };
  }
}

export async function loadOperators() {
  try {
    const response = await apiClient.get('operators.json');
    
    return {
      success: true,
      data: response.data,
      fromCache: response.fromCache
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.status
    };
  }
}

export async function loadPromotions() {
  try {
    const response = await apiClient.get('promotions.json');
    
    return {
      success: true,
      data: response.data,
      fromCache: response.fromCache
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.status
    };
  }
}

// Utilidades para manejo de errores
export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return 'Sin conexión a internet';
      case 404:
        return 'Recurso no encontrado';
      case 408:
        return 'Tiempo de espera agotado';
      case 500:
        return 'Error del servidor';
      default:
        return error.message || 'Error desconocido';
    }
  }
  
  return error.message || 'Error de conexión';
}

export function isNetworkError(error) {
  return error instanceof ApiError && 
         (error.status === 0 || error.status >= 500);
}

export function isTimeoutError(error) {
  return error instanceof ApiError && error.status === 408;
}

// Limpieza automática de cache cada 10 minutos
setInterval(() => {
  apiClient.cleanExpiredCache();
}, 600000);

// Exportar todo como default también
export default {
  ApiClient,
  ApiError,
  apiClient,
  loadProducts,
  loadOperators,
  loadPromotions,
  getErrorMessage,
  isNetworkError,
  isTimeoutError
};
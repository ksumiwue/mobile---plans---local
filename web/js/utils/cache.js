// ===== SISTEMA DE CACHE AVANZADO =====

export class CacheManager {
  constructor(options = {}) {
    this.prefix = options.prefix || 'mobile-plans';
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB por defecto
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutos
    this.cleanupInterval = options.cleanupInterval || 600000; // 10 minutos
    
    // Diferentes tipos de almacenamiento
    this.memory = new Map();
    this.hasLocalStorage = this.checkLocalStorage();
    this.hasSessionStorage = this.checkSessionStorage();
    this.hasIndexedDB = this.checkIndexedDB();
    
    // Estadísticas
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      cleanups: 0
    };
    
    // Inicializar limpieza automática
    this.startCleanupTimer();
    
    // Escuchar eventos de storage
    this.setupStorageListeners();
  }

  // Verificaciones de disponibilidad
  checkLocalStorage() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  checkSessionStorage() {
    try {
      const test = '__test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  checkIndexedDB() {
    return 'indexedDB' in window;
  }

  // Generar clave con prefijo
  getKey(key) {
    return `${this.prefix}:${key}`;
  }

  // Crear objeto de cache con metadata
  createCacheEntry(data, ttl = this.defaultTTL) {
    return {
      data,
      timestamp: Date.now(),
      ttl,
      expiresAt: Date.now() + ttl,
      size: this.calculateSize(data),
      version: '1.0'
    };
  }

  // Calcular tamaño aproximado en bytes
  calculateSize(data) {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch (e) {
      // Fallback: estimación aproximada
      return JSON.stringify(data).length * 2;
    }
  }

  // Verificar si una entrada está expirada
  isExpired(entry) {
    return Date.now() > entry.expiresAt;
  }

  // ===== OPERACIONES DE MEMORIA =====
  
  setMemory(key, data, ttl) {
    const entry = this.createCacheEntry(data, ttl);
    this.memory.set(key, entry);
    this.stats.sets++;
  }

  getMemory(key) {
    const entry = this.memory.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    if (this.isExpired(entry)) {
      this.memory.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return entry.data;
  }

  deleteMemory(key) {
    const deleted = this.memory.delete(key);
    if (deleted) this.stats.deletes++;
    return deleted;
  }

  // ===== OPERACIONES DE LOCALSTORAGE =====
  
  setLocalStorage(key, data, ttl) {
    if (!this.hasLocalStorage) return false;
    
    try {
      const entry = this.createCacheEntry(data, ttl);
      const serialized = JSON.stringify(entry);
      
      // Verificar límite de tamaño
      if (serialized.length > 5 * 1024 * 1024) { // 5MB límite
        console.warn('Datos demasiado grandes para localStorage');
        return false;
      }
      
      localStorage.setItem(this.getKey(key), serialized);
      this.stats.sets++;
      return true;
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
      
      // Si es error de cuota, intentar limpiar
      if (e.name === 'QuotaExceededError') {
        this.cleanupLocalStorage();
        // Intentar una vez más
        try {
          const entry = this.createCacheEntry(data, ttl);
          localStorage.setItem(this.getKey(key), JSON.stringify(entry));
          this.stats.sets++;
          return true;
        } catch (e2) {
          console.warn('No se pudo guardar después de limpiar:', e2);
        }
      }
      
      return false;
    }
  }

  getLocalStorage(key) {
    if (!this.hasLocalStorage) return null;
    
    try {
      const serialized = localStorage.getItem(this.getKey(key));
      if (!serialized) {
        this.stats.misses++;
        return null;
      }
      
      const entry = JSON.parse(serialized);
      
      if (this.isExpired(entry)) {
        localStorage.removeItem(this.getKey(key));
        this.stats.misses++;
        return null;
      }
      
      this.stats.hits++;
      return entry.data;
    } catch (e) {
      console.warn('Error leyendo de localStorage:', e);
      this.stats.misses++;
      return null;
    }
  }

  deleteLocalStorage(key) {
    if (!this.hasLocalStorage) return false;
    
    try {
      localStorage.removeItem(this.getKey(key));
      this.stats.deletes++;
      return true;
    } catch (e) {
      console.warn('Error eliminando de localStorage:', e);
      return false;
    }
  }

  // ===== OPERACIONES DE SESSIONSTORAGE =====
  
  setSessionStorage(key, data, ttl) {
    if (!this.hasSessionStorage) return false;
    
    try {
      const entry = this.createCacheEntry(data, ttl);
      sessionStorage.setItem(this.getKey(key), JSON.stringify(entry));
      this.stats.sets++;
      return true;
    } catch (e) {
      console.warn('Error guardando en sessionStorage:', e);
      return false;
    }
  }

  getSessionStorage(key) {
    if (!this.hasSessionStorage) return null;
    
    try {
      const serialized = sessionStorage.getItem(this.getKey(key));
      if (!serialized) {
        this.stats.misses++;
        return null;
      }
      
      const entry = JSON.parse(serialized);
      
      if (this.isExpired(entry)) {
        sessionStorage.removeItem(this.getKey(key));
        this.stats.misses++;
        return null;
      }
      
      this.stats.hits++;
      return entry.data;
    } catch (e) {
      console.warn('Error leyendo de sessionStorage:', e);
      this.stats.misses++;
      return null;
    }
  }

  deleteSessionStorage(key) {
    if (!this.hasSessionStorage) return false;
    
    try {
      sessionStorage.removeItem(this.getKey(key));
      this.stats.deletes++;
      return true;
    } catch (e) {
      console.warn('Error eliminando de sessionStorage:', e);
      return false;
    }
  }

  // ===== API PRINCIPAL =====
  
  /**
   * Obtener datos del cache
   * @param {string} key - Clave del cache
   * @param {object} options - Opciones (storage, fallback)
   */
  get(key, options = {}) {
    const { storage = 'auto', fallback = null } = options;
    
    // Intentar diferentes storages según la configuración
    const storages = storage === 'auto' 
      ? ['memory', 'session', 'local']
      : [storage];
    
    for (const storageType of storages) {
      let result = null;
      
      switch (storageType) {
        case 'memory':
          result = this.getMemory(key);
          break;
        case 'local':
          result = this.getLocalStorage(key);
          break;
        case 'session':
          result = this.getSessionStorage(key);
          break;
      }
      
      if (result !== null) {
        // Si encontramos en un storage "inferior", copiarlo a memoria
        if (storageType !== 'memory') {
          this.setMemory(key, result, this.defaultTTL);
        }
        return result;
      }
    }
    
    return fallback;
  }

  /**
   * Guardar datos en cache
   * @param {string} key - Clave del cache
   * @param {any} data - Datos a guardar
   * @param {object} options - Opciones (ttl, storage, replicate)
   */
  set(key, data, options = {}) {
    const { 
      ttl = this.defaultTTL, 
      storage = 'auto',
      replicate = true 
    } = options;
    
    const results = {};
    
    if (storage === 'auto' || storage === 'memory') {
      this.setMemory(key, data, ttl);
      results.memory = true;
    }
    
    if (replicate && (storage === 'auto' || storage === 'session')) {
      results.session = this.setSessionStorage(key, data, ttl);
    }
    
    if (replicate && (storage === 'auto' || storage === 'local')) {
      results.local = this.setLocalStorage(key, data, ttl);
    }
    
    return results;
  }

  /**
   * Eliminar datos del cache
   * @param {string} key - Clave del cache
   * @param {object} options - Opciones (storage)
   */
  delete(key, options = {}) {
    const { storage = 'all' } = options;
    
    const results = {};
    
    if (storage === 'all' || storage === 'memory') {
      results.memory = this.deleteMemory(key);
    }
    
    if (storage === 'all' || storage === 'session') {
      results.session = this.deleteSessionStorage(key);
    }
    
    if (storage === 'all' || storage === 'local') {
      results.local = this.deleteLocalStorage(key);
    }
    
    return results;
  }

  /**
   * Verificar si existe una clave en cache
   * @param {string} key - Clave del cache
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Obtener o establecer (con función callback)
   * @param {string} key - Clave del cache
   * @param {function} callback - Función para obtener datos si no están en cache
   * @param {object} options - Opciones de cache
   */
  async getOrSet(key, callback, options = {}) {
    let data = this.get(key, options);
    
    if (data === null) {
      try {
        data = await callback();
        this.set(key, data, options);
      } catch (error) {
        console.warn('Error en callback de getOrSet:', error);
        throw error;
      }
    }
    
    return data;
  }

  // ===== LIMPIEZA Y MANTENIMIENTO =====
  
  cleanupMemory() {
    let cleaned = 0;
    
    for (const [key, entry] of this.memory.entries()) {
      if (this.isExpired(entry)) {
        this.memory.delete(key);
        cleaned++;
      }
    }
    
    this.stats.cleanups++;
    return cleaned;
  }

  cleanupLocalStorage() {
    if (!this.hasLocalStorage) return 0;
    
    let cleaned = 0;
    const keys = [];
    
    // Recopilar claves que coincidan con nuestro prefijo
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        keys.push(key);
      }
    }
    
    // Verificar y limpiar entradas expiradas
    keys.forEach(key => {
      try {
        const serialized = localStorage.getItem(key);
        if (serialized) {
          const entry = JSON.parse(serialized);
          if (this.isExpired(entry)) {
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      } catch (e) {
        // Si no se puede parsear, eliminar
        localStorage.removeItem(key);
        cleaned++;
      }
    });
    
    this.stats.cleanups++;
    return cleaned;
  }

  cleanupSessionStorage() {
    if (!this.hasSessionStorage) return 0;
    
    let cleaned = 0;
    const keys = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      try {
        const serialized = sessionStorage.getItem(key);
        if (serialized) {
          const entry = JSON.parse(serialized);
          if (this.isExpired(entry)) {
            sessionStorage.removeItem(key);
            cleaned++;
          }
        }
      } catch (e) {
        sessionStorage.removeItem(key);
        cleaned++;
      }
    });
    
    this.stats.cleanups++;
    return cleaned;
  }

  cleanup() {
    const results = {
      memory: this.cleanupMemory(),
      local: this.cleanupLocalStorage(),
      session: this.cleanupSessionStorage()
    };
    
    return results;
  }

  // Limpiar todo el cache
  clear(storage = 'all') {
    const results = {};
    
    if (storage === 'all' || storage === 'memory') {
      results.memory = this.memory.size;
      this.memory.clear();
    }
    
    if (storage === 'all' || storage === 'local') {
      results.local = this.clearStorageByPrefix(localStorage);
    }
    
    if (storage === 'all' || storage === 'session') {
      results.session = this.clearStorageByPrefix(sessionStorage);
    }
    
    return results;
  }

  clearStorageByPrefix(storage) {
    if (!storage) return 0;
    
    let cleared = 0;
    const keys = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      storage.removeItem(key);
      cleared++;
    });
    
    return cleared;
  }

  // ===== ESTADÍSTICAS Y DIAGNÓSTICO =====
  
  getStats() {
    const memorySize = Array.from(this.memory.values())
      .reduce((total, entry) => total + entry.size, 0);
    
    const localStorageSize = this.getStorageSize(localStorage);
    const sessionStorageSize = this.getStorageSize(sessionStorage);
    
    return {
      ...this.stats,
      memory: {
        entries: this.memory.size,
        size: memorySize
      },
      localStorage: {
        size: localStorageSize,
        available: this.hasLocalStorage
      },
      sessionStorage: {
        size: sessionStorageSize,
        available: this.hasSessionStorage
      },
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  getStorageSize(storage) {
    if (!storage) return 0;
    
    let size = 0;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(this.prefix + ':')) {
        const value = storage.getItem(key);
        size += key.length + (value ? value.length : 0);
      }
    }
    return size;
  }

  // ===== EVENTOS Y LISTENERS =====
  
  setupStorageListeners() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith(this.prefix + ':')) {
        // Emitir evento personalizado
        window.dispatchEvent(new CustomEvent('cache:storage-changed', {
          detail: {
            key: e.key.replace(this.prefix + ':', ''),
            oldValue: e.oldValue,
            newValue: e.newValue,
            storage: e.storageArea === localStorage ? 'local' : 'session'
          }
        }));
      }
    });
  }

  startCleanupTimer() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  // ===== UTILIDADES =====
  
  // Exportar cache completo para backup
  export(storage = 'memory') {
    const data = {};
    
    if (storage === 'memory') {
      for (const [key, entry] of this.memory.entries()) {
        if (!this.isExpired(entry)) {
          data[key] = entry;
        }
      }
    }
    
    return data;
  }

  // Importar cache desde backup
  import(data, storage = 'memory') {
    Object.entries(data).forEach(([key, entry]) => {
      if (!this.isExpired(entry)) {
        if (storage === 'memory') {
          this.memory.set(key, entry);
        }
      }
    });
  }
}

// Instancia global del cache manager
export const cacheManager = new CacheManager({
  prefix: 'mobile-plans',
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTTL: 300000, // 5 minutos
  cleanupInterval: 600000 // 10 minutos
});

// Funciones de conveniencia
export const cache = {
  get: (key, options) => cacheManager.get(key, options),
  set: (key, data, options) => cacheManager.set(key, data, options),
  delete: (key, options) => cacheManager.delete(key, options),
  has: (key) => cacheManager.has(key),
  getOrSet: (key, callback, options) => cacheManager.getOrSet(key, callback, options),
  clear: (storage) => cacheManager.clear(storage),
  cleanup: () => cacheManager.cleanup(),
  stats: () => cacheManager.getStats()
};

export default cacheManager;
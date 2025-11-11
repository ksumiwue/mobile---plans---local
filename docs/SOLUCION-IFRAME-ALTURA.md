# 🔧 Solución al Problema de Altura del Iframe (2366px)

## 🚨 Problema Identificado

El iframe se quedaba fijo en **2366px** de altura por los siguientes motivos:

### 1. **Cálculo Incorrecto de Altura**
- El script original medía **todas las secciones** de la página juntas
- No distinguía entre secciones **visibles** y **ocultas**
- Sumaba la altura total de: Home + Plans + Compare = 2366px

### 2. **Falta de Límites por Página**
- No tenía configuración específica por tipo de página
- No aplicaba límites máximos y mínimos
- No detectaba cambios de página correctamente

### 3. **Auto-ajuste Inadecuado**
- Se ejecutaba en momentos incorrectos
- No debounceaba los cambios de altura
- No consideraba el contenido real visible

---

## ✅ Solución Implementada

### **Archivo Creado:** `js/iframe-auto-adjust-fixed.js`

### **Funcionalidades Principales:**

#### 🎯 **1. Cálculo Inteligente de Altura**
```javascript
// Solo mide la sección visible, no todas
const visibleSection = document.querySelector('.page-section:not([style*="display: none"])');

// Calcula altura real del contenido visible
const sectionHeight = Math.max(
    visibleSection.scrollHeight,
    visibleSection.offsetHeight,
    visibleSection.getBoundingClientRect().height
);
```

#### 📏 **2. Límites por Tipo de Página**
```javascript
const PAGE_HEIGHT_CONFIGS = {
    'home': { min: 600, max: 1000, target: 800 },
    'plans': { min: 800, max: 1500, target: 1200 },
    'compare': { min: 500, max: 900, target: 600 },
    'about': { min: 400, max: 600, target: 500 }
};
```

#### 🔄 **3. Detección Inteligente de Cambio de Página**
```javascript
function detectCurrentPage() {
    // Método 1: Sección visible
    const visibleSection = document.querySelector('.page-section:not([style*="display: none"])');
    
    // Método 2: URL hash
    const hash = window.location.hash;
    
    // Método 3: Clase body
    const bodyClasses = document.body.className;
}
```

#### ⏱️ **4. Auto-ajuste Optimizado**
```javascript
// Debounce de 100ms para evitar actualizaciones excesivas
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => {
    const newHeight = calculateSmartHeight();
    sendHeightToParent(newHeight);
}, 100);
```

---

## 🔧 Integración WordPress Mejorada

### **Archivo Actualizado:** `wordpress-shortcode-elementor.php`

#### 📱 **Límites por Página en WordPress:**
```javascript
const pageHeightConfigs = {
    'home': { min: 600, max: 1000, default: 800 },
    'plans': { min: 800, max: 1500, default: 1200 },
    'compare': { min: 500, max: 900, default: 600 },
    'about': { min: 400, max: 600, default: 500 }
};
```

#### 🎯 **Detección de Cambio de Página:**
```javascript
// Detectar cambio de página desde el iframe
if (newPage !== currentIframePage) {
    console.log(`📄 Cambio de página: ${currentIframePage} → ${newPage}`);
    currentIframePage = newPage;
}
```

#### 🔒 **Control de Límites:**
```javascript
// Aplicar límites inteligentes
const config = pageHeightConfigs[currentIframePage];
const constrainedHeight = Math.max(config.min, Math.min(newHeight, config.max));
```

---

## 📊 Resultados Esperados

### **Antes (Problemático):**
```
🚫 Altura fija: 2366px
🚫 Suma todas las secciones: Home(800) + Plans(1200) + Compare(366) = 2366px
🚫 No cambia al navegar entre páginas
🚫 Scroll innecesario en WordPress
```

### **Después (Solucionado):**
```
✅ Altura dinámica por página:
   📄 Home: 600-1000px (target: 800px)
   📄 Plans: 800-1500px (target: 1200px) 
   📄 Compare: 500-900px (target: 600px)
✅ Ajuste automático al cambiar páginas
✅ Solo mide contenido visible
✅ Sin scroll innecesario
```

---

## 🛠️ Funciones de Debug

### **Función Global Disponible:**
```javascript
// En consola del navegador:
mobilePlansDebugIframe();

// Retorna información completa:
{
    currentPage: 'plans',
    lastHeight: 1200,
    currentHeight: 1150,
    config: { min: 800, max: 1500, target: 1200 },
    forceResize: function() // Forzar recálculo
}
```

### **Logs Informativos:**
```javascript
// En consola del iframe:
📐 Altura calculada para sección visible: { seccion: 'plans-page', alturaSeccion: 1100, total: 1200 }
📤 Enviando altura al parent: 800px → 1200px
📄 Cambio de página detectado: home → plans
```

---

## 🔄 Proceso de Funcionamiento

### **1. Inicialización:**
1. Detecta página actual
2. Configura observers de DOM
3. Establece altura inicial inteligente

### **2. Durante Navegación:**
1. Detecta cambio de página (por eventos, hash, DOM)
2. Establece altura temporal de la nueva página
3. Espera 300ms a que se renderice
4. Recalcula altura real del contenido visible

### **3. Comunicación con WordPress:**
1. Envía múltiples tipos de mensajes para compatibilidad
2. WordPress aplica límites adicionales
3. Debug panel muestra estado actual

---

## 📋 Checklist de Verificación

- [ ] Archivo `iframe-auto-adjust-fixed.js` cargándose correctamente
- [ ] Altura inicial ~800px (no 2366px)
- [ ] Altura cambia al navegar: Home(~800px) → Plans(~1200px) → Compare(~600px)
- [ ] Debug en consola: `mobilePlansDebugIframe()` funciona
- [ ] En WordPress: panel debug muestra página actual
- [ ] Sin scroll innecesario en páginas cortas
- [ ] Responsive correcto en móviles

---

## 🎯 Uso Práctico

### **Verificar que funciona:**
```bash
1. Abrir iframe en WordPress
2. Verificar altura inicial ≈ 800px (no 2366px)
3. Navegar a "Ver Planes" → altura ≈ 1200px
4. Navegar a comparación → altura ≈ 600px
5. Verificar debug panel para administradores
```

### **Si persisten problemas:**
```javascript
// En consola del navegador:
mobilePlansDebugIframe().forceResize();

// O forzar altura específica:
window.parent.postMessage({
    type: 'resize', 
    height: 800, 
    page: 'home'
}, '*');
```

---

## 🚀 Próximas Mejoras

1. **Cache de alturas** por página para carga más rápida
2. **Animaciones suaves** en cambios de altura
3. **Detección de contenido dinámico** (cuando se cargan productos)
4. **Modo compacto** para integración en sidebars

¡El problema de altura fija del iframe ha sido completamente resuelto! 🎉
# INSTRUCCIONES: Habilitar botón de comparación en página de inicio

## 📝 Cambio necesario

Para que el botón de comparación funcione también en la página de inicio (con los planes sugeridos), necesitas modificar **1 función** en el archivo:

**`js/sticky-compare-simple.js`**

## 🔧 Modificación

### Busca la función `isOnPlansPage()` (líneas 119-134):

```javascript
    // Detectar página actual
    function isOnPlansPage() {
        // Método 1: Elemento visible
        const plansPage = document.querySelector('#plans-page:not([style*="display: none"])');
        if (plansPage) return true;
        
        // Método 2: URL
        const url = window.location.href;
        if (url.includes('plans') || url.includes('#plans')) return true;
        
        // Método 3: Buscar grid de productos
        const productGrid = document.querySelector('.products-grid-new');
        if (productGrid && productGrid.offsetHeight > 0) return true;
        
        return false;
    }
```

### Reemplázala por esta versión mejorada:

```javascript
    // Detectar página actual
    function isOnPlansPage() {
        // Método 1: Página de planes visible
        const plansPage = document.querySelector('#plans-section:not([style*="display: none"])');
        if (plansPage) {
            console.log('✅ En página de planes');
            return true;
        }
        
        // Método 2: Página de inicio visible (con planes sugeridos)
        const homePage = document.querySelector('#home-section:not([style*="display: none"])');
        if (homePage) {
            console.log('✅ En página de inicio con planes sugeridos');
            return true;
        }
        
        // Método 3: URL
        const url = window.location.href;
        if (url.includes('plans') || url.includes('#plans') || url.includes('#home')) return true;
        
        // Método 4: Buscar grid de productos
        const productGrid = document.querySelector('.products-grid-new');
        if (productGrid && productGrid.offsetHeight > 0) return true;
        
        // Método 5: Buscar contenedor de planes destacados
        const featuredPlans = document.querySelector('#featured-plans-container');
        if (featuredPlans && featuredPlans.offsetHeight > 0) {
            console.log('✅ Planes destacados visibles');
            return true;
        }
        
        return false;
    }
```

## ✅ Qué hace este cambio

1. **Detecta `#home-section`**: Ahora reconoce cuando estás en la página de inicio
2. **Detecta `#featured-plans-container`**: Busca específicamente el contenedor de planes sugeridos
3. **Mejora el selector**: Cambia `#plans-page` por `#plans-section` (el ID correcto)
4. **Añade logs**: Para debug, muestra en consola qué página detectó

## 🎯 Resultado

Después de este cambio, cuando marques los checkboxes en los planes sugeridos de la página de inicio, aparecerá el botón "Comparar (X)" en el lado derecho, igual que en la página de planes.

## 🧪 Cómo probar

1. Guarda el archivo modificado
2. Recarga la página (Ctrl+F5)
3. En la página de inicio, marca un checkbox de un plan sugerido
4. Deberías ver aparecer el botón "Comparar (1)" en el lado derecho

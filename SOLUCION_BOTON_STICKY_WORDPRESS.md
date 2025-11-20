# SOLUCIÓN FINAL: Botón Sticky en WordPress con iframe

## 📋 Resumen del Problema

El botón de comparación sticky no se mantiene visible cuando:
1. La aplicación está embebida en WordPress mediante un iframe
2. El usuario hace scroll en la página de WordPress
3. El iframe completo se mueve fuera de la vista

## ✅ Solución Implementada

### Parte 1: JavaScript del iframe (`sticky-compare-simple.js`)

El script detecta si está en un iframe y:
- **En standalone**: Crea el botón con `position: fixed` (centrado verticalmente)
- **En iframe**: Envía mensajes a WordPress para que cree el botón en la página padre

### Parte 2: WordPress Shortcode (actualización necesaria)

El shortcode de WordPress debe:
1. Escuchar mensajes del iframe
2. Crear el botón sticky en la página padre de WordPress
3. Actualizar el botón cuando cambia el contador

## 🔧 Código para Actualizar en WordPress

Añade este código JavaScript al shortcode de WordPress (en `wordpress-shortcode-simple.php`):

```javascript
// AÑADIR DENTRO DEL SCRIPT EXISTENTE, DESPUÉS DE LA FUNCIÓN ajustarAltura()

let stickyButton = null;

// Crear botón sticky en la página padre de WordPress
function crearBotonSticky() {
    if (stickyButton) return stickyButton;
    
    console.log('🔧 WordPress: Creando botón sticky en página padre');
    
    stickyButton = document.createElement('div');
    stickyButton.innerHTML = 'Comparar (0)';
    stickyButton.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        right: 20px !important;
        transform: translateY(-50%) !important;
        background: linear-gradient(135deg, #4A90E2, #357ABD) !important;
        color: white !important;
        padding: 0.8rem 1rem !important;
        border-radius: 50px !important;
        box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4) !important;
        cursor: pointer !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        z-index: 99999 !important;
        transition: all 0.3s ease !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        min-width: 130px !important;
        text-align: center !important;
        display: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        user-select: none !important;
        pointer-events: auto !important;
    `;
    
    // Click event - navegar a comparación en el iframe
    stickyButton.addEventListener('click', function() {
        console.log('👆 WordPress: Click en botón sticky');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ tipo: 'navegarAComparacion' }, '*');
        }
    });
    
    // Hover effects
    stickyButton.addEventListener('mouseenter', function() {
        stickyButton.style.transform = 'translateY(-50%) translateX(-5px) scale(1.05)';
        stickyButton.style.boxShadow = '0 12px 35px rgba(74, 144, 226, 0.6)';
    });
    
    stickyButton.addEventListener('mouseleave', function() {
        stickyButton.style.transform = 'translateY(-50%)';
        stickyButton.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
    });
    
    // Ocultar en móvil
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileView(e) {
        if (e.matches) {
            stickyButton.style.display = 'none !important';
            stickyButton.style.visibility = 'hidden !important';
        } else {
            stickyButton.style.visibility = 'visible';
        }
    }
    mediaQuery.addListener(handleMobileView);
    handleMobileView(mediaQuery);
    
    document.body.appendChild(stickyButton);
    console.log('✅ WordPress: Botón sticky creado en página padre');
    
    return stickyButton;
}

// Actualizar botón sticky
function actualizarBotonSticky(mostrar, contador) {
    const boton = crearBotonSticky();
    
    console.log('🔄 WordPress: Actualizando botón sticky:', { mostrar, contador });
    
    if (mostrar && contador > 0) {
        boton.style.display = 'block';
        boton.innerHTML = `Comparar (${contador})`;
    } else {
        boton.style.display = 'none';
    }
}

// MODIFICAR EL LISTENER DE MENSAJES EXISTENTE PARA AÑADIR:
// (Busca donde dice "window.addEventListener('message'..." y añade este caso)

if (typeof e.data === 'object' && e.data.tipo === 'updateStickyButton') {
    actualizarBotonSticky(e.data.mostrar, e.data.contador);
}

// AÑADIR AL EVENTO LOAD DEL IFRAME:
// (Busca donde dice "iframe.addEventListener('load'..." y añade esto dentro)

setTimeout(function() {
    iframe.contentWindow.postMessage({ tipo: 'stickyButtonCreated' }, '*');
}, 500);

// AÑADIR AL EVENTO BEFOREUNLOAD:
// (Busca donde dice "window.addEventListener('beforeunload'..." y añade esto dentro)

if (stickyButton && stickyButton.parentElement) {
    stickyButton.parentElement.removeChild(stickyButton);
}
```

## 📝 Instrucciones de Implementación

1. **Abre el archivo `functions.php` de tu tema de WordPress**

2. **Busca el código del shortcode `mobile_plans_shortcode_simple`**

3. **Dentro del `<script>` existente, añade las funciones anteriores**

4. **Modifica el listener de mensajes para incluir el manejo del botón sticky**

5. **Guarda y prueba**

## 🎯 Resultado Esperado

- ✅ En standalone: Botón centrado verticalmente con `position: fixed`
- ✅ En WordPress iframe: Botón creado en la página padre de WordPress
- ✅ Siempre visible durante el scroll
- ✅ Se actualiza cuando seleccionas/deseleccionas planes
- ✅ Oculto en móvil automáticamente

## 🔍 Verificación

Para verificar que funciona:

1. Abre la consola del navegador (F12)
2. Deberías ver: `"🔧 WordPress: Creando botón sticky en página padre"`
3. Selecciona un plan
4. Deberías ver: `"🔄 WordPress: Actualizando botón sticky"`
5. El botón debe aparecer y mantenerse visible al hacer scroll

## ⚠️ Nota Importante

El archivo `wordpress-shortcode-simple.php` actual está corrupto. Necesitas:
1. Hacer backup del archivo actual
2. Recrearlo desde cero con el código original
3. Añadir las modificaciones indicadas arriba

O alternativamente, puedo proporcionarte el archivo completo corregido si lo prefieres.

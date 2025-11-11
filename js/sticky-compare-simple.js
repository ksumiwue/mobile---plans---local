/**
 * BOTÓN STICKY SIMPLIFICADO - Versión que SÍ funciona
 * Enfoque directo sin complicaciones
 */

(function() {
    'use strict';
    
    console.log('🔥 STICKY SIMPLE: Iniciando...');
    
    let button = null;
    let lastCount = 0;
    
    // Crear botón inmediatamente
    function createButton() {
        if (button) return;
        
        console.log('🔧 Creando botón sticky...');
        
        button = document.createElement('div');
        button.innerHTML = 'Comparar (0)';
        button.style.cssText = `
            position: absolute !important;
            top: 550px !important;
            right: 0px !important;
            background: linear-gradient(135deg, #4A90E2, #357ABD) !important;
            color: white !important;
            padding: 0.8rem 1rem !important;
            border-radius: 50px !important;
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4) !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
            z-index: 999 !important;
            transition: all 0.3s ease !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            min-width: 130px !important;
            text-align: center !important;
            display: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            user-select: none !important;
            pointer-events: auto !important;
        `;
        
        // Click event
        button.addEventListener('click', function() {
            console.log('👆 Click en botón sticky');
            if (window.app && window.app.navigation) {
                window.app.navigation.navigateTo('compare');
            } else {
                alert('Ir a comparación');
            }
        });
        
        // Hover effects
        button.addEventListener('mouseenter', function() {
            button.style.transform = 'translateX(-5px) scale(1.05)';
            button.style.boxShadow = '0 12px 35px rgba(74, 144, 226, 0.6)';
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'none';
            button.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
        });
        
        // DEBUG: Buscar todas las opciones posibles
        const plansSection = document.querySelector('#plans-page');
        const plansContainer = document.querySelector('#plans-section');
        const productsContainer = document.querySelector('#products-container');
        const sortControls = document.querySelector('.sort-controls, .filter-controls');
        
        console.log('🔍 DEBUG contenedores encontrados:', {
            plansSection: !!plansSection,
            plansContainer: !!plansContainer,
            productsContainer: !!productsContainer,
            sortControls: !!sortControls
        });
        
        // Intentar múltiples contenedores en orden de preferencia
        let targetContainer = plansSection || plansContainer || productsContainer || document.body;
        
        console.log('🎯 Contenedor objetivo:', targetContainer.tagName, targetContainer.id || targetContainer.className);
        
        // Asegurar que el contenedor tenga position relative
        const containerStyle = window.getComputedStyle(targetContainer);
        if (containerStyle.position === 'static') {
            targetContainer.style.position = 'relative';
            console.log('📐 Position relative añadido al contenedor');
        }
        
        // Añadir el botón
        targetContainer.appendChild(button);
        console.log('✅ Botón añadido al contenedor:', targetContainer.tagName);
        
        // Si no es body, añadir información extra de debug
        if (targetContainer !== document.body) {
            console.log('📍 Información del contenedor:', {
                offsetWidth: targetContainer.offsetWidth,
                offsetHeight: targetContainer.offsetHeight,
                position: window.getComputedStyle(targetContainer).position
            });
        }
        console.log('✅ Botón sticky creado y añadido al DOM');
    }
    
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
    
    // Contar productos seleccionados
    function countSelectedProducts() {
        let count = 0;
        
        // Método 1: window.app.comparisonStore
        if (window.app && window.app.comparisonStore && window.app.comparisonStore.size !== undefined) {
            count = window.app.comparisonStore.size;
            console.log('📊 Método 1 - Store:', count);
            return count;
        }
        
        // Método 2: Checkboxes marcados
        const checkedBoxes = document.querySelectorAll('input.compare-checkbox:checked');
        count = checkedBoxes.length;
        console.log('📊 Método 2 - Checkboxes:', count);
        
        return count;
    }
    
    // Actualizar botón
    function updateButton() {
        if (!button) createButton();
        
        const onPlansPage = isOnPlansPage();
        const productCount = countSelectedProducts();
        
        // Verificar específicamente si estamos en la página de comparación
        const onComparePage = document.querySelector('#compare-page:not([style*="display: none"])');
        
        const shouldShow = onPlansPage && productCount > 0 && !onComparePage;
        
        console.log('🔄 Actualizando botón:', { onPlansPage, productCount, onComparePage: !!onComparePage, shouldShow });
        
        if (shouldShow) {
            button.style.display = 'block';
            button.innerHTML = `Comparar (${productCount})`;
            lastCount = productCount;
        } else {
            button.style.display = 'none';
        }
    }
    
    // Forzar mostrar botón (para debug)
    function forceShow() {
        if (!button) createButton();
        button.style.display = 'block';
        button.innerHTML = 'STICKY FORZADO';
        console.log('🚀 Botón forzado a mostrarse');
        console.log('📍 Contenedor del botón:', button.parentElement);
        console.log('📐 Posición del botón:', {
            top: button.style.top,
            right: button.style.right,
            position: button.style.position
        });
    }
    
    // Eventos y observadores
    function setupEvents() {
        console.log('🎯 Configurando eventos...');
        
        // Observar clicks en checkboxes
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('compare-checkbox')) {
                console.log('👆 Click en checkbox detectado');
                setTimeout(updateButton, 500); // Más tiempo para asegurar
            }
        });
        
        // Observar cambios en las secciones de página
        const observer = new MutationObserver(function(mutations) {
            let pageChanged = false;
            mutations.forEach(function(mutation) {
                if (mutation.target.classList && mutation.target.classList.contains('page-section')) {
                    pageChanged = true;
                }
            });
            
            if (pageChanged) {
                console.log('📄 Cambio de página detectado');
                setTimeout(updateButton, 300);
            }
        });
        
        // Observar todas las secciones
        document.querySelectorAll('.page-section').forEach(function(section) {
            observer.observe(section, { attributes: true, attributeFilter: ['style'] });
        });
        
        // Verificación periódica agresiva
        setInterval(updateButton, 3000);
        
        console.log('✅ Eventos configurados');
    }
    
    // Funciones globales para debug
    window.stickyDebug = {
        show: forceShow,
        update: updateButton,
        count: countSelectedProducts,
        isPlans: isOnPlansPage,
        button: () => button
    };
    
    // Inicialización inmediata
    console.log('🚀 Iniciando sticky button simple...');
    
    // Crear botón inmediatamente
    setTimeout(createButton, 100);
    
    // Configurar eventos
    setTimeout(setupEvents, 200);
    
    // Primera actualización
    setTimeout(updateButton, 500);
    
    // Verificaciones adicionales
    setTimeout(updateButton, 2000);
    setTimeout(updateButton, 5000);
    
    console.log('✅ Sticky button simple configurado');
    
})();
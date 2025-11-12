/**
 * Botón de Comparación Sticky - Siempre visible durante scroll
 * Funciona dentro de iframe y sigue el scroll del usuario
 */

(function() {
    'use strict';
    
    console.log('🔥 BOTÓN STICKY: Script cargado correctamente');
    
    let stickyButton = null;
    let isButtonVisible = false;
    let productCount = 0;
    
    /**
     * Crear botón sticky que sigue el scroll
     */
    function createStickyButton() {
        if (stickyButton) return;
        
        stickyButton = document.createElement('div');
        stickyButton.className = 'compare-sticky-btn';
        
        // OCULTAR EN MÓVIL INMEDIATAMENTE
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
        stickyButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: white;
            padding: 1rem 1.25rem;
            border-radius: 60px;
            box-shadow: 0 8px 25px rgba(74, 144, 226, 0.4);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 9999;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            min-width: 140px;
            text-align: center;
            display: none;
            font-family: inherit;
            user-select: none;
        `;
        
        stickyButton.addEventListener('click', function() {
            if (window.app && window.app.navigation) {
                window.app.navigation.navigateTo('compare');
            }
        });
        
        stickyButton.addEventListener('mouseenter', function() {
            stickyButton.style.transform = 'translateX(-5px) scale(1.05)';
            stickyButton.style.boxShadow = '0 12px 35px rgba(74, 144, 226, 0.6)';
            stickyButton.style.background = 'linear-gradient(135deg, #357ABD, #2563EB)';
        });
        
        stickyButton.addEventListener('mouseleave', function() {
            stickyButton.style.transform = 'none';
            stickyButton.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
            stickyButton.style.background = 'linear-gradient(135deg, #4A90E2, #357ABD)';
        });
        
        document.body.appendChild(stickyButton);
        console.log('✅ Botón sticky creado');
    }
    
    /**
     * Actualizar visibilidad y texto del botón
     */
    function updateStickyButton(count, currentPage) {
        if (!stickyButton) createStickyButton();
        
        productCount = count;
        
        // Solo mostrar en página de planes con productos seleccionados
        const shouldShow = currentPage === 'plans' && count > 0;
        
        if (shouldShow && !isButtonVisible) {
            stickyButton.style.display = 'block';
            stickyButton.textContent = `Comparar (${count})`;
            isButtonVisible = true;
            console.log(`🔄 Botón sticky mostrado: ${count} productos`);
        } else if (!shouldShow && isButtonVisible) {
            stickyButton.style.display = 'none';
            isButtonVisible = false;
            console.log('🔄 Botón sticky ocultado');
        } else if (shouldShow && count !== productCount) {
            stickyButton.textContent = `Comparar (${count})`;
            console.log(`🔄 Botón sticky actualizado: ${count} productos`);
        }
    }
    
    /**
     * Detectar página actual
     */
    function getCurrentPage() {
        const plansVisible = document.querySelector('#plans-page:not([style*="display: none"])');
        const homeVisible = document.querySelector('#home-page:not([style*="display: none"])');
        const compareVisible = document.querySelector('#compare-page:not([style*="display: none"])');
        
        if (plansVisible) return 'plans';
        if (homeVisible) return 'home';
        if (compareVisible) return 'compare';
        return 'unknown';
    }
    
    /**
     * Obtener número de productos en comparación
     */
    function getComparisonCount() {
        // Método 1: Desde window.app.comparisonStore (CORRECTO)
        if (window.app && window.app.comparisonStore && window.app.comparisonStore.size !== undefined) {
            console.log('📊 Productos en store:', window.app.comparisonStore.size);
            return window.app.comparisonStore.size;
        }
        
        // Método 2: Desde window.comparisonStore (fallback)
        if (window.comparisonStore && window.comparisonStore.size !== undefined) {
            console.log('📊 Productos en window.comparisonStore:', window.comparisonStore.size);
            return window.comparisonStore.size;
        }
        
        // Método 3: Contar checkboxes marcados en la página
        const checkedBoxes = document.querySelectorAll('input[type="checkbox"].compare-checkbox:checked');
        console.log('📊 Checkboxes marcados:', checkedBoxes.length);
        return checkedBoxes.length;
    }
    
    /**
     * Configurar observadores y eventos
     */
    function setupStickyButtonSystem() {
        // Verificación inicial
        setTimeout(function() {
            const currentPage = getCurrentPage();
            const count = getComparisonCount();
            updateStickyButton(count, currentPage);
        }, 500);
        
        // Observer para cambios de página
        const pageObserver = new MutationObserver(function(mutations) {
            let pageChanged = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (mutation.target.classList.contains('page-section')) {
                        pageChanged = true;
                    }
                }
            });
            
            if (pageChanged) {
                setTimeout(function() {
                    const currentPage = getCurrentPage();
                    const count = getComparisonCount();
                    updateStickyButton(count, currentPage);
                }, 100);
            }
        });
        
        // Observar cambios en secciones de página
        document.querySelectorAll('.page-section').forEach(function(section) {
            pageObserver.observe(section, {
                attributes: true,
                attributeFilter: ['style']
            });
        });
        
        // Observer para cambios de productos seleccionados
        const productObserver = new MutationObserver(function(mutations) {
            let productChanged = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.target.type === 'checkbox' || 
                    mutation.target.classList.contains('product-card') ||
                    mutation.target.classList.contains('comparison-checkbox')) {
                    productChanged = true;
                }
            });
            
            if (productChanged) {
                setTimeout(function() {
                    const currentPage = getCurrentPage();
                    const count = getComparisonCount();
                    updateStickyButton(count, currentPage);
                }, 100);
            }
        });
        
        // Observar productos grid
        const productsGrid = document.querySelector('.products-grid-new, .products-grid');
        if (productsGrid) {
            productObserver.observe(productsGrid, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        
        // Escuchar clicks en checkboxes de comparación específicamente
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('compare-checkbox')) {
                console.log('🎯 Click detectado en checkbox de comparación:', e.target.dataset.productId);
                
                setTimeout(function() {
                    const currentPage = getCurrentPage();
                    const count = getComparisonCount();
                    console.log('🔄 Actualizando botón sticky:', { count, currentPage });
                    updateStickyButton(count, currentPage);
                }, 300); // Tiempo suficiente para que se actualice el store
            }
        });
        
        // Escuchar eventos de navegación
        document.addEventListener('navigation:change', function(e) {
            setTimeout(function() {
                const currentPage = getCurrentPage();
                const count = getComparisonCount();
                updateStickyButton(count, currentPage);
            }, 300);
        });
        
        // Verificación periódica como backup (más frecuente inicialmente)
        let checkCount = 0;
        const backupInterval = setInterval(function() {
            checkCount++;
            const currentPage = getCurrentPage();
            const count = getComparisonCount();
            updateStickyButton(count, currentPage);
            
            // Después de 30 segundos, reducir frecuencia
            if (checkCount > 15) {
                clearInterval(backupInterval);
                
                // Verificación menos frecuente
                setInterval(function() {
                    const currentPage = getCurrentPage();
                    const count = getComparisonCount();
                    updateStickyButton(count, currentPage);
                }, 5000);
            }
        }, 2000);
        
        console.log('✅ Sistema de botón sticky configurado');
    }
    
    // Integración global
    window.stickyCompareButton = {
        update: updateStickyButton,
        show: function() { updateStickyButton(getComparisonCount(), getCurrentPage()); },
        hide: function() { updateStickyButton(0, getCurrentPage()); },
        getCurrentPage: getCurrentPage,
        getCount: getComparisonCount
    };
    
    // Función de debug inmediato
    window.debugStickyButton = function() {
        console.log('🔍 DEBUG BOTÓN STICKY:');
        console.log('- stickyButton existe:', !!stickyButton);
        console.log('- isButtonVisible:', isButtonVisible);
        console.log('- productCount:', productCount);
        console.log('- getCurrentPage():', getCurrentPage());
        console.log('- getComparisonCount():', getComparisonCount());
        console.log('- window.app:', !!window.app);
        console.log('- window.app.comparisonStore:', window.app?.comparisonStore?.size);
        
        // Crear botón forzadamente
        createStickyButton();
        stickyButton.style.display = 'block';
        stickyButton.textContent = 'PRUEBA STICKY';
        console.log('✅ Botón de prueba creado');
        
        return { stickyButton, isButtonVisible, productCount };
    };
    
    // Inicializar inmediatamente para debug
    console.log('🚀 Iniciando sistema sticky button...');
    setupStickyButtonSystem();
    
    // También cuando el DOM esté listo (por si acaso)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM cargado, re-iniciando sticky button...');
            setupStickyButtonSystem();
        });
    }
    
})();
/**
 * Auto-ajuste de iframe ESTABLE - Solución definitiva sin bucles
 * Solo se ajusta cuando realmente cambia la página o contenido
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Modo standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: 🔧 Auto-ajuste ESTABLE iniciado...');
    
    let lastHeight = 0;
    let lastPage = '';
    let isStabilized = false;
    let stabilizationTimer;
    
    // Configuración simple de alturas por página
    const FIXED_HEIGHTS = {
        'home': 1000,
        'plans': 1800,
        'compare': 700,
        'about': 500
    };
    
    /**
     * Detectar página actual de forma robusta
     */
    function getCurrentPage() {
        console.log('🔍 Detectando página actual...');
        
        // Método 1: Sección visible (más específico)
        const sections = ['home-page', 'plans-page', 'compare-page'];
        
        for (let sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const isVisible = window.getComputedStyle(section).display !== 'none';
                console.log(`📄 Sección ${sectionId}: ${isVisible ? 'visible' : 'oculta'}`);
                
                if (isVisible) {
                    return sectionId.replace('-page', '');
                }
            }
        }
        
        // Método 2: Buscar sección con mayor contenido visible
        const allSections = document.querySelectorAll('.page-section');
        let maxHeight = 0;
        let detectedPage = 'home';
        
        allSections.forEach(section => {
            if (window.getComputedStyle(section).display !== 'none') {
                const height = section.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                    
                    if (section.id.includes('home')) detectedPage = 'home';
                    else if (section.id.includes('plans')) detectedPage = 'plans';
                    else if (section.id.includes('compare')) detectedPage = 'compare';
                }
            }
        });
        
        // Método 3: Hash URL
        const hash = window.location.hash.substring(1);
        if (hash && FIXED_HEIGHTS[hash]) {
            console.log(`🔗 Hash detectado: ${hash}`);
            detectedPage = hash;
        }
        
        console.log(`✅ Página detectada: ${detectedPage}`);
        return detectedPage;
    }
    
    /**
     * Calcular altura DINÁMICA basada en contenido real
     */
    function calculatePageHeight(page) {
        console.log(`📏 Calculando altura DINÁMICA para página: ${page}`);
        
        // Encontrar la sección visible actual
        const visibleSection = document.querySelector(`#${page}-page:not([style*="display: none"])`);
        
        if (!visibleSection) {
            console.warn(`⚠️ No se encontró sección visible para: ${page}`);
            return FIXED_HEIGHTS[page] || 1000;
        }
        
        // MÉTODO 1: Medir altura real del contenido
        let realContentHeight = 0;
        
        try {
            // Forzar que todos los elementos sean visibles temporalmente para medir
            const originalOverflow = visibleSection.style.overflow;
            visibleSection.style.overflow = 'visible';
            
            // Medir altura real del contenido
            realContentHeight = Math.max(
                visibleSection.scrollHeight,
                visibleSection.offsetHeight
            );
            
            // Restaurar overflow
            visibleSection.style.overflow = originalOverflow;
            
            console.log(`📐 Altura real de la sección: ${realContentHeight}px`);
            
        } catch (e) {
            console.warn('Error midiendo sección:', e);
            realContentHeight = FIXED_HEIGHTS[page] || 1000;
        }
        
        // MÉTODO 2: Verificar elementos específicos que pueden cambiar
        let dynamicAdjustments = 0;
        
        // Para página de planes: verificar productos filtrados/cargados
        if (page === 'plans') {
            const productGrid = visibleSection.querySelector('.products-grid-new, .products-grid');
            const productCards = visibleSection.querySelectorAll('.product-card-new, .product-card, .plan-card:not([style*="display: none"])');
            
            if (productGrid && productCards.length > 0) {
                // Calcular altura basada en productos realmente visibles
                let lastCardBottom = 0;
                
                productCards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const sectionRect = visibleSection.getBoundingClientRect();
                    const cardBottom = (rect.bottom - sectionRect.top);
                    lastCardBottom = Math.max(lastCardBottom, cardBottom);
                });
                
                if (lastCardBottom > 0) {
                    dynamicAdjustments = Math.max(0, lastCardBottom - realContentHeight + 200);
                    console.log(`📊 Productos visibles: ${productCards.length}, última tarjeta: ${lastCardBottom}px, ajuste: +${dynamicAdjustments}px`);
                }
            }
        }
        
        // Para página de comparación: medir tabla real
        if (page === 'compare') {
            const comparisonTable = visibleSection.querySelector('.comparison-table, .comparison-container, .compare-content');
            
            if (comparisonTable) {
                const tableHeight = Math.max(comparisonTable.scrollHeight, comparisonTable.offsetHeight);
                const tableTop = comparisonTable.offsetTop || 0;
                const calculatedCompareHeight = tableTop + tableHeight + 150;
                
                if (calculatedCompareHeight > realContentHeight) {
                    dynamicAdjustments = calculatedCompareHeight - realContentHeight;
                    console.log(`📋 Tabla de comparación: ${tableHeight}px, ajuste: +${dynamicAdjustments}px`);
                }
            }
        }
        
        // Para página home: verificar featured plans
        if (page === 'home') {
            const featuredContainer = visibleSection.querySelector('.featured-plans-container, .plans-section');
            
            if (featuredContainer) {
                const featuredHeight = featuredContainer.offsetHeight || 0;
                const featuredTop = featuredContainer.offsetTop || 0;
                const calculatedHomeHeight = featuredTop + featuredHeight + 200;
                
                if (calculatedHomeHeight > realContentHeight) {
                    dynamicAdjustments = calculatedHomeHeight - realContentHeight;
                    console.log(`🏠 Featured plans: ${featuredHeight}px, ajuste: +${dynamicAdjustments}px`);
                }
            }
        }
        
        // MÉTODO 3: Verificar altura del documento completo como referencia
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
        
        // Altura final = mayor entre contenido real + ajustes dinámicos
        let finalHeight = realContentHeight + dynamicAdjustments;
        
        // Verificar que no sea excesivamente diferente del documento
        if (documentHeight > finalHeight && documentHeight < finalHeight * 1.5) {
            finalHeight = Math.max(finalHeight, documentHeight);
            console.log(`📄 Usando altura del documento como referencia: ${documentHeight}px`);
        }
        
        // Aplicar límites de seguridad pero más permisivos
        const minHeights = {
            'home': 600,
            'plans': 800, 
            'compare': 400,
            'about': 300
        };
        
        const maxHeights = {
            'home': 2000,
            'plans': 4000, // Aumentado para permitir muchos productos
            'compare': 2000, // Aumentado para comparaciones grandes
            'about': 1000
        };
        
        finalHeight = Math.max(finalHeight, minHeights[page] || 600);
        finalHeight = Math.min(finalHeight, maxHeights[page] || 2000);
        
        console.log(`✅ Altura DINÁMICA calculada para ${page}:`, {
            alturaRealSeccion: realContentHeight,
            ajustesDinamicos: dynamicAdjustments,
            alturaDocumento: documentHeight,
            alturaFinal: finalHeight
        });
        
        return Math.round(finalHeight);
    }
    
    /**
     * Enviar altura al parent
     */
    function sendHeightToParent(height, page) {
        if (height === lastHeight && page === lastPage) {
            console.log(`📏 Sin cambios: ${height}px (${page})`);
            return;
        }
        
        console.log(`📤 Enviando altura: ${lastHeight}px → ${height}px (${page})`);
        
        try {
            window.parent.postMessage({
                type: 'resize',
                height: height,
                page: page,
                timestamp: Date.now()
            }, '*');
        } catch (e) {
            console.warn('📤 Error enviando mensaje:', e);
        }
        
        lastHeight = height;
        lastPage = page;
    }
    
    /**
     * Ajustar altura solo cuando sea necesario
     */
    function adjustHeight(reason = 'manual') {
        const currentPage = getCurrentPage();
        const pageChanged = currentPage !== lastPage;
        
        console.log(`🔧 Ajustando altura por: ${reason}, página: ${currentPage}, cambio: ${pageChanged}, estabilizado: ${isStabilized}`);
        
        // SIEMPRE ajustar si hay cambio de página, independientemente del estado de estabilización
        if (pageChanged || reason === 'navigation' || reason === 'initial' || reason === 'load-complete') {
            const newHeight = calculatePageHeight(currentPage);
            sendHeightToParent(newHeight, currentPage);
            
            // Resetear estabilización en cambio de página
            isStabilized = false;
            clearTimeout(stabilizationTimer);
            
            // Estabilizar después de 2 segundos (reducido)
            stabilizationTimer = setTimeout(() => {
                isStabilized = true;
                console.log(`🔒 Iframe estabilizado para página: ${currentPage} (${newHeight}px)`);
            }, 2000);
        } else if (isStabilized) {
            console.log(`🔒 Iframe estabilizado, ignorando ajuste por: ${reason}`);
        } else {
            console.log(`📏 Sin cambio de página (${currentPage}), no ajustando`);
        }
    }
    
    /**
     * Configurar eventos MÍNIMOS
     */
    function setupEvents() {
        // Solo escuchar eventos de navegación específicos
        document.addEventListener('navigation:change', (e) => {
            console.log('🧭 Evento navegación detectado:', e.detail);
            adjustHeight('navigation');
        });
        
        // Escuchar clicks en navegación (más amplio)
        document.addEventListener('click', (e) => {
            const navElement = e.target.closest('[data-page], .nav-link, .navigation-item, .cta, .cta-minimal, .compare-floating-btn');
            const isButton = e.target.tagName === 'BUTTON' && e.target.textContent.includes('Plan');
            
            if (navElement || isButton) {
                console.log('🧭 Click navegación detectado:', e.target.textContent || e.target.className);
                
                // Forzar detección de cambio después del click
                setTimeout(() => {
                    lastPage = ''; // Resetear para forzar detección
                    adjustHeight('navigation');
                }, 300);
            }
        });
        
        // Hash change
        window.addEventListener('hashchange', () => {
            console.log('🧭 Hash change detectado');
            adjustHeight('navigation');
        });
        
        console.log('🧭 Eventos mínimos configurados');
    }
    
    /**
     * Observer para cambios de página (MEJORADO)
     */
    function setupPageObserver() {
        let observerActive = true;
        
        const observer = new MutationObserver((mutations) => {
            if (!observerActive) return;
            
            let shouldCheck = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList.contains('page-section') || target.id.includes('-page')) {
                        console.log('👀 Observer: cambio en sección detectado:', target.id);
                        shouldCheck = true;
                    }
                }
            });
            
            if (shouldCheck) {
                // Resetear página anterior para forzar detección
                const oldPage = lastPage;
                setTimeout(() => {
                    const newPage = getCurrentPage();
                    console.log(`👀 Observer verificando: ${oldPage} → ${newPage}`);
                    
                    if (newPage !== oldPage) {
                        lastPage = ''; // Forzar cambio
                        adjustHeight('page-change');
                    }
                }, 100);
            }
        });
        
        // Observar solo las secciones de página específicas
        const targetSelectors = ['#home-page', '#plans-page', '#compare-page'];
        let observedCount = 0;
        
        targetSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                observer.observe(element, {
                    attributes: true,
                    attributeFilter: ['style', 'class'],
                    childList: false,
                    subtree: false
                });
                observedCount++;
            }
        });
        
        // Mantener observer activo por más tiempo para detectar navegación
        setTimeout(() => {
            observerActive = false;
            observer.disconnect();
            console.log('👀 Observer desactivado después de 20 segundos');
        }, 20000); // Aumentado a 20 segundos
        
        console.log('👀 Observer configurado para', observedCount, 'secciones específicas');
    }
    
    /**
     * Inicialización
     */
    function initialize() {
        console.log('🚀 Iniciando auto-ajuste estable...');
        
        // Ajuste inicial
        setTimeout(() => {
            adjustHeight('initial');
        }, 500);
        
        // Configurar eventos mínimos
        setupEvents();
        setupPageObserver();
        
        // Verificación periódica para cambios de página Y contenido dinámico
        let checks = 0;
        let lastContentSignature = '';
        
        const dynamicCheckInterval = setInterval(() => {
            checks++;
            
            const currentPage = getCurrentPage();
            
            // Verificar cambios de página
            if (currentPage !== lastPage) {
                console.log(`🔄 Verificación: cambio de página ${lastPage} → ${currentPage}`);
                lastPage = ''; // Forzar detección
                adjustHeight('page-change-check');
                return;
            }
            
            // Verificar cambios de contenido en la misma página
            const contentSignature = getContentSignature(currentPage);
            if (contentSignature !== lastContentSignature) {
                console.log(`🔄 Verificación: cambio de contenido detectado en ${currentPage}`);
                console.log(`Contenido: ${lastContentSignature} → ${contentSignature}`);
                lastContentSignature = contentSignature;
                adjustHeight('content-change');
            }
            
            // Parar verificaciones después de 2 minutos
            if (checks > 40) {
                clearInterval(dynamicCheckInterval);
                console.log('🔄 Verificaciones dinámicas finalizadas');
            }
        }, 3000); // Cada 3 segundos por 2 minutos
        
        // Función para detectar cambios en contenido
        function getContentSignature(page) {
            let signature = '';
            
            const section = document.querySelector(`#${page}-page:not([style*="display: none"])`);
            if (!section) return '';
            
            if (page === 'plans') {
                // Contar productos visibles y altura del grid
                const cards = section.querySelectorAll('.product-card-new, .product-card, .plan-card:not([style*="display: none"])');
                const grid = section.querySelector('.products-grid-new, .products-grid');
                const gridHeight = grid ? grid.offsetHeight : 0;
                signature = `plans:${cards.length}:${gridHeight}`;
            } else if (page === 'compare') {
                // Verificar contenido de comparación
                const table = section.querySelector('.comparison-table, .comparison-container');
                const tableHeight = table ? table.offsetHeight : 0;
                const compareItems = section.querySelectorAll('.compare-item, .product-compare');
                signature = `compare:${compareItems.length}:${tableHeight}`;
            } else if (page === 'home') {
                // Verificar featured plans
                const featured = section.querySelector('.featured-plans-container, .plans-section');
                const featuredHeight = featured ? featured.offsetHeight : 0;
                signature = `home:${featuredHeight}`;
            }
            
            return signature;
        }
        
        // Inicializar signature
        lastContentSignature = getContentSignature(getCurrentPage());
        
        // Ajuste en load completo
        window.addEventListener('load', () => {
            setTimeout(() => adjustHeight('load-complete'), 1000);
        });
        
        console.log('✅ Auto-ajuste estable configurado');
    }
    
    // Función de debug simplificada
    window.mobilePlansDebugIframe = function() {
        const currentPage = getCurrentPage();
        const currentHeight = calculatePageHeight(currentPage);
        
        console.log('🔍 DEBUG iframe estable:', {
            paginaActual: currentPage,
            alturaActual: lastHeight,
            alturaCalculada: currentHeight,
            estabilizado: isStabilized,
            ultimaPagina: lastPage
        });
        
        return {
            currentPage,
            lastHeight,
            currentHeight,
            isStabilized,
            forceResize: () => adjustHeight('debug-force'),
            stabilize: () => { isStabilized = true; },
            unstabilize: () => { isStabilized = false; }
        };
    };
    
    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
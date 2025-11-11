/**
 * Auto-ajuste de iframe MEJORADO - Soluciona problema de altura fija
 * Versión optimizada que solo mide la sección activa visible
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Ejecutándose standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: 🔧 Auto-ajuste MEJORADO iniciado...');
    
    let lastHeight = 0;
    let resizeTimeout;
    let observerTimeout;
    let currentPage = 'home';
    let heightCalculationMethod = 'visible'; // 'visible', 'total', 'smart'
    
    // Configuración de alturas por página (AMPLIADA PARA GRIDS)
    const PAGE_HEIGHT_CONFIGS = {
        'home': { min: 600, max: 1800, target: 1000 }, // Aumentado para featured plans
        'plans': { min: 800, max: 2500, target: 1800 }, // Aumentado para grid completo de productos
        'compare': { min: 500, max: 1200, target: 600 }, // Aumentado ligeramente
        'about': { min: 400, max: 800, target: 500 }
    };
    
    /**
     * Detectar página actual de forma inteligente
     */
    function detectCurrentPage() {
        // Método 1: Sección visible
        const visibleSection = document.querySelector('.page-section:not([style*="display: none"]):not([style*="display:none"])');
        if (visibleSection) {
            const pageId = visibleSection.id || '';
            if (pageId.includes('home')) return 'home';
            if (pageId.includes('plans')) return 'plans';
            if (pageId.includes('compare')) return 'compare';
            if (pageId.includes('about')) return 'about';
        }
        
        // Método 2: URL hash
        const hash = window.location.hash.substring(1);
        if (hash) return hash;
        
        // Método 3: Clase body
        const bodyClasses = document.body.className;
        if (bodyClasses.includes('page-plans')) return 'plans';
        if (bodyClasses.includes('page-compare')) return 'compare';
        if (bodyClasses.includes('page-home')) return 'home';
        
        // Fallback
        return 'home';
    }
    
    /**
     * Calcular altura solo de la sección visible (SOLUCIÓN PRINCIPAL MEJORADA)
     */
    function calculateVisibleSectionHeight() {
        // Encontrar la sección actualmente visible
        const visibleSection = document.querySelector('.page-section:not([style*="display: none"]):not([style*="display:none"])');
        
        let calculatedHeight = 600; // altura mínima de seguridad
        
        if (visibleSection) {
            console.log('📐 Analizando sección visible:', visibleSection.id);
            
            // MÉTODO 1: Altura básica de la sección
            let sectionHeight = Math.max(
                visibleSection.scrollHeight,
                visibleSection.offsetHeight
            );
            
            // MÉTODO 2: Calcular altura específica para grids de productos
            const productGrid = visibleSection.querySelector('.products-grid-new, .products-grid, .featured-plans-container');
            if (productGrid) {
                console.log('🔍 Grid de productos encontrado, calculando altura real...');
                
                // Forzar que el grid se muestre completamente
                const gridRect = productGrid.getBoundingClientRect();
                const gridScrollHeight = productGrid.scrollHeight;
                const gridOffsetHeight = productGrid.offsetHeight;
                
                // Buscar todas las tarjetas de productos
                const productCards = productGrid.querySelectorAll('.product-card-new, .product-card, .plan-card');
                
                if (productCards.length > 0) {
                    // Calcular altura basada en las tarjetas reales
                    let maxCardBottom = 0;
                    productCards.forEach(card => {
                        const cardRect = card.getBoundingClientRect();
                        const cardBottom = cardRect.bottom - gridRect.top;
                        maxCardBottom = Math.max(maxCardBottom, cardBottom);
                    });
                    
                    if (maxCardBottom > 0) {
                        // Altura del grid = altura de las tarjetas + padding
                        const realGridHeight = maxCardBottom + 50; // padding extra
                        
                        // Altura de la sección = posición del grid + altura del grid + elementos adicionales
                        const gridOffsetTop = productGrid.offsetTop;
                        const otherElementsHeight = 200; // espacio para header, títulos, footer, etc.
                        
                        sectionHeight = Math.max(
                            sectionHeight, // altura original
                            gridOffsetTop + realGridHeight + otherElementsHeight
                        );
                        
                        console.log('📊 Altura calculada del grid:', {
                            tarjetas: productCards.length,
                            alturaMaxTarjeta: maxCardBottom,
                            alturaGridReal: realGridHeight,
                            posicionGrid: gridOffsetTop,
                            alturaFinalSeccion: sectionHeight
                        });
                    }
                }
                
                // Alternativa: usar altura natural del grid si es mayor
                const naturalGridHeight = Math.max(gridScrollHeight, gridOffsetHeight);
                if (naturalGridHeight > 0) {
                    const gridOffsetTop = productGrid.offsetTop;
                    const alternativeHeight = gridOffsetTop + naturalGridHeight + 150;
                    sectionHeight = Math.max(sectionHeight, alternativeHeight);
                    
                    console.log('📏 Altura alternativa del grid:', {
                        scrollHeight: gridScrollHeight,
                        offsetHeight: gridOffsetHeight,
                        posicion: gridOffsetTop,
                        alturaAlternativa: alternativeHeight
                    });
                }
            }
            
            // MÉTODO 3: Verificar comparación o contenido especial
            const comparisonTable = visibleSection.querySelector('.comparison-table, .comparison-container');
            if (comparisonTable) {
                const tableHeight = Math.max(comparisonTable.scrollHeight, comparisonTable.offsetHeight);
                const tableOffsetTop = comparisonTable.offsetTop;
                sectionHeight = Math.max(sectionHeight, tableOffsetTop + tableHeight + 100);
                
                console.log('📋 Tabla de comparación detectada:', {
                    alturaTabla: tableHeight,
                    posicionTabla: tableOffsetTop,
                    alturaFinal: tableOffsetTop + tableHeight + 100
                });
            }
            
            // MÉTODO 4: Usar document.body.scrollHeight como referencia final
            const bodyScrollHeight = document.body.scrollHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxDocumentHeight = Math.max(bodyScrollHeight, documentHeight);
            
            // Solo usar altura del documento si es razonable y mayor que la calculada
            if (maxDocumentHeight > sectionHeight && maxDocumentHeight < sectionHeight * 2) {
                sectionHeight = Math.max(sectionHeight, maxDocumentHeight);
                console.log('📄 Usando altura del documento:', maxDocumentHeight);
            }
            
            // Añadir padding extra para elementos fijos
            const headerHeight = document.querySelector('header, .hero-section')?.offsetHeight || 0;
            const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
            const extraPadding = 150; // padding de seguridad aumentado
            
            calculatedHeight = sectionHeight + headerHeight + footerHeight + extraPadding;
            
            console.log('📐 Altura final calculada:', {
                seccion: visibleSection.id,
                alturaSeccion: sectionHeight,
                header: headerHeight,
                footer: footerHeight,
                padding: extraPadding,
                total: calculatedHeight
            });
        }
        
        return Math.max(calculatedHeight, 400); // mínimo absoluto
    }
    
    /**
     * Calcular altura inteligente con límites por página
     */
    function calculateSmartHeight() {
        const currentPageType = detectCurrentPage();
        const config = PAGE_HEIGHT_CONFIGS[currentPageType] || PAGE_HEIGHT_CONFIGS['home'];
        
        console.log(`🧠 Cálculo inteligente para página: ${currentPageType}`, config);
        
        // Método 1: Solo sección visible
        let visibleHeight = calculateVisibleSectionHeight();
        
        // Método 2: Límites inteligentes por tipo de página CON DETECCIÓN DE GRIDS
        const hasProductGrid = document.querySelector('.products-grid-new, .products-grid, .featured-plans-container');
        const productCount = hasProductGrid ? hasProductGrid.querySelectorAll('.product-card-new, .product-card, .plan-card').length : 0;
        
        // Si hay muchos productos, aumentar límites dinámicamente
        let dynamicConfig = { ...config };
        if (productCount > 6) {
            dynamicConfig.max = config.max * 1.5; // Aumentar 50% el límite máximo
            console.log(`🔍 Grid con ${productCount} productos detectado, límite ampliado a ${dynamicConfig.max}px`);
        }
        
        if (visibleHeight < dynamicConfig.min) {
            console.log(`⚠️ Altura ${visibleHeight}px muy baja, usando mínimo ${dynamicConfig.min}px`);
            visibleHeight = dynamicConfig.min;
        } else if (visibleHeight > dynamicConfig.max) {
            console.log(`⚠️ Altura ${visibleHeight}px muy alta, usando máximo ${dynamicConfig.max}px (${productCount} productos)`);
            visibleHeight = dynamicConfig.max;
        }
        
        // Método 3: Verificación de contenido real
        const contentElements = document.querySelectorAll('.products-grid, .comparison-table, .hero-section, .featured-plans');
        if (contentElements.length > 0) {
            let maxContentHeight = 0;
            contentElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                maxContentHeight = Math.max(maxContentHeight, rect.bottom - rect.top);
            });
            
            if (maxContentHeight > 0 && maxContentHeight < visibleHeight) {
                visibleHeight = Math.min(visibleHeight, maxContentHeight + 200);
                console.log('📏 Altura ajustada por contenido real:', maxContentHeight + 200);
            }
        }
        
        return Math.round(visibleHeight);
    }
    
    /**
     * Enviar nueva altura al parent iframe
     */
    function sendHeightToParent(height) {
        if (height === lastHeight) return;
        
        const heightToSend = Math.max(height, 400);
        
        console.log(`📤 Enviando altura al parent: ${lastHeight}px → ${heightToSend}px`);
        
        // Múltiples métodos de comunicación para máxima compatibilidad
        try {
            // Método 1: PostMessage estándar
            window.parent.postMessage({
                type: 'resize',
                height: heightToSend,
                page: currentPage,
                timestamp: Date.now()
            }, '*');
            
            // Método 2: PostMessage alternativo
            window.parent.postMessage({
                type: 'mobile_plans_height_changed',
                height: heightToSend,
                page: currentPage
            }, '*');
            
            // Método 3: Evento personalizado (si el parent lo escucha)
            window.parent.postMessage({
                action: 'iframe_resize',
                data: { height: heightToSend }
            }, '*');
            
        } catch (e) {
            console.warn('📤 Error enviando mensaje al parent:', e);
        }
        
        lastHeight = heightToSend;
    }
    
    /**
     * Función principal de ajuste de altura OPTIMIZADA
     */
    function adjustHeight(force = false) {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const newPage = detectCurrentPage();
            const pageChanged = newPage !== currentPage;
            
            if (pageChanged) {
                console.log(`📄 Cambio de página detectado: ${currentPage} → ${newPage}`);
                currentPage = newPage;
                
                // Reset altura en cambio de página
                sendHeightToParent(PAGE_HEIGHT_CONFIGS[newPage]?.target || 600);
                
                // Esperar a que se renderice la nueva página
                setTimeout(() => adjustHeight(true), 500);
                return;
            }
            
            // Calcular nueva altura
            const newHeight = calculateSmartHeight();
            
            // Solo actualizar si hay cambio REALMENTE significativo o es forzado
            const heightDifference = Math.abs(newHeight - lastHeight);
            const isSignificantChange = heightDifference > 30; // Aumentado de 10 a 30px
            
            // Evitar bucles en páginas estables
            const isStablePage = (currentPage === 'home' || currentPage === 'compare') && !force;
            const hasStableHeight = heightDifference < 5 && lastHeight > 0;
            
            if (force || (isSignificantChange && !hasStableHeight)) {
                sendHeightToParent(newHeight);
            } else if (isStablePage && hasStableHeight) {
                console.log(`📏 Página estable (${currentPage}), altura sin cambios: ${heightDifference}px`);
                return; // No hacer nada más
            } else {
                console.log(`📏 Altura sin cambios significativos: ${heightDifference}px`);
            }
            
        }, 200); // Aumentado debounce de 100ms a 200ms
    }
    
    /**
     * Observador de cambios en el DOM OPTIMIZADO
     */
    function setupDOMObserver() {
        let observerUpdateCount = 0;
        
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            let significantChange = false;
            
            mutations.forEach(mutation => {
                // Detectar cambios de estilo (show/hide de secciones)
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList.contains('page-section')) {
                        console.log('👀 Cambio de visibilidad en sección:', target.id);
                        shouldUpdate = true;
                        significantChange = true;
                    }
                }
                
                // Detectar contenido agregado/removido SIGNIFICATIVO
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Solo contenido realmente significativo
                            const hasSignificantContent = node.querySelector('.products-grid, .comparison-table, .hero-section, .product-card');
                            const isLargeElement = node.offsetHeight > 100; // Aumentado de 50 a 100px
                            
                            if (hasSignificantContent || isLargeElement) {
                                console.log('👀 Contenido significativo agregado:', node.className || node.tagName);
                                shouldUpdate = true;
                                significantChange = true;
                                break;
                            }
                        }
                    }
                }
            });
            
            if (shouldUpdate) {
                observerUpdateCount++;
                
                // Después de 10 actualizaciones, ser más selectivo
                if (observerUpdateCount > 10 && !significantChange) {
                    console.log('👀 Observer: demasiadas actualizaciones menores, ignorando');
                    return;
                }
                
                clearTimeout(observerTimeout);
                const delay = significantChange ? 300 : 1000; // Más delay para cambios menores
                observerTimeout = setTimeout(() => adjustHeight(significantChange), delay);
            }
        });
        
        // Observar solo elementos específicos importantes
        const targetElements = [
            document.querySelector('#home-page'),
            document.querySelector('#plans-page'),
            document.querySelector('#compare-page'),
            document.body
        ].filter(el => el !== null);
        
        targetElements.forEach(element => {
            observer.observe(element, {
                childList: true,
                subtree: false, // No observar todos los subelementos
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
        
        console.log('👀 Observer de DOM optimizado configurado para', targetElements.length, 'elementos');
    }
    
    /**
     * Configurar eventos de navegación personalizada
     */
    function setupNavigationEvents() {
        // Escuchar eventos de navegación customizados
        document.addEventListener('navigation:change', (e) => {
            console.log('🧭 Evento de navegación detectado:', e.detail);
            currentPage = e.detail.page || 'home';
            setTimeout(() => adjustHeight(true), 100);
        });
        
        // Escuchar cambios de hash
        window.addEventListener('hashchange', () => {
            console.log('🧭 Hash change detectado:', window.location.hash);
            setTimeout(() => adjustHeight(true), 100);
        });
        
        // Escuchar clicks en navegación
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-page], [href*="#"]');
            if (navLink) {
                console.log('🧭 Click en navegación detectado');
                setTimeout(() => adjustHeight(true), 300);
            }
        });
        
        console.log('🧭 Eventos de navegación configurados');
    }
    
    /**
     * Inicialización
     */
    function initialize() {
        console.log('🚀 Iniciando auto-ajuste de iframe mejorado...');
        
        // Configuración inicial
        currentPage = detectCurrentPage();
        console.log('📄 Página inicial detectada:', currentPage);
        
        // Ajuste inicial
        setTimeout(() => adjustHeight(true), 500);
        
        // Configurar observadores y eventos
        setupDOMObserver();
        setupNavigationEvents();
        
        // Ajustes periódicos de verificación REDUCIDOS
        let periodicCheckCount = 0;
        const periodicInterval = setInterval(() => {
            periodicCheckCount++;
            
            // Después de 5 verificaciones (15 segundos), reducir frecuencia
            if (periodicCheckCount > 5) {
                clearInterval(periodicInterval);
                
                // Verificación muy esporádica solo para cambios de página
                setInterval(() => {
                    const detectedPage = detectCurrentPage();
                    if (detectedPage !== currentPage) {
                        console.log('🔄 Verificación esporádica: cambio de página detectado');
                        adjustHeight(true);
                    }
                }, 10000); // Solo cada 10 segundos
                
                return;
            }
            
            const detectedPage = detectCurrentPage();
            if (detectedPage !== currentPage) {
                console.log('🔄 Verificación inicial: cambio de página detectado');
                adjustHeight(true);
            }
        }, 3000);
        
        // Ajuste en resize de ventana
        window.addEventListener('resize', () => adjustHeight());
        
        // Ajuste cuando se termina de cargar todo
        window.addEventListener('load', () => {
            setTimeout(() => adjustHeight(true), 1000);
        });
        
        console.log('✅ Auto-ajuste de iframe configurado correctamente');
    }
    
    // Función de debug global
    window.mobilePlansDebugIframe = function() {
        const currentHeight = calculateSmartHeight();
        const config = PAGE_HEIGHT_CONFIGS[currentPage];
        
        console.log('🔍 DEBUG Mobile Plans Iframe:', {
            paginaActual: currentPage,
            alturaActual: lastHeight,
            alturaCalculada: currentHeight,
            configuracion: config,
            seccionVisible: document.querySelector('.page-section:not([style*="display: none"])')?.id,
            metodosDisponibles: {
                calculateVisibleSectionHeight,
                calculateSmartHeight,
                adjustHeight: () => adjustHeight(true),
                detectCurrentPage
            }
        });
        
        return {
            currentPage,
            lastHeight,
            currentHeight,
            config,
            forceResize: () => adjustHeight(true)
        };
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();
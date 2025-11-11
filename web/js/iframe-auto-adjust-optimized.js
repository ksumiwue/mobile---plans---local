/**
 * Auto-ajuste de iframe optimizado para WordPress
 * Evita refreshes innecesarios y solo ajusta cuando hay cambios reales
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Ejecutándose standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: Detectado iframe, iniciando auto-ajuste optimizado...');
    
    let lastHeight = 0;
    let resizeTimeout;
    let isInitialized = false;
    let contentStableCount = 0;
    const STABLE_THRESHOLD = 3; // Número de medidas iguales consecutivas para considerar contenido estable
    const HEIGHT_TOLERANCE = 10; // Píxeles de tolerancia para considerar cambio significativo
    
    /**
     * Calcular altura real del contenido de forma optimizada y conservadora
     */
    function calculateRealHeight() {
        // Limpiar secciones ocultas primero
        cleanHiddenSections();
        
        const body = document.body;
        const html = document.documentElement;
        
        // Métodos básicos de cálculo
        const basicHeights = [
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
        ];
        
        // Encontrar el último elemento visible de forma más precisa
        const lastVisibleElement = findTrueLastVisibleElement();
        
        // Si encontramos un último elemento visible, usarlo como referencia
        if (lastVisibleElement) {
            const rect = lastVisibleElement.getBoundingClientRect();
            const elementBottom = rect.bottom + window.pageYOffset;
            
            // Agregar padding mínimo (solo 10px en lugar de 40)
            basicHeights.push(Math.ceil(elementBottom + 10));
            
            console.log('📏 Último elemento visible:', {
                element: lastVisibleElement.tagName + (lastVisibleElement.className ? '.' + lastVisibleElement.className.split(' ')[0] : ''),
                bottom: elementBottom,
                rect: rect
            });
        }
        
        const finalHeight = Math.max(...basicHeights);
        
        console.log('📏 Altura calculada (conservadora):', {
            finalHeight,
            bodyScroll: body.scrollHeight,
            bodyOffset: body.offsetHeight,
            lastElementUsed: !!lastVisibleElement
        });
        
        return Math.ceil(finalHeight);
    }
    
    /**
     * Limpiar secciones ocultas de forma conservadora
     */
    function cleanHiddenSections() {
        // Solo limpiar las secciones de página que estén explícitamente ocultas
        document.querySelectorAll('.page-section[style*="display: none"], .page-section[style*="display:none"]').forEach(section => {
            // Solo ajustar altura y overflow, sin tocar margin/padding que podrían afectar otros elementos
            section.style.height = '0px';
            section.style.overflow = 'hidden';
            section.style.visibility = 'hidden';
        });
    }
    
    /**
     * Encontrar el último elemento verdaderamente visible (más conservador)
     */
    function findTrueLastVisibleElement() {
        // Buscar en orden específico: main-content, page-section visible, elementos principales
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return null;
        
        // Primero buscar la sección de página visible
        const visibleSection = document.querySelector('.page-section:not([style*="display: none"]):not([style*="display:none"])');
        if (visibleSection) {
            // Buscar el último elemento con contenido real dentro de esta sección
            const elementsInSection = visibleSection.querySelectorAll('*');
            let lastWithContent = null;
            let maxBottom = 0;
            
            for (let i = elementsInSection.length - 1; i >= 0; i--) {
                const element = elementsInSection[i];
                const style = window.getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                
                // Solo considerar elementos que realmente ocupan espacio
                if (style.display !== 'none' && 
                    style.visibility !== 'hidden' && 
                    rect.height > 1 && 
                    rect.width > 1 &&
                    element.offsetParent !== null) {
                    
                    const bottom = rect.bottom + window.pageYOffset;
                    
                    if (bottom > maxBottom) {
                        maxBottom = bottom;
                        lastWithContent = element;
                    }
                }
            }
            
            return lastWithContent;
        }
        
        return null;
    }
    
    /**
     * Enviar altura al padre (WordPress)
     */
    function sendHeightToParent(height) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'mobile-plans-resize',
                height: height,
                timestamp: Date.now(),
                url: window.location.href,
                stable: contentStableCount >= STABLE_THRESHOLD
            }, '*');
            
            console.log('📡 Mobile Plans: Altura enviada al padre:', height + 'px', 
                       `(estable: ${contentStableCount >= STABLE_THRESHOLD})`);
        }
    }
    
    /**
     * Función principal de ajuste optimizada
     */
    function adjustHeight(force = false) {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const currentHeight = calculateRealHeight();
            const heightDifference = Math.abs(currentHeight - lastHeight);
            const isReduction = currentHeight < lastHeight;
            
            // Para reducciones de altura, ser más agresivo (tolerancia menor)
            const tolerance = isReduction ? 5 : HEIGHT_TOLERANCE;
            
            // Verificar si es un cambio significativo
            if (heightDifference > tolerance || force) {
                // Reset contador si hay cambio significativo
                if (heightDifference > tolerance) {
                    contentStableCount = 0;
                    console.log('🔄 Mobile Plans: Cambio significativo detectado:', 
                               `${lastHeight}px → ${currentHeight}px (diff: ${heightDifference}px, reducción: ${isReduction})`);
                } else {
                    contentStableCount++;
                }
                
                lastHeight = currentHeight;
                sendHeightToParent(currentHeight);
            } else {
                // Incrementar contador de estabilidad
                contentStableCount++;
                console.log('📏 Mobile Plans: Altura estable:', currentHeight + 'px', 
                           `(count: ${contentStableCount})`);
                
                // Enviar confirmación de estabilidad
                if (contentStableCount === STABLE_THRESHOLD) {
                    sendHeightToParent(currentHeight);
                }
            }
        }, isInitialized ? 150 : 50); // Menor delay para inicialización
    }
    
    /**
     * Aplicar estilos CSS específicos para iframe (versión conservadora)
     */
    function applyIframeStyles() {
        const iframeStyles = `
            <style id="mobile-plans-iframe-styles">
            /* Estilos mínimos y seguros para iframe */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }
            
            body {
                background: transparent !important;
            }
            
            /* SOLO corregir secciones ocultas sin afectar el resto */
            .page-section[style*="display: none"],
            .page-section[style*="display:none"] {
                height: 0 !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }
            
            /* Asegurar que las secciones visibles se muestren correctamente */
            .page-section:not([style*="display: none"]):not([style*="display:none"]) {
                height: auto !important;
                overflow: visible !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Ocultar scrollbars sin afectar layout */
            ::-webkit-scrollbar {
                width: 0px !important;
                background: transparent !important;
            }
            
            * {
                -ms-overflow-style: none !important;
                scrollbar-width: none !important;
            }
            
            /* Prevenir elementos vacíos que creen espacios */
            br:empty,
            p:empty:not(.floating-card):not([class*="floating"]),
            div:empty:not(.floating-card):not([class*="floating"]):not([class*="grid"]) {
                display: none !important;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', iframeStyles);
        console.log('✅ Mobile Plans: Estilos conservadores de iframe aplicados');
    }
    
    /**
     * Observador de mutaciones optimizado para detectar cambios de sección
     */
    function setupOptimizedObserver() {
        let mutationTimeout;
        
        const observer = new MutationObserver(function(mutations) {
            let hasRelevantMutation = false;
            let hasSectionChange = false;
            
            // Verificar mutaciones
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    hasRelevantMutation = mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
                }
                
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    const attr = mutation.attributeName;
                    
                    // Detectar cambios de display en secciones de página
                    if (attr === 'style' && target.classList.contains('page-section')) {
                        hasSectionChange = true;
                        console.log('🔄 Mobile Plans: Cambio de sección detectado:', target.id || target.className);
                    }
                    
                    // Solo atributos que pueden afectar el layout
                    hasRelevantMutation = hasRelevantMutation || 
                        ((attr === 'style' || attr === 'class' || attr === 'hidden') &&
                         target && target.offsetParent !== null);
                }
            });
            
            if (hasSectionChange || hasRelevantMutation) {
                clearTimeout(mutationTimeout);
                
                // Si hay cambio de sección, reajustar inmediatamente
                const delay = hasSectionChange ? 100 : 200;
                
                mutationTimeout = setTimeout(() => {
                    console.log('🔄 Mobile Plans: DOM cambió, reajustando...', {
                        sectionChange: hasSectionChange,
                        relevantMutation: hasRelevantMutation
                    });
                    
                    // Reset contador de estabilidad en cambios de sección
                    if (hasSectionChange) {
                        contentStableCount = 0;
                        adjustHeight(true); // Forzar recálculo
                    } else {
                        adjustHeight();
                    }
                }, delay);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });
        
        console.log('👁️ Mobile Plans: Observer optimizado configurado con detección de secciones');
        return observer;
    }
    
    /**
     * Observador de resize optimizado
     */
    function setupOptimizedResizeObserver() {
        if (window.ResizeObserver) {
            let resizeTimeout;
            
            const resizeObserver = new ResizeObserver(function(entries) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    console.log('📐 Mobile Plans: Resize significativo detectado');
                    contentStableCount = 0; // Reset estabilidad en resize
                    adjustHeight();
                }, 250);
            });
            
            resizeObserver.observe(document.body);
            console.log('📐 Mobile Plans: ResizeObserver optimizado configurado');
            return resizeObserver;
        }
    }
    
    /**
     * Escuchar mensajes del padre y eventos de navegación
     */
    function setupMessageListener() {
        // Mensajes del padre WordPress
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'mobile-plans-request-height') {
                console.log('📡 Mobile Plans: Solicitud de altura recibida del padre');
                adjustHeight(true); // Forzar medición
            }
        });
        
        // Escuchar eventos de navegación interna
        document.addEventListener('navigation:change', function(event) {
            console.log('📡 Mobile Plans: Cambio de navegación detectado:', event.detail);
            
            // Reset estado y forzar recálculo inmediato
            contentStableCount = 0;
            lastHeight = 0;
            
            // Dar tiempo a que se complete la navegación
            setTimeout(() => {
                console.log('🔄 Mobile Plans: Reajustando altura después de navegación...');
                adjustHeight(true);
            }, 200);
            
            // Segundo ajuste para asegurar estabilidad
            setTimeout(() => {
                adjustHeight(true);
            }, 600);
        });
        
        // Escuchar clics en navegación (fallback)
        document.addEventListener('click', function(event) {
            const navItem = event.target.closest('.nav-item');
            if (navItem) {
                const page = navItem.dataset.page;
                console.log('📡 Mobile Plans: Navegación por clic detectada:', page);
                
                // Reset estado
                contentStableCount = 0;
                
                // Ajustar después de un tiempo corto
                setTimeout(() => {
                    adjustHeight(true);
                }, 300);
            }
        });
    }
    
    /**
     * Detectar cuando el contenido está completamente cargado
     */
    function waitForContentReady() {
        return new Promise((resolve) => {
            // Verificar si elementos principales ya están presentes
            const checkContent = () => {
                const hasProducts = document.querySelector('.product-card, .plan-card, .products-grid');
                const hasMainContent = document.querySelector('.main-content, body > *');
                
                if (hasProducts || hasMainContent) {
                    console.log('✅ Mobile Plans: Contenido principal detectado');
                    resolve();
                } else {
                    console.log('⏳ Mobile Plans: Esperando contenido...');
                    setTimeout(checkContent, 100);
                }
            };
            
            checkContent();
        });
    }
    
    /**
     * Inicialización optimizada
     */
    async function init() {
        console.log('🚀 Mobile Plans: Inicializando ajuste automático optimizado...');
        
        // Aplicar estilos específicos para iframe
        applyIframeStyles();
        
        // Configurar comunicación
        setupMessageListener();
        
        // Esperar a que el contenido esté listo
        await waitForContentReady();
        
        // Configurar observadores
        const mutationObserver = setupOptimizedObserver();
        const resizeObserver = setupOptimizedResizeObserver();
        
        // Ajuste inicial más inteligente
        setTimeout(() => {
            console.log('📏 Mobile Plans: Ajuste inicial optimizado...');
            adjustHeight(true);
            isInitialized = true;
        }, 300);
        
        // Solo un reajuste adicional si no está estable
        setTimeout(() => {
            if (contentStableCount < STABLE_THRESHOLD) {
                console.log('📏 Mobile Plans: Reajuste de verificación...');
                adjustHeight();
            }
        }, 1000);
        
        // Listener de resize de ventana optimizado
        let windowResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(windowResizeTimeout);
            windowResizeTimeout = setTimeout(() => {
                console.log('📐 Mobile Plans: Window resize - reajustando');
                contentStableCount = 0;
                adjustHeight();
            }, 300);
        });
        
        // Función global para debug y ajuste manual
        window.mobilePlansIframeResize = () => adjustHeight(true);
        
        // Limpiar al cerrar
        window.addEventListener('beforeunload', () => {
            if (mutationObserver) mutationObserver.disconnect();
            if (resizeObserver) resizeObserver.disconnect();
        });
        
        console.log('✅ Mobile Plans: Sistema optimizado configurado completamente');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
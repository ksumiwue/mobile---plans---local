/**
 * Auto-ajuste de iframe MÍNIMO - Solo corrige refresh continuo
 * NO modifica CSS ni layout, solo optimiza la comunicación
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Ejecutándose standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: Iniciando ajuste mínimo optimizado...');
    
    let lastHeight = 0;
    let resizeTimeout;
    let isInitialized = false;
    let measurementCount = 0;
    let isStable = false;
    
    const HEIGHT_TOLERANCE = 8; // Tolerancia para considerar cambio significativo
    const MAX_MEASUREMENTS = 5; // Máximo número de mediciones automáticas
    
    /**
     * Calcular altura de forma simple y directa
     */
    function calculateHeight() {
        const body = document.body;
        const html = document.documentElement;
        
        return Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.scrollHeight,
            html.offsetHeight
        );
    }
    
    /**
     * Enviar altura al padre
     */
    function sendHeightToParent(height) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'mobile-plans-resize',
                height: height,
                timestamp: Date.now(),
                stable: isStable
            }, '*');
            
            console.log('📡 Mobile Plans: Altura enviada:', height + 'px', isStable ? '(estable)' : '');
        }
    }
    
    /**
     * Función principal de ajuste
     */
    function adjustHeight(force = false) {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const currentHeight = calculateHeight();
            const heightDifference = Math.abs(currentHeight - lastHeight);
            
            // Solo ajustar si hay cambio significativo, es forzado, o no hemos llegado al límite
            if (heightDifference > HEIGHT_TOLERANCE || force || measurementCount < MAX_MEASUREMENTS) {
                
                if (heightDifference > HEIGHT_TOLERANCE || force) {
                    measurementCount++;
                    lastHeight = currentHeight;
                    
                    console.log(`🔄 Mobile Plans: Altura ${lastHeight}px → ${currentHeight}px (diff: ${heightDifference}px) [${measurementCount}/${MAX_MEASUREMENTS}]`);
                    
                    sendHeightToParent(currentHeight);
                }
                
                // Marcar como estable si hemos hecho suficientes mediciones sin cambios grandes
                if (measurementCount >= MAX_MEASUREMENTS && heightDifference <= HEIGHT_TOLERANCE) {
                    isStable = true;
                    sendHeightToParent(currentHeight);
                    console.log('✅ Mobile Plans: Marcado como estable tras', measurementCount, 'mediciones');
                }
            }
        }, isInitialized ? 200 : 100);
    }
    
    /**
     * Configurar observer básico para cambios importantes
     */
    function setupBasicObserver() {
        if (window.MutationObserver) {
            let mutationTimeout;
            
            const observer = new MutationObserver(function(mutations) {
                let hasSignificantChange = false;
                
                mutations.forEach(function(mutation) {
                    // Solo detectar cambios de navegación (display en page-section)
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' && 
                        mutation.target.classList.contains('page-section')) {
                        hasSignificantChange = true;
                    }
                    
                    // Detectar adición/eliminación de elementos importantes
                    if (mutation.type === 'childList' && 
                        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        hasSignificantChange = true;
                    }
                });
                
                if (hasSignificantChange && !isStable) {
                    clearTimeout(mutationTimeout);
                    mutationTimeout = setTimeout(() => {
                        console.log('🔄 Mobile Plans: Cambio significativo detectado');
                        adjustHeight();
                    }, 300);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
            
            console.log('👁️ Mobile Plans: Observer básico configurado');
            return observer;
        }
    }
    
    /**
     * Escuchar mensajes y eventos de navegación
     */
    function setupEventListeners() {
        // Mensajes del padre
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'mobile-plans-request-height') {
                console.log('📡 Mobile Plans: Solicitud del padre recibida');
                adjustHeight(true);
            }
        });
        
        // Eventos de navegación interna
        document.addEventListener('navigation:change', function(event) {
            console.log('📡 Mobile Plans: Navegación detectada:', event.detail);
            
            // Reset para nueva página
            measurementCount = 0;
            isStable = false;
            
            // Ajustar después de que se complete la navegación
            setTimeout(() => {
                adjustHeight(true);
            }, 400);
        });
        
        // Resize de ventana
        let windowResizeTimeout;
        window.addEventListener('resize', function() {
            if (!isStable) {
                clearTimeout(windowResizeTimeout);
                windowResizeTimeout = setTimeout(() => {
                    console.log('📐 Mobile Plans: Resize de ventana');
                    adjustHeight();
                }, 400);
            }
        });
    }
    
    /**
     * Inicialización
     */
    async function init() {
        console.log('🚀 Mobile Plans: Inicializando ajuste mínimo...');
        
        // Configurar eventos
        setupEventListeners();
        
        // Configurar observer
        const observer = setupBasicObserver();
        
        // Esperar a que se cargue el contenido
        setTimeout(() => {
            console.log('📏 Mobile Plans: Primer ajuste...');
            adjustHeight(true);
            isInitialized = true;
        }, 500);
        
        // Un segundo ajuste por seguridad
        setTimeout(() => {
            if (!isStable) {
                adjustHeight(true);
            }
        }, 1500);
        
        // Función global para debug
        window.mobilePlansDebugMinimal = function() {
            console.log('🔧 Mobile Plans Debug:', {
                altura: lastHeight,
                mediciones: measurementCount,
                estable: isStable,
                inicializado: isInitialized
            });
            adjustHeight(true);
        };
        
        // Limpiar al cerrar
        window.addEventListener('beforeunload', () => {
            if (observer) observer.disconnect();
        });
        
        console.log('✅ Mobile Plans: Sistema mínimo configurado');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
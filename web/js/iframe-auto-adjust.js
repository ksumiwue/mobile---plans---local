/**
 * Auto-ajuste de iframe para WordPress
 * Se carga automáticamente cuando está en iframe
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Ejecutándose standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: Detectado iframe, iniciando auto-ajuste...');
    
    let lastHeight = 0;
    let resizeTimeout;
    
    /**
     * Calcular altura real del contenido
     */
    function calculateRealHeight() {
        const body = document.body;
        const html = document.documentElement;
        
        // Forzar recálculo de estilos
        body.style.display = 'none';
        body.offsetHeight; // Force reflow
        body.style.display = '';
        
        // Obtener todas las métricas posibles
        const heights = [
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        ];
        
        // También considerar el último elemento visible
        const lastElement = body.lastElementChild;
        if (lastElement) {
            const rect = lastElement.getBoundingClientRect();
            heights.push(rect.bottom + 20); // + padding
        }
        
        const maxHeight = Math.max(...heights);
        
        console.log('📏 Mobile Plans: Alturas calculadas:', {
            bodyScrollHeight: body.scrollHeight,
            bodyOffsetHeight: body.offsetHeight,
            htmlScrollHeight: html.scrollHeight,
            htmlOffsetHeight: html.offsetHeight,
            lastElementBottom: lastElement ? lastElement.getBoundingClientRect().bottom : 0,
            maxCalculated: maxHeight
        });
        
        return Math.ceil(maxHeight);
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
                url: window.location.href
            }, '*');
            
            console.log('📡 Mobile Plans: Altura enviada al padre:', height + 'px');
        }
    }
    
    /**
     * Función principal de ajuste
     */
    function adjustHeight() {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            const currentHeight = calculateRealHeight();
            
            // Solo enviar si hay cambio significativo (más de 10px)
            if (Math.abs(currentHeight - lastHeight) > 10) {
                lastHeight = currentHeight;
                sendHeightToParent(currentHeight);
            }
        }, 100);
    }
    
    /**
     * Aplicar estilos CSS específicos para iframe
     */
    function applyIframeStyles() {
        const iframeStyles = `
            <style id="mobile-plans-iframe-styles">
            /* Estilos específicos para iframe */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
                box-sizing: border-box !important;
            }
            
            body {
                min-height: auto !important;
                height: auto !important;
                background: transparent !important;
            }
            
            /* Ajustar contenedor principal */
            .main-content {
                padding: 15px !important;
                margin: 0 !important;
                max-width: 100% !important;
                overflow: hidden !important;
            }
            
            /* Ajustar secciones */
            .page-section {
                margin-bottom: 20px !important;
                padding: 15px !important;
            }
            
            /* Ajustar grid de productos */
            .products-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
                gap: 15px !important;
                margin: 15px 0 !important;
                padding: 0 !important;
            }
            
            /* Ajustar tarjetas de productos */
            .product-card, .plan-card {
                margin: 0 !important;
                padding: 15px !important;
                box-sizing: border-box !important;
                width: 100% !important;
                min-height: auto !important;
            }
            
            /* Ajustar navegación */
            #navigation-container {
                margin: 0 !important;
                padding: 10px 15px !important;
            }
            
            /* Ajustar hero section */
            .hero-section {
                padding: 20px 15px !important;
                margin: 0 !important;
            }
            
            .hero-content {
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            
            /* Responsive para iframe */
            @media (max-width: 768px) {
                .main-content {
                    padding: 10px !important;
                }
                
                .page-section {
                    padding: 10px !important;
                    margin-bottom: 15px !important;
                }
                
                .products-grid {
                    grid-template-columns: 1fr !important;
                    gap: 10px !important;
                }
                
                .hero-section {
                    padding: 15px 10px !important;
                }
            }
            
            /* Ocultar scrollbars */
            ::-webkit-scrollbar {
                display: none !important;
            }
            
            * {
                -ms-overflow-style: none !important;
                scrollbar-width: none !important;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', iframeStyles);
        console.log('✅ Mobile Plans: Estilos de iframe aplicados');
    }
    
    /**
     * Observador de mutaciones para detectar cambios en el DOM
     */
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldResize = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && 
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    shouldResize = true;
                } else if (mutation.type === 'attributes' && 
                          (mutation.attributeName === 'style' || 
                           mutation.attributeName === 'class')) {
                    shouldResize = true;
                }
            });
            
            if (shouldResize) {
                console.log('🔄 Mobile Plans: DOM cambió, reajustando altura...');
                setTimeout(adjustHeight, 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });
        
        console.log('👁️ Mobile Plans: Observer configurado');
        return observer;
    }
    
    /**
     * Observador de resize para cambios de ventana
     */
    function setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(function(entries) {
                console.log('📐 Mobile Plans: Resize detectado');
                setTimeout(adjustHeight, 200);
            });
            
            resizeObserver.observe(document.body);
            resizeObserver.observe(document.documentElement);
            
            console.log('📐 Mobile Plans: ResizeObserver configurado');
            return resizeObserver;
        }
    }
    
    /**
     * Escuchar mensajes del padre
     */
    function setupMessageListener() {
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'mobile-plans-request-height') {
                console.log('📡 Mobile Plans: Solicitud de altura recibida del padre');
                adjustHeight();
            }
        });
    }
    
    /**
     * Inicialización completa
     */
    function init() {
        console.log('🚀 Mobile Plans: Inicializando ajuste automático de iframe...');
        
        // Aplicar estilos específicos para iframe
        applyIframeStyles();
        
        // Configurar comunicación
        setupMessageListener();
        
        // Configurar observadores
        const mutationObserver = setupObserver();
        const resizeObserver = setupResizeObserver();
        
        // Ajuste inicial después de que todo esté listo
        setTimeout(() => {
            console.log('📏 Mobile Plans: Ajuste inicial...');
            adjustHeight();
        }, 500);
        
        // Ajustes adicionales escalonados
        setTimeout(() => adjustHeight(), 1000);
        setTimeout(() => adjustHeight(), 2000);
        setTimeout(() => adjustHeight(), 3000);
        
        // Ajuste cuando la ventana cambia de tamaño
        window.addEventListener('resize', () => {
            console.log('📐 Mobile Plans: Window resize detectado');
            setTimeout(adjustHeight, 300);
        });
        
        // Ajuste cuando se hace scroll (por si cambia algo)
        window.addEventListener('scroll', () => {
            setTimeout(adjustHeight, 100);
        });
        
        // Función global para debug y ajuste manual
        window.mobilePlansIframeResize = adjustHeight;
        
        // Limpiar al cerrar
        window.addEventListener('beforeunload', () => {
            if (mutationObserver) mutationObserver.disconnect();
            if (resizeObserver) resizeObserver.disconnect();
        });
        
        console.log('✅ Mobile Plans: Sistema de auto-ajuste configurado completamente');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // También inicializar en window.load por si acaso
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('🔄 Mobile Plans: Reajuste post-load');
            adjustHeight();
        }, 500);
    });
    
})();
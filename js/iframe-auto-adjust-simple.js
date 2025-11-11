/**
 * Auto-ajuste de iframe SIMPLE - Basado en ejemplo_iframe.txt que funciona
 * Método simple y directo que SÍ funciona
 */

(function() {
    'use strict';
    
    // Solo ejecutar si estamos en iframe
    if (window.self === window.top) {
        console.log('📱 Mobile Plans: Modo standalone, no en iframe');
        return;
    }
    
    console.log('📱 Mobile Plans: 🔧 Auto-ajuste SIMPLE iniciado (método que funciona)...');
    
    let ultimaAltura = 0;
    
    /**
     * Calcular altura REAL del contenido visible - CORREGIDO
     */
    function calcularAlturaTotalDocumento() {
        // Buscar la sección actualmente visible
        const seccionVisible = document.querySelector('.page-section:not([style*="display: none"])');
        
        if (seccionVisible) {
            // Medir solo la sección visible + padding
            const alturaSeccion = Math.max(
                seccionVisible.scrollHeight,
                seccionVisible.offsetHeight
            );
            
            // Añadir espacio óptimo para header, footer y padding
            const alturaFinal = alturaSeccion + 150; // padding perfecto
            
            console.log('📏 Sección visible:', seccionVisible.id, 'Altura:', alturaFinal + 'px');
            return alturaFinal;
        } else {
            // Fallback: altura del documento pero limitada
            const alturaDocumento = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            // Limitar altura máxima para evitar valores excesivos
            const alturaLimitada = Math.min(alturaDocumento, 2500);
            
            console.log('📏 Altura documento (limitada):', alturaLimitada + 'px');
            return alturaLimitada;
        }
    }
    
    /**
     * Enviar altura al parent - CORREGIDO para permitir reducción
     */
    function enviarAltura() {
        const nuevaAltura = calcularAlturaTotalDocumento();
        
        // SIEMPRE enviar la altura, incluso si es menor (para permitir reducción)
        if (Math.abs(nuevaAltura - ultimaAltura) > 20 || ultimaAltura === 0) {
            try {
                window.parent.postMessage({
                    tipo: 'ajustarAltura',
                    altura: nuevaAltura
                }, '*');
                
                console.log('📤 Altura enviada:', ultimaAltura + 'px → ' + nuevaAltura + 'px');
                ultimaAltura = nuevaAltura;
            } catch (e) {
                console.warn('📤 Error enviando mensaje:', e);
            }
        }
    }
    
    /**
     * Escuchar solicitudes de altura del parent - EXACTAMENTE como el ejemplo
     */
    window.addEventListener('message', function(e) {
        if (typeof e.data === 'object' && e.data.tipo === 'solicitarAltura') {
            console.log('📨 Solicitud de altura recibida del parent');
            enviarAltura();
        }
    });
    
    /**
     * Observer para detectar cambios importantes en el DOM
     */
    function configurarObserver() {
        let ultimaSeccionVisible = '';
        
        const observer = new MutationObserver(function(mutations) {
            let huboChangios = false;
            
            mutations.forEach(function(mutation) {
                // Detectar cambios de display en secciones (navegación)
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('page-section')) {
                        console.log('👀 Cambio de sección detectado:', target.id);
                        huboChangios = true;
                    }
                }
                
                // Detectar contenido añadido/removido significativo
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.offsetHeight > 50) { // Elemento significativo
                            console.log('👀 Contenido significativo añadido');
                            huboChangios = true;
                            break;
                        }
                    }
                }
            });
            
            if (huboChangios) {
                setTimeout(enviarAltura, 200);
            }
        });
        
        // Observar cambios en secciones específicas
        const secciones = document.querySelectorAll('.page-section');
        secciones.forEach(function(seccion) {
            observer.observe(seccion, {
                attributes: true,
                attributeFilter: ['style'],
                childList: true,
                subtree: false
            });
        });
        
        // También observar el body para cambios generales
        observer.observe(document.body, {
            childList: true,
            subtree: false,
            attributes: false
        });
        
        console.log('👀 Observer configurado para', secciones.length, 'secciones');
        
        // Verificar cambios de sección periódicamente
        setInterval(function() {
            const seccionActual = document.querySelector('.page-section:not([style*="display: none"])')?.id || 'ninguna';
            if (seccionActual !== ultimaSeccionVisible) {
                console.log('🔄 Cambio de sección detectado:', ultimaSeccionVisible, '→', seccionActual);
                ultimaSeccionVisible = seccionActual;
                setTimeout(enviarAltura, 300);
            }
        }, 500); // Verificar cada medio segundo
    }
    
    /**
     * Inicialización
     */
    function inicializar() {
        console.log('🚀 Iniciando auto-ajuste simple...');
        
        // Enviar altura inicial
        setTimeout(enviarAltura, 500);
        
        // Configurar observer
        configurarObserver();
        
        // Enviar altura cuando se termina de cargar
        window.addEventListener('load', function() {
            setTimeout(enviarAltura, 1000);
        });
        
        // Enviar altura en resize
        window.addEventListener('resize', function() {
            setTimeout(enviarAltura, 100);
        });
        
        console.log('✅ Auto-ajuste simple configurado');
    }
    
    // Función de debug
    window.mobilePlansDebugIframe = function() {
        const altura = calcularAlturaTotalDocumento();
        console.log('🔍 DEBUG iframe simple:', {
            alturaCalculada: altura,
            body: {
                scrollHeight: document.body.scrollHeight,
                offsetHeight: document.body.offsetHeight
            },
            documentElement: {
                scrollHeight: document.documentElement.scrollHeight,
                offsetHeight: document.documentElement.offsetHeight
            },
            enviarAhora: enviarAltura
        });
        
        return {
            altura,
            enviarAltura
        };
    };
    
    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
    
})();
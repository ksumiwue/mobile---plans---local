/**
 * BOTÓN STICKY - Versión Compatible con WordPress iframe
 * Detecta si está en iframe y comunica con la página padre para posicionar el botón
 * - En standalone: position: fixed (centrado en viewport)
 * - En iframe de WordPress: envía mensajes a la página padre para crear el botón allí
 */

(function () {
    'use strict';

    console.log('🔥 STICKY SIMPLE: Iniciando...');

    let button = null;
    let lastCount = 0;
    let isInIframe = window.self !== window.top;

    console.log('📍 Detectado:', isInIframe ? 'DENTRO de iframe (WordPress)' : 'STANDALONE');

    // Crear botón inmediatamente
    function createButton() {
        if (button) return;

        console.log('🔧 Creando botón sticky...');

        button = document.createElement('div');
        button.innerHTML = 'Comparar (0)';

        // Estilos base comunes
        const baseStyles = `
            background: linear-gradient(135deg, #4A90E2, #357ABD) !important;
            color: white !important;
            padding: 0.8rem 1rem !important;
            border-radius: 50px !important;
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4) !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
            z-index: 9999 !important;
            transition: box-shadow 0.3s ease, transform 0.3s ease !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            min-width: 130px !important;
            text-align: center !important;
            display: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            user-select: none !important;
            pointer-events: auto !important;
        `;

        if (isInIframe) {
            // MODO IFRAME: No crear botón aquí, se creará en la página padre
            console.log('📌 Modo IFRAME: El botón se creará en la página padre de WordPress');
            // No añadimos el botón al DOM del iframe
            button = null;
            setupWordPressIntegration();
            return;
        } else {
            // MODO STANDALONE: position fixed centrado en viewport
            button.style.cssText = baseStyles + `
                position: fixed !important;
                top: 50% !important;
                right: 20px !important;
                transform: translateY(-50%) !important;
            `;
            console.log('📌 Modo STANDALONE: usando position: fixed');
        }

        // OCULTAR EN MÓVIL
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        function handleMobileView(e) {
            if (e.matches) {
                button.style.display = 'none !important';
                button.style.visibility = 'hidden !important';
            } else {
                button.style.visibility = 'visible';
            }
        }
        mediaQuery.addListener(handleMobileView);
        handleMobileView(mediaQuery);

        // Click event
        button.addEventListener('click', function () {
            console.log('👆 Click en botón sticky');
            if (window.app && window.app.navigation) {
                window.app.navigation.navigateTo('compare');
            } else {
                alert('Ir a comparación');
            }
        });

        // Hover effects
        button.addEventListener('mouseenter', function () {
            button.style.transform = 'translateY(-50%) translateX(-5px) scale(1.05)';
            button.style.boxShadow = '0 12px 35px rgba(74, 144, 226, 0.6)';
        });

        button.addEventListener('mouseleave', function () {
            button.style.transform = 'translateY(-50%)';
            button.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
        });

        // Añadir el botón al body
        document.body.appendChild(button);
        console.log('✅ Botón sticky creado y añadido al DOM');
    }

    // Integración con WordPress cuando estamos en iframe
    function setupWordPressIntegration() {
        console.log('🔗 Configurando integración con WordPress...');

        // Escuchar mensajes de la página padre
        window.addEventListener('message', function (e) {
            // WordPress confirmó creación del botón sticky
            if (e.data && e.data.tipo === 'stickyButtonCreated') {
                console.log('✅ WordPress confirmó creación del botón sticky');
            }

            // WordPress solicita navegar a comparación (click en botón)
            if (e.data && e.data.tipo === 'navegarAComparacion') {
                console.log('🔗 WordPress: Navegando a comparación desde botón sticky');
                if (window.app && window.app.navigation) {
                    window.app.navigation.navigateTo('compare');
                }
            }
        });

        console.log('✅ Integración con WordPress configurada');
    }

    // Enviar actualización del botón a WordPress
    function sendButtonUpdateToWordPress(shouldShow, count) {
        if (!isInIframe) return;

        try {
            window.parent.postMessage({
                tipo: 'updateStickyButton',
                mostrar: shouldShow,
                contador: count
            }, '*');

            console.log('📤 Mensaje enviado a WordPress:', { mostrar: shouldShow, contador: count });
        } catch (e) {
            console.error('❌ Error enviando mensaje a WordPress:', e);
        }
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
        const productCount = countSelectedProducts();

        // Verificar si estamos en home o plans (ambas páginas válidas)
        const onHomePage = document.querySelector('#home-section:not([style*="display: none"])');
        const onPlansPage = document.querySelector('#plans-section:not([style*="display: none"])');
        const onValidPage = !!(onHomePage || onPlansPage);

        // Verificar si estamos en la página de comparación (donde NO debe mostrarse)
        const onComparePage = document.querySelector('#compare-section:not([style*="display: none"])');

        const shouldShow = onValidPage && productCount > 0 && !onComparePage;

        console.log('🔄 Actualizando botón:', {
            onHomePage: !!onHomePage,
            onPlansPage: !!onPlansPage,
            onValidPage,
            productCount,
            onComparePage: !!onComparePage,
            shouldShow,
            isInIframe
        });

        if (isInIframe) {
            // Enviar actualización a WordPress
            sendButtonUpdateToWordPress(shouldShow, productCount);
        } else {
            // Actualizar botón local
            if (!button) createButton();

            if (shouldShow) {
                button.style.display = 'block';
                button.innerHTML = `Comparar (${productCount})`;
                lastCount = productCount;
            } else {
                button.style.display = 'none';
            }
        }
    }

    // Forzar mostrar botón (para debug)
    function forceShow() {
        if (isInIframe) {
            sendButtonUpdateToWordPress(true, 99);
            console.log('🚀 Mensaje forzado enviado a WordPress');
        } else {
            if (!button) createButton();
            button.style.display = 'block';
            button.innerHTML = 'STICKY FORZADO';
            console.log('🚀 Botón forzado a mostrarse');
            console.log('📍 Contenedor del botón:', button.parentElement);
            console.log('📐 Posición del botón:', {
                position: button.style.position,
                top: button.style.top,
                right: button.style.right,
                transform: button.style.transform,
                isInIframe: isInIframe
            });
        }
    }

    // Eventos y observadores
    function setupEvents() {
        console.log('🎯 Configurando eventos...');

        // Observar clicks en checkboxes
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('compare-checkbox')) {
                console.log('👆 Click en checkbox detectado');
                setTimeout(updateButton, 500);
            }
        });

        // Observar cambios en las secciones de página
        const observer = new MutationObserver(function (mutations) {
            let pageChanged = false;
            mutations.forEach(function (mutation) {
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
        document.querySelectorAll('.page-section').forEach(function (section) {
            observer.observe(section, { attributes: true, attributeFilter: ['style'] });
        });

        // Verificación periódica
        setInterval(updateButton, 3000);

        console.log('✅ Eventos configurados');
    }

    // Funciones globales para debug
    window.stickyDebug = {
        show: forceShow,
        update: updateButton,
        count: countSelectedProducts,
        button: () => button,
        isInIframe: () => isInIframe
    };

    // Inicialización inmediata
    console.log('🚀 Iniciando sticky button simple...');

    // Crear botón inmediatamente (o configurar integración con WordPress)
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
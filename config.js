// ============================================
// CONFIGURACIÓN DE PLANES DESTACADOS
// ============================================
// Edita este archivo para cambiar los planes que aparecen en la página principal

window.mobilePlansElementorConfig = {
    featuredPlans: {
        // ===== MODO DE SELECCIÓN =====
        // Opciones disponibles:
        // - 'manual': Selecciona planes específicos por ID
        // - 'auto': Muestra los primeros 3 planes
        // - 'cheapest': El más barato de cada operador
        // - 'most_expensive': El más caro de cada operador
        // - 'best_value': Mejor relación GB/precio
        mode: 'manual',

        // ===== TÍTULOS PERSONALIZADOS (Opcional) =====
        // Cambia el título y subtítulo de la sección "Planes Sugeridos"
        // Comenta estas líneas para usar los títulos por defecto
        title: '¡Ofertas Destacadas!',
        subtitle: 'Los mejores planes seleccionados para ti',

        // ===== PLANES A MOSTRAR (Solo si mode='manual') =====
        // Máximo 3 planes
        // IDs disponibles de la API: https://ipv6-informatica.es/cart/data/products.json
        manualPlans: [
            'OP25GB',      // Movistar - 25GB + PROMOCIÓN 100GB ADICIONALES - 8.22€
            'VO75GBN+',    // Vodafone - 75GB - 8.18€
            'CMJ60GB_2'    // Orange-Yoigo-Movistar - 60GB - 6.53€
        ],

        // ===== PLAN DESTACADO CON TITULAR LLAMATIVO (Opcional) =====
        // Añade un badge promocional a uno de los planes
        highlightedPlan: {
            id: 'OP25GB',                      // Debe ser uno de los IDs de manualPlans
            text: '¡PROMOCIÓN 100GB GRATIS!'   // Texto del badge (máx 25 caracteres)
        }
    }
};

console.log('✅ Configuración de planes destacados cargada:', window.mobilePlansElementorConfig);

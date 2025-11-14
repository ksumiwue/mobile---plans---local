// CONFIGURACIÓN DE PLANES DESTACADOS
// Este archivo te permite personalizar qué planes aparecen en la sección "Planes Más Populares"

window.mobilePlansElementorConfig = {
    featuredPlans: {
        // MODOS DISPONIBLES:
        // 'auto' - Primeros 3 planes automáticamente
        // 'manual' - Seleccionar planes específicos por ID de producto
        // 'cheapest' - Plan más barato de cada operador
        // 'most_expensive' - Plan más caro de cada operador  
        // 'best_value' - Mejores por relación calidad/precio
        mode: 'manual', // 👈 CAMBIAR AQUÍ EL MODO
        
        // SELECCIÓN MANUAL (solo funciona con mode: 'manual')
        // IDs de los productos que quieres destacar de la API real
        manualPlans: ['MO100GB', 'VO75GBN+', 'CMJ120GB_2'], // 👈 CAMBIAR AQUÍ LOS IDs
        
        // CONFIGURACIÓN ADICIONAL
        maxPlans: 3, // Máximo 3 planes destacados
        showPrices: true,
        showFeatures: true
    }
};

// GUÍA DE IDs DE PRODUCTOS (actualizada con datos reales de la API):
// Para usar el modo 'manual', consulta estos IDs reales:

/* IDs ACTUALES DE PRODUCTOS DE LA API:
   
   MOVISTAR (movistarPlans):
   MO10GB: Movistar - Llamadas Ilimitadas - 10GB (4.92€)
   MO40GB+: Movistar - Llamadas Ilimitadas - 40GB (6.57€)  
   MO100GB: Movistar - Llamadas Ilimitadas - 100GB (8.22€) ⭐ RECOMENDADO
   OP25GB: Movistar - Llamadas Ilimitadas - 25GB (8.22€) + 100GB PROMO
   MO250GB: Movistar - Llamadas Ilimitadas - 250GB (10.70€)
   MOGBILI: Movistar - Llamadas Ilimitadas - Datos Ilimitados (16.49€)
   
   VODAFONE INDIVIDUAL (vodafoneIndividualPlans):
   VO10GBN+: Vodafone - Llamadas Ilimitadas - 10GB (4.05€) ⭐ MÁS BARATO
   VO35GBN+: Vodafone - Llamadas Ilimitadas - 35GB (6.53€)
   VO75GBN+: Vodafone - Llamadas Ilimitadas - 75GB (8.18€) ⭐ EQUILIBRADO
   VO150GBN+: Vodafone - Llamadas Ilimitadas - 150GB (11.49€)
   VO250GBN+: Vodafone - Llamadas Ilimitadas - 250GB (12.31€)
   
   VODAFONE FAMILIAR (vodafoneFamiliarPlans):
   VO-COMPAR75: Vodafone - 75GB - Hasta 3 líneas (18.93€)
   VO-COMPAR150: Vodafone - 150GB - Hasta 3 líneas (22.23€)
   VO-COMPAR300: Vodafone - 300GB - Hasta 3 líneas (25.54€)
   
   ORANGE INDIVIDUAL (orangeIndividualPlans):
   CMJ30GB: Orange-Yoigo-Movistar - 30GB (5.70€) ⭐ MUY ECONÓMICO
   CMJ60GB_2: Orange-Yoigo-Movistar - 60GB (6.53€)
   CM80GB: Orange-Yoigo-Movistar - 80GB (7.36€)
   CMJ120GB_2: Orange-Yoigo-Movistar - 120GB (9.01€) ⭐ BUEN VALOR
   CM150GBN: Orange-Yoigo-Movistar - 150GB (9.83€)
   CM300GB: Orange-Yoigo-Movistar - 300GB (10.66€)
   CMJ400GB: Orange-Yoigo-Movistar - 400GB (20.58€)
   CM800GBN: Orange-Yoigo-Movistar - 800GB (21.40€)
   
   ORANGE FAMILIAR (orangeFamiliarPlans):
   CMDOBLA120: Orange - 120GB - Hasta 3 líneas (18.10€)
   CMDOBLA160: Orange - 160GB - Hasta 3 líneas (22.23€)
   CMDOBLA300: Orange - 300GB - Hasta 3 líneas (30.49€)
*/

// EJEMPLOS DE USO CON IDs REALES:

// 1. DESTACAR LOS MÁS POPULARES DE CADA OPERADOR:
// manualPlans: ['MO100GB', 'VO75GBN+', 'CMJ120GB_2'] // Movistar 100GB + Vodafone 75GB + Orange 120GB (ACTUAL)

// 2. DESTACAR LOS MÁS BARATOS DE CADA OPERADOR:
// manualPlans: ['MO10GB', 'VO10GBN+', 'CMJ30GB'] // Movistar 10GB (4.92€) + Vodafone 10GB (4.05€) + Orange 30GB (5.70€)

// 3. DESTACAR PLANES CON DATOS ILIMITADOS/ALTOS:
// manualPlans: ['MOGBILI', 'VO250GBN+', 'CM800GBN'] // Movistar Ilimitado + Vodafone 250GB + Orange 800GB

// 4. DESTACAR PLANES FAMILIARES:
// manualPlans: ['VO-COMPAR150', 'CMDOBLA160', 'MO250GB'] // Planes compartidos y familiares

// 5. DESTACAR MEJOR RELACIÓN CALIDAD-PRECIO:
// manualPlans: ['OP25GB', 'VO75GBN+', 'CMJ120GB_2'] // Movistar promocional + Vodafone equilibrado + Orange valor

// CONFIGURACIÓN RECOMENDADA PARA MÁXIMO ATRACTIVO (ACTUAL):
// manualPlans: ['MO100GB', 'VO75GBN+', 'CMJ120GB_2'] // Mix equilibrado: económico, popular y buen valor

console.log('📋 Configuración de planes destacados cargada:', window.mobilePlansElementorConfig);
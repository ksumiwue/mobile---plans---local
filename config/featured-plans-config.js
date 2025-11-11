// CONFIGURACIÓN DE PLANES DESTACADOS
// Este archivo te permite personalizar qué planes aparecen en la sección "Planes Más Populares"

window.mobilePlansElementorConfig = {
    featuredPlans: {
        // MODOS DISPONIBLES:
        // 'auto' - Primeros 3 planes automáticamente
        // 'manual' - Seleccionar planes específicos por índice
        // 'cheapest' - Plan más barato de cada operador
        // 'most_expensive' - Plan más caro de cada operador  
        // 'best_value' - Mejores por relación calidad/precio
        mode: 'manual', // 👈 CAMBIAR AQUÍ EL MODO
        
        // SELECCIÓN MANUAL (solo funciona con mode: 'manual')
        // Índices de los productos que quieres destacar (0 = primer producto, 1 = segundo, etc.)
        manualPlans: [2, 7, 10], // 👈 CAMBIAR AQUÍ LOS ÍNDICES
        
        // CONFIGURACIÓN ADICIONAL
        maxPlans: 3, // Máximo 3 planes destacados
        showPrices: true,
        showFeatures: true
    }
};

// GUÍA DE ÍNDICES DE PRODUCTOS (actualizada automáticamente):
// Para usar el modo 'manual', consulta estos índices:

/* ÍNDICES ACTUALES DE PRODUCTOS:
   
   MOVISTAR:
   0: Movistar Fusión Selección 5GB (20.90€)
   1: Movistar Fusión Selección 15GB (25.90€)  
   2: Movistar Fusión Selección 30GB (30.90€) ⭐ MUY POPULAR
   3: Movistar Fusión Ilimitada (39.90€)
   4: Movistar Fusión Familia 50GB (45.90€)
   5: Movistar Fusión Familia Ilimitada (65.90€)
   
   VODAFONE:
   6: Vodafone Yu 8GB (17.99€)
   7: Vodafone Yu 25GB (22.99€) ⭐ MUY POPULAR
   8: Vodafone One 40GB (35.99€)
   9: Vodafone One Ilimitada (49.99€)
   10: Vodafone One Familia 60GB (52.99€)
   11: Vodafone One Familia Ilimitada (72.99€)
   
   ORANGE:
   12: Orange Go Walk 10GB (15.95€) ⭐ MUY ECONÓMICO
   13: Orange Go Walk 25GB (20.95€) ⭐ MUY POPULAR
   14: Orange Go Walk 50GB (27.95€)
   15: Orange Love Ilimitada (39.95€)
   16: Orange Love Familia 80GB (49.95€)
   17: Orange Love Familia Ilimitada (69.95€)
*/

// EJEMPLOS DE USO:

// 1. DESTACAR LOS MÁS POPULARES DE CADA OPERADOR:
// manualPlans: [2, 7, 13] // Movistar 30GB + Vodafone Yu 25GB + Orange Go Walk 25GB

// 2. DESTACAR LOS MÁS BARATOS:
// manualPlans: [0, 6, 12] // Movistar 5GB + Vodafone Yu 8GB + Orange 10GB  

// 3. DESTACAR PLANES PREMIUM:
// manualPlans: [3, 9, 15] // Planes ilimitados individuales

// 4. DESTACAR PLANES FAMILIA:
// manualPlans: [5, 11, 17] // Planes familia ilimitados

// CONFIGURACIÓN RECOMENDADA PARA MÁXIMO ATRACTIVO:
// manualPlans: [2, 7, 12] // Mix: Premium Movistar + Popular Vodafone + Económico Orange

console.log('📋 Configuración de planes destacados cargada:', window.mobilePlansElementorConfig);
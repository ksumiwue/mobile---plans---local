# 📱 Mobile Plans Comparator - Guía de Instalación WordPress + Elementor

## 🚀 Instalación Rápida (5 minutos)

### Paso 1: Subir archivos al tema de WordPress

```bash
# Estructura requerida en tu tema:
/wp-content/themes/tu-tema/
├── functions.php (copiar código aquí)
└── mobile-plans-web/ (subir toda esta carpeta)
    ├── index-new.html
    ├── config/
    │   ├── featured-plans-config.js
    │   └── products-enhanced.json
    ├── js/
    │   ├── app-new.js
    │   ├── components/
    │   └── utils/
    └── css/
```

### Paso 2: Integrar código en WordPress

1. **Abrir** `/wp-content/themes/tu-tema/functions.php`
2. **Copiar** todo el contenido de `wordpress-shortcode-elementor.php`
3. **Pegar** al final del archivo functions.php (antes del `?>`)
4. **Guardar** el archivo

### Paso 3: ¡Listo para usar!

```php
// En cualquier post/página:
[mobile_plans]

// Con configuración personalizada:
[mobile_plans featured_mode="manual" featured_plans="2,7,12" height="600"]
```

---

## ⭐ PERSONALIZAR PLANES DESTACADOS

### Método 1: Archivo de configuración (Recomendado)

Editar: `mobile-plans-web/config/featured-plans-config.js`

```javascript
window.mobilePlansElementorConfig = {
    featuredPlans: {
        mode: 'manual',           // 👈 Cambiar modo aquí
        manualPlans: [2, 7, 12],  // 👈 Cambiar planes aquí
        maxPlans: 3
    }
};
```

### Método 2: Shortcode directo

```php
// Selección manual por índices:
[mobile_plans featured_mode="manual" featured_plans="2,7,12"]

// Más baratos de cada operador:
[mobile_plans featured_mode="cheapest"]

// Más caros de cada operador:
[mobile_plans featured_mode="most_expensive"]

// Mejor relación calidad/precio:
[mobile_plans featured_mode="best_value"]
```

### 📋 Guía de Índices de Productos

```
MOVISTAR (índices 0-5):
├── 0: Fusión 5GB (20.90€) - Económico
├── 1: Fusión 15GB (25.90€) 
├── 2: Fusión 30GB (30.90€) ⭐ MÁS POPULAR
├── 3: Fusión Ilimitada (39.90€) - Premium
├── 4: Familia 50GB (45.90€)
└── 5: Familia Ilimitada (65.90€)

VODAFONE (índices 6-11):
├── 6: Yu 8GB (17.99€) - Económico
├── 7: Yu 25GB (22.99€) ⭐ MÁS POPULAR
├── 8: One 40GB (35.99€)
├── 9: One Ilimitada (49.99€) - Premium
├── 10: Familia 60GB (52.99€)
└── 11: Familia Ilimitada (72.99€)

ORANGE (índices 12-17):
├── 12: Go Walk 10GB (15.95€) ⭐ MÁS ECONÓMICO
├── 13: Go Walk 25GB (20.95€) ⭐ MÁS POPULAR
├── 14: Go Walk 50GB (27.95€)
├── 15: Love Ilimitada (39.95€) - Premium
├── 16: Familia 80GB (49.95€)
└── 17: Familia Ilimitada (69.95€)
```

### 🎯 Combinaciones Recomendadas

```javascript
// 1. MÁS ATRACTIVO (mix de popularidad y precio):
manualPlans: [2, 7, 12]  // Movistar 30GB + Vodafone Yu + Orange económico

// 2. SOLO POPULARES (más vendidos):
manualPlans: [2, 7, 13]  // Los 3 planes marcados como ⭐ MÁS POPULAR

// 3. SOLO ECONÓMICOS (presupuesto bajo):
manualPlans: [0, 6, 12]  // Los más baratos de cada operador

// 4. SOLO PREMIUM (sin límites):
manualPlans: [3, 9, 15]  // Los planes ilimitados individuales

// 5. VARIADO (algo para todos):
manualPlans: [0, 7, 15]  // Económico + Popular + Premium
```

---

## 🎨 Widget de Elementor

### Instalación del Widget

1. **Código ya integrado** en functions.php ✅
2. **Buscar** "Mobile Plans Comparator" en widgets de Elementor
3. **Arrastrar** a tu página
4. **Configurar** en panel lateral

### Opciones del Widget

**⚙️ Configuración General:**
- Altura: 400-1200px (recomendado: 800px)
- Tema: Predeterminado, Oscuro, Minimalista, Colorido

**⭐ Planes Destacados:**
- Modo automático (primeros 3)
- Modo manual (seleccionar índices)
- Más baratos por operador
- Más caros por operador
- Mejor relación calidad/precio

**🎨 Interfaz:**
- Ocultar navegación superior
- Modo responsive automático

---

## 🔧 Opciones Avanzadas

### Shortcode Completo

```php
[mobile_plans 
    height="800"
    width="100%"
    featured_mode="manual"
    featured_plans="2,7,12"
    hide_navigation="false"
    theme="default"
]
```

### Personalización CSS

```css
/* Personalizar contenedor */
.mobile-plans-wrapper {
    margin: 40px 0;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

/* Personalizar iframe */
.mobile-plans-wrapper iframe {
    transition: all 0.3s ease;
}

/* Responsive personalizado */
@media (max-width: 768px) {
    .mobile-plans-wrapper {
        margin: 20px -15px;
    }
}
```

### JavaScript Personalizado

```javascript
// Detectar cuando cambia la altura
window.addEventListener('message', function(e) {
    if (e.data.type === 'mobile_plans_height_changed') {
        console.log('Nueva altura:', e.data.height);
        // Tu código aquí
    }
});
```

---

## 🚨 Solución de Problemas

### ❌ No aparece la aplicación

**Problema:** Shortcode muestra mensaje de error
**Solución:** 
1. Verificar que la carpeta `mobile-plans-web` esté en la ruta correcta
2. Verificar permisos de archivos (644 para archivos, 755 para carpetas)

### ❌ Widget no aparece en Elementor

**Problema:** No encuentro el widget "Mobile Plans Comparator"
**Solución:**
1. Verificar que el código esté en functions.php
2. Verificar que Elementor esté actualizado
3. Limpiar caché de Elementor

### ❌ Los planes destacados no cambian

**Problema:** Siempre aparecen los mismos 3 planes
**Solución:**
1. Verificar configuración en `featured-plans-config.js`
2. Limpiar caché del navegador
3. Verificar que los índices sean correctos

### ❌ Altura no se ajusta automáticamente

**Problema:** El iframe no cambia de altura
**Solución:**
1. Verificar que el tema no interfiera con postMessage
2. Comprobar consola del navegador por errores
3. Usar altura fija como alternativa temporal

---

## 📞 Soporte y Personalización

### Archivos Importantes

- **Configuración:** `mobile-plans-web/config/featured-plans-config.js`
- **Datos:** `mobile-plans-web/config/products-enhanced.json`
- **Aplicación:** `mobile-plans-web/js/app-new.js`
- **WordPress:** Código en `functions.php`

### Logs de Debug

```javascript
// En consola del navegador:
mobilePlansDebugIframe();  // Ver estado del iframe
```

### Contacto

- **Documentación completa:** Ver carpeta `docs/`
- **Archivos de configuración:** Ver carpeta `config/`
- **Debug mode:** Disponible para administradores de WordPress

---

## ✅ Checklist de Instalación

- [ ] Carpeta `mobile-plans-web` subida al tema
- [ ] Código copiado a `functions.php`
- [ ] Shortcode `[mobile_plans]` funciona
- [ ] Widget aparece en Elementor
- [ ] Planes destacados configurados
- [ ] Auto-ajuste de altura funcionando
- [ ] Responsive en móviles correcto
- [ ] Debug panel aparece para administradores

¡Listo! Tu comparador de planes móviles está funcionando perfectamente. 🎉
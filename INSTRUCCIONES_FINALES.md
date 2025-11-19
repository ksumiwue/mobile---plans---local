# INSTRUCCIONES FINALES - Configuración de Planes Destacados

## ✅ Estado actual

TODO el código está implementado y funcionando. Solo faltan 2 líneas en `index-new.html`.

## 📝 Qué hacer

### Paso 1: Restaurar index-new.html (si está corrupto)

```powershell
git restore index-new.html
```

### Paso 2: Añadir 2 líneas en index-new.html

Busca en `index-new.html` la línea **677** que dice:
```html
<link rel="stylesheet" href="css/filter-dropdowns.css">
```

Justo **DESPUÉS** de esa línea, añade:
```html
<link rel="stylesheet" href="css/promo-badge.css">
```

### Paso 3: Añadir config.js

Busca en `index-new.html` alrededor de la línea **880** donde dice:
```html
<script src="js/utils/cache.js"></script>
<script src="js/app-new.js"></script>
```

Entre esas dos líneas, añade:
```html
<script src="config.js"></script>
```

Debería quedar así:
```html
<script src="js/utils/cache.js"></script>
<script src="config.js"></script>
<script src="js/app-new.js"></script>
```

## ✅ Verificación

Después de hacer los cambios:

1. Abre `index-new.html` en el navegador
2. Abre la consola (F12)
3. Deberías ver: `✅ Configuración de planes destacados cargada:`
4. Los planes destacados deberían ser los configurados en `config.js`

## 🎯 Para cambiar los planes en el futuro

Simplemente edita `config.js` y cambia:
- `mode`: 'manual', 'auto', 'cheapest', etc.
- `manualPlans`: Array con los IDs
- `highlightedPlan`: Plan con titular llamativo
- `title` y `subtitle`: Títulos de la sección

## 📋 IDs disponibles (recordatorio)

Movistar: MO10GB, MO40GB+, MO100GB, OP25GB, MO250GB, MOGBILI
Vodafone: VO10GBN+, VO35GBN+, VO75GBN+, VO150GBN+, VO250GBN+
Orange: CMJ30GB, CMJ60GB_2, CM80GB, CMJ100GB_4, CM150GBN, CM300GB, CM800GBN

Vodafone Familiar: VO-COMPAR75, VO-COMPAR150, VO-COMPAR300
Orange Familiar: CMDOBLA120, CMDOBLA160, CMDOBLA300

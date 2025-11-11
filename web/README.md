# Mobile Plans - Versión Web Limpia

## 🎯 **Enfoque: Copia Exacta + Comunicación Funcional**

Esta versión mantiene **EXACTAMENTE** el diseño y funcionalidad original, solo agregando la comunicación iframe que funciona.

## 📁 **Lo que contiene:**

### ✅ **Archivos copiados EXACTOS del original:**
- `index.html` - Copia exacta de `index-new.html` que funciona
- `css/` - Todos los archivos CSS originales sin modificar
- `js/` - Todos los archivos JavaScript originales sin modificar  
- `config/` - Archivos de configuración originales

### ✅ **ÚNICA modificación:**
- Reemplazado el script de `iframe-auto-adjust-minimal.js` por comunicación directa usando el patrón del ejemplo funcional

## 🔧 **Instalación en WordPress:**

### Paso 1: Subir archivos
```
/wp-content/themes/tu-tema/mobile-plans-web/
├── index.html
├── css/ (carpeta completa)
├── js/ (carpeta completa)
└── config/ (carpeta completa)
```

### Paso 2: Agregar código PHP
Copiar el contenido de `wordpress-iframe.php` al `functions.php` del tema.

### Paso 3: Usar shortcode
```php
[mobile_plans_web]
```

## 📡 **Patrón de Comunicación (Del ejemplo funcional):**

### WordPress → Iframe:
```javascript
iframe.contentWindow.postMessage({ tipo: 'solicitarAltura' }, '*');
```

### Iframe → WordPress:
```javascript
window.parent.postMessage({ tipo: 'ajustarAltura', altura: altura }, '*');
```

## ✅ **Garantías:**

- 🎨 **Diseño idéntico** al original
- 🎯 **Tarjetas flotantes** con precios (círculos de colores)
- 📱 **Navegación completa** funcionando
- 🔄 **Sin refresh continuo** (patrón del ejemplo)
- 📏 **Altura se ajusta** automáticamente

## 🧪 **Para verificar:**

### 1. Test directo:
Visitar: `https://tu-sitio.com/.../mobile-plans-web/index.html`
Debe verse EXACTAMENTE como el original.

### 2. Test en WordPress:
Debe verse igual + altura automática sin refresh continuo.

### 3. Consola debug:
```
📱 Mobile Plans: Detectado iframe - configurando comunicación...
📡 Mobile Plans: Solicitud de altura recibida  
📡 Mobile Plans: Altura enviada: 850px
📏 Mobile Plans: Altura ajustada a 850px
```

## 🚨 **Si no funciona:**

### Problema: No se ve igual al original
**Causa:** Archivos CSS/JS no encontrados
**Solución:** Verificar que todos los archivos estén en las rutas correctas

### Problema: Iframe no se ajusta
**Causa:** Error en comunicación
**Solución:** Verificar mensajes en consola del navegador

### Problema: No carga
**Causa:** URL incorrecta
**Solución:** Usar `[mobile_plans_debug_web]` para ver rutas detectadas

## 📋 **Diferencias vs versión original:**

| Aspecto | Original | Versión Web |
|---------|----------|-------------|
| Diseño | ✅ Idéntico | ✅ Idéntico |
| CSS | ✅ Sin cambios | ✅ Sin cambios |
| JavaScript | ✅ Sin cambios | ✅ Sin cambios |
| Comunicación iframe | ❌ Refresh continuo | ✅ Patrón funcional |

## 🎯 **Objetivo conseguido:**

**"Mantener exactamente el mismo diseño y funcionalidad, pero con comunicación iframe que funciona correctamente"**

✅ **Resultado:** Aplicación idéntica + iframe funcional sin refresh continuo
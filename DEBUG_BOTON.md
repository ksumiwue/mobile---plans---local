# DEBUG: Script para diagnosticar el problema del botón

## 🔍 Ejecuta esto en la consola del navegador (F12)

Copia y pega este código en la consola cuando estés en la **página de inicio**:

```javascript
// 1. Verificar que la función detecta la página correctamente
console.log('=== DIAGNÓSTICO DEL BOTÓN ===');
console.log('1. ¿Detecta página de inicio?', window.stickyDebug.isPlans());

// 2. Verificar el contenedor de planes destacados
const featuredContainer = document.querySelector('#featured-plans-container');
console.log('2. Contenedor de planes destacados:', featuredContainer);
console.log('   - Existe:', !!featuredContainer);
console.log('   - Altura:', featuredContainer?.offsetHeight);

// 3. Verificar la sección home
const homeSection = document.querySelector('#home-section');
console.log('3. Sección home:', homeSection);
console.log('   - Existe:', !!homeSection);
console.log('   - Display:', homeSection?.style.display);
console.log('   - Visible:', homeSection && !homeSection.style.display.includes('none'));

// 4. Marcar un checkbox y verificar
console.log('4. Ahora marca un checkbox de un plan...');
setTimeout(() => {
    const count = window.stickyDebug.count();
    console.log('   - Productos seleccionados:', count);
    console.log('   - ¿Debería mostrar botón?', window.stickyDebug.isPlans() && count > 0);
    
    // 5. Verificar el botón
    const button = window.stickyDebug.button();
    console.log('5. Botón:', button);
    console.log('   - Existe:', !!button);
    console.log('   - Display:', button?.style.display);
    console.log('   - Contenedor padre:', button?.parentElement);
    console.log('   - Posición:', {
        top: button?.style.top,
        right: button?.style.right,
        position: button?.style.position
    });
    
    // 6. Forzar actualización
    console.log('6. Forzando actualización...');
    window.stickyDebug.update();
    
    console.log('=== FIN DIAGNÓSTICO ===');
}, 2000);
```

## 📋 Qué buscar en los resultados

1. **¿Detecta página de inicio?** - Debe ser `true`
2. **Contenedor de planes destacados** - Debe existir y tener altura > 0
3. **Sección home** - Debe estar visible (display no debe ser 'none')
4. **Productos seleccionados** - Debe ser > 0 después de marcar checkbox
5. **Botón** - Debe existir y tener `display: 'block'`

## 🎯 Posibles problemas

### Si `isPlans()` retorna `false`:
El problema está en la detección de la página. Necesitamos ajustar los selectores.

### Si el botón existe pero `display: 'none'`:
El problema está en la lógica de `updateButton()`. Puede ser que `onComparePage` esté detectando incorrectamente.

### Si el botón no existe:
El problema está en `createButton()`. El contenedor no se está encontrando correctamente.

## 🔧 Solución temporal para probar

Si quieres ver el botón inmediatamente para probar, ejecuta en la consola:

```javascript
window.stickyDebug.show();
```

Esto forzará la visualización del botón sin importar las condiciones.

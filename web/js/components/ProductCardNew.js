// COMPONENTE DE TARJETA REDISEÑADO - MINIMALISTA Y OPTIMIZADO

class ProductCardNew {
    constructor() {
        this.iconSet = this.initializeIconSet();
    }

    // Conjunto de iconos minimalistas sin color
    initializeIconSet() {
        return {
            individual: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
            </svg>`,
            
            familiar: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/>
            </svg>`,
            
            data: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
            </svg>`,
            
            calls: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
            </svg>`,
            
            sms: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
            </svg>`,
            
            network: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"/>
            </svg>`,
            
            unlimited: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M6 12c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3Zm9 0c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3Z"/>
            </svg>`,
            
            check: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>`
        };
    }

    // Formatear precio con decimales en superíndice (formato codigo.html mejorado)
    formatPrice(price, operator) {
        if (!operator) {
            console.error('❌ formatPrice llamado sin operador:', { price, operator });
        }
        const priceStr = price.toString();
        const [euros, cents = '00'] = priceStr.split('.');
        const colors = this.getOperatorColors(operator);
        
        return `
            <div class="price-section-enhanced">
                <span class="price-main-large" style="color: ${colors.primary};">
                    ${euros}<sup class="price-cents">,${cents.padEnd(2, '0')}<span class="euro-symbol-large">€</span></sup>
                </span>
                <div class="price-label">por mes</div>
            </div>
        `;
    }

    // Banco de imágenes de productos (solo URLs verificadas del codigo.html)
    getImageBank() {
        return {
            individual: [
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_1.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_2.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_5.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_1.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_2.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_3.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_4.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_5.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_6.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_3.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_5.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_7.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_12.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_14.jpg?w=300&h=375&fit=crop'
            ],
            familiar: [
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_fam_1.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/mov_ora_fam_3.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_8.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_1.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_2.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_4.jpg?w=300&h=375&fit=crop',
                'https://ipv6-informatica.es/wp-content/uploads/2025/03/movil_vod_6.jpg?w=300&h=375&fit=crop'
            ]
        };
    }

    // Sistema de asignación aleatoria sin repeticiones
    static usedImages = new Set();
    static shuffledImages = {};

    // Mezclar array de imágenes (Fisher-Yates)
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Obtener imagen aleatoria sin repetición para el conjunto visible
    getProductImage(product, productsInCurrentView = []) {
        const imageBank = this.getImageBank();
        const planType = product.planType || 'individual';
        const availableImages = imageBank[planType] || imageBank.individual;
        
        // Si es un nuevo renderizado, resetear las imágenes usadas
        if (productsInCurrentView.length > 0 && ProductCardNew.usedImages.size === 0) {
            console.log(`🎲 Iniciando nueva asignación de imágenes para ${productsInCurrentView.length} productos`);
        }
        
        // Crear array mezclado para este tipo de plan si no existe
        const shuffleKey = `${planType}_${productsInCurrentView.length}`;
        if (!ProductCardNew.shuffledImages[shuffleKey]) {
            ProductCardNew.shuffledImages[shuffleKey] = this.shuffleArray(availableImages);
            console.log(`🔀 Mezclando ${availableImages.length} imágenes para ${planType}`);
        }
        
        const shuffledImages = ProductCardNew.shuffledImages[shuffleKey];
        
        // Encontrar una imagen no usada
        let selectedImage = null;
        let attempts = 0;
        const maxAttempts = shuffledImages.length;
        
        while (!selectedImage && attempts < maxAttempts) {
            const candidateImage = shuffledImages[attempts % shuffledImages.length];
            
            // Si no está usada en la vista actual, la seleccionamos
            if (!ProductCardNew.usedImages.has(candidateImage)) {
                selectedImage = candidateImage;
                ProductCardNew.usedImages.add(candidateImage);
                break;
            }
            attempts++;
        }
        
        // Si todas están usadas, resetear y empezar de nuevo
        if (!selectedImage) {
            console.log(`🔄 Todas las imágenes de ${planType} usadas, reiniciando...`);
            ProductCardNew.usedImages.clear();
            ProductCardNew.shuffledImages[shuffleKey] = this.shuffleArray(availableImages);
            selectedImage = ProductCardNew.shuffledImages[shuffleKey][0];
            ProductCardNew.usedImages.add(selectedImage);
        }
        
        return selectedImage;
    }

    // Resetear sistema de imágenes para nueva vista
    static resetImageSelection() {
        ProductCardNew.usedImages.clear();
        ProductCardNew.shuffledImages = {};
        console.log('🔄 Sistema de imágenes reseteado');
    }

    // Función hash simple para consistencia
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Obtener logo del operador con color mantenido
    getOperatorLogo(operator) {
        const logos = {
            movistar: 'https://www.movistar.es/estaticos/imagenes/iconos-logos/favicon.ico',
            vodafone: 'https://www.vodafone.es/favicon.ico', 
            orange: 'https://www.orange.es/favicon.ico'
        };
        
        return logos[operator.toLowerCase()] || '';
    }

    // Obtener imagen de fondo específica para cada operador
    getOperatorBackgroundImage(operator) {
        const backgroundImages = {
            movistar: 'https://ipv6-informatica.es/images/galaxy-s25-azul.jpg',
            orange: 'https://ipv6-informatica.es/images/iphone_17_pro_max_naranja_3_.png',
            vodafone: 'https://ipv6-informatica.es/images/iphone-14-rojo.png'
        };
        
        return backgroundImages[operator.toLowerCase()] || backgroundImages.movistar;
    }

    // Obtener descripción del producto desde el JSON con formato especial para promociones
    getProductDescription(product) {
        const description = product.description || "Plan completo con todas las ventajas y servicios incluidos para satisfacer tus necesidades de conectividad.";
        
        // Buscar el símbolo "-" para dividir el texto (para cualquier producto, no solo promociones)
        const dashIndex = description.indexOf('-');
        
        if (dashIndex !== -1) {
            // Parte antes del "-" en negrita (SIN el símbolo "-")
            const boldText = description.substring(0, dashIndex).trim();
            // Resto de la descripción (desde después del "-" hasta el final) en línea separada
            const normalText = description.substring(dashIndex + 1).trim();
            
            return `<div style="text-align: center; margin-bottom: 0.5rem;"><span style="font-weight: 700; color: #000000 !important; font-size: 1.05em;">${boldText}</span></div><span style="color: var(--neutral-800);">${normalText}</span>`;
        }
        
        // Si no tiene "-", devolver descripción normal
        return description;
    }

    // Método auxiliar para parsear datos (ya existe pero lo reutilizamos)
    parseDataToGB(dataString) {
        if (!dataString || typeof dataString !== 'string') return 0;
        
        const lowerData = dataString.toLowerCase();
        
        if (lowerData.includes('ilimitad') || lowerData.includes('unlimited')) {
            return 1000;
        }
        
        const numMatch = dataString.match(/(\d+(?:,\d+)?)/);
        if (!numMatch) return 0;
        
        const num = parseFloat(numMatch[1].replace(',', '.'));
        
        if (lowerData.includes('tb')) {
            return num * 1024;
        } else if (lowerData.includes('gb')) {
            return num;
        } else if (lowerData.includes('mb')) {
            return num / 1024;
        }
        
        return num;
    }

    // Obtener colores del operador (claro y oscuro)
    getOperatorColors(operator) {
        
        // Validación de emergencia - return inmediato si es problemático
        if (operator === undefined || operator === null || operator === '') {
            console.error('❌ OPERADOR PROBLEMÁTICO DETECTADO:', operator);
            return {
                light: '#6B7280',
                dark: '#374151', 
                primary: '#4B5563'
            };
        }
        
        // Validar que operator existe y es string
        if (typeof operator !== 'string') {
            console.warn(`⚠️ Operador no es string:`, { operator, type: typeof operator });
            return {
                light: '#6B7280',        // Gris neutro
                dark: '#374151',         // Gris oscuro  
                primary: '#4B5563'       // Gris principal
            };
        }
        
        const colors = {
            movistar: {
                light: '#4A90E2',    // Azul claro para individual
                dark: '#2E5BBA',     // Azul oscuro para familiar
                primary: '#00579A'   // Color principal para precios
            },
            vodafone: {
                light: '#FF6B6B',    // Rojo claro para individual  
                dark: '#C53030',     // Rojo oscuro para familiar
                primary: '#E60000'   // Color principal para precios
            },
            orange: {
                light: '#FFB347',    // Naranja claro para individual
                dark: '#FF8C00',     // Naranja oscuro para familiar
                primary: '#FF7900'   // Color principal para precios
            }
        };
        
        let operatorKey;
        try {
            operatorKey = operator.toLowerCase();
        } catch (error) {
            console.error('❌ Error al procesar operador:', { operator, error: error.message });
            return {
                light: '#6B7280',
                dark: '#374151', 
                primary: '#4B5563'
            };
        }
        
        return colors[operatorKey] || {
            light: '#6B7280',
            dark: '#374151', 
            primary: '#4B5563'
        };
    }

    // Obtener color del operador (legacy para compatibilidad)
    getOperatorColor(operator) {
        const colors = this.getOperatorColors(operator);
        return colors.primary;
    }

    // Generar badge del tipo de plan con colores del operador
    getPlanTypeBadge(planType, operator) {
        const types = {
            individual: 'Individual',
            familiar: 'Familiar',
            empresarial: 'Empresarial',
            prepago: 'Prepago',
            contrato: 'Contrato'
        };
        
        const colors = this.getOperatorColors(operator);
        const badgeColor = planType === 'familiar' ? colors.dark : colors.light;
        
        return {
            text: types[planType] || 'Plan',
            backgroundColor: badgeColor
        };
    }

    // Generar lista de características (filtrar duplicados)
    generateFeaturesList(features) {
        console.log('🔍 Características recibidas:', features);
        
        if (!features || features.length === 0) return '';
        
        // Filtrar características que ya aparecen con iconos arriba
        const excludePatterns = [
            'Llamadas ilimitadas',
            'SMS ilimitados', 
            'Sin SMS',
            /\d+ SMS/,
            'Red 5G',
            'Red 4G', 
            'Roaming UE incluido'
        ];
        
        let filteredFeatures = features.filter(feature => {
            return !excludePatterns.some(pattern => {
                if (typeof pattern === 'string') {
                    return feature.includes(pattern);
                }
                // Para regex
                return pattern.test(feature);
            });
        });
        
        console.log('✅ Características filtradas (sin duplicados):', filteredFeatures.slice(0, 2));
        
        // Solo mostrar 2 características adicionales para no sobrecargar
        return filteredFeatures.slice(0, 2).map(feature => `
            <li>${feature}</li>
        `).join('');
    }

    // Formatear datos (GB, minutos, etc.) con color del operador
    formatDataAmount(amount, operator, unit = 'GB') {
        const colors = this.getOperatorColors(operator);
        
        if (amount === 'unlimited' || amount === 'ilimitado') {
            return `
                <div class="data-highlight" style="background: rgba(${this.hexToRgb(colors.light)}, 0.15); color: ${colors.primary};">
                    ${this.iconSet.data}
                    Ilimitado
                </div>
            `;
        }
        
        return `
            <div class="data-highlight" style="background: rgba(${this.hexToRgb(colors.light)}, 0.15); color: ${colors.primary};">
                ${this.iconSet.data}
                ${amount}${unit}
            </div>
        `;
    }

    // Convertir hex a RGB para transparencias
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '0, 0, 0';
    }

    // Crear tarjeta completa
    createCard(product, allProductsInView = []) {
        const {
            id,
            name,
            operator,
            price,
            data,
            calls,
            sms,
            features = [],
            planType = 'individual',
            network = '4G',
            contractType = 'contrato'
        } = product;

        const operatorColors = this.getOperatorColors(operator);
        const planBadge = this.getPlanTypeBadge(planType, operator);
        const formattedPrice = this.formatPrice(price, operator);
        const formattedData = this.formatDataAmount(data, operator);
        const featuresList = this.generateFeaturesList(features);
        const backgroundImage = this.getOperatorBackgroundImage(operator);

        return `
            <div class="product-card-new fade-in" data-product-id="${id}" data-operator="${operator}" style="background-image: linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%), url('${backgroundImage}'); background-size: cover; background-position: center top; background-repeat: no-repeat;">
                <!-- Header -->
                <div class="card-header">
                    <div class="plan-type-badge" style="background: ${planBadge.backgroundColor}; color: white;">
                        ${planBadge.text}
                    </div>
                    <div class="comparison-checkbox">
                        <input type="checkbox" id="compare-${id}" class="compare-checkbox" data-product-id="${id}">
                        <label for="compare-${id}" class="compare-label">Comparar</label>
                    </div>
                </div>


                <!-- Precio destacado -->
                ${formattedPrice}

                <!-- Datos principales -->
                ${formattedData}

                <!-- Descripción del producto -->
                <div class="product-description" data-product-description="${product.id}">
                </div>

                <!-- Características -->
                <ul class="features-minimal">
                    <li>${this.iconSet.calls} ${calls === 'unlimited' ? 'Llamadas ilimitadas' : calls + ' min'}</li>
                    <li>${this.iconSet.sms} ${sms === 'unlimited' ? 'SMS ilimitados' : sms === '0' ? 'Sin SMS' : sms + ' SMS'}</li>
                    <li>${this.iconSet.network} Red ${network}</li>
                    <li>${this.iconSet.unlimited} Roaming UE incluido</li>
                    ${featuresList}
                </ul>

                <!-- CTA -->
                <button class="cta-minimal" onclick="window.location.href='https://ipv6-informatica.es/configurador?product=${id}'">
                    <span>Contratar Plan</span>
                </button>

            </div>
        `;
    }

    // Crear skeleton de carga
    createSkeleton() {
        return `
            <div class="skeleton-card">
                <div class="skeleton skeleton-header"></div>
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton skeleton-data"></div>
                <div class="skeleton skeleton-features"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `;
    }

    // Crear múltiples skeletons
    createSkeletons(count = 8) {
        return Array(count).fill(null).map(() => this.createSkeleton()).join('');
    }

    // Renderizar grid de productos
    renderProductGrid(products, container) {
        if (!container) {
            console.error('Container not found');
            return;
        }

        // Resetear sistema de imágenes para nueva vista
        ProductCardNew.resetImageSelection();

        // Mostrar skeletons primero
        container.innerHTML = `
            <div class="products-grid-new">
                ${this.createSkeletons()}
            </div>
        `;

        // Simular carga (en producción esto vendría de la API)
        setTimeout(() => {
            console.log(`🎨 Renderizando ${products.length} productos con imágenes aleatorias sin repetición`);
            
            // Crear tarjetas pasando el array completo para coordinación de imágenes
            const cardsHTML = products.map(product => this.createCard(product, products)).join('');
            
            container.innerHTML = `
                <div class="products-grid-new">
                    ${cardsHTML}
                </div>
            `;

            // Insertar descripciones con HTML después del renderizado
            products.forEach(product => {
                const descriptionElement = document.querySelector(`[data-product-description="${product.id}"]`);
                if (descriptionElement) {
                    descriptionElement.innerHTML = this.getProductDescription(product);
                }
            });

            // Agregar animaciones escalonadas
            this.addStaggeredAnimations();
            
            console.log(`✅ Renderizado completado. Imágenes usadas: ${ProductCardNew.usedImages.size}`);
        }, 800);
    }

    // Animaciones escalonadas para las tarjetas
    addStaggeredAnimations() {
        const cards = document.querySelectorAll('.product-card-new');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('slide-up');
        });
    }

    // Filtrar productos
    filterProducts(products, filters) {
        return products.filter(product => {
            // Filtro por operador
            if (filters.operator && filters.operator !== 'all' && product.operator !== filters.operator) {
                return false;
            }

            // Filtro por tipo de plan
            if (filters.planType && filters.planType !== 'all' && product.planType !== filters.planType) {
                return false;
            }

            // Filtro por precio
            if (filters.maxPrice && product.price > filters.maxPrice) {
                return false;
            }

            // Filtro por datos
            if (filters.minData && product.data !== 'unlimited' && parseInt(product.data) < filters.minData) {
                return false;
            }

            return true;
        });
    }

    // Ordenar productos
    sortProducts(products, sortBy = 'price', order = 'asc') {
        return [...products].sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case 'price':
                    valueA = a.price;
                    valueB = b.price;
                    break;
                case 'data':
                    valueA = a.data === 'unlimited' ? 9999 : parseInt(a.data);
                    valueB = b.data === 'unlimited' ? 9999 : parseInt(b.data);
                    break;
                case 'operator':
                    valueA = a.operator;
                    valueB = b.operator;
                    break;
                default:
                    return 0;
            }

            if (order === 'desc') {
                return valueB > valueA ? 1 : -1;
            }
            return valueA > valueB ? 1 : -1;
        });
    }

    // Búsqueda de productos
    searchProducts(products, searchTerm) {
        if (!searchTerm) return products;

        const term = searchTerm.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.operator.toLowerCase().includes(term) ||
            product.features.some(feature => feature.toLowerCase().includes(term))
        );
    }

    // Inicializar eventos
    initializeEvents() {
        console.log('🎯 Inicializando eventos globales de ProductCard');
        
        // Evento para comparación usando event delegation 
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('compare-checkbox')) {
                const productId = e.target.dataset.productId;
                const checkbox = e.target;
                
                console.log(`🎯 Evento click detectado para producto: ${productId}`);
                console.log(`📋 Estado ANTES del click: ${checkbox.checked}`);
                
                // IGNORAR el estado del checkbox y usar solo el store
                const estaEnStore = window.app.comparisonStore.has(productId);
                const shouldAdd = !estaEnStore; // Si NO está en store = AÑADIR, si está = ELIMINAR
                
                console.log(`🔍 ¿Está en store?: ${estaEnStore}`);
                console.log(`🎯 Acción a realizar: ${shouldAdd ? 'AÑADIR' : 'ELIMINAR'}`);
                
                if (window.app && window.app.toggleComparisonDirect) {
                    window.app.toggleComparisonDirect(productId, shouldAdd);
                } else {
                    console.error('❌ window.app.toggleComparisonDirect no está disponible');
                }
            }
        });
    }

    // Toggle comparación
    toggleComparison(productId) {
        const comparisonStore = window.comparisonStore || new Set();
        
        if (comparisonStore.has(productId)) {
            comparisonStore.delete(productId);
        } else if (comparisonStore.size < 3) {
            comparisonStore.add(productId);
        } else {
            alert('Máximo 3 productos para comparar');
            return;
        }

        window.comparisonStore = comparisonStore;
        this.updateComparisonUI();
    }

    // Actualizar UI de comparación
    updateComparisonUI() {
        const count = window.comparisonStore ? window.comparisonStore.size : 0;
        const compareButton = document.querySelector('.compare-floating-btn');
        
        if (compareButton) {
            compareButton.textContent = `Comparar (${count})`;
            compareButton.style.display = count > 0 ? 'block' : 'none';
        }
    }
}

// Exportar para uso global
window.ProductCardNew = ProductCardNew;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.productCardRenderer = new ProductCardNew();
    window.productCardRenderer.initializeEvents();
});
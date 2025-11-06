// NAVEGACIÓN MINIMALISTA Y LIMPIA

class NavigationMinimal {
    constructor() {
        this.currentPage = 'home';
        this.iconSet = this.initializeIconSet();
    }

    // Iconos para navegación
    initializeIconSet() {
        return {
            home: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
            </svg>`,
            
            plans: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
            </svg>`,
            
            compare: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
            </svg>`,
            
            calculator: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"/>
            </svg>`,
            
            help: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
            </svg>`,
            
            search: `<svg class="icon-minimal" viewBox="0 0 24 24">
                <path stroke="currentColor" fill="none" stroke-width="1.5" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>`
        };
    }

    // Crear el HTML de la navegación
    createNavigationHTML() {
        return `
            <nav class="main-navigation">
                <div class="nav-container">
                    <div class="nav-brand">
                        <h1 class="brand-title">Planes Móviles</h1>
                        <span class="brand-subtitle">Encuentra tu plan ideal</span>
                    </div>
                    
                    <div class="nav-items">
                        <a href="#home" class="nav-item active" data-page="home" data-tooltip="Inicio">
                            ${this.iconSet.home}
                            <span>Inicio</span>
                        </a>
                        <a href="#plans" class="nav-item" data-page="plans" data-tooltip="Ver Planes">
                            ${this.iconSet.plans}
                            <span>Planes</span>
                        </a>
                        <a href="#compare" class="nav-item" data-page="compare" data-tooltip="Comparar Planes">
                            ${this.iconSet.compare}
                            <span>Comparar</span>
                        </a>
                        <a href="#calculator" class="nav-item" data-page="calculator" data-tooltip="Calculadora de Uso">
                            ${this.iconSet.calculator}
                            <span>Calculadora</span>
                        </a>
                        <a href="#help" class="nav-item" data-page="help" data-tooltip="Ayuda y FAQ">
                            ${this.iconSet.help}
                            <span>Ayuda</span>
                        </a>
                    </div>

                    <div class="nav-search">
                        <div class="search-container">
                            ${this.iconSet.search}
                            <input type="text" class="search-input" placeholder="Buscar planes...">
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // Inicializar la navegación
    initialize(container) {
        if (container) {
            container.innerHTML = this.createNavigationHTML();
            this.attachEvents();
        }
    }

    // Adjuntar eventos
    attachEvents() {
        // Navegación entre páginas
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                e.preventDefault();
                this.handleNavigation(navItem.dataset.page);
            }
        });

        // Búsqueda
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            // Búsqueda con Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearchSubmit(e.target.value);
                }
            });
        }

        // Scroll suave para navegación sticky
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    // Manejar navegación
    handleNavigation(page) {
        console.log(`🧭 Navegando de "${this.currentPage}" a "${page}"`);
        
        if (this.currentPage === page) {
            console.log(`ℹ️ Ya estamos en la página "${page}"`);
            return;
        }

        const previousPage = this.currentPage;

        // Actualizar estado
        this.currentPage = page;

        // Actualizar UI
        this.updateActiveNavItem(page);

        // Emitir evento personalizado
        document.dispatchEvent(new CustomEvent('navigation:change', {
            detail: { page, previousPage }
        }));

        // Manejar vista específica
        this.showPage(page);
    }

    // Actualizar elemento activo
    updateActiveNavItem(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Mostrar página específica
    showPage(page) {
        // Ocultar todas las secciones
        document.querySelectorAll('.page-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('fade-in');
        });

        // Mostrar sección actual
        const currentSection = document.querySelector(`#${page}-section`);
        if (currentSection) {
            currentSection.style.display = 'block';
            // Forzar reflow antes de agregar la animación
            currentSection.offsetHeight;
            currentSection.classList.add('fade-in');
        } else {
            console.warn(`⚠️ Sección no encontrada: #${page}-section`);
        }

        // Acciones específicas por página
        switch (page) {
            case 'home':
                this.showHomePage();
                break;
            case 'plans':
                this.showPlansPage();
                break;
            case 'compare':
                this.showComparePage();
                break;
            case 'calculator':
                this.showCalculatorPage();
                break;
            case 'help':
                this.showHelpPage();
                break;
        }
    }

    // Páginas específicas
    showHomePage() {
        // Mostrar hero section y destacados
        this.loadFeaturedPlans();
    }

    showPlansPage() {
        // Mostrar todos los planes con filtros
        if (window.filterSystem) {
            window.filterSystem.applyFilters();
        }
    }

    showComparePage() {
        // Mostrar comparador
        this.loadComparisonView();
    }

    showCalculatorPage() {
        // Mostrar calculadora de planes
        this.initializeCalculator();
    }

    showHelpPage() {
        // Mostrar ayuda y FAQ
        this.loadHelpContent();
    }

    // Manejar búsqueda
    handleSearch(searchTerm) {
        if (window.filterSystem) {
            window.filterSystem.handleSearch(searchTerm);
        }

        // Cambiar a página de planes si no estamos ahí
        if (this.currentPage !== 'plans' && searchTerm.trim()) {
            this.handleNavigation('plans');
        }
    }

    // Búsqueda al presionar Enter
    handleSearchSubmit(searchTerm) {
        if (searchTerm.trim()) {
            this.handleNavigation('plans');
            // Enfocar en resultados
            setTimeout(() => {
                const resultsContainer = document.querySelector('.products-grid-new');
                if (resultsContainer) {
                    resultsContainer.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    }

    // Manejar scroll
    handleScroll() {
        const nav = document.querySelector('.main-navigation');
        if (nav) {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }

    // Cargar planes destacados
    loadFeaturedPlans() {
        // Implementar lógica para mostrar planes destacados
        console.log('Loading featured plans...');
    }

    // Cargar vista de comparación
    loadComparisonView() {
        const comparisonStore = window.comparisonStore || new Set();
        
        if (comparisonStore.size === 0) {
            this.showEmptyComparison();
        } else {
            this.showComparisonTable(Array.from(comparisonStore));
        }
    }

    // Mostrar comparación vacía
    showEmptyComparison() {
        const compareSection = document.querySelector('#compare-section');
        if (compareSection) {
            compareSection.innerHTML = `
                <div class="empty-comparison">
                    <div class="empty-icon">${this.iconSet.compare}</div>
                    <h2>No hay planes para comparar</h2>
                    <p>Agrega planes desde la sección de planes para compararlos aquí.</p>
                    <button class="cta-minimal" onclick="window.navigation.handleNavigation('plans')">
                        Ver Planes
                    </button>
                </div>
            `;
        }
    }

    // Mostrar tabla de comparación
    showComparisonTable(productIds) {
        // Implementar tabla de comparación
        console.log('Showing comparison for:', productIds);
    }

    // Inicializar calculadora
    initializeCalculator() {
        const calculatorSection = document.querySelector('#calculator-section');
        if (calculatorSection) {
            calculatorSection.innerHTML = `
                <div class="calculator-container">
                    <h2>Calculadora de Uso</h2>
                    <p>Responde unas preguntas para encontrar el plan perfecto para ti.</p>
                    <!-- Implementar formulario de calculadora -->
                </div>
            `;
        }
    }

    // Cargar contenido de ayuda
    loadHelpContent() {
        const helpSection = document.querySelector('#help-section');
        if (helpSection) {
            helpSection.innerHTML = `
                <div class="help-container">
                    <h2>Ayuda y Preguntas Frecuentes</h2>
                    <!-- Implementar FAQ y ayuda -->
                </div>
            `;
        }
    }

    // Obtener página actual
    getCurrentPage() {
        return this.currentPage;
    }

    // Navegar programáticamente
    navigateTo(page) {
        this.handleNavigation(page);
    }

    // Actualizar contador de comparación
    updateComparisonCounter() {
        const comparisonStore = window.comparisonStore || new Set();
        const compareNavItem = document.querySelector('[data-page="compare"]');
        
        if (compareNavItem) {
            const count = comparisonStore.size;
            const badge = compareNavItem.querySelector('.nav-badge');
            
            if (count > 0) {
                if (!badge) {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'nav-badge';
                    newBadge.textContent = count;
                    compareNavItem.appendChild(newBadge);
                } else {
                    badge.textContent = count;
                }
            } else if (badge) {
                badge.remove();
            }
        }
    }
}

// Exportar para uso global
window.NavigationMinimal = NavigationMinimal;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new NavigationMinimal();
});
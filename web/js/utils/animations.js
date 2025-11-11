// ===== UTILIDADES DE ANIMACIONES =====

export class AnimationManager {
  constructor() {
    this.observers = new Map();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.setupMediaQueryListener();
  }

  setupMediaQueryListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener((e) => {
      this.prefersReducedMotion = e.matches;
      this.updateAnimationState();
    });
  }

  updateAnimationState() {
    document.documentElement.classList.toggle('reduced-motion', this.prefersReducedMotion);
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('animation:motion-preference-changed', {
      detail: { prefersReducedMotion: this.prefersReducedMotion }
    }));
  }

  // ===== INTERSECTION OBSERVER PARA ANIMACIONES =====
  
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, observer);
        }
      });
    }, defaultOptions);
  }

  // Animación de entrada escalonada
  setupStaggeredAnimation(container, options = {}) {
    const {
      selector = '.animate-item',
      delay = 100,
      className = 'animate-fade-in',
      once = true
    } = options;

    const items = container.querySelectorAll(selector);
    if (items.length === 0) return;

    // Si prefiere movimiento reducido, mostrar todo inmediatamente
    if (this.prefersReducedMotion) {
      items.forEach(item => item.classList.add('animate-immediate'));
      return;
    }

    const observer = this.createIntersectionObserver((target) => {
      const index = Array.from(items).indexOf(target);
      
      setTimeout(() => {
        target.classList.add(className);
        if (once) observer.unobserve(target);
      }, index * delay);
    });

    items.forEach(item => {
      item.style.opacity = '0';
      observer.observe(item);
    });

    this.observers.set(container, observer);
  }

  // Animación de contador
  animateCounter(element, options = {}) {
    const {
      start = 0,
      end = 100,
      duration = 2000,
      easing = 'easeOutExpo',
      prefix = '',
      suffix = '',
      decimals = 0
    } = options;

    if (this.prefersReducedMotion) {
      element.textContent = prefix + end.toFixed(decimals) + suffix;
      return;
    }

    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.applyEasing(progress, easing);
      const currentValue = start + (range * easedProgress);
      
      element.textContent = prefix + currentValue.toFixed(decimals) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // Aplicar función de easing
  applyEasing(t, type) {
    switch (type) {
      case 'linear':
        return t;
      case 'easeInQuad':
        return t * t;
      case 'easeOutQuad':
        return t * (2 - t);
      case 'easeInOutQuad':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeInExpo':
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
      case 'easeOutExpo':
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      case 'easeInOutExpo':
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
      case 'bounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      default:
        return t;
    }
  }

  // Animación de progreso circular
  animateCircularProgress(element, options = {}) {
    const {
      progress = 0,
      duration = 1000,
      strokeWidth = 4,
      size = 100,
      color = '#3b82f6'
    } = options;

    const svg = element.querySelector('svg') || this.createCircularProgressSVG(element, { size, strokeWidth, color });
    const circle = svg.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * (size / 2 - strokeWidth);
    
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    if (this.prefersReducedMotion) {
      const offset = circumference - (progress / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      return;
    }

    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const animationProgress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.applyEasing(animationProgress, 'easeOutExpo');
      const currentProgress = progress * easedProgress;
      const offset = circumference - (currentProgress / 100) * circumference;
      
      circle.style.strokeDashoffset = offset;
      
      if (animationProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  createCircularProgressSVG(container, options) {
    const { size, strokeWidth, color } = options;
    const radius = size / 2 - strokeWidth;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    
    // Círculo de fondo
    const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    backgroundCircle.setAttribute('cx', size / 2);
    backgroundCircle.setAttribute('cy', size / 2);
    backgroundCircle.setAttribute('r', radius);
    backgroundCircle.setAttribute('fill', 'none');
    backgroundCircle.setAttribute('stroke', '#e5e7eb');
    backgroundCircle.setAttribute('stroke-width', strokeWidth);
    
    // Círculo de progreso
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', size / 2);
    progressCircle.setAttribute('cy', size / 2);
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', color);
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
    progressCircle.classList.add('progress-circle');
    
    svg.appendChild(backgroundCircle);
    svg.appendChild(progressCircle);
    container.appendChild(svg);
    
    return svg;
  }

  // Animación de typewriter
  typeWriter(element, options = {}) {
    const {
      text = element.textContent,
      speed = 50,
      cursor = true,
      cursorChar = '|',
      loop = false,
      delay = 1000
    } = options;

    if (this.prefersReducedMotion) {
      element.textContent = text;
      return;
    }

    element.textContent = '';
    let i = 0;
    let isDeleting = false;
    
    const type = () => {
      if (!isDeleting) {
        element.textContent = text.substring(0, i + 1);
        i++;
        
        if (i === text.length) {
          if (loop) {
            setTimeout(() => {
              isDeleting = true;
              type();
            }, delay);
          } else if (cursor) {
            element.textContent += cursorChar;
          }
          return;
        }
      } else {
        element.textContent = text.substring(0, i);
        i--;
        
        if (i === 0) {
          isDeleting = false;
          setTimeout(type, delay);
          return;
        }
      }
      
      setTimeout(type, isDeleting ? speed / 2 : speed);
    };

    type();
  }

  // Animación de partículas
  createParticleExplosion(element, options = {}) {
    const {
      particleCount = 20,
      colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
      duration = 1000,
      spread = 100
    } = options;

    if (this.prefersReducedMotion) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(centerX, centerY, {
        color: colors[Math.floor(Math.random() * colors.length)],
        duration,
        spread
      });
    }
  }

  createParticle(x, y, options) {
    const { color, duration, spread } = options;
    
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * spread;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        document.body.removeChild(particle);
        return;
      }
      
      const currentX = x + vx * progress;
      const currentY = y + vy * progress + (0.5 * 300 * progress * progress); // gravedad
      const opacity = 1 - progress;
      
      particle.style.left = currentX + 'px';
      particle.style.top = currentY + 'px';
      particle.style.opacity = opacity;
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Animación de morphing de números
  morphNumber(element, newValue, options = {}) {
    const {
      duration = 500,
      easing = 'easeOutExpo',
      formatter = (val) => val.toString()
    } = options;

    const oldValue = parseFloat(element.textContent) || 0;
    
    if (this.prefersReducedMotion) {
      element.textContent = formatter(newValue);
      return;
    }

    const startTime = performance.now();
    const difference = newValue - oldValue;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.applyEasing(progress, easing);
      const currentValue = oldValue + (difference * easedProgress);
      
      element.textContent = formatter(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = formatter(newValue);
      }
    };

    requestAnimationFrame(animate);
  }

  // Shake animation
  shake(element, options = {}) {
    const {
      intensity = 5,
      duration = 500,
      direction = 'horizontal'
    } = options;

    if (this.prefersReducedMotion) {
      element.style.borderColor = '#ef4444';
      setTimeout(() => {
        element.style.borderColor = '';
      }, 200);
      return;
    }

    const originalTransform = element.style.transform;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        element.style.transform = originalTransform;
        return;
      }
      
      const shake = Math.sin(progress * Math.PI * 10) * intensity * (1 - progress);
      const transform = direction === 'horizontal' 
        ? `translateX(${shake}px)` 
        : `translateY(${shake}px)`;
      
      element.style.transform = originalTransform + ' ' + transform;
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Pulso de éxito
  successPulse(element, options = {}) {
    const {
      color = '#10b981',
      duration = 600
    } = options;

    if (this.prefersReducedMotion) {
      element.style.backgroundColor = color;
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 200);
      return;
    }

    const originalBackground = element.style.backgroundColor;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        element.style.backgroundColor = originalBackground;
        element.style.transform = '';
        return;
      }
      
      const scale = 1 + Math.sin(progress * Math.PI) * 0.1;
      const opacity = Math.sin(progress * Math.PI);
      
      element.style.transform = `scale(${scale})`;
      element.style.backgroundColor = this.hexToRgba(color, opacity * 0.3);
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Utilidad para convertir hex a rgba
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Limpiar observadores
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Destructor
  destroy() {
    this.cleanup();
  }
}

// Instancia global del manager de animaciones
export const animationManager = new AnimationManager();

// Funciones de conveniencia
export const animations = {
  stagger: (container, options) => animationManager.setupStaggeredAnimation(container, options),
  counter: (element, options) => animationManager.animateCounter(element, options),
  progress: (element, options) => animationManager.animateCircularProgress(element, options),
  typewriter: (element, options) => animationManager.typeWriter(element, options),
  particles: (element, options) => animationManager.createParticleExplosion(element, options),
  morph: (element, value, options) => animationManager.morphNumber(element, value, options),
  shake: (element, options) => animationManager.shake(element, options),
  success: (element, options) => animationManager.successPulse(element, options)
};

// Configuración global para debugging
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost'))) {
  window.debugAnimations = {
    manager: animationManager,
    animations,
    toggleReducedMotion: () => {
      animationManager.prefersReducedMotion = !animationManager.prefersReducedMotion;
      animationManager.updateAnimationState();
    }
  };
}

export default animationManager;
// 🚀 Enhanced JavaScript with Modern Features & Performance Optimizations

// 🌟 Enhanced Fade-in on Scroll with Multiple Animation Types
class ScrollAnimator {
    constructor() {
        this.observer = null;
        this.animations = {
            'fade-up': { transform: 'translateY(30px)', opacity: '0' },
            'fade-down': { transform: 'translateY(-30px)', opacity: '0' },
            'fade-left': { transform: 'translateX(-30px)', opacity: '0' },
            'fade-right': { transform: 'translateX(30px)', opacity: '0' },
            'zoom-in': { transform: 'scale(0.8)', opacity: '0' },
            'zoom-out': { transform: 'scale(1.2)', opacity: '0' },
            'rotate-in': { transform: 'rotate(-10deg) scale(0.8)', opacity: '0' },
            'slide-up': { transform: 'translateY(50px)', opacity: '0' }
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    // Optional: Unobserve after animation to improve performance
                    if (!entry.target.dataset.repeat) {
                        this.observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.repeat) {
                    entry.target.classList.remove('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observeElements();
    }

    observeElements() {
        document.querySelectorAll('[data-animate]').forEach(el => {
            const animationType = el.dataset.animate || 'fade-up';
            const delay = el.dataset.delay || '0';
            
            // Set initial styles
            if (this.animations[animationType]) {
                Object.assign(el.style, {
                    ...this.animations[animationType],
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`
                });
            }
            
            this.observer.observe(el);
        });

        // Legacy support for .fade-section
        document.querySelectorAll('.fade-section').forEach(el => {
            if (!el.dataset.animate) {
                el.dataset.animate = 'fade-up';
                this.observer.observe(el);
            }
        });
    }

    animateElement(element) {
        element.style.transform = 'none';
        element.style.opacity = '1';
        element.classList.add('visible');
    }

    refresh() {
        this.observer.disconnect();
        this.observeElements();
    }
}

// 🎯 Performance Optimized Event Delegation System
class EventManager {
    constructor() {
        this.events = new Map();
        this.throttledEvents = new Map();
        this.debouncedEvents = new Map();
    }

    // Throttle function for performance-critical events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function for user input events
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Add event with optional throttle/debounce
    on(selector, event, handler, options = {}) {
        const { throttle, debounce, once = false } = options;
        
        let finalHandler = handler;
        
        if (throttle) {
            finalHandler = this.throttle(handler, throttle);
        } else if (debounce) {
            finalHandler = this.debounce(handler, debounce);
        }

        const eventHandler = (e) => {
            const target = e.target.closest(selector);
            if (target) {
                finalHandler.call(target, e);
                if (once) {
                    document.removeEventListener(event, eventHandler);
                }
            }
        };

        document.addEventListener(event, eventHandler);
        
        // Store reference for cleanup
        const key = `${selector}-${event}`;
        if (!this.events.has(key)) {
            this.events.set(key, []);
        }
        this.events.get(key).push(eventHandler);
    }

    // Remove all events for a selector
    off(selector, event) {
        const key = `${selector}-${event}`;
        const handlers = this.events.get(key);
        if (handlers) {
            handlers.forEach(handler => {
                document.removeEventListener(event, handler);
            });
            this.events.delete(key);
        }
    }
}

// 🌈 Advanced Page Transition System
class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 500;
        this.init();
    }

    init() {
        // Handle page show/hide events
        window.addEventListener('pageshow', this.handlePageShow.bind(this));
        window.addEventListener('pagehide', this.handlePageHide.bind(this));
        
        // Intercept link clicks for smooth transitions
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Handle browser back/forward
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    handlePageShow(e) {
        if (e.persisted) {
            // Page loaded from cache
            document.body.classList.add('fade-in-fast');
        } else {
            // Fresh page load
            document.body.classList.add('fade-in-up');
        }
        
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('pageTransitionComplete'));
    }

    handlePageHide(e) {
        document.body.classList.add('fade-out');
    }

    handleLinkClick(e) {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !link.download && 
            link.href.indexOf(window.location.origin) === 0) {
            
            if (link.dataset.transition !== 'false') {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        }
    }

    handlePopState(e) {
        if (!this.isTransitioning) {
            this.navigateTo(window.location.href, false);
        }
    }

    async navigateTo(url, pushState = true) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Start exit animation
        document.body.classList.add('page-exit');
        
        // Wait for animation
        await this.delay(this.transitionDuration / 2);
        
        // Navigate
        if (pushState) {
            window.history.pushState({}, '', url);
        }
        window.location.href = url;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 🎨 Enhanced UI Components System
class UIComponents {
    constructor() {
        this.components = new Map();
        this.init();
    }

    init() {
        this.initializeButtons();
        this.initializeForms();
        this.initializeModals();
        this.initializeTooltips();
        this.initializeParallax();
    }

    // Enhanced Button System
    initializeButtons() {
        // Ripple effect for buttons
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.ripple-button, .btn');
            if (button && !button.disabled) {
                this.createRipple(e, button);
            }
        });

        // Loading states
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                this.setButtonLoading(submitBtn, true);
                
                // Auto-reset after 5 seconds if not manually reset
                setTimeout(() => {
                    this.setButtonLoading(submitBtn, false);
                }, 5000);
            }
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setButtonLoading(button, loading) {
        const loadingEl = button.querySelector('.loading');
        const textEl = button.querySelector('.button-text') || button;
        
        if (loading) {
            button.disabled = true;
            button.classList.add('loading-state');
            if (loadingEl) loadingEl.classList.remove('hidden');
            if (textEl !== button) textEl.classList.add('hidden');
        } else {
            button.disabled = false;
            button.classList.remove('loading-state');
            if (loadingEl) loadingEl.classList.add('hidden');
            if (textEl !== button) textEl.classList.remove('hidden');
        }
    }

    // Enhanced Form Handling
    initializeForms() {
        // Real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target);
            }
        });

        // Form submission with loading states
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.dataset.enhance === 'true') {
                e.preventDefault();
                this.handleFormSubmit(form);
            }
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const errorMsg = field.nextElementSibling;
        
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid);
        
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.textContent = isValid ? '' : field.validationMessage;
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('[type="submit"]');
        
        try {
            this.setButtonLoading(submitBtn, true);
            
            // Simulate API call (replace with actual endpoint)
            const response = await fetch(form.action || '#', {
                method: form.method || 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.showNotification('Form submitted successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            this.showNotification('Error: ' + error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    // Modal System
    initializeModals() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                this.openModal(trigger.dataset.modal);
            }
            
            const closeBtn = e.target.closest('.modal-close, [data-modal-close]');
            if (closeBtn) {
                this.closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            modal.querySelector('.modal-content').focus();
        }
    }

    closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    // Tooltip System
    initializeTooltips() {
        let tooltipTimeout;
        
        document.addEventListener('mouseenter', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                tooltipTimeout = setTimeout(() => {
                    this.showTooltip(element);
                }, 500);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                clearTimeout(tooltipTimeout);
                this.hideTooltip();
            }
        });
    }

    showTooltip(element) {
        const text = element.dataset.tooltip;
        const position = element.dataset.tooltipPosition || 'top';
        
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        tooltip.id = 'active-tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        if (position === 'bottom') {
            top = rect.bottom + 10;
        }
        
        tooltip.style.left = `${Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10))}px`;
        tooltip.style.top = `${Math.max(10, top)}px`;
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Parallax Scrolling
    initializeParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        // Throttled scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Notification System
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Create container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-hide
        const hideNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        };
        
        setTimeout(hideNotification, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', hideNotification);
    }
}

// 🌓 Enhanced Dark Mode with System Preference
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupToggle();
        this.watchSystemTheme();
    }

    getInitialTheme() {
        const stored = this.getStoredTheme();
        if (stored) return stored;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        try {
            return JSON.parse(sessionStorage.getItem('theme'));
        } catch {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            sessionStorage.setItem('theme', JSON.stringify(theme));
        } catch {
            // Fallback for environments without sessionStorage
            this.theme = theme;
        }
    }

    applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    this.setStoredTheme(theme);

    // 🌗 Update theme icon dynamically
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.classList.remove('fa-sun', 'fa-moon');
        icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
    }

    // 🔄 Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}


    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupToggle() {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });

        // Legacy support
        const legacyToggle = document.querySelector('#toggleDark');
        if (legacyToggle) {
            legacyToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// 🚀 Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.monitorPageLoad();
        this.monitorScrollPerformance();
        this.monitorMemoryUsage();
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart
            };
            
            console.log('📊 Page Load Metrics:', this.metrics.pageLoad);
        });
    }

    monitorScrollPerformance() {
        let scrollCount = 0;
        let lastTime = Date.now();
        
        window.addEventListener('scroll', () => {
            scrollCount++;
            const now = Date.now();
            
            if (now - lastTime > 1000) {
                console.log(`📈 Scroll Events/sec: ${scrollCount}`);
                scrollCount = 0;
                lastTime = now;
            }
        });
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log(`🧠 Memory Usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
            }, 30000); // Log every 30 seconds
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// 🎯 Main Application Initialization
class App {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Enhanced Application...');
        
        try {
            // Initialize core modules
            this.modules.scrollAnimator = new ScrollAnimator();
            this.modules.eventManager = new EventManager();
            this.modules.pageTransitions = new PageTransitions();
            this.modules.uiComponents = new UIComponents();
            this.modules.themeManager = new ThemeManager();
            this.modules.performanceMonitor = new PerformanceMonitor();
            
            // Setup enhanced interactions
            this.setupEnhancedInteractions();
            
            // Legacy support
            this.initLegacyFeatures();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('appReady'));
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }

    setupEnhancedInteractions() {
        const { eventManager } = this.modules;
        
        // Enhanced button interactions
        eventManager.on('.glow-button, .btn-glow', 'mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.letterSpacing = '0.8px';
        });
        
        eventManager.on('.glow-button, .btn-glow', 'mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.letterSpacing = 'normal';
        });
        
        // Enhanced card interactions
        eventManager.on('.card, .feature-card', 'mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        eventManager.on('.card, .feature-card', 'mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Smooth scroll for anchor links
        eventManager.on('a[href^="#"]', 'click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    initLegacyFeatures() {
        // Support for original fade-section class
        document.querySelectorAll('.fade-section').forEach(el => {
            if (!el.dataset.animate) {
                el.dataset.animate = 'fade-up';
            }
        });
        
        // Original form handling
        const form = document.querySelector('#mpinForm');
        const analyzeBtn = document.querySelector('#analyzeBtn');
        
        if (form && analyzeBtn) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.modules.uiComponents.setButtonLoading(analyzeBtn, true);
                
                // Simulate processing
                setTimeout(() => {
                    this.modules.uiComponents.setButtonLoading(analyzeBtn, false);
                    this.modules.uiComponents.showNotification('Analysis complete!', 'success');
                }, 2000);
            });
        }
    }

    // Public API for external scripts
    getModule(name) {
        return this.modules[name];
    }

    refresh() {
        // Refresh dynamic content
        this.modules.scrollAnimator?.refresh();
        console.log('🔄 Application refreshed');
    }
}

// 🎬 Initialize everything when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// 🌍 Make app globally available
window.EnhancedApp = app;

// 📱 Add CSS for enhanced features (inject if not present)
if (!document.getElementById('enhanced-styles')) {
    const styles = document.createElement('style');
    styles.id = 'enhanced-styles';
    styles.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        .fade-in-fast { animation: fadeInUp 0.3s ease-out; }
        .page-exit { opacity: 0; transform: translateY(-20px); transition: all 0.3s ease-in; }
        
        .tooltip {
            position: fixed;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 10000;
        }
        .tooltip.visible { opacity: 1; }
        
        .notification {
            background: #333;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification.show { transform: translateX(0); }
        .notification-success { background: #10b981; }
        .notification-error { background: #ef4444; }
        .notification-warning { background: #f59e0b; }
        
        #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        }
        
        .loading-state {
            position: relative;
            overflow: hidden;
        }
        
        .loading-state::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
            to { left: 100%; }
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 10000;
        }
        
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            transform: scale(0.7);
            transition: transform 0.3s ease;
        }
        
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        body.modal-open {
            overflow: hidden;
        }
        
        /* Dark mode styles */
        .dark .modal-content {
            background: #1f2937;
            color: white;
        }
        
        .dark .notification {
            background: #374151;
        }
    `;
    document.head.appendChild(styles);
}

// 🎯 Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, ScrollAnimator, ThemeManager, UIComponents };
}
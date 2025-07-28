// Global JavaScript functionality
class SportsManagementSystem {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupAnimations();
    }

    init() {
        // Initialize theme
        this.initializeTheme();
        
        // Initialize sidebar
        this.initializeSidebar();
        
        // Initialize notifications
        this.initializeNotifications();
        
        // Initialize modals
        this.initializeModals();
        
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize smooth scrolling
        this.initializeSmoothScrolling();
        
        // Initialize page transitions
        this.initializePageTransitions();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Search functionality
        const searchInputs = document.querySelectorAll('.search-input, .form-input[type="search"]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleSearch(e));
        });

        // Form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Button animations
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            this.addButtonAnimations(button);
        });

        // Card hover effects
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            this.addCardAnimations(card);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Page visibility
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        this.setupScrollAnimations();
        
        // Stagger animations for lists
        this.setupStaggerAnimations();
        
        // Loading animations
        this.setupLoadingAnimations();
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Sidebar Management
    initializeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (savedState && window.innerWidth > 1024) {
            sidebar?.classList.add('collapsed');
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const isCollapsed = sidebar?.classList.contains('collapsed');
        
        if (window.innerWidth <= 1024) {
            // Mobile: toggle visibility
            sidebar?.classList.toggle('active');
        } else {
            // Desktop: toggle collapsed state
            sidebar?.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', !isCollapsed);
        }

        // Animate content adjustment
        this.animateContentAdjustment();
    }

    animateContentAdjustment() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.transition = 'margin-left 0.3s ease-in-out';
        }
    }

    // Notification System
    initializeNotifications() {
        this.notificationContainer = this.createNotificationContainer();
    }

    createNotificationContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            pointer-events: auto;
            cursor: pointer;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
        `;

        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button style="
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
                border-radius: 4px;
                opacity: 0.7;
                transition: opacity 0.2s;
            " onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.notificationContainer.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        // Click to remove
        notification.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        return notification;
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 400);
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            primary: 'linear-gradient(135deg, #dc143c, #b91c3c)'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            primary: 'fas fa-bell'
        };
        return icons[type] || icons.info;
    }

    // Modal Management
    initializeModals() {
        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Tooltip Management
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            this.createTooltip(element);
        });
    }

    createTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-content';
        tooltip.textContent = tooltipText;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
    }

    // Smooth Scrolling
    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Page Transitions
    initializePageTransitions() {
        // Add page entrance animation
        document.body.classList.add('page-enter');
        
        // Handle page navigation
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(link.href);
            });
        });
    }

    navigateToPage(url) {
        document.body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // Animation Setup
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with scroll animation
        document.querySelectorAll('.card, .stat-card, .player-card, .team-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupStaggerAnimations() {
        document.querySelectorAll('.stagger-children').forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                child.style.setProperty('--index', index);
                child.classList.add('animate-fade-in-up');
            });
        });
    }

    setupLoadingAnimations() {
        // Add loading states to buttons
        document.querySelectorAll('.btn[data-loading]').forEach(button => {
            button.addEventListener('click', () => {
                this.setButtonLoading(button, true);
                
                // Simulate async operation
                setTimeout(() => {
                    this.setButtonLoading(button, false);
                }, 2000);
            });
        });
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            
            const originalText = button.innerHTML;
            button.setAttribute('data-original-text', originalText);
            button.innerHTML = '<div class="loading-spinner"></div>';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.innerHTML = originalText;
            }
        }
    }

    // Button Animations
    addButtonAnimations(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1)';
        });
    }

    // Card Animations
    addCardAnimations(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Search Functionality
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const searchText = element.getAttribute('data-searchable').toLowerCase();
            const isVisible = searchText.includes(searchTerm);
            
            element.style.display = isVisible ? '' : 'none';
            
            if (isVisible && searchTerm) {
                element.classList.add('search-highlight');
            } else {
                element.classList.remove('search-highlight');
            }
        });

        // Show/hide empty state
        const visibleElements = Array.from(searchableElements).filter(el => el.style.display !== 'none');
        const emptyState = document.querySelector('.empty-state');
        
        if (emptyState) {
            emptyState.style.display = visibleElements.length === 0 ? 'block' : 'none';
        }
    }

    // Form Handling
    handleFormSubmit(e) {
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        if (!isValid) {
            e.preventDefault();
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Add loading state
        if (submitButton) {
            this.setButtonLoading(submitButton, true);
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--error);
            font-size: var(--font-size-xs);
            margin-top: var(--spacing-xs);
            animation: fadeInUp 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                this.closeModal(activeModal);
            }
        }

        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showNotification('Keyboard shortcuts: Ctrl+K (Search), Escape (Close)', 'info');
        }
    }

    // Window Resize Handler
    handleResize() {
        const sidebar = document.querySelector('.sidebar');
        
        // Auto-collapse sidebar on mobile
        if (window.innerWidth <= 1024) {
            sidebar?.classList.remove('collapsed');
        }
    }

    // Page Visibility Handler
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.pauseAnimations();
        } else {
            // Page is visible
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        document.querySelectorAll('.animate-pulse, .animate-spin').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        document.querySelectorAll('.animate-pulse, .animate-spin').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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
        };
    }

    // Data Management
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    getFromLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    // API Helpers
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            this.showNotification('Request failed. Please try again.', 'error');
            throw error;
        }
    }

    // Performance Monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    // Accessibility Helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Focus Management
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sms = new SportsManagementSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SportsManagementSystem;
}
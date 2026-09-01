/**
 * navigation.js
 * Handles navbar scroll effect, mobile menu, and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Navbar Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // 2. Mobile Menu Toggle
    const toggleMobileMenu = () => {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // 3. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }

                // Calculate offset (navbar height)
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Desktop Project Dropdown Lifecycle & Interaction Controller
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link-dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        let closeTimer = null;

        const openDropdown = () => {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
            dropdown.classList.add('open');
        };

        const scheduleClose = (delay = 400) => {
            if (closeTimer) {
                clearTimeout(closeTimer);
            }
            closeTimer = setTimeout(() => {
                dropdown.classList.remove('open');
                closeTimer = null;
            }, delay);
        };

        const cancelClose = () => {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
        };

        // Hover on dropdown container (trigger & downward bridge)
        dropdown.addEventListener('mouseenter', () => {
            openDropdown();
        });

        dropdown.addEventListener('mouseleave', () => {
            scheduleClose(400);
        });

        // Hover on dropdown menu panel itself
        if (menu) {
            menu.addEventListener('mouseenter', () => {
                cancelClose();
                openDropdown();
            });

            menu.addEventListener('mouseleave', () => {
                scheduleClose(400);
            });

            // Close dropdown immediately when a dropdown item is clicked
            menu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    dropdown.classList.remove('open');
                    cancelClose();
                });
            });
        }

        // Click trigger toggle
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                // If user clicks the arrow or trigger text
                if (e.target.classList.contains('dropdown-arrow') || e.target === trigger) {
                    if (dropdown.classList.contains('open')) {
                        dropdown.classList.remove('open');
                        cancelClose();
                    } else {
                        openDropdown();
                    }
                }
            });
        }
    });

    // Close desktop dropdown on click outside
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    });

    // Close desktop dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });

    // 5. Mobile Submenu Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle, .mobile-dropdown-title');
    mobileDropdownToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.classList.contains('mobile-dropdown-title')) {
                e.preventDefault();
            }
            e.stopPropagation();
            const parent = btn.closest('.mobile-dropdown-wrap');
            if (parent) {
                parent.classList.toggle('open');
                const sublinks = parent.querySelector('.mobile-dropdown-sublinks');
                const toggleBtn = parent.querySelector('.mobile-dropdown-toggle');
                if (sublinks) {
                    sublinks.classList.toggle('is-open');
                }
                if (toggleBtn) {
                    toggleBtn.classList.toggle('is-open');
                }
            }
        });
    });

    // Close mobile menu on clicking any mobile link or sublink
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-title), .mobile-nav-sublink, .mobile-nav-links .btn').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // 6. Active Navigation State on Scroll
    const highlightActiveNav = () => {
        let current = '';
        const navHeight = navbar.offsetHeight + 10;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - navHeight - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            } else if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // 7. Handle Hash on page load with navbar offset
    if (window.location.hash) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
            setTimeout(() => {
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 150);
        }
    }

    // 8. Intelligent Internal Back Button Handler
    const backButtons = document.querySelectorAll('.back-link, .btn-back, a[data-back]');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (document.referrer && document.referrer.startsWith(window.location.origin) && document.referrer !== window.location.href) {
                e.preventDefault();
                window.history.back();
            }
            // Otherwise, normal fallback href navigation occurs naturally
        });
    });
});

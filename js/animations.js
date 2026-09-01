/**
 * animations.js
 * Handles Intersection Observers and process timeline
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // 1. Scroll Reveal Animations
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
        
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target); // Only reveal once
                }
            });
        }, revealOptions);
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

        // 2. Process Timeline Animation
        const processSection = document.querySelector('.process');
        const processLineFill = document.getElementById('process-line-fill');
        const processSteps = document.querySelectorAll('.process-step');
        
        if (processSection && processLineFill) {
            const processScroll = () => {
                const sectionRect = processSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Check if section is in viewport
                if (sectionRect.top < viewportHeight && sectionRect.bottom > 0) {
                    // Calculate scroll percentage through the section
                    let scrollPercent = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height * 0.5);
                    
                    // Clamp between 0 and 1
                    scrollPercent = Math.max(0, Math.min(1, scrollPercent));
                    
                    // Mobile is vertical, desktop is horizontal
                    if (window.innerWidth <= 1024) {
                        processLineFill.style.height = `${scrollPercent * 100}%`;
                        processLineFill.style.width = '1px';
                    } else {
                        processLineFill.style.width = `${scrollPercent * 100}%`;
                        processLineFill.style.height = '1px';
                    }
                    
                    // Highlight steps based on percentage
                    processSteps.forEach((step, index) => {
                        const stepThreshold = (index) / (processSteps.length - 1);
                        if (scrollPercent >= stepThreshold - 0.1) {
                            step.classList.add('active');
                        } else {
                            step.classList.remove('active');
                        }
                    });
                }
            };
            
            window.addEventListener('scroll', processScroll, { passive: true });
            // Initial call
            processScroll();
            // Handle resize
            window.addEventListener('resize', processScroll, { passive: true });
        }
    }
});

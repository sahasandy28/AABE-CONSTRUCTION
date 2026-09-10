/**
 * contact.js
 * Handles Form Validation and Lead Capture for AABE Developers
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Property Enquiry Form Validation
    const contactForm = document.getElementById('contact-form') || document.getElementById('propertyForm');
    const successMsg = document.getElementById('form-success') || document.querySelector('.form-success-msg');
    let successTimeout = null;
    
    // Ensure hidden by default on script initialization
    if (successMsg) {
        successMsg.classList.add('hidden');
        successMsg.classList.remove('show');
        successMsg.style.display = 'none';
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const name = document.getElementById('name') || document.getElementById('fullName');
            const phone = document.getElementById('phone');
            
            if (name && !name.value.trim()) {
                name.parentElement.classList.add('error');
                isValid = false;
            } else if (name) {
                name.parentElement.classList.remove('error');
            }
            
            if (phone && (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 8)) {
                phone.parentElement.classList.add('error');
                isValid = false;
            } else if (phone) {
                phone.parentElement.classList.remove('error');
            }
            
            if (isValid) {
                contactForm.reset();
                if (successMsg) {
                    if (successTimeout) {
                        clearTimeout(successTimeout);
                    }
                    successMsg.classList.remove('hidden');
                    successMsg.classList.add('show');
                    successMsg.style.display = 'block';
                    
                    successTimeout = setTimeout(() => {
                        successMsg.classList.add('hidden');
                        successMsg.classList.remove('show');
                        successMsg.style.display = 'none';
                    }, 6000);
                }
            } else {
                if (successMsg) {
                    successMsg.classList.add('hidden');
                    successMsg.classList.remove('show');
                    successMsg.style.display = 'none';
                }
            }
        });
        
        // Remove error state on input
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('error');
            });
        });
    }

    // 2. Interactive Masterplan Plot Selection & Details (If Present)
    const plotUnits = document.querySelectorAll('.plot-unit');
    if (plotUnits.length > 0) {
        const detailPlotId = document.getElementById('detail-plot-id');
        const detailPlotCategory = document.getElementById('detail-plot-category');
        const propertyInterestSelect = document.getElementById('propertyInterest');
        const propertyLocationInput = document.getElementById('location');

        plotUnits[0].classList.add('active');

        const selectPlot = (unit) => {
            plotUnits.forEach(p => p.classList.remove('active'));
            unit.classList.add('active');
            const plotId = unit.getAttribute('data-plot');
            const plotType = unit.getAttribute('data-type') || 'Residential Plot';
            if (detailPlotId) detailPlotId.textContent = `PLOT ${plotId}`;
            if (detailPlotCategory) detailPlotCategory.textContent = plotType;
            if (propertyInterestSelect) propertyInterestSelect.value = 'Residential Plot';
            if (propertyLocationInput && !propertyLocationInput.value) {
                propertyLocationInput.value = `Chennai (Plot ${plotId})`;
            }
        };

        plotUnits.forEach(unit => {
            unit.addEventListener('click', () => selectPlot(unit));
            unit.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectPlot(unit);
                }
            });
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                plotUnits.forEach(plot => {
                    const category = plot.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        plot.classList.remove('dimmed');
                    } else {
                        plot.classList.add('dimmed');
                    }
                });
                const activePlot = document.querySelector('.plot-unit.active');
                if (activePlot && activePlot.classList.contains('dimmed')) {
                    const firstVisible = Array.from(plotUnits).find(p => !p.classList.contains('dimmed'));
                    if (firstVisible) selectPlot(firstVisible);
                }
            });
        });
    }

    // (FAQ Accordion is managed in main.js)

    // 5. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const hamburger = document.querySelector('.hamburger');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

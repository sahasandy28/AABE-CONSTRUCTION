/**
 * main.js
 * Initialize AABE Construction Application
 * Handles Testimonials Slider, Interactive Project Modals, FAQ Accordion, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ Accordion Interaction (+ / − toggle)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = item.classList.contains('active');
            const toggleIcon = btn.querySelector('.faq-toggle-icon');

            // Close all other items for a clean single-open accordion feel
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-toggle-icon');
                    if (otherIcon) otherIcon.textContent = '+';
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                if (toggleIcon) toggleIcon.textContent = '+';
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                if (toggleIcon) toggleIcon.textContent = '−';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 2. Buyer Testimonials Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testi');
    const nextBtn = document.getElementById('next-testi');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        if (slides.length === 0) return;
        slides.forEach(s => s.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 6000);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        startAutoSlide();
    }

    // 3. Interactive Project Modals
    const modalButtons = document.querySelectorAll('.btn-open-modal');
    const modals = document.querySelectorAll('.project-modal');

    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                targetModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeModal = (modal) => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        const scrollCta = modal.querySelector('.btn-close-and-scroll');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal(modal));
        }
        if (scrollCta) {
            scrollCta.addEventListener('click', () => {
                const interest = scrollCta.getAttribute('data-interest');
                closeModal(modal);
                const interestSelect = document.getElementById('interest');
                if (interestSelect && interest) {
                    interestSelect.value = interest;
                }
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    // 4. Auto-populate Enquiry Form when clicking "Get Price / Brochure"
    const brochureLinks = document.querySelectorAll('[data-interest]');
    brochureLinks.forEach(link => {
        link.addEventListener('click', () => {
            const interestVal = link.getAttribute('data-interest');
            const selectEl = document.getElementById('interest');
            if (selectEl && interestVal) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value.toLowerCase().includes(interestVal.toLowerCase())) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    // 5. Interactive Click-to-Highlight Comparison Table
    const compareTable = document.querySelector('.compare-table');
    if (compareTable) {
        const projectHeaders = compareTable.querySelectorAll('thead th.th-project');
        const rows = compareTable.querySelectorAll('tbody tr');

        const setActiveColumn = (colIndex) => {
            const targetHeader = compareTable.querySelector(`thead th[data-col="${colIndex}"]`);
            const isCurrentlyActive = targetHeader && targetHeader.classList.contains('col-active');

            // 1. Reset all columns to neutral
            projectHeaders.forEach(th => {
                th.classList.remove('col-active');
                th.setAttribute('aria-pressed', 'false');
            });
            compareTable.querySelectorAll('tbody td').forEach(td => {
                td.classList.remove('col-active');
            });

            // 2. If clicked column was NOT previously active, activate it
            if (!isCurrentlyActive && targetHeader) {
                targetHeader.classList.add('col-active');
                targetHeader.setAttribute('aria-pressed', 'true');

                // Highlight all matching row cells (col 1 -> nth-child 2, col 2 -> nth-child 3, col 3 -> nth-child 4)
                const childPos = parseInt(colIndex, 10) + 1;
                rows.forEach(row => {
                    const cell = row.querySelector(`:scope > td:nth-child(${childPos})`);
                    if (cell) {
                        cell.classList.add('col-active');
                    }
                });
            }
        };

        projectHeaders.forEach(th => {
            const colIndex = th.getAttribute('data-col');

            th.addEventListener('click', () => {
                setActiveColumn(colIndex);
            });

            th.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    setActiveColumn(colIndex);
                }
            });
        });
    }

    // 6. Full-Card Clickable Navigation for Investment Plot Cards
    const investmentCards = document.querySelectorAll('.investment-grid .plot-card[data-href]');
    investmentCards.forEach(card => {
        const targetHref = card.getAttribute('data-href');
        if (!targetHref) return;

        card.addEventListener('click', () => {
            window.location.href = targetHref;
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                window.location.href = targetHref;
            }
        });
    });

    console.log('AABE Construction Website Initialized Successfully');
});

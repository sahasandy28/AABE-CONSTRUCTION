/**
 * about.js
 * Interactive logic for AABE Developers About Page
 * Handles:
 * 1. Scroll-Locked Cinematic Journey Timeline (5-Phase Wheel & Trackpad Controlled Progression)
 * 2. Client Stories / Project Stories Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ===================================================
       1. SCROLL-LOCKED JOURNEY EXPERIENCE (5 PHASES)
       =================================================== */
    const journeySection = document.getElementById('journey');
    if (journeySection) {
        const markers = journeySection.querySelectorAll('.journey-marker');
        const phaseContents = journeySection.querySelectorAll('.journey-phase-content');
        const imageLayers = journeySection.querySelectorAll('.journey-image-layer');
        const lineProgress = document.getElementById('journey-line-progress');
        const phaseCounter = document.getElementById('journey-phase-current');
        const PHASE_COUNT = markers.length || 5;

        let currentPhase = 0;
        let isThrottled = false;
        const THROTTLE_TIME = 600; // ms to guarantee single step per wheel movement
        const WHEEL_DELTA_THRESHOLD = 15; // Ignore tiny touchpad drift

        function setJourneyPhase(index) {
            if (index < 0 || index >= PHASE_COUNT) return;
            currentPhase = index;

            // 1. Update Timeline Markers
            markers.forEach((m, idx) => {
                const isActive = idx === index;
                m.classList.toggle('is-active', isActive);
                m.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // 2. Update Content Panels
            phaseContents.forEach((panel, idx) => {
                const isActive = idx === index;
                panel.classList.toggle('is-active', isActive);
                panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            // 3. Update Image Layers
            imageLayers.forEach((img, idx) => {
                img.classList.toggle('is-active', idx === index);
            });

            // 4. Update Counter (01 to 05)
            if (phaseCounter) {
                phaseCounter.textContent = String(index + 1).padStart(2, '0');
            }

            // 5. Update Timeline Progress Bar (20% -> 100%)
            if (lineProgress) {
                const percent = ((index + 1) / PHASE_COUNT) * 100;
                lineProgress.style.width = `${percent}%`;
            }
        }

        // Direct Marker Click & Keyboard Navigation
        markers.forEach((marker) => {
            marker.addEventListener('click', (e) => {
                e.preventDefault();
                const phase = parseInt(marker.dataset.phase, 10);
                if (!isNaN(phase)) {
                    setJourneyPhase(phase);
                }
            });

            marker.addEventListener('keydown', (e) => {
                const phase = parseInt(marker.dataset.phase, 10);
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextPhase = (phase + 1) % PHASE_COUNT;
                    setJourneyPhase(nextPhase);
                    markers[nextPhase]?.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevPhase = (phase - 1 + PHASE_COUNT) % PHASE_COUNT;
                    setJourneyPhase(prevPhase);
                    markers[prevPhase]?.focus();
                }
            });
        });

        // Scroll-Lock Wheel & Trackpad Controller for Desktop
        function handleJourneyWheel(e) {
            // Only engage on desktop/laptop viewports with mouse/trackpad pointer
            if (window.innerWidth <= 1024) return;

            const rect = journeySection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if Journey section is currently centered/occupying the viewport
            const isInView = rect.top <= 120 && rect.bottom >= viewportHeight - 120;

            if (!isInView) {
                return;
            }

            const delta = e.deltaY;
            if (Math.abs(delta) < WHEEL_DELTA_THRESHOLD) {
                return;
            }

            // User Scrolling Down
            if (delta > 0) {
                if (currentPhase < PHASE_COUNT - 1) {
                    // Lock scrolling and advance 1 phase
                    e.preventDefault();
                    if (!isThrottled) {
                        isThrottled = true;
                        setJourneyPhase(currentPhase + 1);
                        setTimeout(() => {
                            isThrottled = false;
                        }, THROTTLE_TIME);
                    }
                } else {
                    // At Phase 05: Do NOT preventDefault, allowing natural scroll down to next section
                }
            }
            // User Scrolling Up
            else if (delta < 0) {
                if (currentPhase > 0) {
                    // Lock scrolling and reverse 1 phase
                    e.preventDefault();
                    if (!isThrottled) {
                        isThrottled = true;
                        setJourneyPhase(currentPhase - 1);
                        setTimeout(() => {
                            isThrottled = false;
                        }, THROTTLE_TIME);
                    }
                } else {
                    // At Phase 01: Do NOT preventDefault, allowing natural scroll up to previous section
                }
            }
        }

        // Attach non-passive wheel listener to window
        window.addEventListener('wheel', handleJourneyWheel, { passive: false });
    }

    /* ===================================================
       2. CLIENT STORIES / PROJECT STORIES CAROUSEL
       =================================================== */
    const storiesSection = document.getElementById('client-stories');
    if (storiesSection) {
        const panels = storiesSection.querySelectorAll('.client-story-panel');
        const images = storiesSection.querySelectorAll('.client-stories-image-layer');
        const navBtns = storiesSection.querySelectorAll('.client-story-nav');
        const counterEl = document.getElementById('client-story-current');
        const mobileCounterEl = document.getElementById('client-story-mobile-current');
        const prevBtns = storiesSection.querySelectorAll('[data-story-arrow="prev"]');
        const nextBtns = storiesSection.querySelectorAll('[data-story-arrow="next"]');
        const STORY_COUNT = panels.length || 3;

        let currentStory = 0;
        let autoPlayTimer = null;
        let isPaused = false;

        function setStory(index) {
            if (index < 0 || index >= STORY_COUNT) return;
            currentStory = index;

            // Update Story Panels
            panels.forEach((p, idx) => {
                const isActive = idx === index;
                p.classList.toggle('is-active', isActive);
                p.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            // Update Images
            images.forEach((img, idx) => {
                img.classList.toggle('is-active', idx === index);
            });

            // Update Nav Buttons
            navBtns.forEach((btn) => {
                const idx = parseInt(btn.dataset.story, 10);
                const isActive = idx === index;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Update Counter
            const formatted = String(index + 1).padStart(2, '0');
            if (counterEl) counterEl.textContent = formatted;
            if (mobileCounterEl) mobileCounterEl.textContent = formatted;
        }

        function nextStory() {
            setStory((currentStory + 1) % STORY_COUNT);
        }

        function prevStory() {
            setStory((currentStory - 1 + STORY_COUNT) % STORY_COUNT);
        }

        // Arrow Controls
        nextBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            nextStory();
            resetAutoPlay();
        }));

        prevBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            prevStory();
            resetAutoPlay();
        }));

        // Tab Navigation Buttons
        navBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.dataset.story, 10);
                if (!isNaN(idx)) {
                    setStory(idx);
                    resetAutoPlay();
                }
            });
        });

        // Auto Play
        function startAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (!isPaused) {
                    nextStory();
                }
            }, 6000);
        }

        function resetAutoPlay() {
            startAutoPlay();
        }

        storiesSection.addEventListener('mouseenter', () => { isPaused = true; });
        storiesSection.addEventListener('mouseleave', () => { isPaused = false; });
        storiesSection.addEventListener('focusin', () => { isPaused = true; });
        storiesSection.addEventListener('focusout', () => { isPaused = false; });

        startAutoPlay();
    }
});

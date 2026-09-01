/**
 * location-map.js
 * Clean Interactive Live Map for AABE Construction
 * Powered by Leaflet + OpenStreetMap
 * - 100% Free, No API Key Required, Zero Watermarks
 * - Real geographic coordinates for Green City, Abi City, and Chola City
 * - Clickable Floating Project Labels linking to official project pages
 * - Synchronized with Left Location Advantage cards
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const mapContainer = document.getElementById('live-location-map');
    if (!mapContainer || typeof L === 'undefined') {
        return;
    }

    // 1. Real Project Geographic Coordinates & Detail Page URLs
    const projectLocations = [
        {
            id: 'green-city',
            name: 'Green City',
            locality: 'Kayar – Mambakkam',
            type: 'Residential Plots',
            url: 'plots/kayar-mambakkam.html',
            lat: 12.8250,
            lng: 80.1520
        },
        {
            id: 'abi-city',
            name: 'Abi City',
            locality: 'Thaiyur – Thiruporur',
            type: 'Residential Plots',
            url: 'plots/thaiyur-thiruporur.html',
            lat: 12.7630,
            lng: 80.1980
        },
        {
            id: 'chola-city',
            name: 'Chola City',
            locality: 'Uthiramerur',
            type: 'Residential Plots',
            url: 'plots/prime-town.html',
            lat: 12.6320,
            lng: 79.7580
        }
    ];

    // 2. Initialize Leaflet Map
    const map = L.map('live-location-map', {
        center: [12.75, 80.0],
        zoom: 10,
        scrollWheelZoom: false, // Prevents scroll hijacking on page scroll
        zoomControl: false,
        attributionControl: true
    });

    // Top-right clean zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Enable scroll wheel zoom on user map focus / hover
    map.on('focus', () => { map.scrollWheelZoom.enable(); });
    mapContainer.addEventListener('mouseenter', () => { map.scrollWheelZoom.enable(); });
    mapContainer.addEventListener('mouseleave', () => { map.scrollWheelZoom.disable(); });

    // 3. Tile Layer: OpenStreetMap Standard (Clean, real roads/towns, NO API KEY, NO WATERMARK)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // 4. Create Custom Markers with Clickable Floating Labels
    const markersMap = {};
    const bounds = L.latLngBounds();

    projectLocations.forEach((loc) => {
        const customIcon = L.divIcon({
            className: 'aabe-map-marker',
            html: `
                <div class="aabe-marker-inner" data-id="${loc.id}">
                    <span class="aabe-marker-dot" role="button" tabindex="0" aria-label="Center on ${loc.name} map location"></span>
                    <a href="${loc.url}" class="aabe-marker-card" aria-label="View ${loc.name} project details">
                        <span class="aabe-marker-loc">${loc.locality}</span>
                        <strong class="aabe-marker-proj">${loc.name}</strong>
                    </a>
                </div>
            `,
            iconSize: [160, 44],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
        markersMap[loc.id] = { marker, loc };
        bounds.extend([loc.lat, loc.lng]);

        // Marker Click Event: Center map and highlight card (when clicking dot)
        marker.on('click', (e) => {
            // If the user clicked the link card, let the link navigate naturally
            if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest('.aabe-marker-card')) {
                return;
            }
            selectProjectLocation(loc.id);
        });
    });

    // 5. Fit Bounds Gracefully across all three locations and Chennai belt
    function fitAllLocations() {
        map.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 11
        });
    }

    fitAllLocations();

    // 6. Project Selection Controller (Center & Highlight)
    function selectProjectLocation(locId) {
        if (!markersMap[locId]) return;

        const { loc } = markersMap[locId];

        // Active class on marker elements
        document.querySelectorAll('.aabe-marker-inner').forEach(el => {
            el.classList.toggle('is-active', el.dataset.id === locId);
        });

        // Active class on left growth cards
        document.querySelectorAll('.growth-point').forEach(card => {
            card.classList.toggle('is-active', card.dataset.targetLoc === locId);
        });

        // Smoothly fly camera to selected project
        map.flyTo([loc.lat, loc.lng], 13, {
            animate: true,
            duration: 1.0
        });
    }

    // 7. Connect Left-Side Growth Points to Map Focus
    document.querySelectorAll('.growth-point').forEach(card => {
        card.addEventListener('click', () => {
            const locId = card.dataset.targetLoc;
            if (locId) {
                selectProjectLocation(locId);
            }
        });
    });

    // 8. Handle Window Resize & Intersection Visibility
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                map.invalidateSize();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(mapContainer);
});

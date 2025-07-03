import { initRouter } from './router.js';
import { initModal } from './lib/modal.js';
import { initHeaderSearch } from './lib/headerSearch.js';
import { forceDownload } from './lib/forceDownload.js';
import { subscribe, setEmail, listen as listenToSubscription } from './lib/subscriptionState.js';

function initFooterSubscriptionForm() {
    const formContainer = document.getElementById('footer-form-container');
    if (!formContainer) return;

    const subscribeForm = document.getElementById('subscribe-form-footer');
    const successMessage = document.getElementById('subscribe-success-message-footer');
    const emailInput = document.getElementById('subscribe-email-footer');

    listenToSubscription((state) => {
        if (emailInput.value !== state.email) {
            emailInput.value = state.email;
        }
        if (state.isSubscribed) {
            subscribeForm.classList.add('hidden');
            successMessage.classList.add('active');
        }
    });

    emailInput.addEventListener('input', (e) => {
        setEmail(e.target.value);
    });

    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (emailInput.value && emailInput.checkValidity()) {
            subscribe();
        }
    });
}

/**
 * Initializes the accordion functionality for the mobile navigation menu.
 * This has been rewritten to separate the toggle and navigation actions.
 */
function initMobileNavAccordion() {
    const nav = document.querySelector('.main-nav');
    const mainHeader = document.querySelector('.main-header');
    if (!nav || !mainHeader) return;

    nav.addEventListener('click', (e) => {
        const mobileToggle = document.querySelector('.mobile-toggle');
        // This logic should only run when the mobile navigation is active
        if (getComputedStyle(mobileToggle).display === 'none') {
            return;
        }

        // Case 1: The user clicked the DEDICATED toggle button.
        if (e.target.matches('.submenu-toggle')) {
            // Prevent the parent link from navigating
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            if (dropdown) {
                const isOpen = dropdown.classList.toggle('is-open');
                // Update button text for screen readers and visual cue
                e.target.textContent = isOpen ? '−' : '+';
                e.target.setAttribute('aria-expanded', isOpen);
            }
        } 
        // Case 2: The user clicked ANY link (including parent links or submenu links).
        else if (e.target.closest('a')) {
            // Close the main mobile menu overlay.
            mainHeader.classList.remove('nav-open');
            // Reset all accordions to their closed state.
            nav.querySelectorAll('.dropdown.is-open').forEach(d => {
                d.classList.remove('is-open');
                const toggle = d.querySelector('.submenu-toggle');
                if (toggle) {
                    toggle.textContent = '+';
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
}


function initGlobalEventListeners(closeModal, closeSearch) {
    document.body.addEventListener('click', async (e) => {
        const downloadBtn = e.target.closest('.download-btn');
        if (downloadBtn) {
            e.preventDefault();
            const url = downloadBtn.dataset.url;
            const filename = downloadBtn.dataset.filename;
            
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Downloading...';
            downloadBtn.disabled = true;
    
            await forceDownload(url, filename);
    
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    });

    const mainHeader = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    mobileToggle.addEventListener('click', () => mainHeader.classList.toggle('nav-open'));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeSearch();
        }
    });
}

// --- INITIALIZATION ---
function init() {
    const closeModal = initModal();
    const closeSearch = initHeaderSearch();
    
    initFooterSubscriptionForm();
    initGlobalEventListeners(closeModal, closeSearch);
    initMobileNavAccordion(); // Initialize the new, corrected accordion logic
    initRouter();
}

document.addEventListener('DOMContentLoaded', init);
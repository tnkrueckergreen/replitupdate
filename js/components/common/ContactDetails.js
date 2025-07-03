/**
 * Contact details card component
 * @returns {string} HTML string for contact details
 */
export function ContactDetails() {
    return `
        <div class="contact-details-card">
            <div>
                <h3>Get in Touch</h3>
                <ul class="contact-info-list">
                    <li>
                        <img class="contact-icon" src="assets/icons/email.svg" alt="Email icon">
                        <span>andoverview@andoverma.us</span>
                    </li>
                    <li>
                        <img class="contact-icon" src="assets/icons/location.svg" alt="Location icon">
                        <span>80 Shawsheen Road<br>Andover, MA 01810<br>USA</span>
                    </li>
                </ul>
            </div>
            
            <div class="map-container">
                <!-- MODIFIED: The iframe now uses your new link. Unnecessary style attributes have been removed. -->
                <iframe
                    class="map-iframe"
                    src="https://maps.google.com/maps?q=Andover%20High%20School%20MA&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Andover High School Location">
                </iframe>
            </div>
        </div>
    `;
}
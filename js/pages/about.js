import { getStaff } from '../api.js';

function createHTML(staff) {
    const staffCards = staff.map(person => `
        <div class="staff-card" data-id="${person.id}">
            <div class="staff-card-img">
                <img src="${person.image}" alt="${person.name}" loading="lazy">
            </div>
            <h4>${person.name}</h4>
            <p>${person.role}</p>
        </div>
    `).join('');

    return `
        <section class="page" id="about-page">
            <div class="container">
                <div class="page-header">
                    <h1>About ANDOVERVIEW</h1>
                </div>
                
                <div class="about-description">
                    <p>ANDOVERVIEW is a publication written, edited and designed by the Newspaper Production class to serve as an open forum for students to discuss issues relevant to the Andover High School community.</p>
                    <p>Letters to the editor and guest commentaries are encouraged; please email submissions to the following address: <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a>.</p>
                    <p>If you would like to write for us or join the newspaper staff, please visit the <a href="#contact">Contact page</a> for more information.</p>
                    <p>Include contact information for verification purposes. The staff of ANDOVERVIEW reviews letters to the editor and guest commentaries and reserves the right to refuse material for reasons pertaining to length, clarity, libel, obscenity, copyright infringement, or material disruption to the educational process of Andover High School.</p>
                </div>
                
                <div class="page-header team-header">
                    <h2>Meet the Team</h2>
                    <p>The dedicated students behind every story. We are writers, editors, photographers, and leaders committed to bringing you the news that matters.</p>
                </div>
                <div class="staff-grid">${staffCards}</div>
            </div>
        </section>
    `;
}

export async function render(container) {
    const staff = await getStaff();
    container.innerHTML = createHTML(staff);
}
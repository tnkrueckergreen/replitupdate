import { getCombinedData } from '../api.js';
import { formatAuthorNamesFull } from '../lib/formatters.js';

function createHTML(article) {
    const writers = article.writers;

    const tagList = article.tags.map(tag => `
        <a href="#search/${encodeURIComponent(tag)}" class="tag-item">${tag}</a>
    `).join('');

    // NEW LOGIC: Generate a single container for all author bios
    let authorBiosContainer = '';
    if (writers && writers.length > 0) {
        const authorProfilesHTML = writers.map(writer => `
            <div class="author-profile">
                <img src="${writer.image}" alt="${writer.name}">
                <div>
                    <h4>About ${writer.name}</h4>
                    <p>${writer.bio || 'This author has not yet provided a bio.'}</p>
                </div>
            </div>
        `).join('<hr class="author-separator">');

        authorBiosContainer = `<div class="author-bios-container">${authorProfilesHTML}</div>`;
    }

    const authorAvatars = writers.map(writer => `<img src="${writer.image}" alt="${writer.name}">`).join('');
    const authorNames = formatAuthorNamesFull(writers);

    return `
        <section class="page" id="single-article-page">
            <div class="container">
                <div class="single-article-wrapper">
                    <div class="article-meta-bar">
                        <span class="category">${article.category}</span>
                        <span class="date">${article.date}</span>
                    </div>

                    <header class="single-article-header">
                        <h1>${article.title}</h1>
                        <p class="single-article-description">${article.description}</p>
                    </header>
                    
                    <div class="tag-list">${tagList}</div>

                    <div class="single-article-meta-top">
                        <div class="avatar-stack">${authorAvatars}</div>
                        <span>By ${authorNames}</span>
                    </div>

                    <img src="${article.image}" alt="${article.title}" class="single-article-image">
                    
                    <div class="single-article-content">
                        ${article.content}
                        ${authorBiosContainer}
                    </div>
                </div>
            </div>
        </section>
    `;
}

export async function render(container, articleId) {
    const { articles } = await getCombinedData();
    const article = articles.find(a => a.id == articleId);
    if (article) {
        container.innerHTML = createHTML(article);
    } else {
        container.innerHTML = `<div class="container page"><p>Article not found.</p></div>`;
    }
}

import { Authors } from '../metadata/Authors.js';

/**
 * Base article card component
 * @param {Object} article - Article data object
 * @param {Object} options - Display options
 * @returns {string} HTML string for article card
 */
export function ArticleCard(article, options = {}) {
    const {
        className = 'article-card',
        titleTag = 'h4',
        titleClass = 'article-title',
        showExcerpt = true,
        showAuthors = true,
        imageLoading = 'lazy',
        authorSize = 'large',
        withAvatars = true
    } = options;

    return `
        <article class="${className} article-card-linkable">
            ${renderImage(article, imageLoading)}
            ${renderMetaBar(article)}
            ${renderTitle(article, titleTag, titleClass)}
            ${showExcerpt ? renderExcerpt(article) : ''}
            ${showAuthors ? Authors(article.writers, { 
                size: authorSize, 
                withAvatars,
                className: 'author-meta'
            }) : ''}
        </article>
    `;
}

function renderImage(article, loading) {
    return `<img src="${article.image}" alt="${article.title}" loading="${loading}">`;
}

function renderMetaBar(article) {
    return `
        <div class="meta-bar">
            <span class="category">${article.category}</span>
            <span class="date">${article.date.split(',')[0]}</span>
        </div>
    `;
}

function renderTitle(article, tag, className) {
    return `
        <a href="#single-article-page/${article.id}" class="stretched-link">
            <${tag} class="${className}">${article.title}</${tag}>
        </a>
    `;
}

function renderExcerpt(article) {
    return `<p class="excerpt">${article.description}</p>`;
}
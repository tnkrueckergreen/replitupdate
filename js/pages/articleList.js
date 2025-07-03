import { getCombinedData } from '../api.js';
import { formatAuthorNamesSummary } from '../lib/formatters.js';
import { SortControl } from '../components/common/SortControl.js'; // ADDED
import { sortItems } from '../lib/sorting.js'; // ADDED
import { renderList } from '../lib/template.js'; // ADDED
import { SmallCard } from '../components/cards/SmallCard.js'; // ADDED

let articlesToDisplay = []; // Keep a reference to the current articles for sorting

function createAuthorsHTML(writers) {
    const displayWriters = writers.slice(0, 2);
    const remainingCount = writers.length - displayWriters.length;
    const authorAvatars = displayWriters.map(writer => `<img src="${writer.image}" alt="${writer.name}">`).join('');
    const moreAvatars = remainingCount > 0 ? `<div class="avatar-more">+${remainingCount}</div>` : '';
    const authorNames = formatAuthorNamesSummary(writers);

    return `
        <div class="author-meta small">
            <div class="avatar-stack">${authorAvatars}${moreAvatars}</div>
            <span>By ${authorNames}</span>
        </div>
    `;
}

// MODIFIED: This function is now just for creating the HTML structure.
function createHTML(title, articles) {
    const articleCards = renderList(articles, SmallCard);

    return `
        <section class="page article-grid-page">
            <div class="container">
                <div class="page-header"><h1>${title}</h1></div>
                ${SortControl()}
                <div id="article-grid-container" class="article-grid">${articleCards}</div>
            </div>
        </section>
    `;
}

// ADDED: A function to handle sorting and re-rendering the grid
function attachSortListener() {
    const sortSelect = document.getElementById('sort-by');
    const gridContainer = document.getElementById('article-grid-container');

    if (!sortSelect || !gridContainer) return;

    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const sortedArticles = sortItems(articlesToDisplay, sortBy);
        gridContainer.innerHTML = renderList(sortedArticles, SmallCard);
    });
}

// MODIFIED: The main render function now orchestrates everything.
export async function render(container, category = 'all') {
    const { articles } = await getCombinedData();
    let title = '';
    const lowerCategory = category.toLowerCase();

    if (lowerCategory === 'all') {
        articlesToDisplay = articles;
        title = 'All Articles';
    } else if (lowerCategory === 'opinion') {
        articlesToDisplay = articles.filter(a => ['opinion', 'editorial'].includes(a.category.toLowerCase()));
        title = 'Opinion';
    } else {
        articlesToDisplay = articles.filter(a => a.category.toLowerCase() === lowerCategory);
        title = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Default sort by newest
    articlesToDisplay = sortItems(articlesToDisplay, 'date-desc');

    container.innerHTML = createHTML(title, articlesToDisplay);
    attachSortListener(); // Attach the event listener after rendering
}
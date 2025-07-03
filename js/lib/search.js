import Fuse from 'fuse.js';
import { getCombinedData } from '../api.js';

let fuseInstance = null;
let articlesForSearch = [];

/**
 * Strip HTML tags from content
 * @param {string} html - HTML content
 * @returns {string} Plain text content
 */
function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

/**
 * Initialize search with Fuse.js
 */
export async function initializeSearch() {
    if (fuseInstance) return;

    const { articles } = await getCombinedData();
    
    articlesForSearch = articles.map(article => ({
        ...article,
        textContent: stripHtml(article.content)
    }));

    const options = {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'textContent', weight: 0.2 },
            { name: 'tags', weight: 0.2 },
            { name: 'writers.name', weight: 0.1 },
            { name: 'category', weight: 0.05 },
            { name: 'date', weight: 0.05 }
        ],
        includeScore: true,
        minMatchCharLength: 2,
        threshold: 0.3,
        ignoreLocation: true,
    };

    fuseInstance = new Fuse(articlesForSearch, options);
}

/**
 * Perform search with query
 * @param {string} query - Search query
 * @returns {Array} Search results
 */
export async function performSearch(query) {
    await initializeSearch();
    const results = fuseInstance.search(query);
    return results.map(result => result.item);
}
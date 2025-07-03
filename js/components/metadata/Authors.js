import { formatAuthorNamesSummary, formatAuthorNamesFull } from '../../lib/formatters.js';

/**
 * Renders author avatars with names
 * @param {Array} writers - Array of writer objects
 * @param {Object} options - Display options
 * @returns {string} HTML string for authors
 */
export function Authors(writers, options = {}) {
    const {
        size = 'large',
        fullNames = false,
        withAvatars = false,
        className = 'author-meta'
    } = options;

    if (!withAvatars) {
        return SimpleAuthors(writers, { size, fullNames, className });
    }

    return AuthorsWithAvatars(writers, { size, className });
}

/**
 * Simple text-based author display
 */
function SimpleAuthors(writers, { size, fullNames, className }) {
    const formattedNames = fullNames 
        ? formatAuthorNamesFull(writers) 
        : formatAuthorNamesSummary(writers);

    return `<p class="${className} ${className}-${size}">By ${formattedNames}</p>`;
}

/**
 * Author display with avatar stack
 */
function AuthorsWithAvatars(writers, { size, className }) {
    // MODIFIED: Corrected the logic to always cap visible avatars at 2 before showing "+N"
    const maxVisible = 2;
    const visibleWriters = writers.slice(0, maxVisible);
    const remainingCount = writers.length - maxVisible;

    const avatars = visibleWriters.map(writer => 
        `<img src="${writer.image}" alt="${writer.name}" title="${writer.name}">`
    ).join('');

    const moreAvatar = remainingCount > 0 
        ? `<div class="avatar-more">+${remainingCount}</div>` 
        : '';

    const names = formatAuthorNamesSummary(writers);

    return `
        <div class="${className} ${size}">
            <div class="avatar-stack">
                ${avatars}
                ${moreAvatar}
            </div>
            <span>By ${names}</span>
        </div>
    `;
}
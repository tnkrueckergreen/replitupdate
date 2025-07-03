import { render as renderHome } from './pages/home.js';
import { render as renderAbout } from './pages/about.js';
import { render as renderArticleList } from './pages/articleList.js';
import { render as renderSingleArticle } from './pages/singleArticle.js';
import { render as renderIssues } from './pages/issues.js';
import { render as renderSearchResults } from './pages/searchResults.js';
import { render as renderSubscribe } from './pages/subscribe.js';
import { render as renderContact } from './pages/contact.js'; // NEW

const mainContent = document.getElementById('main-content');
const footerCTA = document.getElementById('footer-cta');
const newsTicker = document.getElementById('news-ticker-container'); // ADDED

const routes = {
    'home-page': () => renderHome(mainContent),
    'about-page': () => renderAbout(mainContent),
    'contact': () => renderContact(mainContent), // NEW
    'articles-page-all': () => renderArticleList(mainContent, 'all'),
    'articles-page-community': () => renderArticleList(mainContent, 'community'),
    'articles-page-sports': () => renderArticleList(mainContent, 'sports'),
    'articles-page-arts': () => renderArticleList(mainContent, 'arts'),
    'articles-page-reviews': () => renderArticleList(mainContent, 'reviews'),
    'articles-page-opinion': () => renderArticleList(mainContent, 'opinion'),
    'articles-page-editorial': () => renderArticleList(mainContent, 'editorial'),
    'issues-page': () => renderIssues(mainContent),
    'subscribe': () => renderSubscribe(mainContent),
    'search': (param) => renderSearchResults(mainContent, param),
    'single-article-page': (param) => renderSingleArticle(mainContent, param),
};

function getRouteAndParams(hash) {
    const [path, param] = hash.replace('#', '').split('/');
    return { path: path || 'home-page', param };
}

function updateActiveNavLink(path) {
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.hash.replace('#', '');
        let isActive = (linkPath === path);

        // Highlight "Opinion" when on the editorial page
        if (path === 'articles-page-editorial' && linkPath === 'articles-page-opinion') isActive = true;

        // Highlight "Arts" when on the reviews page
        if (path === 'articles-page-reviews' && linkPath === 'articles-page-arts') isActive = true;
        
        // Highlight "About" when on the contact page
        if (path === 'contact' && linkPath === 'about-page') isActive = true;

        link.classList.toggle('active-link', isActive);
    });
}

export function handleRouteChange() {
    const { path, param } = getRouteAndParams(location.hash);
    
    // Conditionally hide the footer banner on the subscribe page
    if (footerCTA) {
        const pagesToHideFooterOn = ['subscribe'];
        footerCTA.classList.toggle('hidden', pagesToHideFooterOn.includes(path));
    }
    
    // ADDED: Show or hide the news ticker based on the current page
    if (newsTicker) {
        newsTicker.style.display = (path === 'home-page') ? 'flex' : 'none';
    }

    const renderFunction = routes[path];

    if (renderFunction) {
        renderFunction(param);
    } else {
        location.hash = '#home-page';
    }
    
    updateActiveNavLink(path);
    window.scrollTo(0, 0);
}

export function initRouter() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
}
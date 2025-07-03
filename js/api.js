const API_PATHS = {
    articleManifest: 'data/articles.json',
    articleDir: 'data/articles/',
    staff: 'data/staff.json',
};

let cachedCombinedData = null;

function parseArticleTxt(txt, filename) {
    const article = { id: filename.split('.')[0] };
    const lines = txt.split('\n');
    const contentIndex = lines.findIndex(line => line.trim() === '---');
    
    const frontmatter = lines.slice(0, contentIndex).join('\n');
    const content = lines.slice(contentIndex + 1).join('\n');

    article.content = content;

    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const key_ = key.trim().toLowerCase();
            const value = valueParts.join(':').trim();
            
            if (key_ === 'tags' || key_ === 'author') {
                article[key_] = value.split(',').map(item => item.trim());
            } else {
                article[key_] = value;
            }
        }
    });

    return article;
}

async function getArticles() {
    try {
        const manifestResponse = await fetch(API_PATHS.articleManifest);
        const articleFiles = await manifestResponse.json();

        const articlePromises = articleFiles.map(async (filename) => {
            try {
                const articleResponse = await fetch(`${API_PATHS.articleDir}${filename}`);
                if (!articleResponse.ok) return null; // Gracefully handle 404
                const articleTxt = await articleResponse.text();
                return parseArticleTxt(articleTxt, filename);
            } catch (e) {
                console.error(`Failed to load or parse ${filename}`, e);
                return null; // Return null on error
            }
        });

        const articles = (await Promise.all(articlePromises)).filter(Boolean); // Filter out any nulls from failed fetches
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        return articles;

    } catch (error) {
        console.error("Could not fetch article manifest:", error);
        return [];
    }
}

export async function getStaff() {
    try {
        const response = await fetch(API_PATHS.staff);
        return await response.json();
    } catch (error) {
        console.error("Could not fetch staff:", error);
        return [];
    }
}

export async function getCombinedData() {
    if (cachedCombinedData) {
        return cachedCombinedData;
    }

    const [articles, staff] = await Promise.all([getArticles(), getStaff()]);
    
    const staffMap = new Map(staff.map(s => [s.name.toLowerCase(), s]));

    const articlesWithWriters = articles.map(article => {
        // CORRECTED: Safely handle potentially missing 'author' field
        const authorNames = article.author || [];

        const writers = authorNames.map(authorName => {
            const writerData = staffMap.get(authorName.toLowerCase());
            return writerData || { name: authorName, image: 'https://i.pravatar.cc/300?u=placeholder', bio: 'Bio not available.' };
        });
        return { ...article, writers };
    });

    cachedCombinedData = { articles: articlesWithWriters, staff };
    return cachedCombinedData;
}
const apiKey = 'e07e2a7573224afebe0a5768b785b12b';
const newsContainer = document.getElementById('news-grid');
const categorySelect = document.getElementById('category');
const countrySelect = document.getElementById('country');
const searchBtn = document.getElementById('search-btn');
const searchQueryInput = document.getElementById('search');
const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}&page=${page}&pageSize=5`;

let currentPage = 1;
let currentQuery = '';

// Fetch news based on category and country
async function fetchLatestNews(page = 1) {
    const country = countrySelect.value; // Get selected country
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}&page=${page}&pageSize=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data.articles;
}

// Fetch news based on search query
async function searchNews(query, page = 1) {
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=${page}&pageSize=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data.articles;
}

// Display news articles
function displayNews(articles) {
    newsContainer.innerHTML = ''; // Clear previous news
    articles.forEach(article => {
        const newsArticle = document.createElement('article');
        newsArticle.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(newsArticle);
    });
}

// Load more news when the button is clicked
document.getElementById('load-more').addEventListener('click', async () => {
    currentPage++;
    let articles;
    if (currentQuery) {
        articles = await searchNews(currentQuery, currentPage);
    } else {
        articles = await fetchLatestNews(currentPage);
    }
    displayNews(articles);
});

// Fetch news on country change
countrySelect.addEventListener('change', async () => {
    currentPage = 1; // Reset page count
    const articles = await fetchLatestNews(currentPage);
    displayNews(articles);
});

// Search for news when search button is clicked
searchBtn.addEventListener('click', async () => {
    const query = searchQueryInput.value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1; // Reset page count
        const articles = await searchNews(query, currentPage);
        displayNews(articles);
    }
});

// Initial news load (Latest News)
window.addEventListener('DOMContentLoaded', async () => {
    const articles = await fetchLatestNews(currentPage);
    displayNews(articles);
});

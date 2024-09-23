const apiKey = 'e07e2a7573224afebe0a5768b785b12b';
const newsContainer = document.getElementById('newsContainer');
const categorySelect = document.getElementById('category');
const countrySelect = document.getElementById('country');
const searchBtn = document.getElementById('searchBtn');
const searchQueryInput = document.getElementById('searchQuery');
let currentPage = 1;
let currentQuery = '';
let selectedCategory = 'general';
let selectedCountry = 'us'; // Default country

// Fetch news based on category, country, and page
async function fetchNews(category, country, page = 1) {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}&page=${page}&pageSize=5`;
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
document.getElementById('loadMoreBtn').addEventListener('click', async () => {
    currentPage++;
    let articles;
    if (currentQuery) {
        articles = await searchNews(currentQuery, currentPage);
    } else {
        articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    }
    displayNews(articles);
});

// Fetch news on category or country change
categorySelect.addEventListener('change', async () => {
    selectedCategory = categorySelect.value;
    newsContainer.innerHTML = ''; // Clear previous news
    currentPage = 1; // Reset page count
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

countrySelect.addEventListener('change', async () => {
    selectedCountry = countrySelect.value;
    newsContainer.innerHTML = ''; // Clear previous news
    currentPage = 1; // Reset page count
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

// Search for news when search button is clicked
searchBtn.addEventListener('click', async () => {
    const query = searchQueryInput.value.trim();
    if (query) {
        currentQuery = query;
        newsContainer.innerHTML = ''; // Clear previous news
        currentPage = 1; // Reset page count
        const articles = await searchNews(query, currentPage);
        displayNews(articles);
    }
});

// Initial news load (General Category, US as default country)
window.addEventListener('DOMContentLoaded', async () => {
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

const apiKey = 'e07e2a7573224afebe0a5768b785b12b';
const newsContainer = document.getElementById('newsContainer');
const categorySelect = document.getElementById('category');
const countrySelect = document.getElementById('country');
const searchBtn = document.getElementById('searchBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchQueryInput = document.getElementById('searchQuery');
let currentPage = 1;
let currentQuery = '';
let selectedCategory = 'general';
let selectedCountry = 'us'; // Default country

// Show loading indicator
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading');
    loadingElement.textContent = 'Loading...';
    newsContainer.appendChild(loadingElement);
}

// Hide loading indicator
function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// Fetch news based on category, country, and page
async function fetchNews(category, country, page = 1) {
    showLoading();
    try {
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}&page=${page}&pageSize=5`;
        const response = await fetch(url);
        const data = await response.json();
        hideLoading();
        if (response.ok && data.articles.length > 0) {
            return data.articles;
        } else {
            throw new Error('No news articles found.');
        }
    } catch (error) {
        hideLoading();
        displayError(error.message);
        return [];
    }
}

// Fetch news based on search query
async function searchNews(query, page = 1) {
    showLoading();
    try {
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=${page}&pageSize=5`;
        const response = await fetch(url);
        const data = await response.json();
        hideLoading();
        if (response.ok && data.articles.length > 0) {
            return data.articles;
        } else {
            throw new Error('No news articles found for this search query.');
        }
    } catch (error) {
        hideLoading();
        displayError(error.message);
        return [];
    }
}

// Display error message
function displayError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.textContent = message;
    newsContainer.appendChild(errorElement);
}

// Display news articles
function displayNews(articles) {
    articles.forEach(article => {
        const newsArticle = document.createElement('article');
        newsArticle.classList.add('news-card');
        newsArticle.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="News Image">
            <div class="news-content">
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            </div>
        `;
        newsContainer.appendChild(newsArticle);
    });
}

// Clear previous news
function clearNews() {
    newsContainer.innerHTML = '';
}

// Disable button while loading
function toggleButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.textContent = 'Load More';
    }
}

// Load more news when the button is clicked
loadMoreBtn.addEventListener('click', async () => {
    toggleButtonLoading(loadMoreBtn, true);
    currentPage++;
    let articles;
    if (currentQuery) {
        articles = await searchNews(currentQuery, currentPage);
    } else {
        articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    }
    displayNews(articles);
    toggleButtonLoading(loadMoreBtn, false);
});

// Fetch news on category or country change
categorySelect.addEventListener('change', async () => {
    selectedCategory = categorySelect.value;
    clearNews(); // Clear previous news
    currentPage = 1; // Reset page count
    currentQuery = ''; // Reset search query
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

countrySelect.addEventListener('change', async () => {
    selectedCountry = countrySelect.value;
    clearNews(); // Clear previous news
    currentPage = 1; // Reset page count
    currentQuery = ''; // Reset search query
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

// Search for news when search button is clicked
searchBtn.addEventListener('click', async () => {
    const query = searchQueryInput.value.trim();
    if (query) {
        currentQuery = query;
        clearNews(); // Clear previous news
        currentPage = 1; // Reset page count
        toggleButtonLoading(searchBtn, true);
        const articles = await searchNews(query, currentPage);
        displayNews(articles);
        toggleButtonLoading(searchBtn, false);
    }
});

// Initial news load (General Category, US as default country)
window.addEventListener('DOMContentLoaded', async () => {
    const articles = await fetchNews(selectedCategory, selectedCountry, currentPage);
    displayNews(articles);
});

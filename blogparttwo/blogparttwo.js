// Sample article data (in a real implementation, this would be in blog.js as provided)
const articles = [
    {
        id: 1,
        title: "Septimus Heap Book One: Magyk",
        date: "July 5, 2022",
        description:
            "If you enjoy stories about seventh sons of seventh sons and magyk this is the book for you.",
        imgSrc: "magyk.jpg",
        imgAlt: "Book cover for Septimus Heap 1",
        ages: "10-14",
        genre: "Fantasy",
        stars: "****"
    },
    {
        id: 2,
        title: "Magnus Chase Book One: Sword of Summer",
        date: "December 12, 2021",
        description:
            "The anticipated new novel by Rick Riordan. After Greek mythology (Percy Jackson), Greek/Roman (Heroes of Olympus), and Egyptian (Kane Chronicles), Rick decides to try his hand with Norse Mythology, and the end result is good.",
        imgSrc:
            "chase.jpg",
        imgAlt: "Book cover for Magnus Chase 1",
        ages: "12-16",
        genre: "Fantasy",
        stars: "⭐⭐⭐⭐"
    },
    {
        id: 3,
        title: "Belgariad Book One: Pawn of Prophecy",
        date: "Feb 12, 2022",
        description:
            "A fierce dispute among the Gods and the theft of a powerful Orb leaves the World divided into five kingdoms. Young Garion, with his 'Aunt Pol' and an elderly man calling himself Wolf --a father and daughter granted near-immortality by one of the Gods -- set out on a complex mission.",
        imgSrc:
            "belgariad.jpg",
        imgAlt: "Book cover for Pawn of Prophecy",
        ages: "12-16",
        genre: "Fantasy",
        stars: "⭐⭐⭐⭐⭐"
    }
];

// Function to generate article HTML
function createArticleElement(article) {
    // Create the article element
    const articleElement = document.createElement('article');
    
    // Create the HTML content using template literals
    const articleContent = `
        <div class="book-details">
            <time datetime="${formatDateForDateTime(article.date)}">${article.date}</time>
            <p class="age-range">${article.ages}</p>
            <p class="genre">${article.genre}</p>
            <p class="rating">${article.stars}</p>
        </div>
        <div class="book-content">
            <h2>${article.title}</h2>
            <img src="${article.imgSrc}" alt="${article.imgAlt}">
            <p>${article.description}</p>
            <a href="#">Read More...</a>
        </div>
    `;
    
    // Set the innerHTML of the article element
    articleElement.innerHTML = articleContent;
    
    return articleElement;
}

// Helper function to format dates for datetime attribute
function formatDateForDateTime(dateString) {
    // Simple formatting for demonstration - would need more robust handling in production
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // If date parsing fails, return a default format
        return dateString;
    }
    return date.toISOString().split('T')[0];
}

// Function to render all articles
function renderArticles() {
    // Get the container element
    const articlesContainer = document.getElementById('articles-container');
    
    // Clear any existing content
    articlesContainer.innerHTML = '';
    
    // Loop through each article and append to the container
    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        articlesContainer.appendChild(articleElement);
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderArticles();
    console.log('Articles rendered dynamically!');
});
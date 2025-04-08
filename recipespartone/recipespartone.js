// Sample recipe data
const recipes = [
    {
      id: 1,
      title: "Apple Crisp",
      category: "dessert",
      image: "apple-crisp.webp",
      rating: 4,
      description: "This apple crisp recipe is a simple yet delicious fall dessert that's great served warm with vanilla ice cream."
    },
    {
      id: 2,
      title: "Vegetable Stir Fry",
      category: "main dish",
      image: "stir-fry.jpg",
      rating: 3,
      description: "A quick and healthy vegetable stir fry that's perfect for busy weeknights."
    },
    {
      id: 3,
      title: "Classic Cheeseburger",
      category: "main dish",
      image: "cheeseburger.jpg",
      rating: 5,
      description: "The ultimate classic cheeseburger with all the fixings."
    },
    {
      id: 4,
      title: "Caesar Salad",
      category: "salad",
      image: "caesar-salad.jpg",
      rating: 4,
      description: "A classic Caesar salad with homemade dressing and croutons."
    }
  ];
  
  // Function to generate star rating HTML
  function generateRatingStars(rating) {
    let starsHTML = '<span class="rating" role="img" aria-label="Rating: ' + rating + ' out of 5 stars">';
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHTML += '<span aria-hidden="true" class="icon-star">⭐</span>';
      } else {
        starsHTML += '<span aria-hidden="true" class="icon-star-empty">☆</span>';
      }
    }
    
    starsHTML += '</span>';
    return starsHTML;
  }
  
  // Function to display all recipes
  function displayRecipes() {
    const recipeContainer = document.querySelector('.recipe-container');
    
    // Clear existing recipes
    recipeContainer.innerHTML = '';
    
    // Add all recipes to the page
    recipes.forEach(recipe => {
      const recipeCard = document.createElement('article');
      recipeCard.classList.add('recipe-card');
      
      recipeCard.innerHTML = `
        <img src="images/${recipe.image}" alt="${recipe.title}">
        <div class="recipe-content">
          <span class="category">${recipe.category}</span>
          <h2 class="recipe-title">${recipe.title}</h2>
          ${generateRatingStars(recipe.rating)}
          <p class="recipe-description">${recipe.description}</p>
        </div>
      `;
      
      recipeContainer.appendChild(recipeCard);
    });
  }
  
  // Initialize the page when the DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    displayRecipes();
    
    // Add event listener for search form
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = this.querySelector('input').value.toLowerCase();
      
      if (searchInput.trim() === '') {
        displayRecipes();
        return;
      }
      
      // Filter recipes based on search input
      const filteredRecipes = recipes.filter(recipe => {
        return recipe.title.toLowerCase().includes(searchInput) || 
               recipe.category.toLowerCase().includes(searchInput) ||
               recipe.description.toLowerCase().includes(searchInput);
      });
      
      // Display filtered recipes
      const recipeContainer = document.querySelector('.recipe-container');
      recipeContainer.innerHTML = '';
      
      if (filteredRecipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found matching your search.</p>';
        return;
      }
      
      filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('article');
        recipeCard.classList.add('recipe-card');
        
        recipeCard.innerHTML = `
          <img src="images/${recipe.image}" alt="${recipe.title}">
          <div class="recipe-content">
            <span class="category">${recipe.category}</span>
            <h2 class="recipe-title">${recipe.title}</h2>
            ${generateRatingStars(recipe.rating)}
            <p class="recipe-description">${recipe.description}</p>
          </div>
        `;
        
        recipeContainer.appendChild(recipeCard);
      });
    });
  });
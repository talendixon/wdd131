// ✅ Sample Recipe Data
const recipes = [
  {
    id: 1,
    title: "Apple Crisp",
    category: "dessert",
    image: "apple-crisp.webp",
    rating: 4,
    description: "This apple crisp recipe is a simple yet delicious fall dessert that's great served warm with vanilla ice cream.",
    tags: ["Dessert", "Fruit"],
    ingredients: ["apples", "oats", "brown sugar"]
  },
  {
    id: 2,
    title: "Vegetable Stir Fry",
    category: "main dish",
    image: "stir-fry.jpg",
    rating: 3,
    description: "A quick and healthy vegetable stir fry that's perfect for busy weeknights.",
    tags: ["Healthy", "Vegan"],
    ingredients: ["broccoli", "carrots", "bell pepper"]
  },
  {
    id: 3,
    title: "Classic Cheeseburger",
    category: "main dish",
    image: "cheeseburger.jpg",
    rating: 5,
    description: "The ultimate classic cheeseburger with all the fixings.",
    tags: ["Beef", "Grill"],
    ingredients: ["beef", "cheddar", "bun"]
  },
  {
    id: 4,
    title: "Caesar Salad",
    category: "salad",
    image: "caesar-salad.jpg",
    rating: 4,
    description: "A classic Caesar salad with homemade dressing and croutons.",
    tags: ["Salad", "Greens"],
    ingredients: ["romaine", "parmesan", "croutons"]
  }
];

// ✅ 02 - Random Helpers
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function getRandomListEntry(list) {
  return list[getRandomNumber(list.length)];
}

// ✅ 03 - Template Functions
function tagsTemplate(tags) {
  return tags.map(tag => `<li>${tag}</li>`).join('');
}

function ratingTemplate(rating) {
  let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`;
  for (let i = 1; i <= 5; i++) {
    html += i <= rating
      ? `<span aria-hidden="true" class="icon-star">⭐</span>`
      : `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
  }
  html += '</span>';
  return html;
}

function recipeTemplate(recipe) {
  return `
    <article class="recipe-card">
      <img src="images/${recipe.image}" alt="${recipe.title}">
      <div class="recipe-content">
        <ul class="recipe__tags">${tagsTemplate(recipe.tags)}</ul>
        <h2 class="recipe-title">${recipe.title}</h2>
        ${ratingTemplate(recipe.rating)}
        <p class="recipe-description">${recipe.description}</p>
      </div>
    </article>
  `;
}

// ✅ 04 - Render Random Recipe
function renderRecipes(recipeList) {
  const container = document.querySelector('.recipe-container');
  if (!container) return;

  container.innerHTML = recipeList.length
    ? recipeList.map(recipeTemplate).join('')
    : '<p>No recipes found matching your search.</p>';
}

function init() {
  const randomRecipe = getRandomListEntry(recipes);
  renderRecipes([randomRecipe]);
}

// ✅ 05 - Filter Recipes by Search
function filterRecipes(query) {
  query = query.toLowerCase();

  return recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(query) ||
    recipe.description.toLowerCase().includes(query) ||
    recipe.tags.find(tag => tag.toLowerCase().includes(query)) ||
    recipe.ingredients.find(ingredient => ingredient.toLowerCase().includes(query))
  ).sort((a, b) => a.title.localeCompare(b.title));
}

function searchHandler(event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-form input').value.trim().toLowerCase();

  if (searchInput === '') {
    renderRecipes(recipes); // Show all if empty
    return;
  }

  const filtered = filterRecipes(searchInput);
  renderRecipes(filtered);
}

// ✅ Load Everything When Page Loads
document.addEventListener('DOMContentLoaded', () => {
  init(); // Show a random recipe initially
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', searchHandler);
  }
});

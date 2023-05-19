let recipes;
fetch("https://public-api.wordpress.com/rest/v1.1/sites/foodmood07.wordpress.com/posts/")
  .then(response => response.json()) // parse the response as JSON
  .then(data => {
    const recipes = data.posts.map(post => {
      return {
        title: post.title,
        image: post.featured_image,
        content: post.content,
        isFavorite: false
      };
    });
    console.log(recipes); // log the resulting array of recipe objects
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
async function fetchRecipes() {
    try {
      const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/foodmood07.wordpress.com/posts');
      const data = await response.json();
      recipes = data.posts.map(post => ({
        ID: post.ID,
        title: post.title,
        image: post.featured_image,
        content: post.content,
        isFavorite: false
      }));
      showFavorites();
      updateRecipeList();
    } catch (error) {
      console.log(error);
    }
}
document.addEventListener('DOMContentLoaded', fetchRecipes);
async function updateRecipeList() {
  const recipesContainer = document.querySelector('.recipes');
  const rowContainer = recipesContainer.querySelector('.row');
  rowContainer.innerHTML = '';
  const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/foodmood07.wordpress.com/posts/');
  const recipes = await response.json();
  recipes.posts.forEach(post => {
    const imageUrl = post.featured_image;
    const recipeTitle = post.title;
    const recipeDetailsUrl = `recipesDetails.html?id=${post.ID}`;
    const recipeCard = `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">${recipeTitle}</h5>
            <a href="${recipeDetailsUrl}" class="btn btn-primary recipe-details-link">See Recipe</a>
          </div>
        </div>
      </div>
    `;
    rowContainer.insertAdjacentHTML('beforeend', recipeCard);
  });
  const recipeDetailsLinks = document.querySelectorAll('.recipe-details-link');
  recipeDetailsLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const postId = this.getAttribute('href').split('=')[1];
      const recipeTitleElement = this.querySelector('h5');
      const recipeTitle = recipeTitleElement ? recipeTitleElement.textContent : '';
      const recipeContent = '';
      const url = `recipesDetails.html?id=${postId}&title=${recipeTitle}&content=${recipeContent}`;
      window.location.href = url;
    })
  });  
}
$(document).ready(function() {
  $("#button-addon2").on("click", function() {
    var searchQuery = $(".form-control").val();
    var selectedCuisine = $("#exampleSelect1 option:selected").text();
    var filteredRecipes = [];
    $(".list-group-item").each(function() {
      var recipeName = $(this).text();
      var isVegetarian = $(this).hasClass("vegetarian");
      var isGlutenFree = $(this).hasClass("gluten-free");
      var cuisineType = $(this).data("cuisine");
      if (recipeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCuisine === "Any" || selectedCuisine === cuisineType) &&
          (!$("#defaultCheck1").prop('checked') || isVegetarian) && 
          (!$("#defaultCheck2").prop('checked') || isGlutenFree)) {
        filteredRecipes.push($(this));
      }
    });
    $(".list-group-item").hide();
    filteredRecipes.forEach(function(recipe) {
      recipe.show();
    });
  });
});
function searchRecipes() {
  const searchBox = document.getElementById('search-box');
  const filterSelect = document.getElementById('filter');
  const searchTerm = searchBox.value.trim().toLowerCase();
  const filterTerm = filterSelect.value;
  fetch('https://public-api.wordpress.com/rest/v1.1/sites/foodmood07.wordpress.com/posts?category=' + filterTerm)
    .then(response => response.json())
    .then(data => {
      var filteredRecipes = data.posts;
      if (searchTerm) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm)
        );
      }
      renderRecipeCards(filteredRecipes);
      document.getElementById('recipe-cards-container').style.display = 'block';
    });
}
let filteredRecipes = [];
function toggleFavorite(recipeID) {
  const index = recipes.findIndex(recipe => recipe.ID === recipeID);
  if (index !== -1) {
    recipes[index].isFavorite = !recipes[index].isFavorite;
    showFavorites();
    renderRecipeCards(filteredRecipes);
  }
}
function showFavorites() {
  filteredRecipes = recipes.filter(recipe => recipe.isFavorite);
}
function renderRecipeCards(recipes) {
  const recipeCardsContainer = document.getElementById('recipe-cards-container');
  recipeCardsContainer.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('card');
    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.featured_image;
    recipeCard.appendChild(recipeImage);
    const recipeTitle = document.createElement('h2');
    recipeTitle.innerHTML = recipe.title;
    recipeCard.appendChild(recipeTitle);
    const recipeContents = document.createElement('div');
    recipeContents.classList.add('card-container');
    recipeContents.innerHTML = recipe.content;
    recipeCard.appendChild(recipeContents);
    const favoriteButton = document.createElement('button');
    favoriteButton.innerText = recipe.isFavorite ? 'Unfavorite' : 'Favorite';
    favoriteButton.onclick = () => toggleFavorite(recipe.ID);
    recipeCard.appendChild(favoriteButton);
    recipeCardsContainer.appendChild(recipeCard);
  });
}
function isRecipeFavorited(id) {
  const favorites = getFavorites();
  return favorites.indexOf(id) !== -1;
}
function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderRecipeCards(recipes);
}
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function showFavorites() {
  const favorites = getFavorites(); 
  if (!recipes || !recipes.posts) {
    console.log('Recipes or posts are undefined');
    return;
  }
  const filteredPosts = recipes.posts.filter(post => favorites.includes(post.ID));
  const favoriteList = document.getElementById('favorite-list');
  favoriteList.innerHTML = '';
  filteredPosts.forEach(post => {
    const listItem = document.createElement('li');
    listItem.innerText = post.title;
    favoriteList.appendChild(listItem);
  });
}
showFavorites();
function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderRecipeCards(recipes);
  showFavorites();
}
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');
if (!recipeId) {
  console.log('Recipe ID is undefined');
} else {
  fetch('https://public-api.wordpress.com/rest/v1.1/sites/foodmood07.wordpress.com/posts/' + recipeId)
    .then(response => response.json())
    .then(data => {
      const recipeTitle = document.getElementById('recipe-title');
      recipeTitle.innerHTML = data.title;
      const recipeImage = document.getElementById('recipe-image');
      recipeImage.src = data.featured_image;
      const recipeContents = document.getElementById("recipe-content");
      recipeContents.innerHTML = data.content;
    });
}
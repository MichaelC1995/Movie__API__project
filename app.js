// http://www.omdbapi.com/?s=${searchTerm}&page=1apikey=cc5c9783
// https://www.omdbapi.com/?t=avengers&y=2012&apikey=cc5c9783& example for avengers 2012

const movieSearchBox = document.getElementById(`movie__search__box`);
const searchList = document.getElementById(`search__list`);
const resultGrid = document.getElementById(`result__grid`);
let btnElement = document.querySelector(".not__loading");
const loadingSpinner = document.getElementById(`.loading`);
const searchListLoading = document.getElementById(`search__list__item`);
// LOAD MOVIES FROM API


async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=cc5c9783`;
    const response = await fetch(`${URL}`)
    const data = await response.json();
    displayMovieList(data.Search);   
}


// onkeyup(findMovies) for the searchbar to track search input

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    // if else to add and remove class hide__search__list in order to display when searching and to display none afterwards
    if (searchTerm.length != 0){
        searchList.classList.remove(`hide__search__list`)
        loadMovies(searchTerm);
    }

    else{
        searchList.classList.add(`hide__search__list`)
    }
}
findMovies()


// create a function that creates a div for each object / movie found. Appears in searchbar

async function displayMovieList(movies){
    let searchTerm = (movieSearchBox.value).trim();
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=cc5c9783`;
    const response = await fetch(`${URL}`)
    const data = await response.json();
    
    if(movies === `newest`){
        const filteredMovies = data.Search.sort((a, b) => b.Year - a.Year); 
        
    }
    
    else if(movies === 'oldest'){
        const filteredMovies = data.Search.sort((a, b) => a.Year - b.Year);
        // console.log(filteredMovies);
    }
    
    else if(movies === `alphabetical`){    
        const filteredMovies = data.Search.sort((a, b) => a.Title.localeCompare(b.Title))
        // console.log(filteredMovies);
    }
    
    else if(movies === `opposite`){
        const filteredMovies = data.Search.sort((a, b) => b.Title.localeCompare(a.Title))
        console.log(filteredMovies);      
    }   
    
    searchList.innerHTML = "";
    for (let i = 0; i < 6; ++i){
        let movieListItem = document.createElement('div');
        console.log(movieListItem);
        movieListItem.dataset.id = movies[i].imdbID;
        movieListItem.classList.add('search__list__item');
        if(movies[i].Poster !== 'N/A'){
            moviePoster = data.Search[i].Poster;
        }
        else{
            moviePoster = `https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg`
        }
        movieListItem.innerHTML = `
        <div class="search__item__thumbnail">
        <img src="${moviePoster}" alt="">
        </div>
        <div class="search__item__info">
        <h3>${data.Search[i].Title}</h3>
        <p>${data.Search[i].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    filterMovies()
    loadMovieDetails();
    displayMovieDetails()
}


function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search__list__item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add(`hide__search__list`);
            movieSearchBox.value = ``;
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=cc5c9783`)
            const movieDetails = await result.json();
            
            
            
            // console.log(movieDetails);
            fetchData()
            filterMovies()
            displayMovieDetails(movieDetails);
        });
    });
}

// FUNCTION WHICH DISPLAYS THE INFORMATION PULLED LOADED FROM API
function displayMovieDetails(detail) {

    // console.log(detail);    
    resultGrid.innerHTML = `
    <div class="movie__poster">
    <img src="${(detail.Poster != "N/A") ? detail.Poster : "Image not found"}" alt="landing__page--img">
    </div>
    <div class="movie__info">
    <h3 class="movie__title">${detail.Title}</h3>
    <ul class="movie__attributes">
    <li class="year attribute"><span class="bold orange">Year:</span> ${detail.Year}</li>
    <li class="rating attribute"><span class="bold orange">Rating:</span> ${detail.Rated}</li>
    <li class="released attribute"><span class="bold orange">Released:</span> ${detail.Released}</li>
    </ul>
    <div class="movie__description">
    <p class="movie writer "><span class="bold orange">Writer:</span> ${detail.Writer}</p>
    <p class="movie actors"><span class="bold orange">Actors:</span> ${detail.Actors}</p>
    <p class="movie plot"><span class="bold orange">Plot:</span> ${detail.Plot}</p>
    <p class="movie language"><span class="bold orange">Language:</span> ${detail.Language}</p>
    <p class="movie awards"><i class="fas fa-award"></i><span class="bold orange"> Nominations: </span>${detail.Awards}</p>
    </div>
    </div>
    `
}

async function filterMovies(event){
    let searchTerm = (movieSearchBox.value).trim();
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=cc5c9783`;
    const response = await fetch(`${URL}`)
    const data = await response.json();

    if (event.target.value === `newest`){
        displayMovieList(event.target.value)
        displayMovieDetails(event.target.value)
    }

    else if (event.target.value === `oldest`){
        displayMovieList(event.target.value)
        displayMovieDetails(event.target.value)
        console.log(event.target.value);            
    }

    else if (event.target.value === `alphabetical`){
        displayMovieList(event.target.value)
        displayMovieDetails(event.target.value)       
    }

    else if (event.target.value === `opposite`){
        displayMovieList(event.target.value)
        displayMovieDetails(event.target.value)             
    }
}

setTimeout(() => {
    displayMovieDetails()
})


// KEYUP USING 'ENTER' KEY EVENT LISTENER. ALLOWS ENTER KEY TO SEARCH THE SEARCHBAR INPUT
movieSearchBox.addEventListener('keyup', (event) => {
    if (event.key === "Enter"){
        event.preventDefault();
        resultGrid.style.display = `none`;
        const searchQuery = movieSearchBox.value;
        btnElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        btnElement.disabled = true;
        btnElement.style.opacity = 0.5;
        
        setTimeout((findMovies) => {
            btnElement.innerHTML = `<i class="fa fa-search"></i>`;
            btnElement.disabled = false;
            btnElement.style.opacity = 1;
        }, 500)
        fetchData()
        findMovies()   
    }
})


// EVENT LISTENER FOR THE SEARCH BUTTON
btnElement.addEventListener("click", findMovies)


// EVENT LISTENER FOR THE LOADING ELEMENT ON THE SEARCH BUTTON
btnElement.addEventListener(`click`, fetchData)

btnElement.addEventListener(`click`, () => {
    resultGrid.style.display = `none`;
})

searchList.addEventListener(`click`, () => {
    resultGrid.style.display = `flex`;
})


function fetchData() {
    // Show loading state
    btnElement.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    btnElement.disabled = true;
    btnElement.style.opacity = 0.5;
    document.getElementById("loading").style.display = "block";
    // Simulate an API call
    setTimeout(() => {
        // Hide loading state
        btnElement.innerHTML = `<i class="fa fa-search"></i>`;
        btnElement.disabled = false;
        btnElement.style.opacity = 1;
        document.getElementById("loading").style.display = "none";
        
        // Do something with the fetched data
        console.log("Data fetched!");
    }, 500); 
}

function hideResult(){
    if(`hide__search__list` === true){
        document.getElementById("result__grid").style.display = "none";

    }
    else{
        document.getElementById("result__grid").style.display = "flex";
    }
}
hideResult()
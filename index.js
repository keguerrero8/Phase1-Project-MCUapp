//2. if there is no movies in My List, nothing happens when view my list is clicked
//4. Persist My List of movies added
document.addEventListener("DOMContentLoaded", e => {
    searchBar()
    ViewMyList()
    addToMyList()
    initialize()
    topTenLoadList()
    releaseDateLoadList()
    chronologicalLoadList()
})

//initialize some variables
let today = new Date()
let todayDate = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
let myList = []
let myListCount = 0

//this will load the upcoming movie to be released at the center pane of the app upon reload
function initialize () {
    fetch("https://mcuapi.herokuapp.com/api/v1/movies")
    .then(data => data.json())
    .then(json => {
        //console.log(json)
        const startTime = new Date(json.data[1].release_date)
        let minTime = startTime.getTime()
        let movieToDisplay
        for (let movie of json.data) {
            const movieDate = new Date(movie.release_date)
            const timeDiff = Math.abs(todayDate.getTime() - movieDate.getTime())
            if (timeDiff < minTime && movie.box_office === "0") {
                minTime = timeDiff
                movieToDisplay = movie
            }
        }
        displayMovieCenter(movieToDisplay)
    })
}

function topTenLoadList () {
    const list = document.querySelector("#topTen")
    list.addEventListener("click", event => {
        fetch("https://mcuapi.herokuapp.com/api/v1/movies")
        .then(data => data.json())
        .then(json => {
            let topTenList = []
            let maxVal = 0
            let movieToAdd
            for (let i = 0; i < 10; i++) {
                for (let i = 0; i < json.data.length; i++) {
                    if (i===0) {
                        maxVal = json.data[i].box_office
                        movieToAdd = json.data[i]
                    }
                    else if (parseInt(json.data[i].box_office) > parseInt(maxVal)) {
                        maxVal = json.data[i].box_office
                        movieToAdd = json.data[i]             
                    }
                }
                topTenList.push(movieToAdd)
                indexToRemove = json.data.indexOf(movieToAdd)
                json.data.splice(indexToRemove, 1)
            }
            addMovieList(topTenList, "Top 10 Rated")
        })
    })
}

function releaseDateLoadList () {
    const list = document.querySelector("#releaseDate")
    list.addEventListener("click", event => {
        fetch("https://mcuapi.herokuapp.com/api/v1/movies")
        .then(data => data.json())
        .then(json => {
            let releaseDateList = []
            let minVal = 0
            let movieToAdd
            const movieCount = json.data.length

            for (let i = 0; i < movieCount; i++) {
                for (let i = 0; i < json.data.length; i++) {
                    const currentRelease = new Date(json.data[i].release_date)
                    if (i===0) {
                        minVal = new Date(json.data[i].release_date)
                        movieToAdd = json.data[i]
                    }
                    else if (json.data[i].release_date !== null &&  currentRelease < minVal) {
                        minVal = currentRelease
                        movieToAdd = json.data[i]             
                    }
                }
                //only add the movie to list if it has been released
                if (movieToAdd.release_date !== null) {
                    releaseDateList.push(movieToAdd)
                    indexToRemove = json.data.indexOf(movieToAdd)
                    json.data.splice(indexToRemove, 1)
                }
            }
            addMovieList(releaseDateList, "Release date")
        })
    })
}

function chronologicalLoadList () {
    const list = document.querySelector("#chronologically")
    list.addEventListener("click", event => {
        fetch("https://mcuapi.herokuapp.com/api/v1/movies")
        .then(data => data.json())
        .then(json => {
            let chronologicalList = []
            let movieToAdd
            let chronologyCount = 1

            for (let i = 0; i < json.data.length; i++) {
                movieToAdd = null
                for (let i = 0; i < json.data.length; i++) {
                    if (json.data[i].chronology === chronologyCount) {
                        movieToAdd = json.data[i]
                        break
                    }
                }
                chronologyCount++
                if (movieToAdd !== null) {
                    chronologicalList.push(movieToAdd)
                }
                else {
                    break
                }
            }
            addMovieList(chronologicalList, "MCU Timeline")
        })
    })
}


function displayMovieCenter (movieToDisplay) {
    //save elements to variables
    const img = document.querySelector("#movie-image")
    const h2 = document.querySelector("h2")
    const text = document.querySelector("#movie-description")
    const releaseDate = document.querySelector("#movie-release")
    const boxOffice = document.querySelector("#movie-box-office")
    //save data to elements to display
    h2.textContent = movieToDisplay.title
    img.src = movieToDisplay.cover_url
    text.textContent = movieToDisplay.overview
    releaseDate.textContent =movieToDisplay.release_date
    boxOffice.textContent =movieToDisplay.box_office

}

//add movie to My List if it doesnt already exist in the list
function addToMyList () {
    const addToMyListBtn = document.querySelector("#addToMyList")
    const counter = document.querySelector("#listCounter")
    addToMyListBtn.addEventListener("click", () => {
        fetch("https://mcuapi.herokuapp.com/api/v1/movies")
        .then(data => data.json())
        .then(movies => {
            const h2 = document.querySelector("h2")
            const h4 = document.querySelector("h4")
            const moveToAddToList = movies.data.find(movie => movie.title === h2.textContent)
            if (!myList.some(movie => movie.title === moveToAddToList.title)) {
                myList.push(moveToAddToList)
                myListCount++
                counter.textContent = `My List count: ${myListCount}`
            }
            if (h4.textContent === "Ordered by: My List") {
                addMovieList(myList, "My List", false)
            }
        })
    })
}

//view my customized list when button is clicked
function ViewMyList () { 
    viewMyListBtn = document.querySelector("#myList")
    viewMyListBtn.addEventListener("click", () => {
        if (myList.length > 0) { //if there is no items in the list, dont call addMovieList
            addMovieList(myList, "My List")
        }
    })
}

//add movie list to right pane, and first movie of that list is featured
function addMovieList (list, listString, replaceFeature=true) {
    if (replaceFeature) {
        displayMovieCenter(list[0])
    }
    const ulMovies = document.querySelector("#movie-items")
    const h4 = document.querySelector("h4")
    ulMovies.innerHTML = ""
    list.forEach(el => {
        const li = document.createElement("li")
        const hr = document.createElement("hr")
        h4.textContent = `Ordered by: ${listString}`
        li.textContent = el.title
        li.className = "listcategories"
        ulMovies.appendChild(li)
        ulMovies.appendChild(hr)
    })
    viewMovieInfo()
}

//when movie is selected from right pane, that movie will be featured at center with details
function viewMovieInfo () {
    const ulMovies = document.querySelector("#movie-items")
    const movieList = ulMovies.getElementsByTagName("li")
    Array.from(movieList).forEach(movie => {
        movie.addEventListener("click", event => {
            fetch("https://mcuapi.herokuapp.com/api/v1/movies")
            .then(data => data.json())
            .then(json => {
                const movieToFeature = json.data.find(el => el.title === movie.textContent)
                displayMovieCenter(movieToFeature)
            })
        })
    })
}

//search bar functionality, populate search list based on API data, and feature movie at 
//center pane if the movie is selected
function searchBar () {
    const inputSearch = document.querySelector("#searchbar") 
    const searchWrapper = document.querySelector("#searchWrapper") 
    const ulSearchList = document.querySelector("#searchlist") 
    let movieSearched
    inputSearch.addEventListener("keyup", event => {
        userInput = event.target.value
        if (userInput) {
            fetch("https://mcuapi.herokuapp.com/api/v1/movies")
            .then(data => data.json())
            .then(movies => {
                const listForSearch = movies.data.filter(movie => movie.title.toLocaleLowerCase().startsWith(event.target.value.toLocaleLowerCase()))
                ulSearchList.innerHTML = ""
                ulSearchList.classList.remove("inactiveList")
                searchWrapper.classList.add("activeWrapper")
                listForSearch.forEach(movie => {
                    const li = document.createElement("li")
                    li.textContent = movie.title
                    ulSearchList.append(li)
                    li.addEventListener("click", () => {
                        inputSearch.value = li.textContent
                        ulSearchList.classList.add("inactiveList")
                        searchWrapper.classList.remove("activeWrapper")
                        movieSearched = movies.data.find(movie => movie.title === inputSearch.value)
                        displayMovieCenter (movieSearched)                  
                    })
                })
            })
        }
        else {
            ulSearchList.classList.add("inactiveList")
            searchWrapper.classList.remove("activeWrapper")
        }
    }) 
    
}













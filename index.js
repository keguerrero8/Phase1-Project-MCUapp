//1. At page refresh, show featured movie (or most recent release) -- DONE
//2. Click on any of the left side pane lists, to view a populated list of movies on the right, 
//and the first of that list in the center -- DONE
//3. When a movie is selected from the right pane, it should populate at the center pane -- DONE
//4. Ability for person to click on add to My list and keep record of those movies -- DONE - but need to fix duplicates
//5. Click on View My list from left pane and generate the list of movies you have added -- DONE - but need to fix bug for first time view
//6. Implement search bar functionality
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


// let anotherDate = new Date("2020-05-02")

// if (todayDate.getTime() > anotherDate.getTime()) {
//     console.log(todayDate.getTime() - anotherDate.getTime())
// }

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

function addToMyList () {
    const addToMyListBtn = document.querySelector("#addToMyList")
    addToMyListBtn.addEventListener("click", event => {
        fetch("https://mcuapi.herokuapp.com/api/v1/movies")
        .then(data => data.json())
        .then(movies => {
            //***add logic so that we dont have duplicates in the Mylist
            const h2 = document.querySelector("h2")
            const moveToAddToList = movies.data.find(movie => movie.title === h2.textContent)
            //debugger
            console.log(myList)
            if (myList.includes(moveToAddToList) === false) {
                myList.push(moveToAddToList)
                console.log(myList)
            }
        })
    })
}

//***need to add logic in the case where view my list is selected before adding an item
function ViewMyList () { 
    viewMyListBtn = document.querySelector("#myList")
    viewMyListBtn.addEventListener("click", event => {
        addMovieList(myList, "My List")
    })
}


function addMovieList (list, listString) {
    displayMovieCenter(list[0])
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

//use fetch to get list of available movies
//add keyup event listener in search bar and filter list based on startswith function
//for each element in filter list, create an li element 
//add css styling so that when search input box is not active, display none the li's
//add css styling so that when search input box is active, display block the li's
//the active class should be added via JS after filter method gets those related titles
//add an click event to all list elements after keyup event so that text content of list element populates in search box
//when user clicks on user element, that movie should populate to the center screen
function searchBar () {
    const inputSearch = document.querySelector("#searchbar")
    inputSearch.addEventListener("keyup", event => {
        console.log(event.target.value)

    })
    
}













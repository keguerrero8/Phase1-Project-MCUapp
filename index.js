//console.log('%c HI', 'color: firebrick')

//Challenge 1
function addImages () {
    fetch("https://mcuapi.herokuapp.com/api/v1/movies")
    .then(data => data.json())
    .then(json => {
        // create variable for the div
        // take one element from json, and append it to the div
        const img = document.querySelector("#movie-image")
        const h2 = document.querySelector("h2")
        const text = document.querySelector("#movie-description")
        const ulMovies = document.querySelector("#movie-items")
        ulMovies.innerHTML = ""
        h2.textContent = json.data[1].title
        img.src = json.data[1].cover_url
        text.textContent = json.data[1].overview

        for (i=0; i < json.data.length; i++) { //index 21, Guardians of the galaxy 3 is the problem, does not have a url to cover
            if (json.data[i].box_office !== "0") {
                const li = document.createElement("li")
                const hr = document.createElement("hr")
                li.textContent = json.data[i].title
                li.className = "listcategories"
                ulMovies.appendChild(li)
                ulMovies.appendChild(hr)
                // console.log(json.data[i].title)
                // console.log(json.data[i].chronology) 
            }
        }

        // json.data.forEach(el => {
        //     const img = document.createElement("img")
        //     img.src = el.cover_url
        //     img.style.height = "600px"

        //     //h1.textContent = json.data[1].title 
    
        //     div.appendChild(img)         

        // })
        // const img = document.createElement("img")
        // img.src = json.data[1].cover_url
        // img.style.height = "600px"
        // h1.textContent = json.data[1].title 

        // div.appendChild(img)


        // json.message.forEach((url) => {
        //     const img = document.createElement("img")
        //     img.src = url
        //     div.appendChild(img)
        // }      
        // )

    })
}


document.addEventListener("DOMContentLoaded", addImages)

//Challenge 2

// function addDogBreeds () {
//     fetch("https://dog.ceo/api/breeds/list/all")
//     .then(data => data.json())
//     .then(json => {
//         const ul = document.querySelector("#dog-breeds")
//         for (let breed in json.message) {
//             const li = document.createElement("li")
//             li.textContent = breed
//             ul.appendChild(li)
//             li.addEventListener("click", changeColor)
//         }
//     })

// }
// addDogBreeds()

//this app will be for someone that is new to MCU, and wants to start on a journey to watch all the movies
//and keep track of them
//features will include:








//console.log('%c HI', 'color: firebrick')

//Challenge 1
function addImages () {
    fetch("https://mcuapi.herokuapp.com/api/v1/movies")
    .then(data => data.json())
    .then(json => {
        //create variable for the div
        //take one element from json, and append it to the div
        //const div = document.querySelector("#dog-image-container")
        // const h1 = document.querySelector("h1")
        // //console.log(json.data)
        // h1.textContent = json.data[1].title

        // for (i=0; i < json.data.length; i++) { //index 21, Guardians of the galaxy 3 is the problem, does not have a url to cover
        //     if (json.data[i].box_office !== "0") {
        //         const img = document.createElement("img")
        //         img.src = json.data[i].cover_url
        //         img.style.height = "600px"
        //         div.appendChild(img)
        //         console.log(json.data[i].title)
        //         console.log(json.data[i].chronology) 
        //     }
        // }

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








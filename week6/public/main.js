const Submit_button=document.getElementById("submit")
const form= document.getElementById("offerForm")
const offersContainer= document.getElementById("offersContainer")

form.addEventListener("submit", async function(e) {
    e.preventDefault()
    const formData= new FormData(form)

    formData.append("title", document.getElementById("title").value)
    formData.append("price", document.getElementById("price").value)
    formData.append("description", document.getElementById("description").value)
    formData.append("image", document.getElementById("image").files[0])
    

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    })
    
    const result = await response.json()
    console.log(result)
    form.reset()

    displayImages()

})

const displayImages=async() => {

    try {
        offersContainer.innerHTML=""

        const response= await fetch("/offers")
        const offers= await response.json()

        offers.forEach(element => {
            const div=document.createElement("div")
            div.classList.add("offerDiv","col","s12","m6","l4")
            
            const div2=document.createElement("div")
            div2.classList.add("card", "hoverable")
            
            const cardImage= document.createElement("div")
            cardImage.classList.add("card-image")

            if(element.imagePath){
                const image=document.createElement("img")
                image.classList.add("responsive-img")
                image.src = "/"+ element.imagePath
                cardImage.appendChild(image)
            }

            const title= document.createElement("span")
            title.classList.add("card-title")
            title.textContent= element.title

            cardImage.appendChild(title)


            const div3= document.createElement("div")
            div3.classList.add("card-content")

            const description= document.createElement("p")
            description.textContent=element.description

            const price= document.createElement("p")
            price.textContent= "Price: "+ element.price

            
            div3.appendChild(description)
            div3.appendChild(price)
           
            div2.appendChild(cardImage)
            div2.appendChild(div3)
            div.appendChild(div2)
        
            offersContainer.appendChild(div)
        })
    } catch (error) {
        
    }

}
document.addEventListener("DOMContentLoaded", () => {
    displayImages();
})

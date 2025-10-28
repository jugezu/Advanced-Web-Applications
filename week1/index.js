// DO NOT SEND FOLDERS TO CODEGRADE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const dogBreeds =["afghan", "basset", "blood", "ibizan", "walker"]
const wikiTitles= ["afghan_hound", "basset_hound", "blood_hound","ibizan_hound","Treeing Walker Coonhound"]
const getText= async(i) => {

    const url= `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitles[i]}`

    const response= await fetch(url)
    const data= await response.json()

    text= data.extract
    //console.log(text);

    return text
}

const getDogs= async()=>{

    for(let i=0; i<5; i++){

        const dogAPI=`https://dog.ceo/api/breed/hound/${dogBreeds[i]}/images/random`
                      

    const response = await fetch(dogAPI)
    const data= await response.json()

    //console.log(data)
    const image=data.message
    
    const container= document.querySelector(".container")
    const text = await getText(i)
        

    const template=`<div class="wiki-item" >
        <h1 class="wiki-header">${dogBreeds[i]}</h1>
        <div class="wiki-content">
            <p class="wiki-text">
                ${text}
            </p>
            <div class="img-container">
                <img class="wiki-img" src="${image}">
            </div>
        </div>
    </div>`

    container.innerHTML= container.innerHTML+ template

    }

}
document.addEventListener("DOMContentLoaded" ,()=>{
    getDogs()
})

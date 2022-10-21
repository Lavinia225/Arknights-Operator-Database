const searchBar = document.querySelector('form')

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search()
})

function search(searchingFor = 'operator'){
    fetch(`http:localhost:3000/operators`).then(res => res.json()).then(operators => console.log(operators))
}
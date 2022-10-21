const searchBar = document.querySelector('form')

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search()
})

function search(searchingFor = 'operator'){
    fetch(`http:localhost:3000/operators`).then(res => res.json())
    .then(operators => operators.forEach(operator => renderOperators(operator)))
}

function renderOperators(operator){
    const list = document.getElementById('operatorList')
    const li = document.createElement('li')

    li.textContent = operator.name

    list.appendChild(li)
}
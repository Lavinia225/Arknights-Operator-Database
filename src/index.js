const searchBar = document.querySelector('form')

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search()
})

function search(searchingFor = 'operator'){
    fetch(`http:localhost:3000/operators`).then(res => res.json())
    .then(operators => renderOperatorList(operators))
}

function renderOperatorList(operators){
    const list = document.getElementById('operatorList')
    const table = document.createElement('table')

    for(let i = 0; i < operators.length; i += 3){ //i increments 3 per iteration, since three operators go in a table row.
        const tr = document.createElement('tr')

        for (let j = i; j < i + 3; j++){
            const td = document.createElement('td')
            const li = document.createElement('li')

            li.textContent = operators[j].name

            td.appendChild(li)
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    list.appendChild(table)
}
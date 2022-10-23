const searchBar = document.querySelector('form')
const prts = document.getElementById('PRTS')
const factionTable = document.getElementById('factionTable') //This is kept here so when not displayed, it can be brought back.

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search()
})

prts.addEventListener('click', ()=> reset())

function search(searchingFor = 'operator'){
    fetch(`http:localhost:3000/operators`).then(res => res.json())
    .then(operators => renderOperatorList(operators))
}

function renderOperatorList(operators){
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
    clearForm()
    document.getElementById('mainSection').appendChild(table)
}

function clearForm(){
    document.getElementById('factionTable').remove()
}

function reset(){
    Array.from(document.getElementById('mainSection').children).forEach(child => child.remove())
    document.querySelector('body').appendChild(factionTable)
}
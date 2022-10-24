const searchBar = document.querySelector('form')
const prts = document.getElementById('PRTS')
const factionTable = document.getElementById('factionTable') //This is kept here so when not displayed, it can be brought back.
const dropTable = document.querySelector('select')

let searching = 'name'

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search(searching, e.target.search.value)
})

prts.addEventListener('click', ()=>{
    Array.from(document.getElementById('mainSection').children).forEach(child => child.remove())
    document.getElementById('mainSection').appendChild(factionTable)
})

dropTable.addEventListener('change', e=>searching = e.target.value)
factionRedirectAdder()

function search(searchType = 'all', searchingFor = 'all'){ //Current final then is for faction
    fetch(`http:localhost:3000/operators`).then(res => res.json())
    .then(operators =>{
        const operatorResults = operators.filter(operator =>operator[searchType] === searchingFor) //Probably refactor this into secondArg
        renderOperatorList(operatorResults)
    })
}

function renderOperatorList(operators){
    clearForm()
    const table = document.createElement('table')

    table.id = "operatorTable"

    for(let i = 0; i < operators.length; i += 3){ //i increments 3 per iteration, since three operators go in a table row.
        const tr = document.createElement('tr')

        try{
        for (let j = i; j < i + 3; j++){
            const td = document.createElement('td')
            const li = document.createElement('li')
            li.textContent = operators[j].name

            td.appendChild(li)
            tr.appendChild(td)
        }
    }
    catch (era){
        console.warn(`Warning: Operator count was not divisible evenly by three. ${era}`)
    }

        table.appendChild(tr)
    }
    
    document.getElementById('mainSection').appendChild(table)
}

function clearForm(){
    Array.from(document.getElementById('mainSection').children).forEach(child => child.remove())
}

function factionRedirectAdder(){
    const factions = Array.from(document.querySelectorAll('#factionTable img'))

    factions.forEach(faction =>{
        faction.addEventListener('click', ()=>{
            const factionNameStartPoint = faction.src.indexOf('images/') + 7
            const factionName = faction.src.slice(factionNameStartPoint, faction.src.length - 5).replaceAll("%20", " ")
            
            search('faction', factionName)
        })
    })
}
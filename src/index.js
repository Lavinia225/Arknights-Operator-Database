const searchBar = document.querySelector('form')
const prts = document.getElementById('PRTS')
const factionTable = document.getElementById('factionTable') //This is kept here so when not displayed, it can be brought back.
const dropTable = document.querySelector('select')
const mainSection = document.getElementById('mainSection')

let searching = 'name'

searchBar.addEventListener('submit', e=>{
    e.preventDefault()
    search(searching, e.target.search.value)
})

prts.addEventListener('click', ()=>{
    Array.from(mainSection.children).forEach(child => child.remove())
    mainSection.appendChild(factionTable)
})

dropTable.addEventListener('change', e=>{
    searching = e.target.value
    searchBar.search.placeholder = `Searching by ${searching}`
})
factionRedirectAdder()

function search(searchType = 'all', searchingFor = 'all'){
    clearMain()

    fetch(`http:localhost:3000/operators`).then(res => res.json())
    .then(operators =>{
        const operatorResults = operators.filter(operator =>operator[searchType] === searchingFor)
        if(searchType === 'name'){
            renderProfile(operatorResults[0])
        }
        else{
            renderOperatorList(operatorResults) 
        }
    })
    searchBar.reset()
}

function renderOperatorList(operators){
    const table = document.createElement('table')

    table.id = "operatorTable"

    for(let i = 0; i < operators.length; i += 3){ //i increments 3 per iteration, since three operators go in a table row.
        const tr = document.createElement('tr')

        try{
        for (let j = i; j < i + 3; j++){
            const td = document.createElement('td')
            const li = document.createElement('li')
            li.textContent = operators[j].name
            li.addEventListener('click', ()=>renderProfile(operators[j]))

            td.appendChild(li)
            tr.appendChild(td)
        }
    }
    catch (era){
        console.warn(`Warning: Operator count was not divisible evenly by three. ${era}`)
    }

        table.appendChild(tr)
    }
    
    mainSection.appendChild(table)
}

function clearMain(){
    Array.from(mainSection.children).forEach(child => child.remove())
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

function renderProfile(operator){
    clearMain()

    const operatorCopy = Object.assign({}, operator)
    const nameHolder = document.createElement('h2')
    const table = document.createElement('table')
    const tr = document.createElement('tr')
    const tr2 = document.createElement('tr')
    const tr3 = document.createElement('tr')

    for (let key in operatorCopy){
        const td = document.createElement('td')
        td.textContent = `${key}: ${operatorCopy[key]}`
        operatorCopy[key] = td
    }
    const {faction, birthplace, archetype, atk} = operatorCopy

    const classHolder = `class: ${operator.class}`
    nameHolder.textContent = operator.name
    table.id = "operatorProfile"


    document.getElementById('mainSection').append(nameHolder, table)
    table.append(tr, tr2, tr3)
    tr.append(faction, birthplace)
    tr2.append(classHolder, archetype)
    tr3.appendChild(atk)

}
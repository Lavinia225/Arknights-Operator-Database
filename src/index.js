const searchBar = document.querySelector('form')
const prts = document.getElementById('PRTS')
const factionTable = document.getElementById('factionTable') //This is kept here so when not displayed, it can be brought back.
const dropTable = document.querySelector('select')
const mainSection = document.getElementById('mainSection')
const squad = document.getElementById('squad')
const dpsButton = document.getElementById('dps-button')
const atkValues = {

}

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

dpsButton.addEventListener('click', ()=> calculateDPS())

document.querySelector('#squad button').addEventListener('click', e=>selectMode(e))

factionRedirectAdder()
deselectEventAdder()

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
            li.addEventListener('click', ()=>{
                if (document.querySelector('#squad button').textContent === "Select-Mode: ON"){
                    selectOperator(operators[j])
                }
                else{
                renderProfile(operators[j])}
            })

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
    const classHolder = document.createElement('td')
    const form = document.createElement('form')
    const showEditForm = document.createElement('button')
    const submitEditButton = document.createElement('input')
    for (let key in operatorCopy){
        const td = document.createElement('td')
        td.textContent = `${key}: ${operatorCopy[key]}`
        operatorCopy[key] = td
    }

    for (let key in operator){
        if (key === 'id'){

        }
        else{
        const label = document.createElement('label')
        const input = document.createElement('input')

        label.setAttribute('for', key)
        label.textContent = key
        input.type = 'text'
        input.name = key
        input.value = operator[key]

        form.appendChild(label)
        form.appendChild(input)
        }
    }

    const {faction, birthplace, archetype, atk} = operatorCopy

    classHolder.textContent = `class: ${operator.class}`
    nameHolder.textContent = operator.name
    table.id = "operatorProfile"
    form.hidden = true
    form.id = 'editForm'
    showEditForm.textContent = 'Click to Edit'
    submitEditButton.value = 'Submit'
    submitEditButton.type = 'submit'

    nameHolder.addEventListener('click', ()=>{
        if (document.querySelector('#squad button').textContent === "Select-Mode: ON"){
            selectOperator(operator)
        }
    })

    showEditForm.addEventListener('click', ()=>{
        if (form.hidden === false){
            form.hidden = true
        }
        else{
            form.hidden = false
        }
    })

    form.appendChild(submitEditButton)
    mainSection.append(nameHolder, table)
    table.append(tr, tr2, tr3)
    tr.append(faction, birthplace)
    tr2.append(classHolder, archetype)
    tr3.append(atk, showEditForm)
    mainSection.appendChild(form)
}

function selectMode(e){
    buttonText = e.target.textContent

    if (buttonText === "Select-Mode: ON"){
        e.target.textContent = "Select-Mode: OFF"
    }  
    else if (buttonText === "Select-Mode: OFF"){
        e.target.textContent = "Select-Mode: ON"
    }
}

function selectOperator(operator){
    const nameCell = findFreeCell()
    nameCell.textContent = operator.name

    if (operator.class === 'Medic'){
        atkValues[nameCell.id] = {
            atk: 0,
            heal: operator.atk
        }
    }
    else{
        atkValues[nameCell.id] = {
            atk: operator.atk,
            heal: 0
        }
    }
}

function calculateDPS(){
    const offensiveValues = Object.values(atkValues).map(item => item.atk)
    const healValues = Object.values(atkValues).map(item => item.heal)
    
    document.getElementById('dps-label').textContent = "Current DPS: " + offensiveValues.reduce(counter, 0)
    document.getElementById('hps-label').textContent = "Current HPS: " + healValues.reduce(counter, 0)

    function counter(previousValue, currentValue){
        return previousValue += currentValue
    }
}

function deselectEventAdder(){
    const operatorTd = Array.from(document.querySelectorAll('#squad tr td'))

    operatorTd.splice(12, 1)

    operatorTd.map(operator => operator.addEventListener('click', deselectOperator))

}

function deselectOperator(e){
    if (e.target.textContent.startsWith('Operator')){

    }
    else{
    e.target.textContent = `Operator ${e.target.id.substring(2)}`
    delete atkValues[e.target.id]
}}

function findFreeCell(){
    const operatorTd = Array.from(document.querySelectorAll('#squad tr td'))
    
    return operatorTd.find(td=>{
        return td.textContent.startsWith('Operator')
    })
}
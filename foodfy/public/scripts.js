const currentLocation = window.location.pathname
const cards = document.querySelectorAll('.card')
const details = document.querySelectorAll('#recipe-details .details')
const menuItems = document.querySelectorAll('nav ul a')
const addIngredient = document.querySelector('button.add-ingredient')
const addStep = document.querySelector('button.add-step')

for (const item of menuItems) {
    if (currentLocation.includes(item.getAttribute('href')))
        item.classList.add('active')
}

for (const card of cards) {

    if (!card.classList.contains('admin')) {
        card.addEventListener('click', function () {
            const index = card.getAttribute('id')
            window.location.href = `/recipes/${index}`
        })
    }
}

for (const detail of details) {
    const a = detail.querySelector('a')

    a.addEventListener('click', function () {
        if (detail.querySelector('.content').classList.contains('hidden')) {
            a.innerText = 'ESCONDER'
            detail.querySelector('.content').classList.remove('hidden')
        } else {
            a.innerText = 'MOSTRAR'
            detail.querySelector('.content').classList.add('hidden')
        }
    })
}

if (addIngredient)
    addIngredient.addEventListener('click', function () {
        const lastIngredient = document.querySelector('input[name="ingredients[]"]:last-child').cloneNode(true)
        if (lastIngredient.value == '') {
            alert('Preencha o último ingrediente!')
            return
        }
        lastIngredient.value = ''
        document.querySelector('.ingredients').appendChild(lastIngredient)
    })

if (addStep)
    addStep.addEventListener('click', function () {
        const lastStep = document.querySelector('input[name="preparation[]"]:last-child').cloneNode(true)
        if (lastStep.value == '') {
            alert('Preencha o último passo!')
            return
        }
        lastStep.value = ''
        document.querySelector('.preparation').appendChild(lastStep)
    })
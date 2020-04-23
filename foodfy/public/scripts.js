const currentLocation = window.location.pathname
const cards = document.querySelectorAll('.card')
const showHides = document.querySelectorAll('#details .show-hide')
const menuItems = document.querySelectorAll('nav ul a')
const addIngredient = document.querySelector('button.add-ingredient')
const addStep = document.querySelector('button.add-step')
const selects = document.querySelectorAll('select')

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

for (const showHide of showHides) {
    showHide.addEventListener('click', function () {
        if (showHide.nextElementSibling.classList.contains('hidden')) {
            showHide.innerText = 'ESCONDER'
            showHide.nextElementSibling.classList.remove('hidden')
        } else {
            showHide.innerText = 'MOSTRAR'
            showHide.nextElementSibling.classList.add('hidden')
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
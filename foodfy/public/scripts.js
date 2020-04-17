const currentLocation = window.location.pathname
const cards = document.querySelectorAll('.card')
const details = document.querySelectorAll('#recipe-details .details')
const menuItems = document.querySelectorAll('nav ul a')

for (const item of menuItems) {
    if (currentLocation.includes(item.getAttribute('href')))
        item.classList.add('active')
}

for (const [index, card] of cards.entries()) {

    if (!card.classList.contains('admin'))
        card.addEventListener('click', function () {
            window.location.href = `/recipes/${index}`
        })
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
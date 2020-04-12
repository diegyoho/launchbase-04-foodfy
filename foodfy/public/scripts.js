const cards = document.querySelectorAll('.card')

for (const card of cards) {
    card.addEventListener('click', function () {
        alert('Clicked!')
    })
}
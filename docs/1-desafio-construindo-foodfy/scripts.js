const modalOverlay = document.querySelector('#modal-overlay')
const cards = document.querySelectorAll('.card')

for (const card of cards) {
    card.addEventListener('click', function () {

        const cardImg = card.querySelector('img')
        const cardInfo = card.querySelector('.info')

        const modalImg = modalOverlay.querySelector('.modal img')
        const modalInfo = modalOverlay.querySelector('.modal .info')

        modalImg.src = cardImg.src
        modalImg.alt = cardImg.alt

        modalInfo.querySelector('h3').innerText = cardInfo.querySelector('h3').innerText
        modalInfo.querySelector('.author').innerText = cardInfo.querySelector('.author').innerText

        modalOverlay.classList.add('active')
    })
}

document.querySelector('.close-modal a').addEventListener('click', function () {
    modalOverlay.classList.remove('active')
})
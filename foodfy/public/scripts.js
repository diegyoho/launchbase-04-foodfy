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
        card.addEventListener('click', () => {
            const index = card.getAttribute('id')
            window.location.href = `/recipes/${index}`
        })
    }
}

for (const showHide of showHides) {
    showHide.addEventListener('click', () => {
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
    addIngredient.addEventListener('click', () => {
        const lastIngredient = document.querySelector('input[name="ingredients[]"]:last-child').cloneNode(true)
        if (lastIngredient.value == '') {
            alert('Preencha o último ingrediente!')
            return
        }
        lastIngredient.value = ''
        document.querySelector('.ingredients').appendChild(lastIngredient)
    })

if (addStep)
    addStep.addEventListener('click', () => {
        const lastStep = document.querySelector('input[name="preparation[]"]:last-child').cloneNode(true)
        if (lastStep.value == '') {
            alert('Preencha o último passo!')
            return
        }
        lastStep.value = ''
        document.querySelector('.preparation').appendChild(lastStep)
    })

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; ++currentPage) {

        const startAndEnd = currentPage <= 2 || currentPage > totalPages - 2
        const pagesBeforeSelected = currentPage >= selectedPage - 1
        const pagesAfterSelected = currentPage <= selectedPage + 1

        if (startAndEnd || pagesBeforeSelected && pagesAfterSelected) {

            if (oldPage && currentPage - oldPage > 2)
                pages.push('...')
            else if (oldPage && currentPage - oldPage === 2)
                pages.push(currentPage - 1)

            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {
    const page = parseInt(pagination.dataset.page)
    const total = parseInt(pagination.dataset.total)
    const filter = pagination.dataset.filter

    const pages = paginate(page, total)

    let elements = ``

    for (let page of pages) {
        if (!String(page).includes('...'))
            if (filter)
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            else
                elements += `<a href="?page=${page}">${page}</a>`
        else
            elements += `<span>${page}</span>`
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')
    
if (pagination)
    createPagination(pagination)

const PhotosUpload = {
    input: null,
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event, limit, replace = false) {
        const { files: filesList } = event.target
        PhotosUpload.input = event.target

        PhotosUpload.uploadLimit = limit || 1

        if(replace) {
            console.log('Remove esta bosta')
            PhotosUpload.files = []
            PhotosUpload.input.files = PhotosUpload.getAllFiles()
            Array.from(PhotosUpload.preview.children).forEach(preview => preview.remove())
        }

        if(PhotosUpload.hasLimit(filesList)) {
            event.preventDefault()
            PhotosUpload.input.files = PhotosUpload.getAllFiles()
            return
        }

        Array.from(filesList).forEach(file => {
            
            PhotosUpload.files.push(file)
            
            const reader = new FileReader()

            reader.onload = () => {
                const image = PhotosUpload.getImage(reader.result, replace)
                PhotosUpload.preview.appendChild(image)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(filesList) {
        if(filesList.length + PhotosUpload.files.length > PhotosUpload.uploadLimit) {
            alert(`Envie no máximo ${ PhotosUpload.uploadLimit } fotos!`)
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getImage(src, replace = false) {
        const image = new Image()

        image.src = String(src)

        const div = document.createElement('div')
        div.classList.add('photo')

        if(!replace) {
            div.onclick = PhotosUpload.removePhoto
            div.appendChild(PhotosUpload.getRemoveButton())
        }

        div.appendChild(image)

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'delete'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode
        
        if(photoDiv.id) {
            const removedFile = document.createElement('input')
            removedFile.setAttribute('type', 'hidden')
            removedFile.setAttribute('name', 'removed_files[]')

            removedFile.value = photoDiv.id

            PhotosUpload.preview.appendChild(removedFile)
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(event) {
        const { target: preview } = event

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        preview.classList.add('active')

        ImageGallery.highlight.src = preview.src
        ImageGallery.highlight.alt = preview.alt
    }
}

const Lightbox = {
    lightbox: document.querySelector('.gallery .highlight .lightbox'),
    open(event) {
        event.preventDefault()

        const img = Lightbox.lightbox.querySelector('img')

        img.src = event.target.src
        img.alt = event.target.alt

        Lightbox.lightbox.classList.add('active')
    },
    close(event) {
        event.preventDefault()
        Lightbox.lightbox.classList.remove('active')
    }
}
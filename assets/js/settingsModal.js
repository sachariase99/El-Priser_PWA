const settingsModal = document.getElementById('settingsWeb')
const pageContainer = document.getElementById('container')
const modalContent = document.getElementById('modalContent')
const closeModal = document.getElementById('closeModal')

settingsModal.addEventListener('click', () => {
    pageContainer.classList.add('active')
    modalContent.classList.add('active')
})

closeModal.addEventListener('click', () => {
    pageContainer.classList.remove('active')
    modalContent.classList.remove('active')
})
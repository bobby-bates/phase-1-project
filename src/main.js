// require('dotenv').config()

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, World!')
    // console.log(process.env)
})

fetch('API_KEY.txt')
    .then(r => r.text())
    .then(KEY => console.log(KEY))
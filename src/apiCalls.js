import updateData from './scripts.js'

function fetchData(dataCategory) {
    return fetch(`http://localhost:3001/api/v1/${dataCategory}`)
        .then(response => response.json())
        .then(data => data)
}

function fetchPost(newTripData) {
    return fetch('http://localhost:3001/api/v1/trips', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTripData)
    })
        .then(response => handleErrors(response))
        .then(response => response.json())
        .catch(err => showErrorMessage())
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    } else {
        updateData()
        return response
    }
 }

function showErrorMessage() {
    errorMessage.classList.remove('hidden')
}

export { fetchData, fetchPost }
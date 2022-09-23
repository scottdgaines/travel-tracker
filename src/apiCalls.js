function fetchData(dataCategory) {
    return fetch(`http://localhost:3001/api/v1/${dataCategory}`)
        .then(response => response.json())
        .then(data => data)
}

export default fetchData 
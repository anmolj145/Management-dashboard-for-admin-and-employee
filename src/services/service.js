import axios from 'axios';

const getAxiosData = ((URL, callback) => {
    axios.get(URL)
        .then(response => { callback(response); })
        .catch(err => { console.log(err) })
})

const patchAxiosData = ((URL, data, callback) => {
    axios.patch(URL, data)
        .then(response => { callback(response); })
        .catch(err => { console.log(err) })
})

const postAxiosData = ((URL, data, callback) => {
    axios.post(URL, data)
        .then(response => { callback(response); })
        .catch(err => { console.log(err) })
})

const deleteAxiosData = (URL => {
    axios.delete(URL)
        .then(response => { console.log(response); })
        .catch(error => { console.log(error) })
})

export default getAxiosData
export { patchAxiosData, postAxiosData, deleteAxiosData }
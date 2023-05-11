import axios from 'axios'
import { loadToken } from '../utils/storage'
import {useEffect} from 'react'
import {BASE_URL} from "../api/apiKey";

const useAxios = () => {

    axios.interceptors.response.use((response) => response, (error) => {
        return Promise.reject(error)
    })
    axios.defaults.baseURL = BASE_URL
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    const setToken = async() => {
        const token = await loadToken()
        if(token) axios.defaults.headers.common['Authorization'] = token
    }
    useEffect(() => {
        setToken()
    }, [])

    return axios
}

export default useAxios

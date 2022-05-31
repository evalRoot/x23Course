import axios from "axios";
import { SERVER_API } from "../const";

const $host = axios.create({
    baseURL: SERVER_API
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

const isAuthRequest = async () => {
    try {
        const { status } = await $host.get('isAuth')
        return {status: status}
    } catch (error) {
        console.log(error)
        if (error.response.status === 403) {
            return
        }
        return {message: error.message}
    }
}

$host.interceptors.request.use(authInterceptor)

export default isAuthRequest

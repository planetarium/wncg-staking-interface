import axios from 'axios'
import { baseUrls } from 'config/api'

const axiosInstance = axios.create({
  baseURL: baseUrls.server,
  timeout: 20 * 1_000,
})

export default axiosInstance

import axios from 'axios'

const isHandlerEnabled = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, 'handlerEnabled') && !config.handlerEnabled
}

const requestHandler = (request) => {
  if (isHandlerEnabled(request)) {
    // Modify request
  }
  return request
}

const errorHandler = (error) => {
  if (isHandlerEnabled(error.config)) {
    // handler error
  }
  return Promise.reject(new { ...error }())
}

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {
    // handle response
  }
  return response
}

const AxiosApi = (function create() {
  let axiosInstance

  function getAxiosApi() {
    if (!axiosInstance) {
      axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
      })
      axiosInstance.interceptors.request.use((request) => requestHandler(request))
      axiosInstance.interceptors.response.use(
        (response) => successHandler(response),
        (error) => errorHandler(error)
      )
    }

    return axiosInstance
  }
  return {
    getAxiosApi,
  }
})()

export default AxiosApi

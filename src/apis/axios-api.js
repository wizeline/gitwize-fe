import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

const isHandlerEnabled = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, 'handlerEnabled') && !config.handlerEnabled
}

const requestHandler = request => {
  if (isHandlerEnabled(request)) {
    // Modify request
  }
  return request
}

axiosInstance.interceptors.request.use(request => requestHandler(request))

const errorHandler = error => {
  if (isHandlerEnabled(error.config)) {
    // handler error
  }
  return Promise.reject({ ...error })
}

const successHandler = response => {
  if (isHandlerEnabled(response.config)) {
    // handle response
  }
  return response
}

axiosInstance.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
)

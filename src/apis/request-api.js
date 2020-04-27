const BASE_URL = process.env.REACT_APP_BASE_URL

await axiosInstance.get('/api/v1/search?query=react', {handlerEnabled: false})

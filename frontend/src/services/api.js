import axios from 'axios'

const api = axios.create({
    baseURL: '/api' // proxied to Spring Boot via Vite proxy (without /api prefix)
})

// Override baseURL since our routes don't have /api prefix
api.defaults.baseURL = ''

api.interceptors.request.use((config) => {
    try {
        const stored = JSON.parse(localStorage.getItem('dpaas-auth') || '{}')
        const token = stored?.state?.token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (_) { }
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('dpaas-auth')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Websites
export const getWebsites = () => api.get('/websites')
export const createWebsite = (data) => api.post('/websites', data)
export const deleteWebsite = (id) => api.delete(`/websites/${id}`)

// Endpoints
export const getEndpoints = (websiteId) => api.get(`/websites/${websiteId}/endpoints`)
export const createEndpoint = (websiteId, data) => api.post(`/websites/${websiteId}/endpoints`, data)
export const deleteEndpoint = (id) => api.delete(`/endpoints/${id}`)

// Rate Limits
export const getRateLimit = (endpointId) => api.get(`/endpoints/${endpointId}/rate-limit`)
export const createRateLimit = (endpointId, data) => api.post(`/endpoints/${endpointId}/rate-limit`, data)
export const updateRateLimit = (ruleId, data) => api.put(`/rate-limit/${ruleId}`, data)

export default api

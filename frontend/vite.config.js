import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/auth': 'http://localhost:4000',
            '/websites': 'http://localhost:4000',
            '/endpoints': 'http://localhost:4000',
            '/rate-limit': 'http://localhost:4000',
            '/gateway': 'http://localhost:8080',
        }
    }
})

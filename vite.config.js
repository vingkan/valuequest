import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/valuequest/',
    build: {
        outDir: 'valuequest',
    },
    plugins: [react()],
    server: {
        hmr: true,
    },
})
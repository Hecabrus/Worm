import { defineConfig, loadEnv } from 'vite'
import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    
    return {
        root: 'src',
        build: {
            target: 'esnext',
            outDir: '../dist',
            emptyOutDir: true,
            sourcemap: false,
            minify: true,
            cssMinify: true,
            rollupOptions: {
                output: {
                    manualChunks: undefined
                }
            }
        },
        optimizeDeps: {
            include: ['weaviate-ts-client']
        },
        envPrefix: 'VITE_',
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    secure: false
                }
            },
            cors: {
                origin: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                credentials: true
            }
        }
    }
})

import { defineConfig, loadEnv } from 'vite'
import obfuscator from 'rollup-plugin-obfuscator';
import fs from 'fs';
import path from 'path';

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
            },
            headers: {
                'Content-Security-Policy': `
                    default-src 'self';
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                        https://cdn.jsdelivr.net 
                        https://*.googleapis.com 
                        https://www.googletagmanager.com 
                        https://www.google-analytics.com
                        https://esm.run;
                    style-src 'self' 'unsafe-inline' 
                        https://fonts.googleapis.com 
                        https://cdn.jsdelivr.net;
                    img-src 'self' data: 
                        https://*.wikimedia.org 
                        https://64.media.tumblr.com;
                    font-src 'self' https://fonts.gstatic.com;
                    connect-src 'self' 
                        https://*.supabase.co 
                        https://*.weaviate.cloud 
                        https://*.googleapis.com 
                        https://www.google-analytics.com 
                        https://generativelanguage.googleapis.com 
                        https://analytics.google.com
                        http://localhost:5000;
                `,
                'X-Content-Type-Options': 'nosniff',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
            }
        }
    }
})

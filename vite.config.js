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
            cssMinify: true
        },
        envPrefix: 'VITE_',
        server: {
            port: 3000
        }
    }
})

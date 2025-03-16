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
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: false,
            minify: true,
            cssMinify: true,
            modulePreload: false,
            reportCompressedSize: false,
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                    format: 'iife', // Immediately Invoked Function Expression
                    compact: true,
                    entryFileNames: 'assets/[hash].js',
                    chunkFileNames: 'assets/[hash].js',
                    assetFileNames: 'assets/[hash].[ext]',
                    globals: {
                        'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js': 'marked',
                        'https://esm.run/@google/generative-ai': 'generativeAi'
                    }
                },
                plugins: [
                    obfuscator({
                        // Core obfuscation
                        compact: true,
                        controlFlowFlattening: true,
                        controlFlowFlatteningThreshold: 1,
                        deadCodeInjection: true,
                        deadCodeInjectionThreshold: 1,
                        
                        // Debug protection
                        debugProtection: true,
                        debugProtectionInterval: true,
                        disableConsoleOutput: true,
                        selfDefending: true,
                        
                        // String transformations
                        stringArray: true,
                        stringArrayEncoding: ['base64'],
                        stringArrayRotate: true,
                        stringArrayShuffle: true,
                        stringArrayWrappersCount: 5,
                        stringArrayWrappersChainedCalls: true,
                        stringArrayWrappersParametersMaxCount: 5,
                        stringArrayWrappersType: 'function',
                        
                        // Identifier transformations
                        identifierNamesGenerator: 'hexadecimal',
                        identifiersPrefix: '__',
                        renameGlobals: true,
                        
                        // Additional security
                        numbersToExpressions: true,
                        simplify: true,
                        splitStrings: true,
                        transformObjectKeys: true,
                        unicodeEscapeSequence: true,
                        
                        // Build settings
                        sourceMap: false,
                        seed: Date.now(),
                        domainLock: [], // Add your domain(s) here
                        stringArrayThreshold: 1
                    })
                ]
            },
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                    passes: 3,
                    unsafe: true,
                    unsafe_proto: true
                },
                mangle: {
                    toplevel: true,
                    safari10: true,
                    properties: {
                        regex: /^_/
                    }
                },
                format: {
                    comments: false
                }
            }
        },
        envDir: '../',
        envPrefix: 'VITE_',
        server: {
            https: {
                key: fs.readFileSync('ssl/localhost.key'),
                cert: fs.readFileSync('ssl/localhost.crt'),
            },
            proxy: {
                '/weaviate': {
                    target: `https://${env.VITE_WEAVIATE_URL}`,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/weaviate/, ''),
                    headers: {
                        'Authorization': `Bearer ${env.VITE_WEAVIATE_API_KEY}`
                    }
                },
                '/api': {
                    target: 'https://localhost:5000',
                    changeOrigin: true,
                    secure: false
                }
            },
            port: 3000
        }
    }
})
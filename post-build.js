import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const indexFile = join(distDir, 'index.html');

let html = readFileSync(indexFile, 'utf8');

// Add comprehensive CSP headers
const csp = `
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' 
            https://cdn.jsdelivr.net 
            https://*.googleapis.com 
            https://www.googletagmanager.com 
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
            http://localhost:5000;
    ">
`;

html = html.replace('</head>', `${csp}</head>`);

// Add additional security headers
html = html.replace('</head>', `
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <script>
        (function(){
            function protect() {
                const d = document;
                // Add more detection methods
                if (
                    window.devtools?.isOpen || 
                    window._phantom || 
                    window.__nightmare || 
                    window.callPhantom ||
                    (/./[Symbol.match].constructor('return this')()) !== window ||
                    window.Firebug || 
                    window.console?.firebug ||
                    document.documentElement.hasAttribute('webdriver') ||
                    navigator.webdriver ||
                    window.chrome?.runtime
                ) {
                    d.body.innerHTML = '';
                    d.write('Access denied');
                    d.close();
                    window.location.href = 'about:blank';
                }
            }
            protect();
            setInterval(protect, 1000);
            
            // Add window size protection
            window.addEventListener('resize', protect);
            
            // Add debugger protection
            setInterval(() => {
                debugger;
            }, 100);
        })();
    </script>
    </head>
`);

writeFileSync(indexFile, html);

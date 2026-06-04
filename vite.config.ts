import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // command === 'serve'
        //     ? wayfinder({
        //           formVariants: true,
        //       })
        //     : null,
    ],
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: '0.0.0.0', // Allows connections from outside the container
        port: 5173,
        hmr: {
            host: 'localhost', // The host your browser uses to connect
        },
        watch: {
            usePolling: true, // Crucial for Docker on Windows/macOS file system sync
        },
    },
}));

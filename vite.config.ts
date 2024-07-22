/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), VueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(
                new URL('./src', import.meta.url)
            )
        }
    },
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url))
    }
})

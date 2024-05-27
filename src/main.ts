import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'
import router from './router'
import { md3 } from 'vuetify/blueprints'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
    blueprint: md3,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    },

    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    }
})

app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(vuetify)

app.mount('#app')

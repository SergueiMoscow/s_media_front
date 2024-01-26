/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'


const app = createApp(App)

registerPlugins(app)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

app.mount('#app')

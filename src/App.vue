<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import SideBar from './components/sidebar/SidebarComp.vue'
</script>

<template>
    <v-app
        class="rounded rounded-md"
        style="background: lightblue"
        full-height
    >
        <v-app-bar clipped-right
            ><v-app-bar-title
                >Christmass Lottery Contract
            </v-app-bar-title></v-app-bar
        >
        <SideBar />

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
        <v-footer
            class="bg-indigo-lighten-1 text-center d-flex flex-column"
        >
            <div class="pt-0">
                Lorem ipsum dolor sit amet consectetur
            </div>

            <v-divider></v-divider>

            <div>
                {{ new Date().getFullYear() }} —
                <strong>Szymon Zinkowicz</strong>
            </div>
        </v-footer>
    </v-app>
</template>

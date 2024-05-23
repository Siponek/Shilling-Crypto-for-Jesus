<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import SideBar from './components/sidebar/SidebarComp.vue'
</script>

<template>
    <v-app class="rounded rounded-md bg-yellow" full-height>
        <v-app-bar clipped-right
            ><v-app-bar-title
                >Christmass Lottery Contract
            </v-app-bar-title></v-app-bar
        >
        <SideBar />

        <v-main
            style="background: lightcoral"
            class="bg-green"
        >
            <v-container style="background: lightblue">
                <router-view />
            </v-container>
        </v-main>
        <v-footer
            class="bg-indigo-lighten-1 text-center d-flex flex-column"
        >
            <div></div>

            <div class="pt-0">
                Phasellus feugiat arcu sapien, et iaculis ipsum
                elementum sit amet. Mauris cursus commodo
                interdum. Praesent ut risus eget metus luctus
                accumsan id ultrices nunc. Sed at orci sed
                massa consectetur dignissim a sit amet dui.
                Duis commodo vitae velit et faucibus. Morbi
                vehicula lacinia malesuada. Nulla placerat
                augue vel ipsum ultrices, cursus iaculis dui
                sollicitudin. Vestibulum eu ipsum vel diam
                elementum tempor vel ut orci. Orci varius
                natoque penatibus et magnis dis parturient
                montes, nascetur ridiculus mus.
            </div>

            <v-divider></v-divider>

            <div>
                {{ new Date().getFullYear() }} —
                <strong>Vuetify</strong>
            </div>
        </v-footer>
    </v-app>
</template>

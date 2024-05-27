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

        <v-main min-width="960px">
            <v-container>
                <router-view />
            </v-container>
        </v-main>
        <v-footer
            class="bg-indigo-lighten-1 text-center d-lg-flex flex-column"
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

<style>
    .color-discreet-orange {
        background-color: #ffa791;
    }
    .color-mother-nature {
        background-color: #b4e2c2;
    }
    .color-black {
        background-color: #3a3a3a;
    }
    .color-silver-bullet {
        background-color: #c5c5c5;
    }
    .color-gardenia {
        background-color: #c5c5c5;
    }
    .color-bungalow {
        background-color: #b48038;
    }
    .color-brown {
        background-color: #7c5741;
    }
    .color-orange {
        background-color: #ed4c00;
    }
</style>

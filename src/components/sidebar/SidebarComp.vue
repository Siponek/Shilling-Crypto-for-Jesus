<template>
    <v-navigation-drawer expand-on-hover rail>
        <v-list density="compact">
            <v-list-item
                link
                :prepend-icon="iconForItem('/')"
                title="Home"
                value="home"
                @click="setActive('/')"
                to="/"
            ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact">
            <v-list-item
                link
                :prepend-icon="iconForItem('/about')"
                title="About"
                value="about"
                @click="setActive('/about')"
                to="/about"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
    import { useNavigationStore } from '@/stores/navigation_pinia'
    const store = useNavigationStore()

    const iconForItem = (route: string) => {
        return store.activeItem === route
            ? '$radioOn'
            : '$radioOff'
    }

    const setActive = (route: string) => {
        store.setActiveItem(route)
    }
</script>

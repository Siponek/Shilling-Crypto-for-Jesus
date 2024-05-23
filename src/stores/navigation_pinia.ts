import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
    state: () => ({
        activeItem: '/'
    }),
    actions: {
        setActiveItem(item: string) {
            this.activeItem = item
        }
    }
})

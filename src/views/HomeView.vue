<script setup lang="ts">
    import { useWeb3Store } from '@/stores/web3store_pinia'
    import AbiInterface from '@/components/smartContract/AbiInterface.vue'
    import MetamaskBtn from '@/components/smartContract/MetamaskBtn.vue'
    import { computed } from 'vue'
    const web3Store = useWeb3Store()

    const tate_status = computed(() => {
        return parseFloat(web3Store.balance) < 1
            ? '...You are poor!'
            : '...You are rich!'
    })
</script>

<template>
    <v-container class="main-content">
        <v-alert
            v-if="web3Store.warningMessage"
            :text="web3Store.warningMessage"
            type="error"
            dense
            prominent
            dismissible
            class="warning-box"
            role="alert"
            elevation="12"
        >
        </v-alert>
        <v-container class="metamask-class">
            <MetamaskBtn v-if="!web3Store.connected" />
            <v-btn v-else @click="web3Store.resetWeb3">
                Disconnect wallet</v-btn
            >
        </v-container>
        <transition>
            <v-card
                v-if="web3Store.connected"
                title="Hello there, this is your balance"
                :subtitle="tate_status"
                elevated
                min-width="40vw"
            >
                <v-card-text>{{
                    web3Store.balance
                        ? web3Store.balance
                        : 'YOU GOT NOTHING'
                }}</v-card-text>
            </v-card>
        </transition>
        <div v-if="!web3Store.connected">
            Connect to MetaMask to interact with the contract
        </div>

        <Transition :duration="900" name="nested">
            <v-container
                v-if="web3Store.connected"
                class="abi"
            >
                <AbiInterface />
            </v-container>
        </Transition>
    </v-container>
</template>

<style scoped>
    .metamask-class {
        margin-top: 20px;
        max-width: min-content;
    }

    .abi {
        margin-top: 20px;
        max-width: min-content;
    }

    .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
    }

    .balance-box {
        background-color: rgb(18, 130, 199);
        width: 100%;
        height: 300px;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }
    .warning-box {
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
    }

    .nested-enter-active,
    .nested-leave-active {
        transition: all 0.3s ease-in-out;
    }
    /* delay leave of parent element */
    .nested-leave-active {
        transition-delay: 0.25s;
    }

    .nested-enter-from,
    .nested-leave-to {
        transform: translateY(30px);
        opacity: 0;
    }

    /* we can also transition nested elements using nested selectors */
    .nested-enter-active .inner,
    .nested-leave-active .inner {
        transition: all 0.3s ease-in-out;
    }
    /* delay enter of nested element */
    .nested-enter-active .inner {
        transition-delay: 0.25s;
    }

    .nested-enter-from .inner,
    .nested-leave-to .inner {
        transform: translateX(30px);
        opacity: 0.001;
    }
</style>

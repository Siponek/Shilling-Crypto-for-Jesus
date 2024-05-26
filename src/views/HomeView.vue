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
        <transition name="fade" mode="out-in">
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
        <transition name="fade" mode="out-in">
            <v-container
                v-if="web3Store.connected"
                class="abi"
            >
                <AbiInterface />
            </v-container>
        </transition>
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

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }
    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>

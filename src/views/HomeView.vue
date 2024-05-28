<script setup lang="ts">
    import { useWeb3Store } from '@/stores/web3Store_pinia'
    import AbiInterface from '@/components/smartContract/AbiInterface.vue'
    import MetamaskBtn from '@/components/smartContract/MetamaskBtn.vue'
    import LotteryInterface from '@/components/smartContract/LotteryInterface.vue'
    import { computed } from 'vue'
    const web3Store = useWeb3Store()

    const tate_status = computed(() => {
        return parseFloat(web3Store.balance) < 1
            ? '...You are poor!'
            : '...You are rich!'
    })
</script>

<template>
    <v-row no-gutters>
        <Transition :duration="1200">
            <v-col
                :class="{
                    'col-connected': web3Store.connected,
                    'col-disconnected': !web3Store.connected
                }"
            >
                <v-container class="top-content">
                    <v-card
                        title="Contract Address"
                        class="color-black p-1"
                        max-width="50vw"
                    >
                        <v-container>
                            <v-card
                                :text="
                                    web3Store.contractAddress
                                "
                                v-if="
                                    web3Store.contractAddress
                                "
                            >
                                <v-container
                                    class="metamask-class"
                                >
                                    <MetamaskBtn
                                        v-if="
                                            !web3Store.connected
                                        "
                                    />
                                    <v-btn
                                        v-else
                                        @click="
                                            web3Store.resetWeb3
                                        "
                                    >
                                        Disconnect
                                        wallet</v-btn
                                    >
                                </v-container>
                                <v-container
                                    v-if="!web3Store.connected"
                                    class="d-flex justify-center flex-sm-column align-center"
                                >
                                    <v-alert
                                        v-if="
                                            web3Store.warningMessage
                                        "
                                        :text="
                                            web3Store.warningMessage
                                        "
                                        type="error"
                                        dense
                                        prominent
                                        dismissible
                                        class="my-2"
                                        role="alert"
                                        elevation="12"
                                        min-height="50px"
                                        max-width="20vw"
                                    >
                                    </v-alert>

                                    <div
                                        v-if="
                                            !web3Store.connected
                                        "
                                    >
                                        Connect to MetaMask to
                                        interact with the
                                        contract
                                    </div>
                                </v-container>
                            </v-card>
                        </v-container>
                    </v-card>
                </v-container>
            </v-col>
        </Transition>

        <Transition :duration="1200">
            <v-col
                v-if="web3Store.connected"
                :cols="web3Store.connected ? 4 : 12"
            >
                <v-container class="main-content">
                    <v-card
                        v-if="web3Store.connected"
                        class="color-black"
                        elevation="10"
                    >
                        <v-card-title
                            >Smart Contract
                            Interface</v-card-title
                        >
                        <v-container class="abi">
                            <v-card
                                title="Hello there, this is your balance"
                                :subtitle="tate_status"
                            >
                                <v-card-text>{{
                                    web3Store.balance
                                        ? web3Store.balance
                                        : 'YOU GOT NOTHING'
                                }}</v-card-text>
                            </v-card>

                            <AbiInterface />
                        </v-container>
                    </v-card>
                </v-container>
            </v-col>
        </Transition>
        <Transition :duration="1200">
            <v-col v-if="web3Store.connected" cols="4">
                <v-container class="lottery-content">
                    <v-card
                        title="Lottery Interface"
                        v-if="web3Store.connected"
                        min-width="25vw"
                        class="color-black"
                        elevation="10"
                    >
                        <LotteryInterface />
                    </v-card>
                </v-container>
            </v-col>
        </Transition>
    </v-row>
</template>

<style>
    .my-theme-btn-class {
        background-color: red !important;
    }
</style>

<style scoped>
    .v-enter-active,
    .v-leave-active {
        transition:
            transform 1.2s ease-in-out,
            flex-basis 1.2s ease-in-out,
            opacity 1.2s ease-in-out;
        width: 100%; /* Match the width to avoid layout shift */
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateX(100%); /* Move to the right */
    }

    .col-connected,
    .col-disconnected {
        transition: flex-basis 0.7s ease-in-out;
    }

    .col-connected {
        flex: 0 0 25%; /* Equivalent to cols="3" in a 12-column grid */
    }

    .col-disconnected {
        flex: 0 0 100%; /* Equivalent to cols="12" */
    }
</style>

<style scoped>
    .metamask-class {
        max-width: min-content;
    }

    .abi {
        margin-top: 20px;
        max-width: min-content;
    }

    .top-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    }

    .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 50vh;
    }
    .lottery-content {
        display: flex;
        flex-direction: column;
        align-items: center;
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
</style>

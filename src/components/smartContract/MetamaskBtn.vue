<template>
    <v-btn @click="conenctToMetaMask"
        >Connect to metamask</v-btn
    >
</template>

<script setup>
    import { useWeb3Store } from '@/stores/web3store_pinia'
    const web3Store = useWeb3Store()
    function conenctToMetaMask() {
        web3Store.initWeb3()
    }
</script>

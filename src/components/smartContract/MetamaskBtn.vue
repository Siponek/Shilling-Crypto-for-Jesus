<template>
    <v-btn @click="conenctToMetaMask"
        >Connect to metamask</v-btn
    >
</template>

<script setup>
    import { useWeb3Store } from '@/stores/web3Store_pinia'
    import { useContractStore } from '@/stores/contractStore_pinia'
    const web3Store = useWeb3Store()
    const contractStore = useContractStore()
    async function conenctToMetaMask() {
        await web3Store.initWeb3()
        contractStore.setCurrentContract(web3Store.contract)
    }
</script>

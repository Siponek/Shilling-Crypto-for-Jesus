<script setup lang="ts">
    import { ethers } from 'ethers'
    import { ref, onMounted } from 'vue'
    const abi = JSON.parse(import.meta.env.VITE_CONTRACT_ABI)
    // const provider = ref<Provider | null>(null)
    declare global {
        interface Window {
            // ethereum?: Provider
            ethereum?: ethers.Eip1193Provider
        }
    }

    declare module 'ethers' {
        interface BrowserProvider {
            getSigner(): ethers.JsonRpcSigner
        }
    }
    const contractAddress: string =
        '0x3745724986BcF75B597a54e61ACF1ec4415561Af'
    const abiJson = abi as unknown as ethers.InterfaceAbi
    const contract = ref<ethers.Contract | null>(null)
    const balance = ref<string>('')
    const signer = ref<
        | ethers.JsonRpcSigner
        | ethers.ContractRunner
        | null
        | undefined
    >(null)
    const provider = ref<
        // | ethers.AbstractProvider
        | ethers.BrowserProvider
        // | ethers.Eip1193Provider
        // | ethers.JsonRpcSigner
        | null
    >(null)

    const warningMessage = ref<string>('')
    const accounts = ref([])
    const connected = ref(false)

    async function initEthers() {
        if (!window.ethereum) {
            console.error(
                'MetaMask is not installed! Using read-only defaults'
            )
            warningMessage.value =
                'Failed to initialize provider.'
            return
        } else {
            provider.value = new ethers.BrowserProvider(
                window.ethereum
            )
            signer.value = provider.value
        }
        // Ensure the provider has been initialized correctly before continuing
        if (!provider.value) {
            console.error('Provider initialization failed')
            return
        }
        signer.value = await provider.value.getSigner()
        accounts.value = await provider.value.send(
            'eth_requestAccounts',
            []
        )
        connected.value = true
        contract.value = new ethers.Contract(
            contractAddress,
            abiJson,
            signer.value
        )

        fetchBalance()
    }

    async function fetchBalance() {
        if (!contract.value) {
            console.error('Contract not initialized')
            return
        }

        try {
            const userAddress = 'user_address_here' // Replace with actual user address
            const result =
                await contract.value.balanceOf(userAddress)
            balance.value = ethers.formatEther(result)
        } catch (error) {
            console.error('Error fetching balance:', error)
        }
    }

    onMounted(initEthers)
</script>

<template>
    <v-container fluid class="main-content">
        <div v-if="warningMessage" class="warning-box">
            {{ warningMessage }}
        </div>
        <div class="balance-box">Hello there</div>
        <button @click="fetchBalance">Check Balance</button>
        <p>Balance: {{ balance }}</p>
    </v-container>
</template>

<style scoped>
    .main-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    .balance-box {
        background-color: green;
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
    }
</style>

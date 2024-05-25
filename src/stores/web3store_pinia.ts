import { defineStore } from 'pinia'
import Web3, { type AbiStruct, type ContractAbi } from 'web3'
import { init } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

const logo_url: string =
    'https://comparic.pl/wp-content/uploads/2023/09/Obraz1.jpg'
const injected = injectedModule()
const onboard = init({
    wallets: [injected],
    chains: [
        {
            id: '11155111', // Sepolia Testnet
            token: 'ETH',
            label: 'Sepolia Testnet',
            rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com'
        }
    ],
    appMetadata: {
        name: 'Smart Lottery',
        icon: logo_url,
        description: 'Your App Description'
    }
})

export const useWeb3Store = defineStore('web3', {
    state: () => ({
        web3: null as Web3 | null,
        accounts: '',
        contract: null as any,
        balance: '',
        connected: false,
        warningMessage: '',
        contractAddress:
            '0x3745724986BcF75B597a54e61ACF1ec4415561Af',
        abi: null as null | ContractAbi
    }),
    actions: {
        async initWeb3() {
            const wallets = await onboard.connectWallet()
            if (wallets.length > 0) {
                this.web3 = new Web3(wallets[0].provider)
                this.accounts = (
                    await this.web3.eth.getAccounts()
                )[0]
            } else {
                this.warningMessage =
                    'Please connect to a wallet.'
                return
            }
            await this.fetchABI()
            await this.loadContract()
            await this.fetchBalance()
            this.connected = true
        },
        async loadContract() {
            if (!this.abi) {
                this.warningMessage = 'ABI is not set.'
                return
            }
            if (!this.web3) {
                this.warningMessage = 'Web3 is not set.'
                return
            }
            this.contract = new this.web3.eth.Contract(
                this.abi,
                this.contractAddress
            )
        },
        async fetchBalance() {
            if (!this.web3 || !this.accounts) return
            this.balance = this.web3.utils.fromWei(
                await this.web3.eth.getBalance(this.accounts),
                'ether'
            )
        },
        async fetchABI() {
            try {
                const response = await fetch(
                    import.meta.env.VITE_CONTRACT_ABI_PATH
                )
                if (response.ok) {
                    const data = await response.json()
                    if (data.status === '1') {
                        this.abi = JSON.parse(
                            data.result
                        ) as ContractAbi
                    } else {
                        console.error(
                            'ABI fetch failed with status:',
                            data.message
                        )
                        this.warningMessage =
                            'Failed to load contract ABI: ' +
                            data.message
                        throw new Error(
                            'Failed to load ABI: ' +
                                data.message
                        )
                    }
                } else {
                    throw new Error(
                        'Network response was not ok'
                    )
                }
            } catch (error) {
                console.error('Error fetching the ABI:', error)
                this.warningMessage =
                    'Error fetching the ABI. See console for details.'
                throw error
            }
        }
    }
})

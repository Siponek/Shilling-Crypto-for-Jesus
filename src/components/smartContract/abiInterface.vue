<template>
    <div>
        <v-card class="form-class" min-width="25vw">
            <v-form
                v-if="
                    true //change to owner == current user
                "
            >
                <v-text-field
                    v-model="authAddress"
                    :rules="rules"
                    label="Address to authorize"
                    density="comfortable"
                ></v-text-field>
                <v-row justify="end">
                    <v-btn
                        class="my-2 mx-2"
                        @click="authorizeAddress"
                        >Authorize</v-btn
                    >
                </v-row>
            </v-form>
        </v-card>
        <v-card class="form-class">
            <v-form @submit.prevent>
                <v-text-field
                    v-model="ticketCount"
                    :rules="rules"
                    label="Number of tickets"
                    density="comfortable"
                ></v-text-field>
                <v-text-field
                    v-model="firstName"
                    :rules="rules"
                    label="First name"
                    density="comfortable"
                ></v-text-field>
                <v-text-field
                    v-model="lastName"
                    :rules="rules"
                    label="Last name"
                    density="comfortable"
                ></v-text-field>
                <v-text-field
                    v-model="studentId"
                    :rules="rules"
                    label="Student ID"
                    density="comfortable"
                ></v-text-field>
                <v-row justify="end">
                    <v-btn
                        class="my-2 mx-2"
                        @click="buyTickets"
                        >Buy tickets</v-btn
                    >
                </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script setup lang="js">
    import { ref } from 'vue'
    import { useWeb3Store } from '@/stores/web3Store_pinia'
    import { useContractStore } from '@/stores/contractStore_pinia'

    const web3Store = useWeb3Store()
    const contractStore = useContractStore()
    const authAddress = ref('')
    const ticketCount = ref(0)
    const firstName = ref('')
    const lastName = ref('')
    const studentId = ref('')
    const rules = [v => !!v || 'Field is required']

    function authorizeAddress() {
        if (contractStore !== null) {
            contractStore
                .authorizeAddress(
                    web3Store.account,
                    authAddress.value
                )
                .then(response => {
                    console.log(
                        'Transaction successful:',
                        response
                    )
                })
                .catch(error => {
                    console.error('Transaction failed:', error)
                })
        } else console.error('Contract not found')
    }

    async function buyTickets() {
        if (contractStore !== null) {
            console.log(
                'Buying tickets:',
                ticketCount.value,
                firstName.value,
                lastName.value,
                studentId.value
            )
            await contractStore.buyTickets(
                web3Store.account,
                ticketCount.value,
                firstName.value,
                lastName.value,
                studentId.value
            )
        } else {
            console.error('Contract not found')
        }
    }
</script>

<style scoped>
    .form-class {
        margin-top: 20px;
        padding: 10px;
    }
</style>

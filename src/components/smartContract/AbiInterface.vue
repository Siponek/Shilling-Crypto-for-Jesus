<template>
    <v-dialog
        v-model="isParticipantsWindowOpen"
        max-width="500px"
    >
        <v-card
            title="
            Participants info"
        >
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-list-item-title>
                            <h4>
                                Student ID:
                                {{ studentId }}
                            </h4>
                        </v-list-item-title>
                        <v-list-item-subtitle
                            v-if="
                                contractStore
                                    .currentStudentCredentials
                                    .firstName &&
                                contractStore
                                    .currentStudentCredentials
                                    .lastName
                            "
                        >
                            First name:
                            {{
                                contractStore
                                    .currentStudentCredentials
                                    .firstName
                            }}
                            Last name :

                            {{
                                contractStore
                                    .currentStudentCredentials
                                    .lastName
                            }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-else>
                            <h2>
                                Could not find the data to
                                match the ID
                            </h2>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="isParticipantsWindowOpen = false"
                    >Close</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-card class="form-class">
        <v-form
            v-if="
                true //change to owner == current user
            "
        >
            <v-text-field
                v-model="authAddress"
                label="Address to authorize"
                density="comfortable"
                :rules="addressRules"
            ></v-text-field>
            <v-btn class="my-2 mx-2" @click="authorizeAddress"
                >Authorize</v-btn
            >
            <v-btn
                class="my-2 mx-2"
                @click="authorizeAddress({ deauth: true })"
                >Deauthorize</v-btn
            >
        </v-form>
    </v-card>
    <v-card class="form-class">
        <v-form @submit.prevent>
            <v-text-field
                v-model="ticketCount"
                label="Number of tickets"
                density="comfortable"
            ></v-text-field>
            <v-text-field
                v-model="firstName"
                label="First name"
                density="comfortable"
            ></v-text-field>
            <v-text-field
                v-model="lastName"
                label="Last name"
                density="comfortable"
            ></v-text-field>
            <v-text-field
                v-model="studentId"
                label="Student ID"
                density="comfortable"
            ></v-text-field>
            <v-btn class="my-2 mx-2" @click="buyTickets"
                >Buy tickets</v-btn
            >
            <v-btn
                class="my-2 mx-2"
                @click="getParticipantCredentials"
                >Get credentials for ID</v-btn
            >
        </v-form>
    </v-card>
</template>

<script setup lang="js">
    import { ref } from 'vue'
    import { useWeb3Store } from '@/stores/web3Store_pinia'
    import { useContractStore } from '@/stores/contractStore_pinia'
    import web3 from 'web3'

    const web3Store = useWeb3Store()
    const contractStore = useContractStore()
    const authAddress = ref('')
    const ticketCount = ref(0)
    const firstName = ref('')
    const lastName = ref('')
    const studentId = ref('')
    const addressRules = ref([
        v =>
            web3.utils.isAddress(v) ||
            'Address must be valid Ethereum address'
    ])

    const isParticipantsWindowOpen = ref(false)

    async function getParticipantCredentials() {
        if (contractStore !== null) {
            console.log(
                'Getting credentials for ID:',
                studentId.value
            )
            await contractStore.getParticipantCredentials(
                web3Store.account,
                studentId.value
            )
            isParticipantsWindowOpen.value = true
        } else {
            console.error('ID not found')
        }
    }

    function authorizeAddress(deauth = false) {
        if (contractStore !== null) {
            console.log(
                deauth ? 'Deauthorizing' : 'Authorizing',
                authAddress.value
            )
            if (deauth === true) {
                contractStore
                    .deauthorizeAddress(
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
                        console.error(
                            'Transaction failed:',
                            error
                        )
                    })
            } else {
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
                        console.error(
                            'Transaction failed:',
                            error
                        )
                    })
            }
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

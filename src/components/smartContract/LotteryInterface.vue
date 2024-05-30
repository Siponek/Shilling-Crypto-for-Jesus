<template>
    <v-dialog v-model="isWinnersModalOpen" max-width="600px">
        <v-card
            title="
            Lottery Winners"
        >
            <v-card-text>
                <v-list>
                    <v-list-item
                        v-for="(
                            winner, index
                        ) in contractStore.currentWinnersArray"
                        :key="index"
                    >
                        <v-list-item-title
                            >Student ID:
                            {{
                                winner.studentId
                            }}</v-list-item-title
                        >
                        <v-list-item-subtitle
                            >Winning Ticket ID:
                            {{
                                winner.winningId
                            }}</v-list-item-subtitle
                        >
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="isWinnersModalOpen = false"
                    >Close</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-container>
        <v-card>
            <v-card-text>
                {{
                    contractStore.ownerAddress ==
                    web3Store.account
                        ? 'You are the owner of the contract'
                        : 'It seems that you are not the owner of the contract.\
                        Get the owner of the contract to verify it'
                }}
            </v-card-text>
            <v-list rounded="sm">
                <v-list-item>
                    <v-card
                        border="double lg opacity-100"
                        class="mx-auto ml-2"
                        max-width="360"
                        rounded="sm"
                        variant="text"
                        :text="contractStore.ownerAddress"
                        title="Contract owner"
                    >
                    </v-card>
                    <v-btn
                        class="my-2 mx-2"
                        @click="
                            contractStore.getContractOwner()
                        "
                        >Get owner of the contract</v-btn
                    >
                </v-list-item>
                <v-list-item>
                    <v-card
                        border="double lg  opacity-100"
                        class="mx-auto ml-2"
                        max-width="360"
                        rounded="sm"
                        variant="text"
                        :text="
                            contractStore.totalTicketsInGame
                        "
                        title="Total tickets in game"
                    >
                    </v-card>
                    <v-btn
                        class="my-2 mx-2"
                        @click="
                            contractStore.getTotalTicketsInGame()
                        "
                        >Get total tickets in game</v-btn
                    >
                </v-list-item>
                <v-list-item>
                    <v-card
                        border="double lg opacity-100"
                        class="mx-auto ml-2"
                        max-width="360"
                        rounded="sm"
                        variant="text"
                        :text="
                            contractStore.currentWinningIds.join(
                                ', '
                            )
                        "
                        title="Current winning tickets"
                    >
                    </v-card>
                    <v-btn
                        class="my-2 mx-2"
                        @click="
                            contractStore.getWinningIds(
                                web3Store.account
                            )
                        "
                        >Get winning tickets</v-btn
                    >
                    <v-btn
                        class="my-2 mx-2"
                        @click="getWinnersRanges()"
                        >Get the winners</v-btn
                    >
                </v-list-item>
                <v-list-item>
                    <v-text-field
                        hide-details="auto"
                        label="Amount of tickets to draw"
                        v-model="amountOfTicketsToBeDrawn"
                    ></v-text-field>
                    <v-btn
                        class="my-2 mx-2"
                        @click="drawWinners()"
                        >Draw winners</v-btn
                    >
                </v-list-item>
                <v-list-item>
                    <v-btn
                        class="my-2 mx-2"
                        @click="
                            contractStore.resetLottery(
                                web3Store.account
                            )
                        "
                        >Reset the lottery!</v-btn
                    >
                </v-list-item>
            </v-list>
        </v-card>
    </v-container>
</template>

<script setup>
    import { useWeb3Store } from '@/stores/web3Store_pinia'
    import { useContractStore } from '@/stores/contractStore_pinia'
    import { ref } from 'vue'

    const web3Store = useWeb3Store()
    const contractStore = useContractStore()
    const amountOfTicketsToBeDrawn = ref(0)
    const isWinnersModalOpen = ref(false)

    async function getWinnersRanges() {
        if (contractStore === null) {
            console.error('Contract store is null')
            return
        }
        if (
            contractStore.currentWinningIds.length < 1 ||
            contractStore.currentWinningIds[0] === null
        ) {
            console.error(
                'No acces to winning ids. Get the winning tickets first'
            )
            return
        }

        await contractStore.getAllParticipantsRanges(
            web3Store.account
        )
        contractStore.checkForWinners()
        isWinnersModalOpen.value = true
    }
    function drawWinners() {
        if (
            amountOfTicketsToBeDrawn.value < 1 ||
            amountOfTicketsToBeDrawn.value > 10
        ) {
            console.error(
                'Invalid number of winners specified'
            )
            return
        }
        if (contractStore === null) {
            console.error('Contract store is null')
            return
        }
        contractStore.drawWinners(
            web3Store.account,
            amountOfTicketsToBeDrawn.value
        )
    }
</script>

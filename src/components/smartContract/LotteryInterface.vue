<template>
    <v-container>
        <v-card class="my-2">
            <v-card-text>
                Niemieckie fury, zegarki szwacaria, Ja mówię to
                co chce, Wy kurwy w kagańcach
                {{
                    contractStore.ownerAddress ==
                    web3Store.account
                        ? 'You are the owner of the contract'
                        : 'You are not the owner of the contract'
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
                    >
                        <v-card-text>
                            {{ contractStore.ownerAddress }}
                        </v-card-text>
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
                    >
                        <v-card-text>
                            {{
                                contractStore.totalTicketsInGame
                            }}
                        </v-card-text>
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
                    >
                        <v-card-text>
                            {{
                                contractStore.currentWinningIds.join(
                                    ', '
                                )
                            }}
                        </v-card-text>
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
                        v-model="winnersNumer"
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
                        @click="contractStore.resetLottery()"
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
    import { ref, toRaw } from 'vue'

    const web3Store = useWeb3Store()
    const contractStore = useContractStore()
    const winnersNumer = ref(0)
    async function getWinnersRanges() {
        if (contractStore === null) {
            console.error('Contract store is null')
            return
        }

        await contractStore.getAllParticipantsRanges(
            web3Store.account
        )
        console.log(
            'Current student ranges:',
            toRaw(contractStore.currentStudentRanges)
        )
        contractStore.checkForWinners()
    }

    function drawWinners() {
        if (
            winnersNumer.value < 1 ||
            winnersNumer.value > 10
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
            winnersNumer.value
        )
    }
</script>

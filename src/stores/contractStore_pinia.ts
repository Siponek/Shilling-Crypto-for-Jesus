import { defineStore } from 'pinia'
import { Contract, type Address } from 'web3'

interface Range {
    start: number
    end: number
}

interface ParticipantWithRanges {
    studentId: string
    ranges: Range[]
}

export const useContractStore = defineStore('contract_store', {
    state: () => ({
        currentWinningIds: [null] as unknown as number[],
        ownerAddress: '' as string,
        totalTicketsInGame: 0 as number,
        storeContract: null as Contract<any> | null
    }),
    actions: {
        setCurrentContract(contract: Contract<any>): void {
            this.storeContract = contract
        },
        async authorizeAddress(
            currentAddress: Address,
            addressToAuthorize: Address
        ): Promise<void> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }

            try {
                console.log(
                    'Authorizing address: ',
                    addressToAuthorize
                )
                await this.storeContract.methods
                    .authorizeAddress(addressToAuthorize)
                    .send({ from: currentAddress })
                    .on('transactionHash', hash => {
                        console.log('transactionHash', hash)
                    })
                    .on(
                        'confirmation',
                        (confirmations: any) => {
                            console.log(
                                'confirmation',
                                confirmations
                            )
                        }
                    )
                    .on('receipt', receipt => {
                        console.log(receipt)
                    })
                    .on('error', error => {
                        // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                        console.log(
                            'Transaction failed',
                            error
                        )
                    })
            } catch (error) {
                console.error(
                    'Error authorizing address:',
                    error
                )
                throw error
            }
        },
        async buyTickets(
            currentAddress: Address,
            ticketCount: number,
            firstName: string,
            lastName: string,
            studentId: string
        ) {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }
            try {
                this.storeContract.methods
                    .buyTicketsOffchainMode(
                        ticketCount,
                        firstName,
                        lastName,
                        studentId
                    )
                    .send({ from: currentAddress })
                    .on('transactionHash', hash => {
                        console.log('transactionHash', hash)
                    })
                    .on(
                        'confirmation',
                        (confirmations: any) => {
                            console.log(
                                'confirmation',
                                confirmations
                            )
                        }
                    )
                    .on('receipt', receipt => {
                        console.log(receipt)
                    })
                    .on('error', error => {
                        // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                        console.log(
                            'Transaction failed',
                            error
                        )
                    })
            } catch (error) {
                console.error('Error buying tickets:', error)
                throw error
            }
        },
        async getTotalTicketsInGame(): Promise<void> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }

            try {
                const result = await this.storeContract.methods
                    .totalTicketsInGame()
                    .call()
                console.log(
                    'totalTicketsInGame() result:',
                    result
                )
                // check if the number is bigint
                if (typeof result === 'bigint') {
                    this.totalTicketsInGame = Number(result)
                } else {
                    console.error(
                        'Error fetching total tickets in game: result is not a number'
                    )
                    console.log(
                        result,
                        typeof result,
                        isNaN(result as unknown as number)
                    )
                }
            } catch (error) {
                console.error(
                    'Error fetching total tickets in game:',
                    error
                )
                throw error
            }
        },

        async getContractOwner(): Promise<void> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }
            try {
                const result = await this.storeContract.methods
                    .owner()
                    .call()
                console.log(
                    'getContractOwner() result:',
                    result
                )
                if (
                    typeof result === 'string' &&
                    !isNaN(result)
                ) {
                    this.ownerAddress = result as string
                } else {
                    console.error(
                        'Error fetching contract owner: result is not a string'
                    )
                    console.log(result, typeof result)
                }
            } catch (error) {
                console.error(
                    'Error fetching total tickets in game:',
                    error
                )
                throw error
            }
        },
        async findParticipantByTicketId(
            ticketId: number
        ): Promise<ParticipantWithRanges | undefined> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }

            try {
                const participants =
                    await this.getAllParticipantsRanges()
                return participants.find(
                    (participant: { ranges: any[] }) =>
                        participant.ranges.some(
                            (range: {
                                start: number
                                end: number
                            }) =>
                                ticketId >= range.start &&
                                ticketId <= range.end
                        )
                )
            } catch (error) {
                console.error(
                    'Error finding participant by ticket ID:',
                    error
                )
                throw error
            }
        },
        async getAllParticipantsRanges(): Promise<
            ParticipantWithRanges[]
        > {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const result = await this.storeContract.methods
                    .getAllParticipantsRanges()
                    .call()
                console.log(
                    'getAllParticipantsRanges() result:',
                    result
                )
                return (result as any[]).map(
                    (participant: any) => ({
                        studentId: participant.studentId,
                        ranges: participant.ranges.map(
                            (range: any) => ({
                                start: range.start,
                                end: range.end
                            })
                        )
                    })
                )
            } catch (error) {
                console.error(
                    'Error fetching participants and ranges:',
                    error
                )
                throw error
            }
        },
        async getWinningIds(
            currentAddress: Address
        ): Promise<void> {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const winningIdArray =
                    await this.storeContract.methods
                        .getCurrentWinningID()
                        .call({ from: currentAddress })

                if (Array.isArray(winningIdArray)) {
                    this.currentWinningIds = winningIdArray
                    console.log(winningIdArray)
                } else {
                    console.error(
                        'Error fetching winning IDs: result is not an array'
                    )
                    console.log(winningIdArray)
                }
            } catch (error) {
                console.error('Error fetching winners:', error)
                throw error
            }
        },
        async drawWinners(
            currentAddress: Address,
            numberOfWinners: number
        ): Promise<void> {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const winnnersArray =
                    await this.storeContract.methods
                        .drawWinnersOffChainMode(
                            numberOfWinners
                        )
                        .send({ from: currentAddress })
                console.log(
                    'drawWinners() result:',
                    winnnersArray
                )
            } catch (error) {
                console.error('Error drawing winners:', error)
                throw error
            }
        },

        async resetLottery(): Promise<void> {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const result = await this.storeContract.methods
                    .resetLottery()
                    .call()
                console.log('resetLottery() result:', result)
            } catch (error) {
                console.error('Error reseting lottery:', error)
                throw error
            }
        },

        isWinner(ticket: number, ranges: Range[]): boolean {
            let low = 0
            let high = ranges.length - 1

            while (low <= high) {
                const mid = Math.floor((low + high) / 2)
                if (ticket < ranges[mid].start) {
                    high = mid - 1
                } else if (ticket > ranges[mid].end) {
                    low = mid + 1
                } else {
                    return true
                }
            }
            return false
        }
    }
})

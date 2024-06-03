import { defineStore } from 'pinia'
import type { id } from 'vuetify/locale'
import { Contract, type Address } from 'web3'

interface Range {
    start: number
    end: number
}

interface ParticipantWithRanges {
    studentId: string
    ranges: Range[]
}

interface ParticipantSolidityExport {
    0: string
    1: { start: string; end: string }[]
    studentId: string
    ranges: { start: number; end: number }[]
}

export const useContractStore = defineStore('contract_store', {
    state: () => ({
        currentWinningIds: [] as unknown as number[],
        ownerAddress: '' as string,
        totalTicketsInGame: 0 as number,
        storeContract: null as Contract<any> | null,
        currentStudentRanges:
            [] as ParticipantSolidityExport[],
        currentWinnersArray: [] as unknown as {
            studentId: string
            winningId: number
        }[],
        currentStudentCredentials: {} as unknown as {
            firstName: string
            lastName: string
        }
        // currentStudentRanges: [] as ParticipantWithRanges[]
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
        async deauthorizeAddress(
            currentAddress: Address,
            addressToAuthorize: Address
        ): Promise<void> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }

            try {
                console.log(
                    'Deauthorizing address: ',
                    addressToAuthorize
                )
                await this.storeContract.methods
                    .deauthorizeAddress(addressToAuthorize)
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
                    'Error deauthorizing address:',
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
        async getParticipantCredentials(
            currentAddress: Address,
            id: string
        ): Promise<void> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }
            try {
                const result = await this.storeContract.methods
                    .getParticipantCredentials(id)
                    .call({ from: currentAddress })
                console.log(
                    'getParticipantCredentials() result:',
                    result
                )
                if (typeof result === 'object') {
                    this.currentStudentCredentials =
                        result as any as {
                            firstName: string
                            lastName: string
                        }
                } else {
                    console.error(
                        'Error fetching participant credentials: result is not an object'
                    )
                    console.log(result, typeof result)
                }
            } catch (error) {
                console.error(
                    'Error fetching participant credentials:',
                    error
                )
                throw error
            }
        },

        async findParticipantByTicketId(
            ticketId: number,
            participants: ParticipantWithRanges[]
        ): Promise<ParticipantWithRanges | undefined> {
            if (!this.storeContract) {
                throw new Error('Contract not set')
            }

            try {
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
        async getAllParticipantsRanges(
            currentAddress: Address
        ): Promise<void> {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const result = await this.storeContract.methods
                    .getAllParticipantsRanges()
                    .call({ from: currentAddress })
                const parsedResult =
                    result as ParticipantSolidityExport[]
                this.currentStudentRanges = parsedResult
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

        async resetLottery(
            currentAddress: Address
        ): Promise<void> {
            if (!this.storeContract)
                throw new Error('Contract not set')
            try {
                const result = await this.storeContract.methods
                    .resetLottery()
                    .send({ from: currentAddress })
                console.log('resetLottery() result:', result)
            } catch (error) {
                console.error('Error reseting lottery:', error)
                throw error
            }
        },
        checkForWinners() {
            if (this.currentWinningIds.length < 1) {
                console.error('No winning IDs in the lottery')
                return
            }
            if (this.currentStudentRanges.length < 1) {
                console.error('No participants in the lottery')
                return
            }
            const winnnersArray = []
            for (const winningId of this.currentWinningIds) {
                console.log('Checking for winner:', winningId)
                for (const participant of this
                    .currentStudentRanges) {
                    const winner = this.isWinner(
                        winningId,
                        participant.ranges
                    )
                    if (winner) {
                        winnnersArray.push({
                            studentId: participant.studentId,
                            winningId
                        })
                    }
                }
            }
            this.currentWinnersArray = winnnersArray
        },
        isWinner(ticket: number, ranges: Range[]): boolean {
            // First number in range is inclusive, second is exclusive
            let lo = 0
            // -1 because the last number is exclusive
            let hi = ranges.length - 1
            do {
                const mid = Math.floor(lo + (lo + hi) / 2)
                if (mid >= ranges.length) {
                    console.error('Outside of range')
                    return false
                }
                const v = ranges[mid]
                if (v.start <= ticket && ticket < v.end) {
                    return true
                } else if (ticket < v.start) {
                    hi = mid
                } else if (ticket >= v.end) {
                    // If the ticket is equal to the end of the range and the next range has this number
                    // as the start, then the we can move to next range and win at the start of the next range
                    lo = mid + 1
                } else {
                    console.error('Error in binary search')
                    return false
                }
            } while (lo <= hi)
            return false
        }
    }
})

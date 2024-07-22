import { beforeAll, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContractStore } from '../contractStore_pinia'

interface Range {
    start: number
    end: number
}

describe('isWinner', () => {
    beforeAll(() => {
        // creates a fresh pinia and makes it active
        setActivePinia(createPinia())
    })

    it('return true if the ticket is within a range', () => {
        const store = useContractStore()
        const ranges: Range[] = [
            { start: 1, end: 10 },
            { start: 20, end: 30 }
        ]
        const ticket = 5
        expect(store.isWinner(ticket, ranges)).toBe(true)
    })

    it('return false if the ticket is not within any range', () => {
        const store = useContractStore()
        const ranges: Range[] = [
            { start: 1, end: 10 },
            { start: 20, end: 30 }
        ]
        const ticket = 15
        expect(store.isWinner(ticket, ranges)).toBe(false)
    })

    it('return false if the ticket is exactly at the end of a range', () => {
        const store = useContractStore()
        const ranges: Range[] = [
            { start: 1, end: 10 },
            { start: 20, end: 30 }
        ]
        const ticket = 10
        expect(store.isWinner(ticket, ranges)).toBe(false)
    })

    it('return true if the ticket is at the start of a range', () => {
        const store = useContractStore()
        const ranges: Range[] = [
            { start: 1, end: 10 },
            { start: 10, end: 30 }
        ]
        const ticket = 10
        expect(store.isWinner(ticket, ranges)).toBe(true)
    })

    it('return false if the ranges are empty', () => {
        const store = useContractStore()
        const ranges: Range[] = []
        const ticket = 5
        expect(store.isWinner(ticket, ranges)).toBe(false)
    })
})

import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit"
import { AppDispatch } from "./rootStore"
import axios from "axios"
import { setIdle, setPending } from "./utility"

export interface PokedexEntry {
    name: string,
    url: string
}

export interface Pokedex {
    entries: Record<string,PokedexEntry>,
    entryIds: string[],
    hasMore: boolean,
    limit: number,
    offset: number,
    loading: 'pending' | 'idle'
}

const initialState : Pokedex = {
    entries: {},
    entryIds: [],
    hasMore: true,
    limit: 40,
    offset: 0,
    loading: 'idle'
}

export const pokedexSlice = createSlice({
    name: 'pokedex',
    initialState,
    reducers: {
        resetState(state) {
            state = initialState
        },
        entriesLoading(state) {
            setPending(state)
        },
        entriesReceived(state, action) {
            console.debug('entriesReceived')
            setIdle(state)
            const { payload : {count, results} } = action
            results.forEach((entry: PokedexEntry) => {
                if (!state.entries[entry.name]) {
                    state.entries[entry.name] = entry
                    state.entryIds.push(entry.name)
                }
            })
            state.hasMore = count > state.entryIds.length
            state.offset = state.offset + state.limit
            console.debug(`hasMore: ${state.hasMore}`)
            console.debug(`offset: ${state.offset}`)
        }
    }
})

const { resetState, entriesLoading, entriesReceived } = pokedexSlice.actions

export const fetchPokedexEntries = (limit: number, offset: number) => async (appDispatch: AppDispatch) => {
    console.debug('fetchPokedexEntries')
    appDispatch(entriesLoading())
    const response = await axios({method: 'GET', url: `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`})
    const { status, data } = response
    if (status === 200) {
        appDispatch(entriesReceived(data))
    } else {
        console.error(`ERROR (${status}): `, response)
        appDispatch(entriesReceived(data))
    }
}

export const refreshPokedexEntries = () => async (appDispatch: AppDispatch) => {
    appDispatch(resetState())
    const { limit, offset } = initialState
    appDispatch(fetchPokedexEntries(limit, offset))

}

const selectSelf = (state: Pokedex) => state
export const selectPokedexEntries = createDraftSafeSelector(selectSelf, (state) => state.entryIds.map((id) => state.entries[id]))
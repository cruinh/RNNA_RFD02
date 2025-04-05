import { createSlice } from "@reduxjs/toolkit";
import { setIdle, setPending } from "./utility";
import { AppDispatch } from "./rootStore";
import axios from "axios";

export interface Pokemon {
    name?: string,
    url?: string,
    id?: number,
    species: {
        name?: string,
        url?: string,
        flavor_text_entries?: [{
            flavor_text: string
        }],
        displayFlavorIndex: number
    },
    sprites?: {
        front_default: string,
        back_default: string,
        front_shiny: string,
        back_shiny: string,
        front_female: string,
        back_female: string,
        front_shiny_female: string,
        back_shiny_female: string
    },
    loading: 'pending' | 'idle'
}

const initialState: Pokemon = {
    loading: 'idle',
    species: {
        displayFlavorIndex: 0
    }
}

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState,
    reducers: {
        resetState(state) {
            state = initialState
        },
        updateUrl(state, action) {
            state.url = action.payload
        },
        detailsLoading(state) {
            setPending(state)
        },
        detailsReceived(state, action) {
            setIdle(state)
            const { payload } = action
            console.debug('DETAILS RECEIVED: ', payload)
            Object.assign(state, payload)
            state.species.displayFlavorIndex = 0
        },
        incrementDisplayedFlavorText(state) {
            let next = state.species.displayFlavorIndex + 1
            let max = state.species.flavor_text_entries?.length || 0
            state.species.displayFlavorIndex = next >= max ? 0 : next
        },
        speciesLoading(state) {
            setPending(state)
        },
        speciesReceived(state, action) {
            setIdle(state)
            const { payload } = action
            state.species.flavor_text_entries = payload.flavor_text_entries
        }
    }
})

const { updateUrl, detailsLoading, detailsReceived, speciesLoading, speciesReceived } = pokemonSlice.actions
export const { resetState: resetPokemon, incrementDisplayedFlavorText } = pokemonSlice.actions

export const fetchPokemonDetails = (url: string) => async (appDispatch: AppDispatch) => {
    appDispatch(detailsLoading())
    const pokemonResult = await axios({method: 'GET', url })
    const { status, data } = pokemonResult
    if (status === 200) {
        appDispatch(updateUrl(url))
        appDispatch(detailsReceived(data))

        const { species: {url: speciesUrl} } = data
        appDispatch(speciesLoading())
        const speciesResult = await axios({method: 'GET', url: speciesUrl})

        const { status: speciesStatus, data: speciesData} = speciesResult
        if (speciesStatus === 200) {
            appDispatch(speciesReceived(speciesData))
        } else {
            console.error(`ERROR: (${speciesStatus}): `, speciesResult)
            appDispatch(speciesReceived({}))
        }
    } else {
        console.error(`ERROR: (${status}): `, pokemonResult)
        appDispatch(detailsReceived({}))
    }
}
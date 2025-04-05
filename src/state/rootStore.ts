import { configureStore } from "@reduxjs/toolkit"; 
import { pokedexSlice } from "./pokedexSlice";
import { useDispatch, useSelector } from "react-redux";
import { pokemonSlice } from "./pokemonSlice";

export const rootStore = configureStore({
    reducer: {
        pokedex: pokedexSlice.reducer,
        pokemon: pokemonSlice.reducer
    }
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
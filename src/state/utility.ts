export interface MutableSlice {
    loading: 'idle' | 'pending'
}

export const setIdle = <T extends MutableSlice>(state: T) => {
    if (state.loading != 'idle') {
        state.loading = 'idle'
    }
}

export const setPending = <T extends MutableSlice>(state: T) => {
    if (state.loading != 'pending') {
        state.loading = 'pending'
    }
}
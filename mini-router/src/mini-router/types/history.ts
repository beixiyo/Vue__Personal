import type { HistoryState } from 'vue-router'


export type HistoryLocation = string

export interface NavigationCallback {
    (to: HistoryLocation, from: HistoryLocation, information: any): void
}

export interface RouterHistory {
    readonly location: {
        value: string
    }
    push(to: HistoryLocation, data?: HistoryState): void
    replace(to: HistoryLocation, data?: HistoryState): void
    readonly state: HistoryState
    listen(callback: NavigationCallback): void
}

export interface StateEntry extends HistoryState {
    back: HistoryLocation | null
    current: HistoryLocation
    forward: HistoryLocation | null
    position: number
    replace: boolean
}

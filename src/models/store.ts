import {defineStore} from "pinia";
import unpopulated_civs from "../civilizations.json";
import {Civ} from "./civ.ts";
import {CivData} from "./civ_data.ts";

function load_civs() {
    const civs: Array<Civ> = []

    for (let unpopulated_civ of unpopulated_civs.civilizations.reverse()) {
        civs.push(
            new Civ({
                name: unpopulated_civ.name,
                expansion: unpopulated_civ.expansion,
                focuses: unpopulated_civ.focuses,
            })
        )
    }
    return civs
}

function populate_civ_data(civilizations: Array<Civ>): Array<CivData> {
    const civsData: Array<CivData> = []
    civilizations.forEach((civ) => civsData.push(new CivData(civ)))
    return civsData
}

export const useStore = defineStore('main', {
    actions: {},
    state: () => {
        return {
            cookiesConfirmed: false,
            hasCelebrated: false,
            allow_played_civs: false,
            civilizations: load_civs(),
            civ_session_data: populate_civ_data(load_civs()),
            random_civs: [] as Array<Civ>,
            theme: 'viva-light' as string
        }
    },
    persist: true,
})
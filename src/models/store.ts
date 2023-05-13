import {defineStore} from "pinia";
import {CivSession} from "./civ_session.ts";
import unpopulated_civs from "../civilizations.json";
import {Civ} from "./civ.ts";

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

function populate_session(civilizations: Array<Civ>) {
    const civs: Array<Civ> = []
    civilizations.forEach((civ) => civs.push(civ))
    return new CivSession(civs, [])
}

export const useStore = defineStore('main', {
    actions: {},
    state: () => {
        return {
            cookiesConfirmed: false,
            civilizations: load_civs(),
            civ_session: populate_session(load_civs()),
            random_civs: [] as Array<Civ>,
            theme: 'viva-light' as string
        }
    },
    persist: true,
})
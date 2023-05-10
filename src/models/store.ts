import {defineStore} from "pinia";
import {CivSession} from "./civ_session.ts";
import unpopulated_civs from "../civilizations.json";
import {Civ} from "./civ.ts";

function populate_civs() {
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
    const civs: Array<string> = []
    civilizations.forEach((civ) => civs.push(civ.name))
    return new CivSession(civs, [])
}

export const useStore = defineStore('main', {
    actions: {},
    state: () => {
        return {
            civilizations: populate_civs(),
            civ_session: populate_session(populate_civs()),
            random_civs: [] as Array<string>,
        }
    },
    persist: true,
})
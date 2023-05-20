import { defineStore } from "pinia";
import { Civ } from "./civ.ts";
import { CivData } from "./civ_data.ts";

function load_civs(unpopulated_civs: Array<any>) {

    const civs: Array<Civ> = []

    for (let unpopulated_civ of unpopulated_civs.reverse()) {
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

export const main_store = defineStore("main", {
    actions: {},
    state: () => {
        return {
            cookiesConfirmed: false,
            hasCelebrated: false,
            game: "aoe2" as "aoe2" | "aoe1",
            allow_played_civs: false,
            random_civs: [] as Array<Civ>,
            theme: 'viva-light' as string
        }
    },
    persist: true,
});

export function civ_grid_store(civ_name: "aoe2" | "aoe1", civs: Array<any>) {
    return defineStore(civ_name, {
        actions: {},
        state: () => {
            return {
                hasCelebrated: false,
                allow_played_civs: false,
                accordionActiveIndex: -1,
                civilizations: load_civs(civs),
                civ_session_data: populate_civ_data(load_civs(civs)),
                random_civs: [] as Array<Civ>,
                theme: 'viva-light' as string
            }
        },
        persist: true,
    })();
}

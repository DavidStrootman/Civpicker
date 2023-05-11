import {Civ} from "./civ.ts";

export class CivSession {
    public selected_civs: Array<Civ>
    public played_civs: Array<string>
    static selected_civs: Array<string>;

    constructor(selected_civs: Array<Civ>, played_civs: Array<string>) {
        this.selected_civs = selected_civs;
        this.played_civs = played_civs;
    }
}
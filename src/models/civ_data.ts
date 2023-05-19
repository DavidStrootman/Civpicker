import {Civ} from "./civ.ts";

export class CivData {
    public civ: Civ
    public selected: boolean
    public played: boolean

    constructor(civ: Civ) {
        this.civ = civ;
        this.selected = false;
        this.played = false;
    }
}
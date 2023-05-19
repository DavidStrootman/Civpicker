import {Civ} from "./civ.ts";

export class CivData {
    public civ: Civ
    public selected: boolean
    public visible: boolean
    public played: boolean

    constructor(civ: Civ) {
        this.civ = civ;
        this.selected = true;
        this.visible = true;
        this.played = false;
    }
}
export class CivSession {
    public selected_civs: Array<string>
    public played_civs: Array<string>
    static selected_civs: Array<string>;

    constructor(selected_civs: Array<string>, played_civs: Array<string>) {
        this.selected_civs = selected_civs;
        this.played_civs = played_civs;
    }
}
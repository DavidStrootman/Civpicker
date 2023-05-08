export interface CivParams {
    civ_bonuses?: string;
    expansion?: string;
    focuses?: Array<string>;
    name?: string;
    team_bonus?: string;
    team_unit?: string;
    unique_tech_castle?: string;
    unique_tech_castle_effect?: string;
    unique_tech_imperial?: string;
    unique_tech_imperial_effect?: string;
    unique_unit?: string;
}

export class Civ {
    readonly civ_bonuses: string
    readonly expansion: string
    readonly focuses: Array<string>
    readonly name: string
    readonly team_bonus: string
    readonly team_unit: string
    readonly unique_tech_castle: string
    readonly unique_tech_castle_effect: string
    readonly unique_tech_imperial: string
    readonly unique_tech_imperial_effect: string
    readonly unique_unit: string

    constructor(params: CivParams) {
        this.civ_bonuses = params.civ_bonuses || "";
        this.expansion = params.expansion || "";
        this.focuses = params.focuses || new Array<string>();
        this.name = params.name || "";
        this.team_bonus = params.team_bonus || "";
        this.team_unit = params.team_unit || "";
        this.unique_tech_castle = params.unique_tech_castle || "";
        this.unique_tech_castle_effect = params.unique_tech_castle_effect || "";
        this.unique_tech_imperial = params.unique_tech_imperial || "";
        this.unique_tech_imperial_effect = params.unique_tech_imperial_effect || "";
        this.unique_unit = params.unique_unit || "";
    }
}

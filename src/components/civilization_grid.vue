<script lang="ts">

import '../assets/styles/civilizations.css'
// @ts-ignore
import confetti from "canvas-confetti/src/confetti.js"

import 'primeicons/primeicons.css'
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Checkbox from "primevue/checkbox";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Toolbar from "primevue/toolbar";
import Card from "primevue/card";
import Message from "primevue/message";
import { civ_grid_store } from "../models/store.ts";
import { CivData } from "../models/civ_data"
import { Civ } from "../models/civ"
import { PropType } from 'vue';


function fuzzy_filter(target: string, filter: string) {
    var hay = target.toLowerCase(), i = 0, n = -1, l;
    filter = filter.toLowerCase();
    for (; l = filter[i++];) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
}
// TODO: add an animation for when all civs have been played.
// TODO: add overlayPanel and/or dynamicDialog for civs with information on the civ.
export default {
    name: "civilization_grid",
    components: {
        DataView,
        DataViewLayoutOptions,
        Checkbox,
        InputSwitch,
        InputText,
        InputNumber,
        Slider,
        Accordion,
        AccordionTab,
        Toolbar,
        Card,
        Message,
    },
    props: {
        game_name: {
            required: true,
            type: String as PropType<"aoe1" | "aoe2">,
        },
        unpopulated_civs: {
            required: true,
            type: Array<any>,
        },
        expansions: {
            required: true,
            type: Object,
        },
        focuses: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            store: civ_grid_store(this.game_name, this.unpopulated_civs),
            random_count: 1,
            filter: "",
            accordionActiveIndex: -1,
            activeTab: 0,
            resetClicked: false
        }
    },
    beforeMount() {
        this.filter_civs_by_name()
    },
    methods: {
        filter_civs_by_name() {
            // Filter civs by name.
            for (const civ_data of this.store.civ_session_data) {
                civ_data.visible = fuzzy_filter(civ_data.civ.name, this.filter)
            }
        },
        generate_random_civs() {
            this.store.random_civs = []

            let selected_civs = this.store.civ_session_data.filter((civ: CivData) => civ.selected)

            if (!this.store.allow_played_civs) {
                selected_civs = selected_civs.filter((civ: CivData) => !civ.played)
            }

            if (selected_civs.length != 0) {
                for (let i = 0; i < this.random_count; ++i) {
                    this.store.random_civs.push(selected_civs[Math.floor(Math.random() * selected_civs.length)].civ);
                }
            }
        },
        toggle_accordion() {
            this.accordionActiveIndex = this.accordionActiveIndex === 0 ? -1 : 0;
        },
        selectAll() {
            // Set all civs that are visible through the filter to selected.
            this.store.civ_session_data.filter((civData: CivData) => civData.visible).forEach((civData: CivData) => civData.selected = true);
        },
        deselectAll() {
            // Set all civs that are visible through the filter to unselected.
            this.store.civ_session_data.filter((civData: CivData) => civData.visible).forEach((civData: CivData) => civData.selected = false);
        },
        toggleFocus(focus: string) {
            const civs = this.store.civ_session_data.filter((civData: CivData) => civData.civ.focuses.includes(focus));
            const allSelected = civs.every((civData: CivData) => civData.selected);
            civs.forEach((civData: CivData) => civData.selected = !allSelected);
        },
        toggleExpansion(expansion: string) {
            const civs = this.store.civ_session_data.filter((civData: CivData) => civData.civ.expansion === expansion);
            const allSelected = civs.every((civData: CivData) => civData.selected);
            civs.forEach((civData: CivData) => civData.selected = !allSelected);
        },
        toggleSelected(data: CivData) {
            // Toggle the selected state of the civ.
            data.selected = !data.selected;
        },
        togglePlayed(data: CivData) {
            // Toggle the played state of the civ.
            data.played = !data.played;
        },
        resetButtonClick() {
            if (!this.resetClicked) {
                this.resetClicked = true;
                return
            }
            else {
                this.resetClicked = false;
                this.store.$reset();
                this.accordionActiveIndex = -1;
            }
        },

        celebrate() {
            var count = 200;
            var defaults = {
                origin: { y: 0.9 }
            };

            function fire(particleRatio: number, opts: object) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    },
    computed: {
        randomSelectedCivDatas() {
            const { civ_session_data, random_civs } = this.store;
            let out_civs: Array<CivData> = [];
            random_civs.forEach((civ: Civ) => {
                const civData = civ_session_data.find((civData: CivData) => civData.civ.name === civ.name);
                if (civData) {
                    out_civs.push(civData);
                }
            });
            return out_civs;
        },
        civCardClass() {
            return (data: CivData) => {
                return {
                    'civ-card-active': data.selected,
                    'surface-card': !data.selected
                };
            };
        },
        playedClass() {
            return (data: CivData) => {
                return {
                    'bg-primary': data.played,
                    'text-color-primary': data.played,
                    'surface-hover': !data.played,
                    'text-color-secondary': !data.played,
                };
            };
        },
        playedButtonClass() {
            return (data: CivData) => {
                return {
                    'pi-play': !data.played,
                    'pi-undo': data.played,
                }
            }
        },
        playButtonTooltip() {
            return (played: boolean) => {
                return played ? 'Undo' : 'Play';
            }
        },
        expansionButtonClass() {
            return (expansion: string) => {
                const civs = this.store.civ_session_data.filter((civData: CivData) => civData.civ.expansion === expansion);
                const allSelected = civs.every((civData: CivData) => civData.selected);
                return {
                    'bg-primary': allSelected,
                    'surface-card': !allSelected
                }
            }
        },
        focusButtonClass() {
            return (filter: string) => {
                const civs = this.store.civ_session_data.filter((civData: CivData) => civData.civ.focuses.includes(filter));
                const allSelected = civs.every((civData: CivData) => civData.selected);
                return {
                    'bg-primary': allSelected,
                    'surface-card': !allSelected
                }
            }
        },
        resetLabel() {
            return this.resetClicked ? 'Are you sure?' : 'Reset';
        },
        allCivsPlayed() {
            if (this.store.hasCelebrated) return false;
            if (this.store.civ_session_data.every(civData => civData.played)) {
                this.celebrate();
                this.store.hasCelebrated = true;

                return true;
            }
            return false;
        },
    }
}
</script>


<template>
    <div v-if="allCivsPlayed" class="absolute w-full z-2 bottom-0 left-0 mb-3">
        <div class="flex flex-row justify-content-center align-items-center">
            <Message class="w-30rem m-4 border-1 bg-secondary" severity="success" icon="pi pi-heart">
                You've played all {{ store.civ_session_data.length }} Civilizations!</Message>
        </div>
    </div>
    <div
        class="flex flex-row flex-wrap w-full relative mb-3 sm:justify-content-center xl:justify-content-start border-round top-0 left-0 bg-primary">
        <div class="surface-card relative border-round m-2" v-for="[key, civData] of randomSelectedCivDatas.entries()">
            <div class="flex p-1 h-full gap-2 justify-content-between align-content-center align-items-center">
                <div v-tooltip.bottom="playButtonTooltip(civData.played)">
                    <Button @click="togglePlayed(civData)" text>
                        <i class="pi" :class="playedButtonClass(civData)"></i>
                    </Button>
                </div>
                <div class="flex gap-2 align-items-center bg-secondary">
                    <img class="max-w-2rem" :src="`./images/civilizations/CivIcon-${civData.civ.name}.webp`"
                        :alt="civData.civ.name" :title="civData.civ.name" />
                    <div class="font-normal text-color-secondary">{{ key + 1 }}: {{ civData.civ.name }}</div>
                </div>
                <div class="flex w-align-items-center" v-if="civData.civ.focuses.length > 0">
                    <Button size="small" class="h-2rem w-1rem" plain icon="pi pi-info-circle" text aria-label="Filter" />
                </div>
            </div>
        </div>
        <!-- TODO: Remove absolute positioning and use flexbox to align the button to the right by wrapping the random civs in a div. -->
        <div v-if="store.random_civs.length > 0" class="absolute right-0 mr-1 mt-1">
            <Button @click="store.random_civs = []" icon="pi pi-times" style="color: var(--primary-color-text);" text
                rounded aria-label="Cancel" />
        </div>
    </div>

    <Toolbar class="surface-primary flex-column md:flex-row border-0 border-none"
        style="border-bottom-right-radius:0; border-bottom-left-radius:0;">
        <template #start>
            <div class="flex flex-wrap align-items-center gap-3">
                <Button label="Random Civ" @click="generate_random_civs()" v-on:click.stop />
                <Slider v-model="random_count" :step="1" :min="1" :max="8" class="ml-2 w-14rem hidden md:block" />
                <InputNumber v-model.number="random_count" buttonLayout="vertical"
                    style="flex-direction: column; width: 3rem" decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus" :min="1" :max="8" v-on:click.stop />
                <div class="flex w-min">
                    <div class="flex w-12rem">
                        <span class="p-input-icon-left" v-on:click.stop>
                            <i class="pi pi-search" />
                            <InputText class="w-full" v-model="filter" @update:modelValue="filter_civs_by_name()"
                                placeholder="Filter by name" v-on:keydown.stop />
                        </span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button outlined label="Select None" @click="deselectAll()" v-on:click.stop />
                    <Button outlined label="Select All" @click="selectAll()" v-on:click.stop />
                </div>
            </div>
        </template>

        <template #end>
            <div class="flex py-2 lg:py-0 align-items-center">
                <Button @click="toggle_accordion()" icon-pos="right" label="Filters and Options" severity="help"
                    icon="pi pi-filter" text />
            </div>
        </template>
    </Toolbar>
    <Accordion v-model:activeIndex="accordionActiveIndex" expandIcon="pi pi-angle-left">
        <AccordionTab :pt="{
            headerAction: { class: 'flex-row-reverse hidden' },
            content: {
                class: 'border-none',
                style: 'border-bottom-right-radius:0;border-bottom-left-radius:0;'
            }
        }">
            <div class="flex flex-column md:flex-row flex-wrap justify-content-between gap-5 mx-4">
                <div class="flex-1">
                    <p>Focuses</p>
                    <div class="flex flex-row flex-wrap gap-3">
                        <template v-for="{ name } of focuses.focuses">
                            <div>
                                <Button @click="toggleFocus(name)"
                                    class="flex border-round shadow-1 border-none w-4rem h-4rem align-items-center justify-content-center"
                                    :class="focusButtonClass(name)">
                                    <img class="border-round h-3rem w-3rem" :src="`./images/focuses/${name}.webp`"
                                        :alt="name" v-tooltip.bottom="name" />
                                </Button>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="flex-1">
                    <p>Expansions</p>
                    <div class="flex flex-row flex-wrap gap-3">
                        <template v-for="{ name } of expansions.expansions">
                            <div>
                                <Button @click="toggleExpansion(name)"
                                    class="flex border-round shadow-1 border-none w-4rem h-4rem align-items-center justify-content-center"
                                    :class="expansionButtonClass(name)">
                                    <img class="border-round h-3rem w-3rem"
                                        :src="`./images/expansions/${name.replace(/ /g, '_')}.webp`" :alt="name"
                                        v-tooltip.bottom="name" />
                                </Button>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="flex-2 lg:flex-1 surface-hover border-round p-4 justify-content-center">
                    <div>
                        <p class="text-xl font-bold m-0">Options</p>
                        <div class="flex flex-row flex-wrap gap-5">
                            <div class="flex flex-1 flex-column">
                                <p>Allow Generating Previously Played Civs</p>
                                <InputSwitch v-model="store.allow_played_civs" />
                            </div>
                            <div class="flex flex-1 flex-column">
                                <p>Reset All Settings</p>
                                <Button @click="resetButtonClick()" icon="pi pi-refresh"
                                    :severity="!resetClicked ? 'primary' : 'danger'" :label="resetLabel" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccordionTab>
    </Accordion>

    <Card class="overflow-y-scroll h-max border-none shadow-none" style="border-radius: 0;" :pt="{
        body: { class: 'py-0' },
        content: { class: 'py-0' }
    }">
        <template #content>
            <DataView :dataKey="undefined" :value="store.civ_session_data" :layout="'grid'">
                <template class="border-round" #grid="{ data }: { data: CivData }">
                    <div v-if="data.visible" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                        <div @click="toggleSelected(data)" :class="civCardClass(data)"
                            class="border-1 relative h-7rem surface-border border-round no-text-select"
                            style="cursor: pointer">
                            <div class="flex absolute left-0 top-0" v-on:click="$event.stopPropagation()">
                                <Checkbox :ref="`checkbox_${data.civ.name}`" v-model="data.selected" :binary="true"
                                    :inputClass="['border-top-none', 'border-left-none', 'border-right-1', 'border-bottom-1']"
                                    :inputStyle="{ 'border-radius': 'var(--border-radius) 0 var(--border-radius) 0' }" />
                            </div>

                            <div @click="togglePlayed(data); $event.stopPropagation();" :class="playedClass(data)"
                                class="flex absolute right-0 top-0 px-3 gap-2 align-content-center justify-content-center"
                                style="padding-top: 0.1rem; padding-bottom: 0.1rem; font-size: 0.7rem; border-radius: 0 var(--border-radius) 0 var(--border-radius); outline: 1px solid var(--surface-border)">
                                <div v-tooltip.bottom="playButtonTooltip(data.played)">
                                    <i class="pi" :class="playedButtonClass(data)" style="font-size: 0.7rem;"></i>
                                </div>
                                <p class="m-0 no-text-select"><template v-if="!data.played">Play</template><template
                                        v-if="data.played">Played</template></p>
                            </div>

                            <div class="flex align-content-center justify-content-center surface-hover w-3rem absolute left-0 bottom-0 p-1"
                                style="border-radius: 0 var(--border-radius) 0 var(--border-radius); outline: 1px solid var(--surface-border) "
                                v-tooltip.bottom="data.civ.expansion">
                                <div class="flex">
                                    <img class="text-300 w-1rem" style="font-size: 0.8rem"
                                        :src="`./images/expansions/${data.civ.expansion.replace(/ /g, '_')}.webp`"
                                        :alt="data.civ.expansion" draggable="false" />
                                </div>
                            </div>

                            <div
                                class="flex pl-1 md:pl-2 lg:pl-3 xl:pl-3 pr-3 h-full justify-content-between gap-1 align-content-center align-items-center">
                                <div class="flex gap-2 align-items-center">
                                    <img class="max-w-2rem"
                                        :src="`./images/civilizations/CivIcon-${data.civ.name.replace(/ /g, '_')}.webp`"
                                        :alt="data.civ.name" :title="data.civ.name" draggable="false" />
                                    <div class="text-lg font-bold">{{ data.civ.name }}</div>
                                </div>
                                <div class="flex gap-2 max-w-2rem p-1 -m-1 mr-1 flex-column"
                                    v-if="data.civ.focuses.length > 0">
                                    <template v-for="focus of data.civ.focuses">
                                        <img class="border-round shadow-4" :src="`./images/focuses/${focus}.webp`"
                                            :alt="focus" v-tooltip.right="focus" draggable="false" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </template>
    </Card>
    <div class="h-2rem surface-card" style="border-radius: 0 0 var(--border-radius) var(--border-radius)"></div>
</template>

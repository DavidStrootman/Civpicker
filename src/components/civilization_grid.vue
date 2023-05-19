<script lang="ts">
import unpopulated_civs from "../civilizations.json"
import expansions from "../expansions.json"
import focuses from "../focuses.json"
import '../assets/styles/civilizations.css'
import 'primeicons/primeicons.css'
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Toolbar from "primevue/toolbar";
import Card from "primevue/card";
import { useStore } from "../models/store.ts";
import { CivData } from "../models/civ_data"


function fuzzy_filter(target: string, filter: string) {
    var hay = target.toLowerCase(), i = 0, n = -1, l;
    filter = filter.toLowerCase();
    for (; l = filter[i++];) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
}

// TODO: add overlayPanel and/or dynamicDialog for civs with information on the civ
export default {
    name: "civilization_grid",
    components: {
        DataView,
        DataViewLayoutOptions,
        Checkbox,
        InputText,
        InputNumber,
        Slider,
        Accordion,
        AccordionTab,
        Toolbar,
        Card,
    },
    data() {
        return {
            // TODO: Create session in App.vue and pass it to this component.
            store: useStore(),
            unpopulated_civs,
            expansions,
            focuses,
            random_count: 1,
            filter: "",
            accordionActiveIndex: -1,
            activeTab: 0
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

            const selected_civs = this.store.civ_session_data.filter((civ: CivData) => civ.selected)

            if (selected_civs.length != 0) {
                for (let i = 0; i < this.random_count; ++i) {
                    this.store.random_civs.push(selected_civs[Math.floor(Math.random() * selected_civs.length)].civ);
                }
            }
        },
        toggle_accordion() {
            this.accordionActiveIndex = this.accordionActiveIndex === 0 ? -1 : 0;
        },
        deselectAll() {
            // Set all civs that are visible through the filter to unselected.
            this.store.civ_session_data.filter((civ: CivData) => civ.visible).forEach((civ: CivData) => civ.selected = false);
        },
        selectAll() {
            // Set all civs that are visible through the filter to selected.
            this.store.civ_session_data.filter((civ: CivData) => civ.visible).forEach((civ: CivData) => civ.selected = true);
        },
        toggleSelected(data: CivData) {
            // Toggle the selected state of the civ.
            data.selected = !data.selected;
        }
    },
    computed: {
        civClass() {
            return (data: CivData) => {
                return {
                    'surface-hover': data.selected,
                    'surface-card': !data.selected
                };
            };
        }
    }
}


</script>


<template>
    <div 
        class="flex flex-row flex-wrap w-full relative mb-3 sm:justify-content-center xl:justify-content-start border-round top-0 left-0 bg-primary">
        <div class="surface-card w-15rem relative border-round m-2" v-for="[key, civ] of store.random_civs.entries()">
            <div class="flex p-1 h-full gap-1 justify-content-between align-content-center align-items-center">
                <div class="flex gap-2 align-items-center bg-secondary">
                    <img class="max-w-2rem" :src="`./images/civilizations/CivIcon-${civ.name}.webp`" :alt="civ.name"
                        :title="civ.name" />
                    <div class="font-normal text-color-secondary">{{ key + 1 }}: {{ civ.name }}</div>
                </div>
                <div class="flex w-align-items-center" v-if="civ.focuses.length > 0">
                    <Button size="small" class="h-2rem w-1rem" plain icon="pi pi-info-circle" text aria-label="Filter" />
                </div>
            </div>
        </div>
        <!-- TODO: Remove absolute positioning and use flexbox to align the button to the right by wrapping the random civs in a div. -->
        <div v-if="store.random_civs.length >0" class="absolute right-0 mr-1 mt-1">
            <Button @click="store.random_civs = []" icon="pi pi-times" style="color: var(--primary-color-text);" text rounded aria-label="Cancel" />
        </div>
    </div>


    <Toolbar class="surface-primary border-0 border-none"
        style="border-bottom-right-radius:0; border-bottom-left-radius:0;">
        <template #start>
            <div class="flex align-items-center gap-3">
                <Button label="Random Civ" @click="generate_random_civs()" v-on:click.stop />
                <Slider v-model="random_count" :step="1" :min="1" :max="8" class="ml-2 w-14rem" />
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
                <div>
                    <span class="p-buttonset">
                        <Button outlined label="Select None" @click="deselectAll()" v-on:click.stop />
                        <Button outlined label="Select All" @click="selectAll()" v-on:click.stop />
                    </span>

                </div>
            </div>
        </template>

        <template #end>
            <div class="flex align-items-center">
                <Button @click="toggle_accordion()" icon-pos="right" label="Filters" severity="help" icon="pi pi-filter"
                    text />
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
            <div class="flex mx-4">
                <div class="w-full justify-content-center">
                    <div>
                        <p>Focuses</p>
                        <div class="grid w-28rem h-12rem">
                            <template v-for="focus of focuses.focuses">
                                <div class="col-2">
                                    <div
                                        class="flex bg-primary border-round w-4rem h-4rem align-items-center justify-content-center">
                                        <img class="border-round shadow-4 h-3rem w-3rem"
                                            :src="`./images/focuses/${focus.name}.webp`" :alt="focus.name"
                                            v-tooltip.bottom="focus.name" />
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="w-full justify-content-center">
                    <div>
                        <p>Expansions</p>
                        <div class="grid w-28rem h-12rem">
                            <template v-for="expansion of expansions.expansions">
                                <div class="col-2">
                                    <div
                                        class="flex bg-primary border-round w-4rem h-4rem align-items-center justify-content-center">
                                        <img class="border-round shadow-4 h-3rem w-3rem"
                                            :src="`./images/expansions/${expansion.name.replace(/ /g, '_')}.webp`"
                                            :alt="expansion.name" v-tooltip.bottom="expansion.name" />
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </AccordionTab>
    </Accordion>

    <Card class="overflow-y-scroll h-max border-none shadow-none" style="border-radius: 0; scrollbar-width: none;" :pt="{
        body: { class: 'py-0' },
        content: { class: 'py-0' }
    }">
        <template #content>
            <DataView :dataKey="undefined" :value="store.civ_session_data" :layout="'grid'">
                <template class="border-round" #grid="{ data }: { data: CivData }">
                    <div v-if="data.visible" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                        <div @click="toggleSelected(data)" :class="civClass(data)"
                            class="border-1 relative h-7rem surface-border border-round" style="cursor: pointer">
                            <div class="flex absolute left-0 top-0" v-on:click="$event.stopPropagation()">
                                <Checkbox :ref="`checkbox_${data.civ.name}`" v-model="data.selected" :binary="true"
                                    :inputClass="['border-top-none', 'border-left-none', 'border-right-1', 'border-bottom-1']"
                                    :inputStyle="{ 'border-radius': ' var(--border-radius) 0 var(--border-radius) 0' }" />
                            </div>

                            <div class="flex align-content-center justify-content-center surface-hover w-3rem absolute left-0 bottom-0 p-1"
                                style="border-radius: 0 var(--border-radius) 0 var(--border-radius); outline: 1px solid var(--surface-border) "
                                v-tooltip.bottom="data.civ.expansion">
                                <div class="flex">
                                    <img class="text-300 w-1rem" style="font-size: 0.8rem"
                                        :src="`./images/expansions/${data.civ.expansion.replace(/ /g, '_')}.webp`"
                                        :alt="data.civ.expansion" />
                                </div>
                            </div>

                            <div
                                class="flex pl-6 pr-3 h-full justify-content-between align-content-center align-items-center">
                                <div class="flex gap-2 align-items-center">
                                    <img class="max-w-2rem" :src="`./images/civilizations/CivIcon-${data.civ.name}.webp`"
                                        :alt="data.civ.name" :title="data.civ.name" />
                                    <div class="text-xl font-bold">{{ data.civ.name }}</div>
                                </div>
                                <div class="flex gap-2 max-w-2rem p-1 -m-1 mr-2 flex-column"
                                    v-if="data.civ.focuses.length > 0">
                                    <template v-for="focus of data.civ.focuses">
                                        <img class="border-round shadow-4" :src="`./images/focuses/${focus}.webp`"
                                            :alt="focus" v-tooltip.right="focus" />
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

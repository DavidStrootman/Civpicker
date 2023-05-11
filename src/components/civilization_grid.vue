<script lang="ts">
import unpopulated_civs from "../civilizations.json"
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
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Card from "primevue/card";
import {useStore} from "../models/store.ts";
import {Civ} from "../models/civ.ts";


function fuzzy_filter(target: string, filter: string) {
    var hay = target.toLowerCase(), i = 0, n = -1, l;
    filter = filter.toLowerCase();
    for (; l = filter[i++];) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
}

// TODO add overlay panel for civs with information on the civ
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
        TabView,
        TabPanel,
        Card,
    },
    data() {
        return {
            // TODO: Create session in App.vue and pass it to this component.
            // TODO: Remember selected and played civs.
            store: useStore(),
            unpopulated_civs,
            focuses,
            random_count: 1,
            filter: "",
            filtered_civs: [] as Array<Civ>,
            accordionActiveIndex: -1,
            activeTab: 0
        }
    },
    beforeMount() {
        this.filter_civs()
    },
    methods: {
        filter_civs() {
            for (const civ of this.store.civilizations) {
                let through_filter: boolean = fuzzy_filter(civ.name, this.filter)
                if (this.filtered_civs.includes(civ)) {
                    !through_filter ? this.filtered_civs.splice(this.filtered_civs.indexOf(civ), 1) : null
                } else {
                    through_filter ? this.filtered_civs.push(civ) : null
                }
            }
        },
        generate_random_civs() {
            this.store.random_civs = []

            if (this.store.civ_session.selected_civs.length != 0) {
                for (let i = 0; i < this.random_count; ++i) {
                    this.store.random_civs.push(this.store.civ_session.selected_civs[Math.floor(Math.random() * this.store.civ_session.selected_civs.length)]);
                }
            }
        },
        toggle_accordion() {
            if (this.accordionActiveIndex == 0) {
                this.accordionActiveIndex = -1
            } else {
                this.accordionActiveIndex = 0
            }
        }
    }
}


</script>


<template>
    <TabView v-model:activeIndex="activeTab" v-if="store.random_civs.length != 0">
        <TabPanel v-for="[key, civ] of store.random_civs.entries()" :key="key" :header="`${key+1}: ${civ.name}`">
            <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div class="surface-hover relative h-7rem">
                    <div class="flex align-content-center justify-content-center surface-hover w-3rem absolute left-0 top-0 p-1"
                         v-tooltip.bottom="civ.expansion">
                        <div class="flex">
                            <img class="text-300 w-1rem"
                                 style="font-size: 0.8rem"
                                 :src="`./images/expansions/${civ.expansion.replace(/ /g,'_')}.webp`"
                                 :alt="civ.expansion"/>
                        </div>
                    </div>
                    <div class="flex pl-6 pr-3 h-full justify-content-between align-content-center align-items-center">
                        <div class="flex gap-2 align-items-center">
                            <img class="max-w-2rem"
                                 :src="`./images/civilizations/CivIcon-${civ.name}.webp`"
                                 :alt="civ.name"
                                 :title="civ.name"/>
                            <div class="text-xl font-bold">{{ civ.name }}</div>
                        </div>
                        <div class="flex gap-2 max-w-2rem p-1 -m-1 mr-2 flex-column"
                             v-if="civ.focuses.length > 0">
                            <template v-for="focus of civ.focuses">
                                <img class="border-round shadow-4"
                                     :src="`./images/focuses/${focus}.webp`"
                                     :alt="focus"
                                     v-tooltip.right="focus"
                                />
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </TabPanel>
    </TabView>
    <Toolbar class="surface-ground border-0 border-none">
        <template #start>
            <div class="flex align-items-center gap-3">
                <Button label="Random Civ"
                        @click="generate_random_civs()"
                        v-on:click.stop/>
                <Slider v-model="random_count" :step="1" :min="1" :max="8" class="ml-2 w-14rem"/>
                <InputNumber v-model.number="random_count" buttonLayout="vertical"
                             style="flex-direction: column; width: 3rem"
                             decrementButtonClassName="p-button-secondary"
                             incrementButtonClassName="p-button-secondary"
                             incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" :min="1"
                             :max="8"
                             v-on:click.stop/>
                <div class="flex w-min">
                    <div class="flex w-12rem">
                        <span class="p-input-icon-left"
                              v-on:click.stop>
                              <i class="pi pi-search"/>
                              <InputText class="w-full" v-model="filter" @update:modelValue="filter_civs()"
                                         placeholder="Filter"
                                         v-on:keydown.stop/>
                        </span>
                    </div>
                </div>
                <div>
                    <span class="p-buttonset">
                        <Button outlined label="Select None"
                                @click="store.civ_session.selected_civs = store.civ_session.selected_civs.filter(civ => !filtered_civs.map(({name}) => name).includes( civ.name ) );"
                                v-on:click.stop/>
                        <Button outlined label="Select All"
                                @click="filtered_civs.forEach(civ => (!store.civ_session.selected_civs.includes(civ)) ? store.civ_session.selected_civs.push(civ) : null)"
                                v-on:click.stop/>
                    </span>

                </div>
            </div>
        </template>

        <template #end>
            <div class="flex align-items-center">
                <Button @click="toggle_accordion()" icon-pos="right" label="Settings" severity="help" icon="pi pi-cog"
                        text/>
            </div>
        </template>
    </Toolbar>
    <Accordion v-model:activeIndex="accordionActiveIndex" expandIcon="pi pi-angle-left">
        <AccordionTab :pt="{headerAction: {class: 'flex-row-reverse hidden'},
                            content: {class: 'surface-ground border-none'}}">
            <div class="flex">
                <template v-for="focus of focuses.focuses">
                    <img class="border-round shadow-4 w-4"
                         :src="`./images/focuses/${focus.name}.webp`"
                         :alt="focus.name"
                         v-tooltip.left="focus.name"/>
                </template>
            </div>
        </AccordionTab>
    </Accordion>
    <Card>
        <template #content>
<!--            {{store.civ_session.selected_civs}}-->
            <DataView :dataKey="undefined" :value="store.civilizations" :layout="'grid'">
                <template class="border-round" #grid="{data}">
                    <div
                         class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
<!--                        TODO: Fix these botched lookups using name on arrays of Civ objects-->
                        <div @click="store.civ_session.selected_civs.map(({name}) => name).includes(data.name) ? store.civ_session.selected_civs.splice(store.civ_session.selected_civs.map(({name}) => name).indexOf(data.name), 1) : store.civ_session.selected_civs.push(data)"
                             v-bind:class="{'surface-hover': store.civ_session.selected_civs.map(({name}) => name).includes(data.name),
                                    'surface-card': !store.civ_session.selected_civs.map(({name}) => name).includes(data.name)}"
                             class="border-1 relative h-7rem surface-border border-round"
                             style="cursor: pointer">
                            <div class="flex absolute left-0 top-0" v-on:click="$event.stopPropagation()">
                                <Checkbox :ref="`checkbox_${data.name}`"
                                          v-model="store.civ_session.selected_civs"
                                          :value="data"
                                          :inputClass="['border-top-none', 'border-left-none','border-right-1', 'border-bottom-1']"
                                          :inputStyle="{'border-radius':' var(--border-radius) 0 var(--border-radius) 0'}"/>
                            </div>

                            <div class="flex align-content-center justify-content-center surface-hover w-3rem absolute left-0 bottom-0 p-1"
                                 style="border-radius: 0 var(--border-radius) 0 var(--border-radius); outline: 1px solid var(--surface-border) "
                                 v-tooltip.bottom="data.expansion">
                                <div class="flex">
                                    <img class="text-300 w-1rem"
                                         style="font-size: 0.8rem"
                                         :src="`./images/expansions/${data.expansion.replace(/ /g,'_')}.webp`"
                                         :alt="data.expansion"/>
                                </div>
                            </div>

                            <div class="flex pl-6 pr-3 h-full justify-content-between align-content-center align-items-center">
                                <div class="flex gap-2 align-items-center">
                                    <img class="max-w-2rem"
                                         :src="`./images/civilizations/CivIcon-${data.name}.webp`"
                                         :alt="data.name"
                                         :title="data.name"/>
                                    <div class="text-xl font-bold">{{ data.name }}</div>
                                </div>
                                <div class="flex gap-2 max-w-2rem p-1 -m-1 mr-2 flex-column"
                                     v-if="data.focuses.length > 0">
                                    <template v-for="focus of data.focuses">
                                        <img class="border-round shadow-4"
                                             :src="`./images/focuses/${focus}.webp`"
                                             :alt="focus"
                                             v-tooltip.right="focus"
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </template>
    </Card>
</template>


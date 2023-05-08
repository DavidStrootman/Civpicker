<script lang="ts">
import unpopulated_civs from "../civilizations.json"
import {Civ} from "../models/civ.ts"
import {CivSession} from "../models/civ_session.ts"
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
            unpopulated_civs,
            civ_session: new CivSession([], []),
            civilizations: [] as Array<Civ>,
            random_civs: [] as Array<string>,
            random_count: 1,
            filter: "",
            filtered_civs: [] as Array<string>,
            accordionActiveIndex: -1,
            activeTab: 0
        }
    },
    beforeMount() {
        const selected_civs: Array<string> = []
        for (let unpopulated_civ of unpopulated_civs.civilizations) {
            this.civilizations.push(
                new Civ({
                    name: unpopulated_civ.name,
                    expansion: unpopulated_civ.expansion,
                    focuses: unpopulated_civ.focuses,
                })
            )
            selected_civs.push(unpopulated_civ.name)
            this.filtered_civs.push(unpopulated_civ.name)
        }
        this.civ_session = new CivSession(selected_civs, [])
        this.filter_civs()
    },
    methods: {
        filter_civs() {
            for (const civ of this.civilizations) {
                let through_filter: boolean = fuzzy_filter(civ.name, this.filter)
                if (this.filtered_civs.includes(civ.name)) {
                    !through_filter ? this.filtered_civs.splice(this.filtered_civs.indexOf(civ.name), 1) : null
                } else {
                    through_filter ? this.filtered_civs.push(civ.name) : null
                }
            }
        },
        generate_random_civs() {
            this.random_civs = []
            if (this.civ_session.selected_civs.length != 0) {
                for (let i = 0; i < this.random_count; ++i) {
                    this.random_civs.push(this.civ_session.selected_civs[Math.floor(Math.random() * this.civ_session.selected_civs.length)]);
                }
            }
        },
        toggle_accordion() {
            if (this.accordionActiveIndex == 0) {
                this.accordionActiveIndex = -1
            } else {
                const audio = new Audio('/sound/vine-boom.mp3');
                audio.play();
                this.accordionActiveIndex = 0
            }
        }
    }
}


</script>


<template>
    <TabView v-model:activeIndex="activeTab" v-if="random_civs.length != 0">
        <TabPanel v-for="civ of random_civs" :key="civ" :header="civ">
            <p>{{ civ }}</p>
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

                <span class="p-input-icon-left"
                      v-on:click.stop>
                          <i class="pi pi-search"/>
                          <InputText v-model="filter" @update:modelValue="filter_civs()" placeholder="Filter"
                                     v-on:keydown.stop/>
                        </span>
                <span class="p-buttonset">
                    <Button outlined label="Select None"

                            @click="civ_session.selected_civs = civ_session.selected_civs.filter(civ => !filtered_civs.includes( civ ) );"
                            v-on:click.stop/>
                    <Button outlined label="Select All"
                            @click="filtered_civs.forEach(civ => (!civ_session.selected_civs.includes(civ)) ? civ_session.selected_civs.push(civ) : null)"
                            v-on:click.stop/>
                </span>
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
            <p>
                Hey
            </p>
        </AccordionTab>
    </Accordion>

    <Card>
        <template #content>
            <DataView :dataKey="undefined" :value="civilizations" :layout="'grid'">
                <template class="border-round" #grid="slotProps">
                    <div v-if="filtered_civs.includes(slotProps.data.name)"
                         class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                        <div @click="($refs[`checkbox_${slotProps.data.name}`] as any).onClick()"
                             v-bind:class="{'surface-hover': civ_session.selected_civs.includes(slotProps.data.name),
                                    'surface-card': !civ_session.selected_civs.includes(slotProps.data.name)}"
                             class="border-1 h-6rem surface-border border-round"
                             style="cursor: pointer">
                            <div class="relative">
                        <span class="text-300 absolute right-0 top-0 pr-2"
                              style="font-size: 0.8rem">{{ slotProps.data.expansion }}</span>
                            </div>
                            <div class="flex p-3 gap-2 h-full align-items-center">
                                <div v-on:click="$event.stopPropagation()">
                                    <Checkbox :ref="`checkbox_${slotProps.data.name}`"
                                              v-model="civ_session.selected_civs"
                                              :value="slotProps.data.name"/>
                                </div>
                                <div class="flex gap-2 max-w-2rem p-1 -m-1 flex-column"
                                     v-if="slotProps.data.focuses.length > 0">
                                    <template v-for="focus of slotProps.data.focuses">
                                        <img class="border-round shadow-4"
                                             :src="`/images/focuses/${focus}.webp`"
                                             :alt="focus"
                                             v-tooltip.left="focus"
                                        />
                                    </template>
                                </div>
                                <img class="max-w-2rem"
                                     :src="`/images/civilizations/CivIcon-${slotProps.data.name}.webp`"
                                     :alt="slotProps.data.name"
                                     :title="slotProps.data.name"
                                />
                                <div class="text-xl font-bold">{{ slotProps.data.name }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </template>
    </Card>
</template>


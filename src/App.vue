<script lang="ts">

import civilization_grid from "./components/civilization_grid.vue";
import Button from "primevue/button";
import aoe2_unpopulated_civs from "./data/aoe2_civilizations.json"
import aoe2_expansions from "./data/aoe2_expansions.json"
import aoe2_focuses from "./data/aoe2_focuses.json"
import aoe1_unpopulated_civs from "./data/aoe1_civilizations.json"
import aoe1_expansions from "./data/aoe1_expansions.json"
import aoe1_focuses from "./data/aoe1_focuses.json"
import { main_store } from "./models/store";

export default {
    name: "App",

    methods: {
        setTheme() {
            // @ts-ignore
            this.$primevue.changeTheme("viva-light", this.store.theme, "light-mode", () => {
            })
        },
        toggleTheme() {
            // TODO: Do this in a non-idiotic way. Also fix the icons toggling based on hardcoded themes.
            let nextTheme = '';
            if (this.store.theme === 'viva-light') nextTheme = 'viva-dark';
            else if (this.store.theme === 'viva-dark') nextTheme = 'viva-light';

            // @ts-ignore
            this.$primevue.changeTheme(this.store.theme, nextTheme, 'light-mode', () => {
            })

            this.store.theme = nextTheme;
        },
        toggleGame() {
            if (this.store.game === 'aoe2') this.store.game = 'aoe1';
            else if (this.store.game === 'aoe1') this.store.game = 'aoe2';
        },

    },
    mounted() {
        this.setTheme()
    },
    components: {
        Button,
        civilization_grid,
    },
    data() {
        return {
            store: main_store(),
            aoe2_unpopulated_civs,
            aoe2_expansions,
            aoe2_focuses,
            aoe1_unpopulated_civs,
            aoe1_expansions,
            aoe1_focuses,
        }
    },
    computed: {
        aoe1ButtonClass() {
            return this.store.game === 'aoe1' ? 'civ-card-active' : 'surface-card';
        },
        aoe2ButtonClass() {
            return this.store.game === 'aoe2' ? 'civ-card-active' : 'surface-card';
        }
    }
};
</script>


<template>
    <!-- <div class="absolute z-2 bottom-0 right-0 mr-6 mb-3" v-if="!store.cookiesConfirmed">
                                                            <Message @close="store.cookiesConfirmed=true" class="w-11 m-4 border-1 bg-secondary" severity="info"
                                                                     icon="pi pi-wrench">This site uses functional cookies</Message>
                                                        </div> -->

    <div class="absolute left-0 top-0 flex flex-column w-8rem ">
        <div @click="store.game = 'aoe2'"
            class="flex justify-content-center align-items-center h-6rem m-3 mb-1 border-round" :class="aoe2ButtonClass"
            style="cursor: pointer">
            <img class="w-full" :src="`./images/games/Age_of_Empires_II.webp`" />
        </div>
        <div @click="store.game = 'aoe1'"
            class="flex justify-content-center align-items-center h-6rem m-3 mt-1 p-2 border-round" :class="aoe1ButtonClass"
            style="cursor: pointer">
            <img class="w-full" :src="`./images/games/Age_of_Empires_I.webp`" style="cursor: pointer" />
        </div>
    </div>
    <div class="flex flex-column app-wrapper w-full h-full justify-content-start">
        <Button ref="theme-toggle" class="absolute mx-6 my-4 right-0 top-0"
            :icon="store.theme === 'viva-light' ? 'pi pi-moon' : 'pi pi-sun'" text rounded aria-label="Theme"
            @click="toggleTheme()" />
        <civilization_grid game_name="aoe2" :unpopulated_civs="aoe2_unpopulated_civs.civilizations"
            :expansions="aoe2_expansions" :focuses="aoe2_focuses" v-if="store.game === 'aoe2'" />
        <civilization_grid game_name="aoe1" :unpopulated_civs="aoe1_unpopulated_civs.civilizations"
            :expansions="aoe1_expansions" :focuses="aoe1_focuses" v-if="store.game === 'aoe1'" />
    </div>
</template>

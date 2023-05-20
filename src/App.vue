<script lang="ts">

import civilization_grid from "./components/civilization_grid.vue";
import Button from "primevue/button";
import Message from "primevue/message";
// @ts-ignore
import confetti from "canvas-confetti/src/confetti.js"
import aoe2_unpopulated_civs from "./aoe2_civilizations.json"
import aoe2_expansions from "./aoe2_expansions.json"
import aoe2_focuses from "./aoe2_focuses.json"
import aoe1_unpopulated_civs from "./aoe1_civilizations.json"
// import aoe1_expansions from "./aoe1_expansions.json"
// import aoe1_focuses from "./aoe1_focuses.json"
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
    mounted() {
        this.setTheme()
    },
    components: {
        Button,
        civilization_grid,
        Message
    },
    data() {
        return {
            store: main_store(),
            aoe2_unpopulated_civs,
            aoe2_expansions,
            aoe2_focuses,
            aoe1_unpopulated_civs,
            aoe1_expansions: [],
            aoe1_focuses: [],
        }
    },
    computed: {
        // TODO: Move this to civilization_grid component.
        // ifAllPlayed() {
        //     if (this.store.hasCelebrated) return false;
        //     if (this.store.civ_session_data.every(civData => civData.played)) {
        //         this.celebrate();
        //         this.store.hasCelebrated = true;

        //         return true;
        //     }
        //     return false;
        // },
        gameButtonLabel() {
            return this.store.game === 'aoe2' ? 'aoe1' : 'aoe2';
        }
    }
};
</script>


<template>
    <!-- <div class="absolute z-2 bottom-0 right-0 mr-6 mb-3" v-if="!store.cookiesConfirmed">
                                            <Message @close="store.cookiesConfirmed=true" class="w-11 m-4 border-1 bg-secondary" severity="info"
                                                     icon="pi pi-wrench">This site uses functional cookies</Message>
                                        </div> -->
    <!-- <div v-if="ifAllPlayed" class="absolute w-full z-2 bottom-0 left-0 mb-3">
        <div class="flex flex-row justify-content-center align-items-center">
            <Message class="w-30rem m-4 border-1 bg-secondary" severity="success" icon="pi pi-heart">Congratulations! You've
                played all {{ store.civ_session_data.length }} Civilizations!</Message>
        </div>
    </div> -->
    <Button @click="toggleGame()" class="absolute left-0 top-0" :label="gameButtonLabel" />
    <div class="flex flex-column app-wrapper w-full h-full justify-content-start">
        <Button ref="theme-toggle" class="absolute mx-6 my-4 right-0 top-0"
            :icon="store.theme === 'viva-light' ? 'pi pi-moon' : 'pi pi-sun'" text rounded aria-label="Theme"
            @click="toggleTheme()" />
        <civilization_grid game_name="aoe2" :unpopulated_civs="aoe2_unpopulated_civs.civilizations" :expansions="aoe2_expansions" :focuses="aoe2_focuses"  v-if="store.game === 'aoe2'" />
        <civilization_grid game_name="aoe1" :unpopulated_civs="aoe1_unpopulated_civs.civilizations" :expansions="aoe1_expansions" :focuses="aoe1_focuses" v-if="store.game === 'aoe1'" />
    </div>
</template>

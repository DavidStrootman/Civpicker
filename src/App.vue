<script lang="ts">

import civilization_grid from "./components/civilization_grid.vue";
import Button from "primevue/button";
import Message from "primevue/message";
import {useStore} from "./models/store.ts";

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
            store: useStore(),
        }
    }
};
</script>


<template>
<!--    <Message severity="info" icon="pi pi-wrench">This site uses functional cookies-->
<!--    </Message>-->
    <div class="flex flex-column app-wrapper w-full h-full justify-content-start">
        <Button ref="theme-toggle" class="absolute mx-6 my-4 right-0 top-0"
                :icon="store.theme === 'viva-light' ? 'pi pi-moon' : 'pi pi-sun'" text rounded
                aria-label="Theme" @click="toggleTheme()"/>
        <civilization_grid/>
    </div>
</template>

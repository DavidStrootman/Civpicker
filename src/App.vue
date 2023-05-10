<script lang="ts">

import civilization_grid from "./components/civilization_grid.vue";
import Button from "primevue/button";

export default {
    name: "App",
    methods: {
        toggleTheme() {
            let nextTheme = '';
            if (this.currentTheme === 'viva-light') nextTheme = 'viva-dark';
            else if (this.currentTheme === 'viva-dark') nextTheme = 'viva-light';

            // @ts-ignore
            this.$primevue.changeTheme(this.currentTheme, nextTheme, 'light-mode', () => {
            });

            this.currentTheme = nextTheme;
        }
    },
    components: {
        Button,
        civilization_grid
    },
    data() {
        return {
            currentTheme: "viva-light",
        }
    }
};
</script>


<template>
    <Button ref="theme-toggle" class="absolute mx-6 my-4 right-0 top-0"
            :icon="currentTheme === 'viva-light' ? 'pi pi-moon' : 'pi pi-sun'" text rounded
            aria-label="Theme" @click="toggleTheme()"/>
    <civilization_grid/>
</template>

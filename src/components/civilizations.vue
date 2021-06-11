<template id="civilizations">
  <div class="container mt-8 mx-auto px-32 civilizations-container">
    <div v-for="(expansion, index) in civilizations.expansions">
      <div class="m-2 float-left" v-for="(civilization, index) in expansion.civilizations">
        <img class=" hover:border-red-400 border-4 border-white rounded" v-bind:src="'src/assets/images/civilizations/CivIcon-' + civilization + '.webp'">
        <p class="text-center">{{ civilization }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import civilizations from "../civilizations.json"
import '../assets/styles/civilizations.css'

export default defineComponent({
  name: "civilizations",
  data() {
    return {
      civ_images: import.meta.glob("../assets/images/civilizations/*.bmp"),
      civilizations: civilizations      
    }
  }
})
</script>

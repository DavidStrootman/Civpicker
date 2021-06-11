<template id="civilizations">
  <div class="container">
    <div v-for="(expansion, index) in civilizations.expansions">
      <div v-for="(civilization, index) in expansion.civilizations">
        <img v-bind:src="'src/assets/images/civilizations/CivIcon-' + civilization + '.webp'">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import civilizations from "../civilizations.json"

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

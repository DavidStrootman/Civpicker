<template>
  <div class="container header-bar px-32 p-2">
    <div
      class="
        logo-container
        w-64
        mt-12
        p-2
        text-center
        border-4 border-current
        rounded
      "
    >
      <p class="header-logo text-4xl">Gagnismaðr</p>
    </div>
  </div>
  <civilizations/>
</template> 

<script lang="ts">
import { defineComponent } from "vue";
import civilizations from "./components/civilizations.vue";

export default defineComponent({
  name: "App",
  components: {
    civilizations,
  },
});
</script>

<template>
  <div id="app">
    <GameLayout />
  </div>
</template>

<script>
import GameLayout from '../src/components/GameLayout.vue'

export default {
  name: 'App',
  components: {
    GameLayout
  }
}
</script>

<style lang="scss">
  @import "../src/assets/styles/main.scss";
</style>

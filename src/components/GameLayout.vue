<template>
  <div class="game-layout container">
    <h2 class="title"></h2>
    <GameWindow />
  </div>
</template>

<script>
import GameWindow from './GameWindow.vue'

export default {
  name: 'GameLayout',
  components: {
    GameWindow
  }
}
</script>

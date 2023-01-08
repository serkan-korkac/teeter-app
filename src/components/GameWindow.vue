<template>
  <div ref="el" class="window" :class="{ gameover: gameIsOver, winner: isWin }">
    <transition name="fade">
      <div v-if="gameIsOver || isWin" class="result-title">
        <h2>
          {{ gameIsOver ? "Game Over" : "Winner" }}
        </h2>
        <button @click="restart()">Restart</button>
      </div>
    </transition>
    <button v-if="!showPause" @click.prevent="startGame()">Play</button>

    <button v-else @click.prevent="pause()">Pause</button>

    <div class="window-footer">
      <div class="board" :style="borderAngle">
        <left-side />
        <right-side />
      </div>
      <div class="base" />
    </div>
  </div>
</template>
<script setup>
import RightSide from "./RightSide.vue";
import LeftSide from "./LeftSide.vue";
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const showPause = ref(false);
const el = ref();
const gameIsOver = ref(false);
const maxScore = ref(20);
const borderAngle = computed(() => store.getters["calculations/getBoardAngle"]);
const watchForLoose = computed(() => store.getters["calculations/isLoose"]);
const leftForce = computed(
  () => store.getters["calculations/getLeftForce"] / 10000
);
const rightForce = computed(
  () => store.getters["calculations/getRightForce"] / 10000
);
const isWin = computed(() => {
  const total =
    parseFloat(leftForce.value.toFixed(1)) +
    parseFloat(rightForce.value.toFixed(1));
  if (total >= maxScore.value && !gameIsOver.value) {
    stopGame();
  }
  return total >= maxScore.value && !gameIsOver.value;
});
const showResult = computed(() => gameIsOver.value || isWin.value);
watch(
  () => borderAngle.value,
  (value) => {
    resetTransition();
  }
);
watch(
  () => watchForLoose.value,
  (newVal) => {
    if (newVal.value) setGameIsOver();
  }
);
function startGame() {
  showPause.value = true;
  store.commit("gameState/SET_PLAY", true);
}
function stopGame() {
  setTimeout(() => {
    pause();
    resetTransition("final");
  }, 1000);
}
function pause() {
  showPause.value = false;
  store.commit("gameState/SET_PLAY", false);
}
function resetTransition(final) {
  if (el &&el.value.querySelector(".board")) {
   el.value.querySelector(".board").style.transitionDuration = "0s";

    if (!final)
     el.value.querySelector(".board").style.transitionDuration = "1s";
  }
}
function setGameIsOver() {
  gameIsOver.value = true;
  setTimeout(() => {
    resetTransition("final");
  }, 5000);
}
function restart() {
  window.location.reload(true);
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

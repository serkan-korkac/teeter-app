<template>
  <div class="right-side">
    <div
      v-for="(item, index) in rightSideCount"
      :data-weight="weights[index]"
      :style="styles[index]"
      :key="index"
      class="weight"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, watch,ref } from "vue";
import { useStore } from "vuex";
const maxRightPos = ref(300);
const minRightPos = ref(0);
const maxWeight = ref(10);
const minWeight = ref(0);
const weights = ref([]);
const weight = ref(null);
const styles = ref([]);
const store = useStore();
const rightSideCount = computed(() => store.getters["calculations/getRightCount"]);
onMounted(() => {
  createNew()
})
watch(
  () => rightSideCount,
  (count, prevCount) => {
    createNew()
  },
  { deep: true }
);
function createNew() {
  console.log("createNew");
  const style = rightBoxParams();
  styles.value.push(style);
}
function setF2d2(rightPos) {
  let position = rightPos;
  position = position.replace("right: ", "");
  position = position.replace("px;", "");
  const distance = 500 - parseInt(position);
  store.dispatch("calculations/calcRightForce", {
    m2: weight.value,
    d2: distance,
  });
  store.dispatch("calculations/calcTotalK");
}
function rightBoxParams() {
  const position = rightPosition();
  const weight = rightWeight();
  setF2d2(position);
  return position + weight;
}
function rightPosition() {
  return `right: ${rand(maxRightPos.value, minRightPos.value)}px;`;
}
function rightWeight() {
  weight.value = rand(maxWeight.value, minWeight.value);
  weights.value.push(weight.value);
  store.commit("calculations/setBoxWeight", weight.value);
  return `width: ${weight.value}0px; height: ${weight.value}0px;`;
}
function rand(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
</script>

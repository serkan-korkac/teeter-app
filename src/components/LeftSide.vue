<template>
  <div ref="root" class="left-side">
    <template v-for="(item, id) in maxItems" :key="id">
      <figure
        :data-item="'id' + id"
        :data-type="figureType()"
        :style="setItemParams()"
        :data-weight="weight"
      />
    </template>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
const root = ref(null);
const store = useStore();
const launched = ref(false);
const isPause = ref(false);
const maxItems = ref(20);
const currentIndex = ref(0);
const maxLeftPos = ref(0);
const minLeftPost = ref(300);
const maxWeight = ref(10);
const minWeight = ref(1);
const weight = ref(0);
const isPlaying = computed(
  () =>
    store.getters["gameState/isPlaying"] &&
    !store.getters["calculations/isLoose"]
);
watch(
  () => isPlaying.value,
  (value) => {
    if (isPlaying.value) {
      console.log('if>>', isPlaying.value, launched.value)
      return !launched.value ? startFalling() : pause();
    } else {
      console.log('else >> ',isPlaying.value)
      return pause();
    }
  }
);
function getItemPosition(current) {
  const currentPos = window
    .getComputedStyle(current)
    .getPropertyValue("transform");
  const currentY_array = currentPos.split(",");
  const currentY = currentY_array[currentY_array.length - 1].replace(
    /[^\d.]/g,
    ""
  );
  console.log({ currentY, currentPos },  window
    .getComputedStyle(current)
    .getPropertyValue("transform"));
  return currentY;
}
function pause() {
  console.log('pause')
  const current = root.value.querySelector(
    `[data-item=id${currentIndex.value}`
  );
  console.log({ current });
  const posY = getItemPosition(current);
  if (!isPause.value) {
    current.style.transform = `translateY(-${posY}px)`;
    current.style.transition = `none`;
    isPause.value = true;
  } else {
    current.style.transition = `transform 5s linear`;
    current.style.transitionDuration = `${calcNewFallTime(posY)}s`;
    current.style.transform = `translateY(0px)`;
    isPause.value = false;
  }
}
function calcNewFallTime(currentY) {
  const fullPath = 500;
  const normalTime = 5;
  const newPath = currentY;
  const newTime = (normalTime * newPath) / fullPath;
  return parseInt(newTime) ? parseInt(newTime) : 1;
}
function rand(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setItemParams() {
  const position = leftPosition();
  const wght = setWeight();
  return position + wght;
}
function leftPosition() {
  return `left: ${rand(maxLeftPos.value, minLeftPost.value)}px;`;
}
function setWeight() {
  weight.value = rand(maxWeight.value, minWeight.value);
  return `width: ${weight.value}0px; height: ${weight.value}0px;border-width: ${weight.value}0px;`;
}
function figureType() {
  const res = rand(0, 4);
  if (res === 1) return "circle";
  else if (res === 2) return "rectangle";
  else return "triangle";
}
function moveLeft(item) {
  const x = window.getComputedStyle(item).getPropertyValue("left");
  const distance = x.replace("px", "");
  if (distance <= -20) return;
  item.style.left = distance - 10 + "px";
}
function moveRight(item) {
  const x = window.getComputedStyle(item).getPropertyValue("left");
  const distance = x.replace("px", "");
  if (distance >= 400) return;
  item.style.left = parseInt(distance) + 10 + "px";
}
function startFalling() {
  if (currentIndex.value === maxItems.value || !isPlaying.value) return false;
  const current = root.value.querySelector(
    `[data-item=id${currentIndex.value}`
  );
  launched.value = true;

  function moveItems(e) {
    if (e.key === "ArrowLeft") {
      moveLeft(current);
    } else if (e.key === "ArrowRight") {
      moveRight(current);
    }
  }

  if (current.getAttribute("data-item") === "id" + currentIndex.value) {
    current.style.transform = "translateY(0px)";
    current.classList.add("active");
    window.addEventListener("keydown", moveItems);

    current.addEventListener("transitionend", () => {
      window.removeEventListener("keydown", moveItems);
      const wght = parseInt(current.getAttribute("data-weight"));
      const position =
        parseInt(
          window
            .getComputedStyle(current)
            .getPropertyValue("left")
            .replace("px", "")
        ) +
        (wght * 10) / 2;
      const distance = 500 - position;
      store.commit("calculations/createRight");

      store.dispatch("calculations/calcLeftForce", {
        m1: wght,
        d1: distance,
      });
      currentIndex.value += 1;
      if (isPlaying.value) startFalling();
    });
  }
}
</script>
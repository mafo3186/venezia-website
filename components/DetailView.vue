<template>
  <transition name="fade">
    <div
      v-if="detailView && currentProject"
      class="fixed top-0 left-0 z-40 flex flex-col justify-center items-center gap-16 w-screen h-screen"
      @mousemove="onMouseMove"
    >
      <button
        class="fixed top-8 left-4 flex justify-center items-center w-12 h-12 rounded-full bg-gray-200 bg-opacity-30 backdrop-blur-md"
        @click="detailView = false"
      >
        <-
      </button>

      <div
        ref="wrapper"
        class="flex flex-col gap-[30vh] w-full h-full overflow-y-auto py-[10vh]"
        @scroll="onScroll"
      >
        <!-- Title -->
        <div
          class="flex flex-col gap-5 max-w-[50vw] mx-auto p-4 bg-white bg-opacity-15 backdrop-blur-2xl section"
          ref="title"
        >
          <h1 class="text-center text-6xl">{{ currentProject.title }}</h1>
          <h3 class="text-xl">{{ currentProject.author }}</h3>
        </div>
        <!-- Sections -->
        <SanityGrid
          v-for="section in currentProject.sections"
          :key="section._key"
          :section="section"
          :scroll-position="scrollPosition"
          @on-reached-view-port="onNextSection"
          @on-leave-view-port="onLeaveSection"
        />
        <SanityGrid
          :lastFiller="true"
          :scroll-position="scrollPosition"
          @on-reached-view-port="onNextSection"
          @on-leave-view-port="onLeaveSection"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const { detailView, currentProject, currentDotIndex } = useDetailView();
const { isInStandBy, resetStandByTimer } = usestandBy();
const { mousePos } = useMousePos();
const { height } = useWindowSize();
const scrollPosition = ref(0);
const wrapper = ref<HTMLElement>();

/**
 *
 */
function onNextSection() {
  if (currentDotIndex.value < currentProject.value.sections.length - 1) {
    currentDotIndex.value++;
  }
}

function onLeaveSection() {
  if (currentDotIndex.value >= 0) {
    currentDotIndex.value--;
  }
}

/**
 *
 * @param event
 */
function onMouseMove(event: MouseEvent) {
  mousePos.value.x = event.clientX;
  mousePos.value.y = event.clientY;

  resetStandByTimer();
}

function onScroll(event: Event) {
  scrollPosition.value = (event.target as HTMLElement)?.scrollTop;

  if (scrollPosition.value >= wrapper.value?.scrollHeight! - height.value) {
    currentDotIndex.value = 0;
    detailView.value = false;
  }

  resetStandByTimer();
}

watch(isInStandBy, () => {
  if (isInStandBy.value) {
    detailView.value = false;
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.content {
  @apply flex justify-center items-center gap-96 w-full text-[40px];
}

.content:nth-of-type(odd) .content-inner {
  margin-left: 15%;
}

.content:nth-of-type(even) .content-inner {
  margin-right: 15%;
}

.content .content-inner {
  width: auto;
  max-width: 60vw;
}

.content .content-inner img,
.content .content-inner video {
  max-height: 80vh;
}

/* .content .content-inner img,
.content .content-inner video {
  max-width: 80vw;
} */

h4,
h3,
h2,
h1 {
  @apply !mb-8 mt-8 font-bold;
}

h1 {
  @apply text-6xl;
}
h2 {
  @apply text-5xl;
}
h3 {
  @apply text-4xl;
}
h4 {
  @apply text-3xl;
}
</style>

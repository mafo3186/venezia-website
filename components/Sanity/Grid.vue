<template>
  <div
    class="content"
    v-if="section && !lastFiller"
  >
    <div
      ref="sectionRef"
      class="content-inner"
    >
      <SanityRichText
        v-if="section._type == 'sectionRichText'"
        :content="section"
      />
      <SanityCustomImage
        v-if="section._type == 'sectionImage'"
        :section="section"
      />
      <SanityVideo
        v-if="section._type == 'sectionVideo'"
        :section="section"
      />
      <SanityGallery
        v-if="section._type == 'sectionGallery'"
        :section="section"
      />
      <SanityAudio
        v-if="section._type == 'sectionAudio'"
        :section="section"
      />
      <SanityIframe
        v-if="section._type == 'sectionIframe'"
        :section="section"
      />
    </div>
  </div>
  <div
    v-if="lastFiller"
    ref="sectionRef"
    class="content pt-[10vh] pb-[90vh] bg-white bg-opacity-15"
  >
    <h2>Scroll on to return to exploration</h2>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  section?: any;
  scrollPosition?: number;
  lastFiller?: boolean;
}>();

const emits = defineEmits<{
  (e: "onReachedViewPort"): void;
  (e: "onLeaveViewPort"): void;
}>();

const { height } = useWindowSize();
const sectionRef = ref<HTMLElement>();
const sectionPosition = ref(0);
const inViewport = ref(false);

function setSectionPosition() {
  if (!sectionRef.value) return;

  const rect = sectionRef.value.getBoundingClientRect();
  const containerTop = rect.top;

  sectionPosition.value = containerTop - height.value;
}

watch(
  () => props.scrollPosition,
  () => {
    setSectionPosition();

    if (sectionPosition.value < 0 && !inViewport.value) {
      emits("onReachedViewPort");
      inViewport.value = true;
    }

    if (sectionPosition.value > 0 && inViewport.value) {
      emits("onLeaveViewPort");
      inViewport.value = false;
    }
  }
);
</script>

<style></style>

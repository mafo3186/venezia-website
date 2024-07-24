<template>
  <div
    v-if="section && section.images.length > 0"
    class="p-4 backdrop-blur-2xl bg-white bg-opacity-15"
  >
    <div class="gallery-container">
      <button
        v-if="section.images.length > 3"
        class="arrow left-arrow"
        @click="prevImage"
        :disabled="currentIndex === 0"
      >
        <span class="arrow-icon">←</span>
      </button>
      <div
        class="gallery"
        :class="{ 'centered-gallery': section.images.length <= 3 }"
      >
        <div
          class="image-container"
          v-for="image in visibleImages"
          :key="image.id"
          @click="openLightbox(image)"
        >
          <SanityImage
            v-if="image.image?.asset"
            :asset-id="image.image.asset._ref"
            auto="format"
            width="1000"
            loading="lazy"
          />
          <img
            v-else
            src="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png"
            alt="Image placeholder"
          />
          <span
            v-if="image.caption"
            class="caption"
            >{{ image.caption }}</span
          >
        </div>
      </div>
      <button
        v-if="section.images.length > 3"
        class="arrow right-arrow"
        @click="nextImage"
        :disabled="currentIndex >= props.section.images.length - 3"
      >
        <span class="arrow-icon">→</span>
      </button>
    </div>
    <SanityContent
      class="additional-text p-4 backdrop-blur-2xl bg-white bg-opacity-15"
      v-if="section.content"
      :blocks="section.content"
    />

    <div
      v-if="lightboxOpen"
      class="lightbox"
      @keydown.esc="closeLightbox"
      @keydown.left="prevLightboxImage"
      @keydown.right="nextLightboxImage"
      tabindex="-1"
    >
      <button
        class="close-button"
        @click="closeLightbox"
      >
        X
      </button>
      <SanityImage
        v-if="selectedImage.image?.asset"
        :asset-id="selectedImage.image.asset._ref"
        auto="format"
        height="600"
        width="800"
      />
      <img
        v-else
        src="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png"
        alt="Image placeholder"
      />
      <span class="caption p-4 backdrop-blur-2xl bg-white bg-opacity-15">{{
        selectedImage.caption
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
const props = defineProps<{
  section: any;
}>();

const currentIndex = ref(0);
const lightboxOpen = ref(false);
const selectedImageIndex = ref(0);
const selectedImage = ref(null);

const visibleImages = computed(() => {
  return props.section.images.slice(currentIndex.value, currentIndex.value + 3);
});

function prevImage() {
  if (currentIndex.value > 0) currentIndex.value -= 1;
}

function nextImage() {
  if (currentIndex.value < props.section.images.length - 3)
    currentIndex.value += 1;
}

function openLightbox(image) {
  selectedImage.value = image;
  selectedImageIndex.value = props.section.images.indexOf(image);
  lightboxOpen.value = true;
  setTimeout(() => document.addEventListener("keydown", handleKeydown), 0);
}

function closeLightbox() {
  lightboxOpen.value = false;
  document.removeEventListener("keydown", handleKeydown);
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    prevLightboxImage();
  } else if (event.key === "ArrowRight") {
    nextLightboxImage();
  }
}

function prevLightboxImage() {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--;
    selectedImage.value = props.section.images[selectedImageIndex.value];
  }
}

function nextLightboxImage() {
  if (selectedImageIndex.value < props.section.images.length - 1) {
    selectedImageIndex.value++;
    selectedImage.value = props.section.images[selectedImageIndex.value];
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style>
.gallery-container {
  position: relative;
  display: flex;
  align-items: start;
  margin-bottom: 16px;
}

.gallery {
  display: flex;
  gap: 20px; /* Increased gap */
  margin: 0 20px;
  flex: 0 1 auto;
  align-items: flex-end;
}

.centered-gallery {
  justify-content: center;
}

.image-container {
  width: calc(33.333% - 6.67px);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.arrow,
.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12px;
  height: 12px;
  padding: 20px;
  border-radius: 50%;
  background-color: rgba(200, 200, 200, 0.3);
  backdrop-filter: blur(5px);
  cursor: pointer;
}

.arrow-icon,
.close-button {
  font-size: 24px;
}

.left-arrow,
.right-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.left-arrow {
  left: 10px;
}

.right-arrow {
  right: 10px;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
}

.close-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1050;
}

.caption {
  height: 150px;
  margin-top: 10px; /* Increased space between image and caption */
}

em {
  @apply p-4;
}

h4 {
  @apply !mb-8;
}
</style>

<template>
  <div v-if="section">
    <SanityImage
      v-if="section.image.image.asset"
      :asset-id="section.image.image.asset._ref"
    />
    <img
      v-else
      src="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png"
      alt="image"
    />
    <br />
    <span v-if="section.image?.caption">{{ section.image.caption }}</span>
    <SanityContent
      v-if="section.content"
      :blocks="section.content"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  section: any;
}>();
</script>

<style scoped>
div {
  @apply p-4 backdrop-blur-2xl bg-white bg-opacity-15;
}
</style>

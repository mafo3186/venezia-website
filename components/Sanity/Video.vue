<template>
  <div v-if="section">
    <SanityFile
      v-if="section?.video?.asset"
      :asset-id="section.video.asset._ref"
    >
      <template #default="{ src }">
        <video
          :src="src"
          controls
        ></video>
      </template>
    </SanityFile>
    <SanityContent
      class="additional-text"
      v-if="section.content"
      :blocks="section.content"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  section: any;
}>();
</script>

<style scoped>
div {
  @apply p-4 backdrop-blur-2xl bg-white bg-opacity-15;
}
</style>

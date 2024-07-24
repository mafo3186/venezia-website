<template>
  <div v-if="section">
    <h2 v-if="section.title">{{ section.title }}</h2>
    <br />
    <SanityFile
      v-if="section?.audio?.asset"
      :asset-id="section.audio.asset._ref"
    >
      <template #default="{ src }">
        <audio
          controls
          class="w-full"
        >
          <source :src="src" />
          Your browser does not support the audio element.
        </audio>
      </template>
    </SanityFile>
    <br />
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

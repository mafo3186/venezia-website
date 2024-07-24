<template>
  <div
    v-if="section"
    class="p-4 backdrop-blur-2xl bg-white bg-opacity-15"
  >
    <iframe
      :src="section.link"
      frameborder="0"
      class="h-[80vh] w-full rounded-3xl"
    ></iframe>
    <br />
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

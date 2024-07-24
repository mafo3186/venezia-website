<template>
  <div class="p-4 backdrop-blur-2xl bg-white bg-opacity-15">
    <SanityContent :blocks="content.content" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: any;
}>();
</script>

<style></style>
